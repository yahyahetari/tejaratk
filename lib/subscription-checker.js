// lib/subscription-checker.js
import prisma from '@/lib/db/prisma';
import { GRACE_PERIOD_DAYS } from '@/config/plans';
import { updateKeyStatusBasedOnSubscription } from './activation-key';

/**
 * فحص حالة الاشتراك وتحديثها
 * @param {string} merchantId - معرف التاجر
 * @returns {Promise<object>} - حالة الاشتراك
 */
export async function checkSubscriptionStatus(merchantId) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { merchantId },
      include: {
        merchant: true
      }
    });

    if (!subscription) {
      return {
        hasSubscription: false,
        status: null,
        message: 'لا يوجد اشتراك'
      };
    }

    const now = new Date();
    const periodEnd = new Date(subscription.currentPeriodEnd || subscription.endDate);
    const daysUntilExpiry = Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24));

    let needsUpdate = false;
    let newStatus = subscription.status;
    let newMerchantStatus = subscription.merchant.status;

    // التحقق من انتهاء الاشتراك
    if (now > periodEnd) {
      // حساب فترة السماح
      const gracePeriodEnd = new Date(periodEnd);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS);

      if (now > gracePeriodEnd) {
        // انتهت فترة السماح - تعليق الخدمة
        if (subscription.status !== 'EXPIRED') {
          newStatus = 'EXPIRED';
          newMerchantStatus = 'SUSPENDED';
          needsUpdate = true;
        }
      } else {
        // في فترة السماح
        if (subscription.status !== 'OVERDUE') {
          newStatus = 'OVERDUE';
          newMerchantStatus = 'OVERDUE';
          needsUpdate = true;
        }
      }
    } else {
      // الاشتراك نشط
      if (subscription.status !== 'ACTIVE') {
        newStatus = 'ACTIVE';
        newMerchantStatus = 'ACTIVE';
        needsUpdate = true;
      }
    }

    // تحديث الحالة إذا لزم الأمر
    if (needsUpdate) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: newStatus,
          isOverdue: newStatus === 'OVERDUE',
          overdueAt: newStatus === 'OVERDUE' ? now : null,
          gracePeriodEnd: newStatus === 'OVERDUE' ? new Date(periodEnd.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000) : null
        }
      });

      await prisma.merchant.update({
        where: { id: merchantId },
        data: { status: newMerchantStatus }
      });

      // تحديث حالة كود التفعيل
      await updateKeyStatusBasedOnSubscription(merchantId);

      // إرسال إشعار
      await sendSubscriptionNotification(merchantId, newStatus, daysUntilExpiry);
    }

    return {
      hasSubscription: true,
      status: newStatus,
      isActive: newStatus === 'ACTIVE',
      isOverdue: newStatus === 'OVERDUE',
      isExpired: newStatus === 'EXPIRED',
      daysUntilExpiry,
      currentPeriodEnd: subscription.currentPeriodEnd,
      gracePeriodEnd: subscription.gracePeriodEnd,
      inGracePeriod: newStatus === 'OVERDUE',
      needsRenewal: daysUntilExpiry <= 7,
      message: getStatusMessage(newStatus, daysUntilExpiry)
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
}

/**
 * فحص جميع الاشتراكات وتحديث الحالات (Cron Job)
 */
export async function checkAllSubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'OVERDUE']
        }
      },
      include: {
        merchant: true
      }
    });

    const results = {
      checked: subscriptions.length,
      updated: 0,
      expired: 0,
      overdue: 0,
      warnings: 0
    };

    for (const subscription of subscriptions) {
      const status = await checkSubscriptionStatus(subscription.merchantId);
      
      if (status.isExpired) {
        results.expired++;
        results.updated++;
      } else if (status.isOverdue) {
        results.overdue++;
        results.updated++;
      } else if (status.needsRenewal) {
        results.warnings++;
      }
    }

    // تسجيل النتائج
    await prisma.activityLog.create({
      data: {
        action: 'SUBSCRIPTION_CHECK_COMPLETED',
        description: `تم فحص ${results.checked} اشتراك`,
        metadata: results
      }
    });

    return results;
  } catch (error) {
    console.error('Error checking all subscriptions:', error);
    throw error;
  }
}

/**
 * الحصول على الاشتراكات التي تحتاج تجديد
 * @param {number} daysThreshold - عدد الأيام
 * @returns {Promise<array>}
 */
