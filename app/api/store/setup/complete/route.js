import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';
import { createActivationKey } from '@/lib/activation-key';
import { notifyStoreSetupCompleted, notifyActivationKeyCreated } from '@/lib/notification-sender';

/**
 * API لإكمال إعداد المتجر وتوليد كود التفعيل
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

    // تحديث حالة المتجر
    await prisma.store.update({
      where: { merchantId },
      data: {
        setupCompleted: true,
        setupStep: 5 // الخطوة الأخيرة
      }
    });

    // تحديث حالة التاجر
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'ACTIVE'
      }
    });

    // التحقق من وجود كود تفعيل سابق
    let activationKey = await prisma.activationKey.findFirst({
      where: { 
        merchantId,
        status: 'ACTIVE'
      }
    });

    // إنشاء كود تفعيل جديد إذا لم يكن موجوداً
    if (!activationKey) {
      activationKey = await createActivationKey(merchantId, {
        notes: 'تم الإنشاء عند إكمال إعداد المتجر'
      });

      // إرسال إشعار بإنشاء الكود
      await notifyActivationKeyCreated(merchantId, activationKey.key);
    }

    // إرسال إشعار بإكمال الإعداد
    await notifyStoreSetupCompleted(merchantId);

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'STORE_SETUP_COMPLETED',
        description: 'تم إكمال إعداد المتجر بنجاح',
        metadata: { 
          storeId: store.id,
          activationKeyId: activationKey.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إكمال إعداد المتجر بنجاح',
      data: {
        store: {
          id: store.id,
          brandName: store.brandName,
          setupCompleted: true
        },
        activationKey: {
          id: activationKey.id,
          key: activationKey.key,
          status: activationKey.status,
          expiresAt: activationKey.expiresAt
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
