// lib/activation-key.js
import prisma from '@/lib/db/prisma';
import { generateActivationKey, isValidKeyFormat } from './key-generator';

/**
 * إنشاء كود تفعيل جديد للتاجر
 * @param {string} merchantId - معرف التاجر
 * @param {object} options - خيارات إضافية
 * @returns {Promise<object>} - كود التفعيل
 */
export async function createActivationKey(merchantId, options = {}) {
  try {
    // التحقق من وجود اشتراك نشط
    const subscription = await prisma.subscription.findUnique({
      where: { merchantId },
      include: { merchant: true }
    });

    if (!subscription) {
      throw new Error('لا يوجد اشتراك نشط');
    }

    // توليد الكود
    const key = generateActivationKey(merchantId, subscription.planType || subscription.planId);

    // إنشاء سجل الكود في قاعدة البيانات
    const activationKey = await prisma.activationKey.create({
      data: {
        merchantId,
        key,
        status: 'ACTIVE',
        expiresAt: subscription.currentPeriodEnd,
        storeUrl: options.storeUrl || null,
        storeDomain: options.storeDomain || null,
        notes: options.notes || null,
      },
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'ACTIVATION_KEY_CREATED',
        description: 'تم إنشاء كود تفعيل جديد',
        metadata: { keyId: activationKey.id },
      },
    });

    return activationKey;
  } catch (error) {
    console.error('Error creating activation key:', error);
    throw error;
  }
}

/**
 * التحقق من صحة كود التفعيل
 * @param {string} key - كود التفعيل
 * @param {object} requestData - بيانات الطلب
 * @returns {Promise<object>} - نتيجة التحقق
 */
export async function verifyActivationKey(key, requestData = {}) {
  try {
    // التحقق من تنسيق الكود
    if (!isValidKeyFormat(key)) {
      return {
        valid: false,
        error: 'تنسيق كود التفعيل غير صحيح',
        code: 'INVALID_FORMAT'
      };
    }

    // البحث عن الكود في قاعدة البيانات
    const activationKey = await prisma.activationKey.findUnique({
      where: { key },
      include: {
        merchant: {
          include: {
            subscription: true,
            store: true
          }
        }
      }
    });

    if (!activationKey) {
      // تسجيل محاولة فاشلة
      await logVerificationAttempt(null, key, false, 'كود غير موجود', requestData);
      
      return {
        valid: false,
        error: 'كود التفعيل غير موجود',
        code: 'KEY_NOT_FOUND'
      };
    }

    // التحقق من حالة الكود
    if (activationKey.status !== 'ACTIVE') {
      await logVerificationAttempt(activationKey.id, key, false, `حالة الكود: ${activationKey.status}`, requestData);
      
      return {
        valid: false,
        error: `كود التفعيل ${getStatusText(activationKey.status)}`,
        code: 'KEY_INACTIVE',
        status: activationKey.status
      };
    }

    // التحقق من تاريخ الانتهاء
    if (activationKey.expiresAt && new Date(activationKey.expiresAt) < new Date()) {
      // تحديث حالة الكود
      await prisma.activationKey.update({
        where: { id: activationKey.id },
        data: { status: 'EXPIRED' }
      });

      await logVerificationAttempt(activationKey.id, key, false, 'الكود منتهي', requestData);
      
      return {
        valid: false,
        error: 'كود التفعيل منتهي الصلاحية',
        code: 'KEY_EXPIRED',
        expiresAt: activationKey.expiresAt
      };
    }

    // التحقق من حالة الاشتراك
    const subscription = activationKey.merchant.subscription;
    if (!subscription || subscription.status !== 'ACTIVE') {
      await logVerificationAttempt(activationKey.id, key, false, 'الاشتراك غير نشط', requestData);
      
      return {
        valid: false,
        error: 'الاشتراك غير نشط',
        code: 'SUBSCRIPTION_INACTIVE',
        subscriptionStatus: subscription?.status
      };
    }

    // تحديث معلومات الاستخدام
    await prisma.activationKey.update({
      where: { id: activationKey.id },
      data: {
        verificationCount: { increment: 1 },
        lastVerifiedAt: new Date(),
        isUsed: true,
        usedAt: activationKey.usedAt || new Date(),
        usedBy: requestData.ipAddress || activationKey.usedBy,
        storeUrl: requestData.storeUrl || activationKey.storeUrl,
        storeDomain: requestData.storeDomain || activationKey.storeDomain,
      }
    });

    // تسجيل التحقق الناجح
    await logVerificationAttempt(activationKey.id, key, true, null, requestData);

    return {
      valid: true,
      key: activationKey,
      merchant: {
        id: activationKey.merchant.id,
        name: activationKey.merchant.name,
        email: activationKey.merchant.email,
      },
      subscription: {
        planType: subscription.planType || subscription.planId,
        status: subscription.status,
        expiresAt: subscription.currentPeriodEnd || subscription.endDate,
      },
      store: activationKey.merchant.store ? {
        brandName: activationKey.merchant.store.brandName,
        currency: activationKey.merchant.store.currency,
        timezone: activationKey.merchant.store.timezone,
      } : null
    };
  } catch (error) {
    console.error('Error verifying activation key:', error);
    throw error;
  }
}

