import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API لإدارة التجار (Admin)
 * GET /api/admin/merchants - قائمة التجار
 */
export async function GET(request) {
  try {
    const { verifyAuth } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    const auth = await verifyAuth(request);
    if (!auth.authenticated || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات أدمن مطلوبة' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (status !== 'all') {
      where.subscription = {
        status: status.toUpperCase()
      };
    }

    const merchants = await prisma.merchant.findMany({
      where,
      include: {
        user: {
          select: { email: true, emailVerified: true, createdAt: true }
        },
        subscription: true,
        store: {
          select: {
            brandName: true,
            setupCompleted: true
          }
        },
        _count: {
          select: {
            invoices: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    const total = await prisma.merchant.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        merchants: merchants.map(merchant => ({
          id: merchant.id,
          businessName: merchant.businessName,
          contactName: merchant.contactName,
          email: merchant.user?.email,
          emailVerified: merchant.user?.emailVerified,
          status: merchant.status,
          createdAt: merchant.createdAt,
          store: merchant.store,
          subscription: merchant.subscription ? {
            id: merchant.subscription.id,
            planType: merchant.subscription.planType,
            billingCycle: merchant.subscription.billingCycle,
            status: merchant.subscription.status,
            startDate: merchant.subscription.startDate,
            endDate: merchant.subscription.endDate
          } : null,
          stats: {
            invoicesCount: merchant._count.invoices
          }
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error in admin merchants API:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب التجار' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - تحديث بيانات تاجر
 */
export async function PATCH(request) {
  try {
    const { verifyAuth } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    const auth = await verifyAuth(request);
    if (!auth.authenticated || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات أدمن مطلوبة' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { merchantId, action, data } = body;

    if (!merchantId || !action) {
      return NextResponse.json(
        { success: false, error: 'معرف التاجر والإجراء مطلوبان' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'suspend':
        result = await prisma.subscription.update({
          where: { merchantId },
          data: { status: 'SUSPENDED' }
        });
        break;

      case 'activate':
        result = await prisma.subscription.update({
          where: { merchantId },
          data: { status: 'ACTIVE' }
        });
        break;

      case 'extend':
        const subscription = await prisma.subscription.findUnique({
          where: { merchantId }
        });

        if (!subscription) {
          return NextResponse.json(
            { success: false, error: 'لا يوجد اشتراك لهذا التاجر' },
            { status: 404 }
          );
        }

        const extensionDays = data?.days || 30;
        const newEndDate = new Date(subscription.endDate);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);

        result = await prisma.subscription.update({
          where: { merchantId },
          data: { endDate: newEndDate, status: 'ACTIVE' }
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'إجراء غير معروف' },
          { status: 400 }
        );
    }

    await prisma.activityLog.create({
      data: {
        merchantId: auth.user.id,
        action: `ADMIN_${action.toUpperCase()}`,
        description: `Admin action: ${action} on merchant ${merchantId}`,
        metadata: { targetMerchantId: merchantId, action, data }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تنفيذ الإجراء بنجاح',
      data: result
    });

  } catch (error) {
    console.error('Error in admin merchants PATCH:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تنفيذ الإجراء' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - حذف تاجر
 */
export async function DELETE(request) {
  try {
    const { verifyAuth } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    const auth = await verifyAuth(request);
    if (!auth.authenticated || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات أدمن مطلوبة' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId) {
      return NextResponse.json(
        { success: false, error: 'معرف التاجر مطلوب' },
        { status: 400 }
      );
    }

    await prisma.merchant.delete({
      where: { id: merchantId }
    });

    await prisma.activityLog.create({
      data: {
        merchantId: auth.user.id,
        action: 'ADMIN_DELETE_MERCHANT',
        description: `Admin deleted merchant ${merchantId}`,
        metadata: { deletedMerchantId: merchantId }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف التاجر بنجاح'
    });

  } catch (error) {
    console.error('Error in admin merchants DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف التاجر' },
      { status: 500 }
    );
  }
}
