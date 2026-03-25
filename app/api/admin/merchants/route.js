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
      select: {
        id: true,
        businessName: true,
        contactName: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            emailVerified: true,
            createdAt: true,
          }
        },
        subscription: {
          select: {
            id: true,
            planType: true,
            billingCycle: true,
            status: true,
            startDate: true,
            endDate: true,
          }
        },
        store: {
          select: {
            brandName: true,
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
 * PUT - تحديث حالة تاجر (alias for PATCH)
 */
export async function PUT(request) {
  return PATCH(request);
}

/**
 * PATCH - تحديث بيانات/حالة تاجر
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

    let message = '';

    switch (action) {
      case 'suspend': {
        // إيقاف التاجر + الاشتراك
        await prisma.$transaction([
          prisma.merchant.update({
            where: { id: merchantId },
            data: { status: 'SUSPENDED' }
          }),
          prisma.subscription.updateMany({
            where: { merchantId },
            data: { status: 'PAUSED' }
          })
        ]);
        message = 'تم إيقاف حساب التاجر بنجاح';
        break;
      }

      case 'activate': {
        // تفعيل التاجر + الاشتراك
        await prisma.$transaction([
          prisma.merchant.update({
            where: { id: merchantId },
            data: { status: 'ACTIVE' }
          }),
          prisma.subscription.updateMany({
            where: { merchantId },
            data: { status: 'ACTIVE' }
          })
        ]);
        message = 'تم تفعيل حساب التاجر بنجاح';
        break;
      }

      case 'extend': {
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
        const baseDate = subscription.endDate || subscription.currentPeriodEnd || new Date();
        const newEndDate = new Date(baseDate);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);

        await prisma.subscription.update({
          where: { merchantId },
          data: {
            endDate: newEndDate,
            currentPeriodEnd: newEndDate,
            status: 'ACTIVE'
          }
        });
        message = `تم تمديد الاشتراك ${extensionDays} يوماً بنجاح`;
        break;
      }

      case 'delete': {
        // حذف التاجر وحسابه بالكامل (cascade يحذف كل البيانات المرتبطة)
        const merchant = await prisma.merchant.findUnique({
          where: { id: merchantId },
          select: { userId: true }
        });

        if (!merchant) {
          return NextResponse.json(
            { success: false, error: 'التاجر غير موجود' },
            { status: 404 }
          );
        }

        // حذف المستخدم (cascade يحذف Merchant وكل البيانات)
        await prisma.user.delete({
          where: { id: merchant.userId }
        });
        message = 'تم حذف الحساب بالكامل';
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'إجراء غير معروف' },
          { status: 400 }
        );
    }

    // تسجيل النشاط (لا نسجل عند الحذف لأن التاجر لم يعد موجوداً)
    if (action !== 'delete') {
      try {
        await prisma.activityLog.create({
          data: {
            merchantId,
            action: `ADMIN_${action.toUpperCase()}`,
            description: `Admin action: ${action} on merchant ${merchantId}`,
            metadata: { targetMerchantId: merchantId, action, adminId: auth.user.id }
          }
        });
      } catch (e) { /* تجاهل أخطاء التسجيل */ }
    }

    return NextResponse.json({ success: true, message });

  } catch (error) {
    console.error('Error in admin merchants action:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تنفيذ الإجراء' },
      { status: 500 }
    );
  }
}

