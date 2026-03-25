import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/store-setup - جلب بيانات إعداد المتجر
 */
export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: auth.user.id },
      include: {
        storeSetup: true,
        store: true,
        brandIdentity: true,
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'لم يتم العثور على التاجر' }, { status: 404 });
    }

    const setupData = {
      fullName: merchant.contactName || '',
      brandName: merchant.store?.brandName || merchant.businessName || '',
      email: merchant.email || merchant.store?.email || '',
      phone: merchant.phone || merchant.store?.phone || '',
      hasLicense: merchant.storeSetup?.licenseCompleted || false,
      licenseNumber: '',
      country: merchant.store?.country || '',
      paymentGateways: merchant.storeSetup?.paymentConfig?.selected || (merchant.storeSetup?.paymentGateway ? merchant.storeSetup.paymentGateway.split(',').filter(Boolean) : []),
      address: merchant.store?.address || '',
      city: merchant.store?.city || '',
      currency: merchant.store?.currency || 'SAR',
      taxRate: merchant.store?.settings?.taxRate || 0,
      shippingCost: merchant.store?.settings?.shippingCost || 0,
      logo: merchant.brandIdentity?.logo || merchant.storeLogo || '',
      primaryColor: merchant.brandIdentity?.primaryColor || '#3B82F6',
      secondaryColor: merchant.brandIdentity?.secondaryColor || '#10B981',
      isCompleted: merchant.storeSetup?.isCompleted || false,
      currentStep: merchant.storeSetup?.currentStep || 1,
    };

    return NextResponse.json({ success: true, storeSetup: setupData });
  } catch (error) {
    console.error('Get store setup error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

/**
 * POST /api/store-setup
 */
export async function POST(request) {
  return handleSave(request);
}

/**
 * PUT /api/store-setup
 */
export async function PUT(request) {
  return handleSave(request);
}

/**
 * وظيفة الحفظ الموحدة - محسّنة لأقل عدد طلبات لقاعدة البيانات
 */
async function handleSave(request) {
  const t0 = Date.now();
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    // تشغيل المصادقة وقراءة البيانات معاً
    const [auth, body] = await Promise.all([
      verifyAuth(request),
      request.json()
    ]);

    console.log(`[store-setup] Auth: ${Date.now() - t0}ms`);

    if (!auth.authenticated) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const {
      fullName, brandName, email, phone,
      hasLicense, licenseNumber, country,
      paymentGateways, logo,
      primaryColor, secondaryColor
    } = body;

    if (!fullName || !brandName) {
      return NextResponse.json({ error: 'الاسم واسم المتجر مطلوبان' }, { status: 400 });
    }

    // استخدام merchantId من الجلسة مباشرة لتجنب استعلام إضافي
    const merchantId = auth.merchant?.id;
    if (!merchantId) {
      // fallback: البحث في قاعدة البيانات
      const merchant = await prisma.merchant.findUnique({
        where: { userId: auth.user.id },
        select: { id: true }
      });
      if (!merchant) {
        return NextResponse.json({ error: 'لم يتم العثور على التاجر' }, { status: 404 });
      }
      return performSave(prisma, merchant.id, body, t0);
    }

    return performSave(prisma, merchantId, body, t0);
  } catch (error) {
    console.error(`[store-setup] Error after ${Date.now() - t0}ms:`, error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حفظ المعلومات' }, { status: 500 });
  }
}

async function performSave(prisma, merchantId, body, t0) {
  const {
    fullName, brandName, email, phone,
    hasLicense, paymentGateways, logo,
    primaryColor, secondaryColor, country
  } = body;

  const gatewaysString = Array.isArray(paymentGateways) ? paymentGateways.join(',') : '';
  const gatewaysConfig = Array.isArray(paymentGateways) ? { selected: paymentGateways } : null;
  const hasGateways = Array.isArray(paymentGateways) && paymentGateways.length > 0;

  // تحضير بيانات الشعار (تجنب حفظ undefined)
  const logoData = logo || undefined;

  // تنفيذ كل شيء في transaction واحد
  await prisma.$transaction([
    prisma.merchant.update({
      where: { id: merchantId },
      data: {
        contactName: fullName,
        businessName: brandName,
        phone: phone || undefined,
        email: email || undefined,
        storeName: brandName,
        ...(logoData ? { storeLogo: logoData } : {}),
      }
    }),
    prisma.store.upsert({
      where: { merchantId },
      create: {
        merchantId, brandName, email, phone,
        country: country || null,
        address: body.address || null,
        city: body.city || null,
        currency: body.currency || 'SAR',
        settings: {
          taxRate: parseFloat(body.taxRate) || 0,
          shippingCost: parseFloat(body.shippingCost) || 0,
        }
      },
      update: {
        brandName, email, phone,
        ...(country ? { country } : {}),
        ...(body.address !== undefined ? { address: body.address } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.currency ? { currency: body.currency } : {}),
        settings: {
          taxRate: parseFloat(body.taxRate) || 0,
          shippingCost: parseFloat(body.shippingCost) || 0,
        }
      }
    }),
    prisma.storeSetup.upsert({
      where: { merchantId },
      create: {
        merchantId,
        basicInfoCompleted: true,
        licenseCompleted: hasLicense || false,
        paymentSetupCompleted: hasGateways,
        brandIdentityCompleted: !!logoData || (primaryColor !== '#3B82F6'),
        paymentGateway: gatewaysString || null,
        paymentConfig: gatewaysConfig,
        currentStep: 4,
      },
      update: {
        basicInfoCompleted: true,
        licenseCompleted: hasLicense || false,
        paymentSetupCompleted: hasGateways,
        brandIdentityCompleted: !!logoData || (primaryColor !== '#3B82F6'),
        paymentGateway: gatewaysString || null,
        paymentConfig: gatewaysConfig,
      }
    }),
    prisma.brandIdentity.upsert({
      where: { merchantId },
      create: {
        merchantId,
        primaryColor: primaryColor || '#3B82F6',
        secondaryColor: secondaryColor || '#10B981',
        logo: logoData || null,
      },
      update: {
        primaryColor: primaryColor || '#3B82F6',
        secondaryColor: secondaryColor || '#10B981',
        ...(logoData ? { logo: logoData } : {}),
      }
    }),
  ]);

  console.log(`[store-setup] Total save: ${Date.now() - t0}ms`);

  return NextResponse.json({
    success: true,
    message: 'تم حفظ إعدادات المتجر بنجاح'
  });
}