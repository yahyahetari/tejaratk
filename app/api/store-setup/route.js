import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

/**
 * Create Store Setup
 * POST /api/store-setup
 */
export async function POST(request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    
    const {
      storeName,
      storeUrl,
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    // Validation
    if (!storeName || !storeUrl) {
      return NextResponse.json(
        { error: 'اسم المتجر وعنوان URL مطلوبان' },
        { status: 400 }
      );
    }

    // Check if store URL is already taken
    const existingStore = await prisma.storeSetup.findUnique({
      where: { storeUrl: storeUrl.toLowerCase() },
    });

    if (existingStore && existingStore.merchantId !== session.merchant.id) {
      return NextResponse.json(
        { error: 'عنوان URL هذا مستخدم بالفعل' },
        { status: 409 }
      );
    }

    // Create or update store setup
    const storeSetup = await prisma.storeSetup.upsert({
      where: { merchantId: session.merchant.id },
      create: {
        merchantId: session.merchant.id,
        storeName,
        storeUrl: storeUrl.toLowerCase(),
        description,
        metaTitle,
        metaDescription,
        metaKeywords,
        status: 'DRAFT',
      },
      update: {
        storeName,
        storeUrl: storeUrl.toLowerCase(),
        description,
        metaTitle,
        metaDescription,
        metaKeywords,
      },
    });

    return NextResponse.json({
      success: true,
      storeSetup,
    }, { status: 201 });
  } catch (error) {
    console.error('Store setup error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ المعلومات' },
      { status: 500 }
    );
  }
}

/**
 * Get Store Setup
 * GET /api/store-setup
 */
export async function GET(request) {
  try {
    const session = await requireAuth();

    const storeSetup = await prisma.storeSetup.findUnique({
      where: { merchantId: session.merchant.id },
    });

    if (!storeSetup) {
      return NextResponse.json(
        { error: 'لم يتم إعداد المتجر بعد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      storeSetup,
    });
  } catch (error) {
    console.error('Get store setup error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}