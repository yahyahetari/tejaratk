import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';

/**
 * API لحفظ معلومات المتجر (Store Setup)
 * POST /api/store/setup
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
      fullName,
      brandName,
      email,
      phone,
      hasLicense,
      licenseNumber,
      licenseDocument,
      country,
      paymentGateways,
      setupStep
    } = body;

    // التحقق من البيانات المطلوبة
    if (!fullName || !brandName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'جميع الحقول الأساسية مطلوبة'
        },
        { status: 400 }
      );
    }

    // البحث عن متجر موجود أو إنشاء جديد
    const existingStore = await prisma.store.findUnique({
      where: { merchantId }
    });

    let store;

    if (existingStore) {
      // تحديث المتجر الموجود
      store = await prisma.store.update({
        where: { merchantId },
        data: {
          fullName,
          brandName,
          email,
          phone,
          hasLicense: hasLicense || false,
          licenseNumber: licenseNumber || null,
          licenseDocument: licenseDocument || null,
          country: country || null,
          paymentGateways: paymentGateways || [],
          setupStep: setupStep || existingStore.setupStep,
          updatedAt: new Date()
        }
      });
    } else {
      // إنشاء متجر جديد
      store = await prisma.store.create({
        data: {
          merchantId,
          fullName,
          brandName,
          email,
          phone,
          hasLicense: hasLicense || false,
          licenseNumber: licenseNumber || null,
          licenseDocument: licenseDocument || null,
          country: country || null,
          paymentGateways: paymentGateways || [],
          setupStep: setupStep || 1,
          setupCompleted: false
        }
      });
    }

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'STORE_SETUP_UPDATED',
        description: `تم تحديث معلومات المتجر - الخطوة ${setupStep || 1}`,
        metadata: { storeId: store.id, setupStep: store.setupStep }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ معلومات المتجر بنجاح',
      data: {
        id: store.id,
        setupStep: store.setupStep,
        setupCompleted: store.setupCompleted
      }
    });

  } catch (error) {
    console.error('Error in store setup API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء حفظ معلومات المتجر'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - الحصول على معلومات المتجر
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
      include: {
        brandIdentity: true
      }
    });

    if (!store) {
      return NextResponse.json({
        success: true,
        hasStore: false,
        data: null
      });
    }

    return NextResponse.json({
      success: true,
      hasStore: true,
      data: store
    });

  } catch (error) {
    console.error('Error getting store data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء جلب معلومات المتجر'
      },
      { status: 500 }
    );
  }
}
