import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';

/**
 * API لتحديث بوابات الدفع
 * POST /api/store/payment-gateways
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
    const body = await request.json();

    const {
      paymentGateways,
      gatewayConfigs
    } = body;

    // التحقق من البيانات
    if (!Array.isArray(paymentGateways)) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات بوابات الدفع غير صحيحة'
        },
        { status: 400 }
      );
    }

    // البحث عن المتجر
    const store = await prisma.store.findUnique({
      where: { merchantId }
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على المتجر'
        },
        { status: 404 }
      );
    }

    // تحديث بوابات الدفع
    const updatedStore = await prisma.store.update({
      where: { merchantId },
      data: {
        paymentGateways: paymentGateways,
        updatedAt: new Date()
      }
    });

    // حفظ إعدادات البوابات (إذا وجدت)
    if (gatewayConfigs && typeof gatewayConfigs === 'object') {
      // TODO: حفظ الإعدادات في جدول منفصل مشفر
      // يجب تشفير مفاتيح API قبل الحفظ
    }

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'PAYMENT_GATEWAYS_UPDATED',
        description: `تم تحديث بوابات الدفع - ${paymentGateways.length} بوابة`,
        metadata: { 
          storeId: store.id,
          gateways: paymentGateways
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بوابات الدفع بنجاح',
      data: {
        paymentGateways: updatedStore.paymentGateways
      }
    });

  } catch (error) {
    console.error('Error in payment gateways API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء تحديث بوابات الدفع'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - الحصول على بوابات الدفع المفعلة
 */
export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const merchantId = auth.user.id;

    const store = await prisma.store.findUnique({
      where: { merchantId },
      select: {
        paymentGateways: true
      }
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على المتجر'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentGateways: store.paymentGateways || []
      }
    });

  } catch (error) {
    console.error('Error getting payment gateways:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء جلب بوابات الدفع'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - حذف بوابة دفع
 */
export async function DELETE(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const merchantId = auth.user.id;
    const { searchParams } = new URL(request.url);
    const gatewayId = searchParams.get('gateway');

    if (!gatewayId) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف البوابة مطلوب'
        },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { merchantId }
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على المتجر'
        },
        { status: 404 }
      );
    }

    // إزالة البوابة من القائمة
    const updatedGateways = (store.paymentGateways || []).filter(g => g !== gatewayId);

    await prisma.store.update({
      where: { merchantId },
      data: {
        paymentGateways: updatedGateways
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف بوابة الدفع بنجاح'
    });

  } catch (error) {
    console.error('Error deleting payment gateway:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء حذف بوابة الدفع'
      },
      { status: 500 }
    );
  }
}
