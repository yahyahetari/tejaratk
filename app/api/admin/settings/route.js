// app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';

// GET /api/admin/settings - الحصول على إعدادات النظام
export async function GET(request) {
  try {
    await requireAdmin();

    // إحصائيات عامة للنظام
    const [
      totalUsers,
      totalMerchants,
      totalStores,
      totalSubscriptions,
      activeSubscriptions,
      totalPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.store.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      settings: {
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'تجارتك',
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
        environment: process.env.NODE_ENV,
      },
      stats: {
        totalUsers,
        totalMerchants,
        totalStores,
        totalSubscriptions,
        totalRevenue: totalPayments._sum.amount || 0,
        activeSubscriptions,
      },
    });
  } catch (error) {
    console.error('Admin get settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء جلب الإعدادات' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PUT /api/admin/settings - تحديث إعدادات النظام
export async function PUT(request) {
  try {
    await requireAdmin();

    const body = await request.json();

    // هنا يمكن إضافة منطق تحديث الإعدادات
    // مثل حفظها في قاعدة البيانات أو ملف تكوين

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
    });
  } catch (error) {
    console.error('Admin update settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء تحديث الإعدادات' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
