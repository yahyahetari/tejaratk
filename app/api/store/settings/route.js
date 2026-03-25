import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const session = await verifyAuth(request);
    if (!session || !session.authenticated) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user?.id },
      select: {
        id: true,
        businessName: true,
        contactName: true,
        phone: true,
        email: true,
        storeName: true,
        store: {
          select: {
            brandName: true,
            email: true,
            phone: true,
            country: true,
            currency: true,
            description: true,
            address: true,
            city: true,
            settings: true,
          }
        }
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 });
    }

    // تجميع البيانات من Merchant + Store
    const storeSettings = merchant.store?.settings || {};
    const settings = {
      storeName: merchant.store?.brandName || merchant.storeName || merchant.businessName || '',
      storeDescription: merchant.store?.description || '',
      storeEmail: merchant.store?.email || merchant.email || '',
      storePhone: merchant.store?.phone || merchant.phone || '',
      storeAddress: merchant.store?.address || storeSettings.address || '',
      storeCity: merchant.store?.city || storeSettings.city || '',
      storeCountry: merchant.store?.country || '',
      currency: merchant.store?.currency || 'SAR',
      taxRate: storeSettings.taxRate || 0,
      shippingCost: storeSettings.shippingCost || 0,
    };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const session = await verifyAuth(request);
    if (!session || !session.authenticated) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { storeName, storeDescription, storeEmail, storePhone, storeAddress, storeCity, storeCountry, currency, taxRate, shippingCost } = body;

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user?.id },
      select: { id: true }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 });
    }

    // حفظ في Merchant + Store معاً
    await prisma.$transaction([
      prisma.merchant.update({
        where: { userId: session.user?.id },
        data: {
          businessName: storeName || undefined,
          storeName: storeName || undefined,
          email: storeEmail || undefined,
          phone: storePhone || undefined,
        },
      }),
      prisma.store.upsert({
        where: { merchantId: merchant.id },
        create: {
          merchantId: merchant.id,
          brandName: storeName,
          description: storeDescription,
          email: storeEmail,
          phone: storePhone,
          country: storeCountry || null,
          currency: currency || 'SAR',
          address: storeAddress || null,
          city: storeCity || null,
          settings: {
            taxRate: parseFloat(taxRate) || 0,
            shippingCost: parseFloat(shippingCost) || 0,
            address: storeAddress || '',
            city: storeCity || '',
          }
        },
        update: {
          brandName: storeName || undefined,
          description: storeDescription,
          email: storeEmail || undefined,
          phone: storePhone || undefined,
          country: storeCountry || undefined,
          currency: currency || undefined,
          settings: {
            taxRate: parseFloat(taxRate) || 0,
            shippingCost: parseFloat(shippingCost) || 0,
            address: storeAddress || '',
            city: storeCity || '',
          }
        },
      })
    ]);

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
