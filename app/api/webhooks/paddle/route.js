import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { handlePaddleWebhook, verifyPaddleWebhook } = await import('@/lib/payment/paddle');

    const rawBody = await request.text();
    const signature = request.headers.get('paddle-signature');

    if (process.env.NODE_ENV === 'production') {
      if (!signature || !verifyPaddleWebhook(rawBody, signature)) {
        console.error('Invalid Paddle webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    console.log('Paddle webhook received:', event.event_type);

    const result = await handlePaddleWebhook(event);

    if (!result.success) {
      console.error('Paddle webhook processing failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Update subscription in database if needed
    if (result.subscription) {
      const { merchantId, status, planType, billingCycle, startDate, endDate } = result.subscription;

      try {
        await prisma.subscription.upsert({
          where: { merchantId },
          update: { status, planType, billingCycle, startDate, endDate, updatedAt: new Date() },
          create: { merchantId, status, planType, billingCycle, startDate, endDate }
        });
      } catch (dbError) {
        console.error('Error updating subscription:', dbError);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Paddle webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
