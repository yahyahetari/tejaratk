import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');
    const { calculateSubscriptionEndDate } = await import('@/lib/subscription-checker');
    const { sendNotification } = await import('@/lib/notification-sender');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const merchantId = auth.user.id;
    const body = await request.json();
    const { planType, billingCycle, paymentMethod } = body;

    if (!planType || !billingCycle) {
      return NextResponse.json({ success: false, error: 'نوع الخطة ودورة الفوترة مطلوبة' }, { status: 400 });
    }

    const validPlanTypes = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
    const validBillingCycles = ['MONTHLY', 'YEARLY'];

    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json({ success: false, error: 'نوع الخطة غير صحيح' }, { status: 400 });
    }

    if (!validBillingCycles.includes(billingCycle)) {
      return NextResponse.json({ success: false, error: 'دورة الفوترة غير صحيحة' }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({ where: { merchantId } });

    if (!subscription) {
      return NextResponse.json({ success: false, error: 'لا يوجد اشتراك للتجديد' }, { status: 404 });
    }

    const currentEndDate = subscription.status === 'ACTIVE' && subscription.endDate > new Date()
      ? subscription.endDate
      : new Date();

    const newEndDate = calculateSubscriptionEndDate(currentEndDate, billingCycle);

    const updatedSubscription = await prisma.subscription.update({
      where: { merchantId },
      data: {
        planType,
        billingCycle,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: newEndDate,
        lastPaymentDate: new Date(),
        nextPaymentDate: newEndDate,
        updatedAt: new Date()
      }
    });

    const invoice = await prisma.invoice.create({
      data: {
        merchantId,
        subscriptionId: subscription.id,
        amount: 0,
        currency: 'SAR',
        status: 'PAID',
        paidAt: new Date(),
        dueDate: new Date(),
        items: [{ description: `تجديد اشتراك ${planType} - ${billingCycle}`, quantity: 1, unitPrice: 0, total: 0 }]
      }
    });

    await prisma.payment.create({
      data: {
        merchantId,
        invoiceId: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        method: paymentMethod || 'CARD',
        status: 'SUCCESS',
        transactionId: `TXN-${Date.now()}`,
        processedAt: new Date()
      }
    });

    try {
      await sendNotification(merchantId, {
        type: 'SUBSCRIPTION',
        title: 'تم تجديد الاشتراك',
        message: `تم تجديد اشتراكك بنجاح حتى ${newEndDate.toLocaleDateString('ar-SA')}`,
        metadata: { subscriptionId: subscription.id, planType, billingCycle, endDate: newEndDate }
      });
    } catch (e) { console.error('Notification error:', e); }

    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'SUBSCRIPTION_RENEWED',
        description: `تم تجديد الاشتراك - ${planType} - ${billingCycle}`,
        metadata: { subscriptionId: subscription.id, invoiceId: invoice.id, endDate: newEndDate }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تجديد الاشتراك بنجاح',
      data: { subscription: updatedSubscription, invoice: { id: invoice.id, amount: invoice.amount, status: invoice.status } }
    });

  } catch (error) {
    console.error('Error in subscription renewal API:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء تجديد الاشتراك' }, { status: 500 });
  }
}
