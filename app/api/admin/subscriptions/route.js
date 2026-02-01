// app/api/admin/subscriptions/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/admin/subscriptions - الحصول على جميع الاشتراكات
export async function GET(request) {
  try {
    const { requireAdmin } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const planId = searchParams.get('planId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const where = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (planId) {
      where.planId = planId;
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          merchant: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ]);

    const stats = await prisma.subscription.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const planStats = await prisma.subscription.groupBy({
      by: ['planId'],
      _count: { id: true },
      _sum: { amount: true },
    });

    return NextResponse.json({
      success: true,
      subscriptions,
      stats: {
        byStatus: stats,
        byPlan: planStats,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin get subscriptions error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء جلب الاشتراكات' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PUT /api/admin/subscriptions - تحديث اشتراك
export async function PUT(request) {
  try {
    const { requireAdmin } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    await requireAdmin();

    const body = await request.json();
    const { subscriptionId, status, endDate } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: 'معرف الاشتراك مطلوب' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (endDate) updateData.endDate = new Date(endDate);

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
      include: {
        merchant: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الاشتراك بنجاح',
      subscription,
    });
  } catch (error) {
    console.error('Admin update subscription error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء تحديث الاشتراك' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
