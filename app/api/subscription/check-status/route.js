import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/session';
import { checkSubscriptionStatus } from '@/lib/subscription-checker';

/**
 * API لفحص حالة الاشتراك
 * GET /api/subscription/check-status
 */
export async function GET(request) {
  try {
    // التحقق من المصادقة
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const merchantId = auth.user.id;

    // فحص حالة الاشتراك
    const result = await checkSubscriptionStatus(merchantId);

    if (!result.subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'لا يوجد اشتراك',
          hasSubscription: false
        },
        { status: 404 }
      );
    }

    // حساب الأيام المتبقية
    const daysRemaining = result.subscription.endDate 
      ? Math.ceil((new Date(result.subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 0;

    // تحديد ما إذا كان في فترة السماح
    const isInGracePeriod = result.subscription.status === 'EXPIRED' && daysRemaining >= -7 && daysRemaining < 0;

    // تحديد ما إذا كان يحتاج تجديد
    const needsRenewal = daysRemaining <= 7 && daysRemaining >= 0;

    // تحديد ما إذا كان متأخر
    const isOverdue = result.subscription.status === 'EXPIRED' && daysRemaining < -7;

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: result.subscription.id,
          planType: result.subscription.planType,
          billingCycle: result.subscription.billingCycle,
          status: result.subscription.status,
          startDate: result.subscription.startDate,
          endDate: result.subscription.endDate,
          lastPaymentDate: result.subscription.lastPaymentDate,
          nextPaymentDate: result.subscription.nextPaymentDate
        },
        statusInfo: {
          isActive: result.subscription.status === 'ACTIVE',
          isExpired: result.subscription.status === 'EXPIRED',
          isSuspended: result.subscription.status === 'SUSPENDED',
          isCancelled: result.subscription.status === 'CANCELLED',
          isInGracePeriod,
          needsRenewal,
          isOverdue,
          daysRemaining,
          daysInGracePeriod: isInGracePeriod ? Math.abs(daysRemaining) : 0
        },
        messages: {
          status: getStatusMessage(result.subscription.status, daysRemaining, isInGracePeriod, isOverdue),
          action: getActionMessage(result.subscription.status, needsRenewal, isInGracePeriod, isOverdue)
        }
      }
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء فحص حالة الاشتراك'
      },
      { status: 500 }
    );
  }
}

/**
 * رسالة الحالة
 */
function getStatusMessage(status, daysRemaining, isInGracePeriod, isOverdue) {
  if (status === 'ACTIVE') {
    if (daysRemaining > 30) {
      return 'اشتراكك نشط ومستمر';
    } else if (daysRemaining > 7) {
      return `اشتراكك نشط - يتبقى ${daysRemaining} يوم`;
    } else if (daysRemaining > 0) {
      return `⚠️ اشتراكك سينتهي خلال ${daysRemaining} يوم`;
    } else {
      return '⚠️ اشتراكك سينتهي اليوم';
    }
  }

  if (status === 'EXPIRED') {
    if (isInGracePeriod) {
      return `⚠️ اشتراكك منتهي - فترة السماح: ${Math.abs(daysRemaining)} يوم متبقية`;
    } else if (isOverdue) {
      return '❌ اشتراكك منتهي ومعلق';
    } else {
      return '❌ اشتراكك منتهي';
    }
  }

  if (status === 'SUSPENDED') {
    return '⏸️ اشتراكك معلق';
  }

  if (status === 'CANCELLED') {
    return '🚫 اشتراكك ملغي';
  }

  return 'حالة غير معروفة';
}

/**
 * رسالة الإجراء المطلوب
 */
function getActionMessage(status, needsRenewal, isInGracePeriod, isOverdue) {
  if (status === 'ACTIVE' && needsRenewal) {
    return 'يُنصح بتجديد اشتراكك الآن لتجنب انقطاع الخدمة';
  }

  if (status === 'EXPIRED') {
    if (isInGracePeriod) {
      return 'جدد اشتراكك الآن قبل انتهاء فترة السماح';
    } else if (isOverdue) {
      return 'يجب تجديد اشتراكك لإعادة تفعيل الخدمة';
    } else {
      return 'جدد اشتراكك لمواصلة استخدام الخدمة';
    }
  }

  if (status === 'SUSPENDED') {
    return 'تواصل مع الدعم لإعادة تفعيل اشتراكك';
  }

  if (status === 'CANCELLED') {
    return 'اشترك في خطة جديدة للبدء من جديد';
  }

  return null;
}
