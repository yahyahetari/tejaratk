import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API لإحصائيات الأدمن - محسّن
 * GET /api/admin/analytics
 * 
 * التحسينات:
 * 1. استخدام Promise.all للـ queries المتوازية
 * 2. Caching للنتائج (5 دقائق)
 * 3. تقليل عدد الـ queries
 */
export async function GET(request) {
  try {
    // Dynamic imports
    const { verifyAuth } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;
    const { withCache, CacheKeys, CacheTTL } = await import('@/lib/cache');

    // التحقق من المصادقة والصلاحيات
    const auth = await verifyAuth(request);
    if (!auth.authenticated || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات أدمن مطلوبة' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // استخدام Cache
    const cacheKey = CacheKeys.ANALYTICS(period);

    const data = await withCache(cacheKey, async () => {
      return await fetchAnalyticsData(prisma, period);
    }, CacheTTL.MEDIUM); // 5 دقائق

    return NextResponse.json({
      success: true,
      data,
      cached: false, // سيكون true إذا من الـ cache
    });

  } catch (error) {
    console.error('Error in admin analytics API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء جلب الإحصائيات'
      },
      { status: 500 }
    );
  }
}

/**
 * جلب بيانات التحليلات
 * @param {import('@prisma/client').PrismaClient} prisma 
 * @param {string} period 
 */
async function fetchAnalyticsData(prisma, period) {
  // حساب تاريخ البداية بناءً على الفترة
  const now = new Date();
  let startDate;

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(0);
  }

  // ===== تنفيذ جميع الـ queries بشكل متوازٍ =====
  const [
    // إحصائيات التجار
    totalMerchants,
    activeMerchants,
    newMerchants,

    // إحصائيات الاشتراكات
    subscriptionStats,
    subscriptionsByPlan,

    // إحصائيات الإيرادات
    totalRevenue,

    // إحصائيات الفواتير
    invoiceStats,
  ] = await Promise.all([
    // التجار
    prisma.merchant.count(),
    prisma.merchant.count({
      where: { subscription: { status: 'ACTIVE' } }
    }),
    prisma.merchant.count({
      where: { createdAt: { gte: startDate } }
    }),

    // الاشتراكات - استعلام مجمّع
    prisma.subscription.groupBy({
      by: ['status'],
      _count: true,
    }),

    // الاشتراكات حسب الخطة
    prisma.subscription.groupBy({
      by: ['planType'],
      _count: true,
      where: { status: 'ACTIVE' }
    }),

    // الإيرادات
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'PAID',
        paidAt: { gte: startDate }
      }
    }),

    // الفواتير - استعلام مجمّع
    prisma.invoice.groupBy({
      by: ['status'],
      _count: true,
      where: { createdAt: { gte: startDate } }
    }),
  ]);

  // معالجة إحصائيات الاشتراكات
  const subscriptionCounts = {
    total: 0,
    active: 0,
    expired: 0,
    suspended: 0,
    paused: 0,
  };

  subscriptionStats.forEach(item => {
    subscriptionCounts.total += item._count;
    const status = item.status?.toLowerCase() || 'other';
    if (subscriptionCounts.hasOwnProperty(status)) {
      subscriptionCounts[status] = item._count;
    }
  });

  // معالجة إحصائيات الفواتير
  const invoiceCounts = {
    total: 0,
    paid: 0,
    due: 0,
    overdue: 0,
    void: 0,
  };

  invoiceStats.forEach(item => {
    invoiceCounts.total += item._count;
    const status = item.status?.toLowerCase() || 'other';
    if (invoiceCounts.hasOwnProperty(status)) {
      invoiceCounts[status] = item._count;
    }
  });

  // معدل التحويل
  const conversionRate = totalMerchants > 0
    ? (activeMerchants / totalMerchants) * 100
    : 0;

  // متوسط الإيرادات لكل تاجر
  const revenueTotal = totalRevenue._sum.amount || 0;
  const avgRevenuePerMerchant = activeMerchants > 0
    ? revenueTotal / activeMerchants
    : 0;

  return {
    period,
    generatedAt: new Date().toISOString(),
    merchants: {
      total: totalMerchants,
      active: activeMerchants,
      new: newMerchants,
      conversionRate: Math.round(conversionRate * 100) / 100
    },
    subscriptions: {
      total: subscriptionCounts.total,
      active: subscriptionCounts.active,
      expired: subscriptionCounts.expired,
      suspended: subscriptionCounts.suspended,
      byPlan: subscriptionsByPlan.map(item => ({
        planType: item.planType || 'UNKNOWN',
        count: item._count
      }))
    },
    revenue: {
      total: revenueTotal,
      avgPerMerchant: Math.round(avgRevenuePerMerchant * 100) / 100
    },
    invoices: {
      total: invoiceCounts.total,
      paid: invoiceCounts.paid,
      pending: invoiceCounts.due,
      overdue: invoiceCounts.overdue
    }
  };
}