export async function getSubscriptionsNeedingRenewal(daysThreshold = 7) {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          lte: thresholdDate
        }
      },
      include: {
        merchant: {
          include: {
            store: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error getting subscriptions needing renewal:', error);
    throw error;
  }
}

/**
 * إرسال تنبيهات التجديد
 */
export async function sendRenewalReminders() {
  try {
    // تنبيه قبل 7 أيام
    const subscriptions7Days = await getSubscriptionsNeedingRenewal(7);
    for (const sub of subscriptions7Days) {
      await sendRenewalReminder(sub.merchantId, 7);
    }

    // تنبيه قبل 3 أيام
    const subscriptions3Days = await getSubscriptionsNeedingRenewal(3);
    for (const sub of subscriptions3Days) {
      await sendRenewalReminder(sub.merchantId, 3);
    }

    // تنبيه قبل يوم واحد
    const subscriptions1Day = await getSubscriptionsNeedingRenewal(1);
    for (const sub of subscriptions1Day) {
      await sendRenewalReminder(sub.merchantId, 1);
    }

    return {
      sent7Days: subscriptions7Days.length,
      sent3Days: subscriptions3Days.length,
      sent1Day: subscriptions1Day.length
    };
  } catch (error) {
    console.error('Error sending renewal reminders:', error);
    throw error;
  }
}

/**
 * إرسال تنبيه تجديد
 */
async function sendRenewalReminder(merchantId, daysRemaining) {
  try {
    // التحقق من عدم إرسال نفس التنبيه مرتين
    const existingNotification = await prisma.notification.findFirst({
      where: {
        merchantId,
        type: 'SUBSCRIPTION',
        title: `تنبيه: باقي ${daysRemaining} أيام على انتهاء اشتراكك`,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // آخر 24 ساعة
        }
      }
    });

    if (existingNotification) {
      return; // تم إرسال التنبيه بالفعل
    }

    await prisma.notification.create({
      data: {
        merchantId,
        type: 'SUBSCRIPTION',
        title: `تنبيه: باقي ${daysRemaining} أيام على انتهاء اشتراكك`,
        message: `اشتراكك سينتهي خلال ${daysRemaining} أيام. يرجى التجديد لتجنب تعليق الخدمة.`,
        link: '/dashboard/subscription/renew'
      }
    });
  } catch (error) {
    console.error('Error sending renewal reminder:', error);
  }
}

/**
 * إرسال إشعار تغيير حالة الاشتراك
 */
async function sendSubscriptionNotification(merchantId, status, daysUntilExpiry) {
  try {
    let title = '';
    let message = '';
    let link = '/dashboard/subscription';

    switch (status) {
      case 'OVERDUE':
        title = '⚠️ اشتراكك منتهي - فترة سماح';
        message = `انتهى اشتراكك. لديك ${GRACE_PERIOD_DAYS} أيام لتجديد الاشتراك قبل تعليق الخدمة.`;
        link = '/dashboard/subscription/renew';
        break;
      
      case 'EXPIRED':
        title = '❌ تم تعليق خدمتك';
        message = 'تم تعليق خدمتك بسبب عدم تجديد الاشتراك. يرجى التجديد لاستعادة الخدمة.';
        link = '/dashboard/subscription/renew';
        break;
      
      case 'ACTIVE':
        if (daysUntilExpiry <= 7) {
          title = `تنبيه: باقي ${daysUntilExpiry} أيام على انتهاء اشتراكك`;
          message = 'يرجى تجديد اشتراكك قريباً لتجنب انقطاع الخدمة.';
          link = '/dashboard/subscription/renew';
        }
        break;
    }

    if (title && message) {
      await prisma.notification.create({
        data: {
          merchantId,
          type: 'SUBSCRIPTION',
          title,
          message,
          link
        }
      });
    }
  } catch (error) {
    console.error('Error sending subscription notification:', error);
  }
}

/**
 * الحصول على رسالة الحالة
 */
function getStatusMessage(status, daysUntilExpiry) {
  switch (status) {
    case 'ACTIVE':
      if (daysUntilExpiry <= 0) {
        return 'اشتراكك نشط';
      } else if (daysUntilExpiry <= 7) {
        return `باقي ${daysUntilExpiry} أيام على انتهاء اشتراكك`;
      }
      return 'اشتراكك نشط';
    
    case 'OVERDUE':
      return `اشتراكك منتهي - فترة سماح ${GRACE_PERIOD_DAYS} أيام`;
    
    case 'EXPIRED':
      return 'اشتراكك منتهي - تم تعليق الخدمة';
    
    case 'CANCELLED':
      return 'تم إلغاء اشتراكك';
    
    default:
      return status;
  }
}

/**
 * حساب تاريخ انتهاء الاشتراك الجديد
 * @param {string} billingCycle - دورة الفوترة
 * @param {Date} startDate - تاريخ البداية (اختياري)
 * @returns {Date}
 */
export function calculateSubscriptionEndDate(billingCycle, startDate = new Date()) {
  const endDate = new Date(startDate);
  
  if (billingCycle === 'YEARLY') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  
  return endDate;
}

/**
 * حساب تاريخ الدفع القادم
 * @param {Date} currentPeriodEnd - تاريخ انتهاء الفترة الحالية
 * @returns {Date}
 */
export function calculateNextPaymentDate(currentPeriodEnd) {
  // تاريخ الدفع القادم هو قبل 3 أيام من انتهاء الفترة
  const nextPaymentDate = new Date(currentPeriodEnd);
  nextPaymentDate.setDate(nextPaymentDate.getDate() - 3);
  return nextPaymentDate;
}
