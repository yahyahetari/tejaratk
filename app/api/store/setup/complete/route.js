import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');
    const { notifyStoreSetupCompleted } = await import('@/lib/notification-sender');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const merchantId = auth.user.id;

    const store = await prisma.store.findUnique({ where: { merchantId } });

    if (!store) {
      return NextResponse.json({ success: false, error: 'لم يتم إنشاء المتجر بعد' }, { status: 404 });
    }

    if (store.setupCompleted) {
      return NextResponse.json({ success: true, message: 'إعداد المتجر مكتمل مسبقاً', alreadyCompleted: true });
    }

    // التحقق من اكتمال الخطوات
    if (!store.fullName || !store.brandName || !store.email) {
      return NextResponse.json({ success: false, error: 'يرجى إكمال جميع خطوات الإعداد' }, { status: 400 });
    }

    await prisma.store.update({
      where: { merchantId },
      data: { setupCompleted: true, setupCompletedAt: new Date(), updatedAt: new Date() }
    });

    await prisma.activityLog.create({
      data: {
        merchantId, action: 'STORE_SETUP_COMPLETED',
        description: 'تم إكمال إعداد المتجر بنجاح',
        metadata: { storeId: store.id }
      }
    });

    try {
      await notifyStoreSetupCompleted(merchantId);
    } catch (e) { console.error('Notification error:', e); }

    return NextResponse.json({
      success: true,
      message: 'تم إكمال إعداد المتجر بنجاح',
      data: { storeId: store.id }
    });

  } catch (error) {
    console.error('Error completing store setup:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء إكمال إعداد المتجر' }, { status: 500 });
  }
}
