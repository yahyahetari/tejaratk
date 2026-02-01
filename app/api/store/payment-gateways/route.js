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
    const { paymentGateways, gatewayConfigs } = body;

    if (!Array.isArray(paymentGateways)) {
      return NextResponse.json({ success: false, error: 'بيانات بوابات الدفع غير صحيحة' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { merchantId } });

    if (!store) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على المتجر' }, { status: 404 });
    }

    await prisma.store.update({
      where: { merchantId },
      data: {
        paymentGateways: paymentGateways,
        paymentGatewayConfigs: gatewayConfigs || {},
        updatedAt: new Date()
      }
    });

    await prisma.activityLog.create({
      data: {
        merchantId, action: 'PAYMENT_GATEWAYS_UPDATED',
        description: `تم تحديث بوابات الدفع: ${paymentGateways.join(', ')}`,
        metadata: { paymentGateways }
      }
    });

    return NextResponse.json({ success: true, message: 'تم حفظ بوابات الدفع بنجاح' });

  } catch (error) {
    console.error('Error updating payment gateways:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حفظ بوابات الدفع' }, { status: 500 });
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
      select: { paymentGateways: true, paymentGatewayConfigs: true }
    });

    if (!store) {
      return NextResponse.json({ success: true, paymentGateways: [], gatewayConfigs: {} });
    }

    return NextResponse.json({
      success: true,
      paymentGateways: store.paymentGateways || [],
      gatewayConfigs: store.paymentGatewayConfigs || {}
    });

  } catch (error) {
    console.error('Error getting payment gateways:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء جلب بوابات الدفع' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gateway = searchParams.get('gateway');

    if (!gateway) {
      return NextResponse.json({ success: false, error: 'معرف البوابة مطلوب' }, { status: 400 });
    }

    const store = await prisma.store.findUnique({ where: { merchantId: auth.user.id } });

    if (!store) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على المتجر' }, { status: 404 });
    }

    const updatedGateways = (store.paymentGateways || []).filter(g => g !== gateway);

    await prisma.store.update({
      where: { merchantId: auth.user.id },
      data: { paymentGateways: updatedGateways, updatedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: 'تم حذف بوابة الدفع بنجاح' });

  } catch (error) {
    console.error('Error deleting payment gateway:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حذف بوابة الدفع' }, { status: 500 });
  }
}
