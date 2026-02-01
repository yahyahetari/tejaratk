import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const merchantId = auth.user.id;
    const body = await request.json();
    const { fullName, brandName, email, phone, hasLicense, licenseNumber, licenseDocument, country, paymentGateways, setupStep } = body;

    if (!fullName || !brandName || !email || !phone) {
      return NextResponse.json({ success: false, error: 'جميع الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    const existingStore = await prisma.store.findUnique({ where: { merchantId } });
    let store;

    if (existingStore) {
      store = await prisma.store.update({
        where: { merchantId },
        data: {
          fullName, brandName, email, phone,
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
      store = await prisma.store.create({
        data: {
          merchantId, fullName, brandName, email, phone,
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

    await prisma.activityLog.create({
      data: {
        merchantId, action: 'STORE_SETUP_UPDATED',
        description: `تم تحديث معلومات المتجر - الخطوة ${setupStep || 1}`,
        metadata: { storeId: store.id, setupStep: store.setupStep }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ معلومات المتجر بنجاح',
      data: { id: store.id, setupStep: store.setupStep, setupCompleted: store.setupCompleted }
    });

  } catch (error) {
    console.error('Error in store setup API:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حفظ معلومات المتجر' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { merchantId: auth.user.id },
      include: { brandIdentity: true }
    });

    if (!store) {
      return NextResponse.json({ success: true, hasStore: false, data: null });
    }

    return NextResponse.json({ success: true, hasStore: true, data: store });

  } catch (error) {
    console.error('Error getting store data:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء جلب معلومات المتجر' }, { status: 500 });
  }
}
