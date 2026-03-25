// lib/notification-sender.js
import prisma from './db/prisma.js';

/**
 * إرسال إشعار للتاجر
 * @param {string} merchantId - معرف التاجر
 * @param {object} notification - بيانات الإشعار
 * @returns {Promise<object>}
 */
export async function sendNotification(merchantId, notification) {
  try {
    const { type, title, message, link, data } = notification;

    const newNotification = await prisma.notification.create({
      data: {
        merchantId,
        type: type || 'SYSTEM',
        title,
        message,
        link: link || null,
        data: data || null
      }
    });

    return newNotification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * إرسال إشعارات متعددة
 * @param {array} notifications - قائمة الإشعارات
 * @returns {Promise<array>}
 */
export async function sendBulkNotifications(notifications) {
  try {
    const results = await Promise.all(
      notifications.map(notif =>
        sendNotification(notif.merchantId, {
          type: notif.type,
          title: notif.title,
          message: notif.message,
          link: notif.link,
          data: notif.data
        })
      )
    );

    return results;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
}

/**
 * إشعار نجاح الدفع
 * @param {string} merchantId - معرف التاجر
 * @param {object} paymentData - بيانات الدفع
 */
export async function notifyPaymentSuccess(merchantId, paymentData) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: '✅ تم الدفع بنجاح',
    message: `تم استلام دفعتك بمبلغ ${paymentData.amount} ${paymentData.currency} بنجاح.`,
    link: `/dashboard/invoices/${paymentData.invoiceId}`,
    data: paymentData
  });
}

/**
 * إشعار فشل الدفع
 * @param {string} merchantId - معرف التاجر
 * @param {object} paymentData - بيانات الدفع
 */
export async function notifyPaymentFailed(merchantId, paymentData) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: '❌ فشل الدفع',
    message: `فشلت عملية الدفع. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى.`,
    link: '/dashboard/subscription/renew',
    data: paymentData
  });
}

/**
 * إشعار تجديد الاشتراك
 * @param {string} merchantId - معرف التاجر
 * @param {object} subscriptionData - بيانات الاشتراك
 */
export async function notifySubscriptionRenewed(merchantId, subscriptionData) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: '🎉 تم تجديد اشتراكك',
    message: `تم تجديد اشتراكك بنجاح. صالح حتى ${new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('ar-SA')}`,
    link: '/dashboard/subscription',
    data: subscriptionData
  });
}

/**
 * إشعار انتهاء الاشتراك قريباً
 * @param {string} merchantId - معرف التاجر
 * @param {number} daysRemaining - الأيام المتبقية
 */
export async function notifySubscriptionExpiringSoon(merchantId, daysRemaining) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: `⚠️ باقي ${daysRemaining} أيام على انتهاء اشتراكك`,
    message: `اشتراكك سينتهي خلال ${daysRemaining} أيام. يرجى التجديد لتجنب انقطاع الخدمة.`,
    link: '/dashboard/subscription/renew',
    data: { daysRemaining }
  });
}

/**
 * إشعار انتهاء الاشتراك
 * @param {string} merchantId - معرف التاجر
 */
export async function notifySubscriptionExpired(merchantId) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: '❌ انتهى اشتراكك',
    message: 'انتهى اشتراكك. يرجى التجديد لاستعادة الخدمة.',
    link: '/dashboard/subscription/renew'
  });
}

/**
 * إشعار تعليق الخدمة
 * @param {string} merchantId - معرف التاجر
 */
export async function notifyServiceSuspended(merchantId) {
  return await sendNotification(merchantId, {
    type: 'SUBSCRIPTION',
    title: '🚫 تم تعليق خدمتك',
    message: 'تم تعليق خدمتك بسبب عدم تجديد الاشتراك. يرجى التجديد فوراً.',
    link: '/dashboard/subscription/renew'
  });
}

/**
 * إشعار إكمال إعداد المتجر
 * @param {string} merchantId - معرف التاجر
 */
export async function notifyStoreSetupCompleted(merchantId) {
  return await sendNotification(merchantId, {
    type: 'SYSTEM',
    title: '🎉 تم إكمال إعداد متجرك',
    message: 'تهانينا! تم إكمال إعداد متجرك بنجاح. يمكنك الآن البدء في استخدام جميع المميزات.',
    link: '/dashboard'
  });
}

/**
 * تعيين جميع الإشعارات كمقروءة
 * @param {string} merchantId - معرف التاجر
 */
export async function markAllNotificationsAsRead(merchantId) {
  try {
    await prisma.notification.updateMany({
      where: {
        merchantId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
}

/**
 * تعيين إشعار كمقروء
 * @param {string} notificationId - معرف الإشعار
 */
export async function markNotificationAsRead(notificationId) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * الحصول على عدد الإشعارات غير المقروءة
 * @param {string} merchantId - معرف التاجر
 * @returns {Promise<number>}
 */
export async function getUnreadNotificationsCount(merchantId) {
  try {
    return await prisma.notification.count({
      where: {
        merchantId,
        read: false
      }
    });
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
}

/**
 * الحصول على آخر الإشعارات
 * @param {string} merchantId - معرف التاجر
 * @param {number} limit - عدد الإشعارات
 * @returns {Promise<array>}
 */
export async function getRecentNotifications(merchantId, limit = 10) {
  try {
    return await prisma.notification.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Error getting recent notifications:', error);
    throw error;
  }
}

/**
 * حذف إشعار
 * @param {string} notificationId - معرف الإشعار
 */
export async function deleteNotification(notificationId) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId }
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * حذف جميع الإشعارات المقروءة
 * @param {string} merchantId - معرف التاجر
 */
export async function deleteReadNotifications(merchantId) {
  try {
    await prisma.notification.deleteMany({
      where: {
        merchantId,
        read: true
      }
    });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    throw error;
  }
}
