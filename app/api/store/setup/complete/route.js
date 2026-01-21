import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';
import { notifyStoreSetupCompleted } from '@/lib/notification-sender';

/**
 * API لإكمال إعداد المتجر
 * POST /api/store/setup/complete
 */
export async function POST(request) {
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

    // التحقق من وجود المتجر
    const store = await prisma.store.findUnique({
      where: { merchantId }
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على معلومات المتجر'
        },
        { status: 404 }
      );
    }

    // التحقق من وجود اشتراك نشط
    const subscription = await prisma.subscription.findUnique({
      where: { merchantId }
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'يجب أن يكون لديك اشتراك نشط لإكمال الإعداد'
        },
        { status: 400 }
      );
    }

    // تحديث حالة إعداد المتجر
    await prisma.storeSetup.update({
      where: { merchantId },
      data: {
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // تحديث حالة التاجر
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'ACTIVE'
      }
    });

    // إرسال إشعار بإكمال الإعداد
    await notifyStoreSetupCompleted(merchantId);

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'STORE_SETUP_COMPLETED',
        description: 'تم إكمال إعداد المتجر بنجاح',
        metadata: {
          storeId: store.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إكمال إعداد المتجر بنجاح',
      data: {
        store: {
          id: store.id,
          brandName: store.brandName
        }
      }
    });

  } catch (error) {
    console.error('Error completing store setup:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء إكمال إعداد المتجر'
      },
      { status: 500 }
    );
  }
}
