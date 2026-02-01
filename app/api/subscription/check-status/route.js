import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { verifyAuth } = await import('@/lib/auth/session');
    const { checkSubscriptionStatus } = await import('@/lib/subscription-checker');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const merchantId = auth.user.id;
    const result = await checkSubscriptionStatus(merchantId);

    if (!result.subscription) {
      return NextResponse.json(
        { success: false, error: 'لا يوجد اشتراك', hasSubscription: false },
        { status: 404 }
      );
    }

    const daysRemaining = result.subscription.endDate
      ? Math.ceil((new Date(result.subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : 0;

    const isInGracePeriod = result.subscription.status === 'EXPIRED' && daysRemaining >= -7 && daysRemaining < 0;
    const needsRenewal = daysRemaining <= 7 && daysRemaining >= 0;
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
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء فحص حالة الاشتراك' }, { status: 500 });
  }
}

function getStatusMessage(status, daysRemaining, isInGracePeriod, isOverdue) {
  if (status === 'ACTIVE') {
    if (daysRemaining > 30) return 'اشتراكك نشط ومستمر';
    if (daysRemaining > 7) return `اشتراكك نشط - يتبقى ${daysRemaining} يوم`;
    if (daysRemaining > 0) return `⚠️ اشتراكك سينتهي خلال ${daysRemaining} يوم`;
    return '⚠️ اشتراكك سينتهي اليوم';
  }
  if (status === 'EXPIRED') {
    if (isInGracePeriod) return `⚠️ اشتراكك منتهي - فترة السماح: ${Math.abs(daysRemaining)} يوم متبقية`;
    if (isOverdue) return '❌ اشتراكك منتهي ومعلق';
    return '❌ اشتراكك منتهي';
  }
  if (status === 'SUSPENDED') return '⏸️ اشتراكك معلق';
  if (status === 'CANCELLED') return '🚫 اشتراكك ملغي';
  return 'حالة غير معروفة';
}

function getActionMessage(status, needsRenewal, isInGracePeriod, isOverdue) {
  if (status === 'ACTIVE' && needsRenewal) return 'يُنصح بتجديد اشتراكك الآن لتجنب انقطاع الخدمة';
  if (status === 'EXPIRED') {
    if (isInGracePeriod) return 'جدد اشتراكك الآن قبل انتهاء فترة السماح';
    if (isOverdue) return 'يجب تجديد اشتراكك لإعادة تفعيل الخدمة';
    return 'جدد اشتراكك لمواصلة استخدام الخدمة';
  }
  if (status === 'SUSPENDED') return 'تواصل مع الدعم لإعادة تفعيل اشتراكك';
  if (status === 'CANCELLED') return 'اشترك في خطة جديدة للبدء من جديد';
  return null;
}
