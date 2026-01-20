import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';

/**
 * API لإدارة التجار (Admin)
 * GET /api/admin/merchants - قائمة التجار
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // all, active, expired, suspended
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // بناء شروط البحث
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

    // جلب التجار
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
        activationKeys: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            key: true,
            status: true,
            lastVerifiedAt: true
          }
        },
        _count: {
          select: {
            invoices: true,
            payments: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    // عدد التجار الكلي
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
          activationKey: merchant.activationKeys?.[0] ? {
            key: merchant.activationKeys[0].key,
            status: merchant.activationKeys[0].status,
            lastVerifiedAt: merchant.activationKeys[0].lastVerifiedAt
          } : null,
          stats: {
            invoicesCount: merchant._count.invoices,
            paymentsCount: merchant._count.payments
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
      {
        success: false,
        error: 'حدث خطأ أثناء جلب التجار'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH - تحديث بيانات تاجر
 */
export async function PATCH(request) {
  try {
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
        {
          success: false,
          error: 'معرف التاجر والإجراء مطلوبان'
        },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'suspend':
        // تعليق الاشتراك
        result = await prisma.subscription.update({
          where: { merchantId },
          data: { status: 'SUSPENDED' }
        });
        break;

      case 'activate':
        // تفعيل الاشتراك
        result = await prisma.subscription.update({
          where: { merchantId },
          data: { status: 'ACTIVE' }
        });
        break;

      case 'extend':
        // تمديد الاشتراك
        const subscription = await prisma.subscription.findUnique({
          where: { merchantId }
        });

        if (!subscription) {
          return NextResponse.json(
            {
              success: false,
              error: 'لا يوجد اشتراك لهذا التاجر'
            },
            { status: 404 }
          );
        }

        const extensionDays = data?.days || 30;
        const newEndDate = new Date(subscription.endDate);
        newEndDate.setDate(newEndDate.getDate() + extensionDays);

        result = await prisma.subscription.update({
          where: { merchantId },
          data: {
            endDate: newEndDate,
            status: 'ACTIVE'
          }
        });
        break;

      case 'updateRole':
        // تغيير الدور
        result = await prisma.merchant.update({
          where: { id: merchantId },
          data: { role: data?.role || 'MERCHANT' }
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'إجراء غير معروف'
          },
          { status: 400 }
        );
    }

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId: auth.user.id,
        action: `ADMIN_${action.toUpperCase()}`,
        description: `Admin action: ${action} on merchant ${merchantId}`,
        metadata: {
          targetMerchantId: merchantId,
          action,
          data
        }
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
      {
        success: false,
        error: 'حدث خطأ أثناء تنفيذ الإجراء'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - حذف تاجر
 */
export async function DELETE(request) {
  try {
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
        {
          success: false,
          error: 'معرف التاجر مطلوب'
        },
        { status: 400 }
      );
    }

    // حذف جميع البيانات المرتبطة (Cascade)
    await prisma.merchant.delete({
      where: { id: merchantId }
    });

    // تسجيل النشاط
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
      {
        success: false,
        error: 'حدث خطأ أثناء حذف التاجر'
      },
      { status: 500 }
    );
  }
}
