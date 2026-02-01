import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

/**
 * API لإحصائيات الأدمن
 * GET /api/admin/analytics
 */
export async function GET(request) {
  try {
    // التحقق من المصادقة والصلاحيات
    const auth = await verifyAuth(request);
    if (!auth.authenticated || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات أدمن مطلوبة' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year, all

    // حساب تاريخ البداية بناءً على الفترة
    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0); // كل الوقت
    }

    // إحصائيات التجار
    const totalMerchants = await prisma.merchant.count();
    const activeMerchants = await prisma.merchant.count({
      where: {
        subscription: {
          status: 'ACTIVE'
        }
      }
    });
    const newMerchants = await prisma.merchant.count({
      where: {
        createdAt: { gte: startDate }
      }
    });

    // إحصائيات الاشتراكات
    const totalSubscriptions = await prisma.subscription.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });
    const expiredSubscriptions = await prisma.subscription.count({
      where: { status: 'EXPIRED' }
    });
    const suspendedSubscriptions = await prisma.subscription.count({
      where: { status: 'SUSPENDED' }
    });

    // إحصائيات حسب نوع الخطة
    const subscriptionsByPlan = await prisma.subscription.groupBy({
      by: ['planType'],
      _count: true,
      where: { status: 'ACTIVE' }
    });

    // إحصائيات الإيرادات
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'SUCCESS',
        processedAt: { gte: startDate }
      }
    });

    const revenueByMonth = await prisma.payment.groupBy({
      by: ['processedAt'],
      _sum: { amount: true },
      where: {
        status: 'SUCCESS',
        processedAt: { gte: startDate }
      },
      orderBy: { processedAt: 'asc' }
    });

    // إحصائيات الفواتير
    const totalInvoices = await prisma.invoice.count({
      where: { createdAt: { gte: startDate } }
    });
    const paidInvoices = await prisma.invoice.count({
      where: {
        status: 'PAID',
        createdAt: { gte: startDate }
      }
    });
    const pendingInvoices = await prisma.invoice.count({
      where: {
        status: 'PENDING',
        createdAt: { gte: startDate }
      }
    });
    const overdueInvoices = await prisma.invoice.count({
      where: {
        status: 'OVERDUE',
        createdAt: { gte: startDate }
      }
    });

    // معدل نمو التجار (مقارنة مع الفترة السابقة)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (now.getTime() - startDate.getTime()));

    const previousPeriodMerchants = await prisma.merchant.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });

    const growthRate = previousPeriodMerchants > 0
      ? ((newMerchants - previousPeriodMerchants) / previousPeriodMerchants) * 100
      : 0;

    // معدل التحويل (Conversion Rate)
    const conversionRate = totalMerchants > 0
      ? (activeMerchants / totalMerchants) * 100
      : 0;

    // متوسط الإيرادات لكل تاجر
    const avgRevenuePerMerchant = activeMerchants > 0
      ? (totalRevenue._sum.amount || 0) / activeMerchants
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        period,
        merchants: {
          total: totalMerchants,
          active: activeMerchants,
          new: newMerchants,
          growthRate: Math.round(growthRate * 100) / 100,
          conversionRate: Math.round(conversionRate * 100) / 100
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          expired: expiredSubscriptions,
          suspended: suspendedSubscriptions,
          byPlan: subscriptionsByPlan.map(item => ({
            planType: item.planType,
            count: item._count
          }))
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          avgPerMerchant: Math.round(avgRevenuePerMerchant * 100) / 100,
          byMonth: revenueByMonth.map(item => ({
            month: item.processedAt,
            amount: item._sum.amount || 0
          }))
        },
        invoices: {
          total: totalInvoices,
          paid: paidInvoices,
          pending: pendingInvoices,
          overdue: overdueInvoices
        }
      }
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