/**
 * الحصول على معلومات كود التفعيل
 * @param {string} merchantId - معرف التاجر
 * @returns {Promise<object>} - معلومات الكود
 */
export async function getActivationKey(merchantId) {
  try {
    const activationKey = await prisma.activationKey.findFirst({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      include: {
        verifications: {
          take: 10,
          orderBy: { verifiedAt: 'desc' }
        }
      }
    });

    return activationKey;
  } catch (error) {
    console.error('Error getting activation key:', error);
    throw error;
  }
}

/**
 * إعادة توليد كود التفعيل
 * @param {string} merchantId - معرف التاجر
 * @param {string} reason - سبب إعادة التوليد
 * @returns {Promise<object>} - الكود الجديد
 */
export async function regenerateActivationKey(merchantId, reason = 'طلب التاجر') {
  try {
    // إلغاء الكود القديم
    const oldKey = await prisma.activationKey.findFirst({
      where: { merchantId, status: 'ACTIVE' }
    });

    if (oldKey) {
      await prisma.activationKey.update({
        where: { id: oldKey.id },
        data: { 
          status: 'REVOKED',
          notes: `تم إلغاؤه: ${reason}`
        }
      });
    }

    // إنشاء كود جديد
    const newKey = await createActivationKey(merchantId, {
      notes: `تم إعادة التوليد: ${reason}`
    });

    // إرسال إشعار
    await prisma.notification.create({
      data: {
        merchantId,
        type: 'KEY',
        title: 'تم إعادة توليد كود التفعيل',
        message: `تم إنشاء كود تفعيل جديد. السبب: ${reason}`,
        link: '/dashboard/activation-key'
      }
    });

    return newKey;
  } catch (error) {
    console.error('Error regenerating activation key:', error);
    throw error;
  }
}

/**
 * تسجيل محاولة التحقق
 */
async function logVerificationAttempt(keyId, key, success, errorMessage, requestData) {
  try {
    if (!keyId) {
      // تسجيل في ActivityLog فقط
      await prisma.activityLog.create({
        data: {
          action: 'ACTIVATION_KEY_VERIFICATION_FAILED',
          description: `محاولة تحقق فاشلة من كود غير موجود`,
          ipAddress: requestData.ipAddress,
          userAgent: requestData.userAgent,
          metadata: { key, error: errorMessage }
        }
      });
      return;
    }

    await prisma.keyVerification.create({
      data: {
        keyId,
        ipAddress: requestData.ipAddress || 'unknown',
        userAgent: requestData.userAgent,
        storeUrl: requestData.storeUrl,
        success,
        errorMessage,
        requestData: requestData,
        responseData: success ? { valid: true } : { valid: false, error: errorMessage }
      }
    });
  } catch (error) {
    console.error('Error logging verification attempt:', error);
  }
}

/**
 * الحصول على نص حالة الكود
 */
function getStatusText(status) {
  const statusMap = {
    ACTIVE: 'نشط',
    EXPIRED: 'منتهي',
    SUSPENDED: 'معلق',
    REVOKED: 'ملغي'
  };
  return statusMap[status] || status;
}

/**
 * الحصول على سجل التحققات
 * @param {string} keyId - معرف الكود
 * @param {number} limit - عدد السجلات
 * @returns {Promise<array>}
 */
export async function getKeyVerifications(keyId, limit = 50) {
  try {
    return await prisma.keyVerification.findMany({
      where: { keyId },
      orderBy: { verifiedAt: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Error getting key verifications:', error);
    throw error;
  }
}

/**
 * تحديث حالة كود التفعيل بناءً على حالة الاشتراك
 * @param {string} merchantId - معرف التاجر
 */
export async function updateKeyStatusBasedOnSubscription(merchantId) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { merchantId }
    });

    if (!subscription) return;

    let newStatus = 'ACTIVE';
    
    if (subscription.status === 'EXPIRED') {
      newStatus = 'EXPIRED';
    } else if (subscription.status === 'OVERDUE' || subscription.status === 'CANCELLED') {
      newStatus = 'SUSPENDED';
    }

    await prisma.activationKey.updateMany({
      where: { 
        merchantId,
        status: 'ACTIVE'
      },
      data: { 
        status: newStatus,
        expiresAt: subscription.currentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Error updating key status:', error);
    throw error;
  }
}
