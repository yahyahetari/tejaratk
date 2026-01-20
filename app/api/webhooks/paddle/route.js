import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { handlePaddleWebhook, verifyPaddleWebhook } from '@/lib/payment/paddle';

/**
 * Paddle Webhook Handler
 * POST /api/webhooks/paddle
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('paddle-signature');
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !verifyPaddleWebhook(rawBody, signature)) {
        console.error('Invalid Paddle webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }
    
    const event = JSON.parse(rawBody);
    console.log('Paddle webhook received:', event.event_type);
    
    // Process the webhook event
    const result = await handlePaddleWebhook(event);
    
    // Update database based on event type
    if (result.success && result.data) {
      await processWebhookData(result.action, result.data, event);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paddle webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Process webhook data and update database
 */
async function processWebhookData(action, data, rawEvent) {
  const customData = rawEvent.data?.custom_data;
  const merchantId = customData?.merchantId;
  
  switch (action) {
    case 'subscription_created':
      if (merchantId) {
        await prisma.subscription.upsert({
          where: { merchantId },
          update: {
            paddleSubscriptionId: data.paddleSubscriptionId,
            paddleCustomerId: data.paddleCustomerId,
            planType: data.planType,
            billingCycle: data.billingCycle,
            status: 'ACTIVE',
            currentPeriodStart: new Date(data.currentPeriodStart),
            currentPeriodEnd: new Date(data.currentPeriodEnd),
          },
          create: {
            merchantId,
            paddleSubscriptionId: data.paddleSubscriptionId,
            paddleCustomerId: data.paddleCustomerId,
            planType: data.planType,
            billingCycle: data.billingCycle,
            status: 'ACTIVE',
            amount: 0, // Will be updated from transaction
            currentPeriodStart: new Date(data.currentPeriodStart),
            currentPeriodEnd: new Date(data.currentPeriodEnd),
          },
        });
        
        // Update merchant status
        await prisma.merchant.update({
          where: { id: merchantId },
          data: { status: 'ACTIVE' },
        });
      }
      break;
    
    case 'subscription_updated':
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
        data: {
          status: mapPaddleStatus(data.status),
          currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart) : undefined,
          currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined,
          cancelAtPeriodEnd: data.scheduledChange?.action === 'cancel',
        },
      });
      break;
    
    case 'subscription_canceled':
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
        data: {
          status: 'CANCELLED',
          cancelledAt: data.canceledAt ? new Date(data.canceledAt) : new Date(),
        },
      });
      
      // Update merchant status
      const canceledSub = await prisma.subscription.findFirst({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
      });
      if (canceledSub) {
        await prisma.merchant.update({
          where: { id: canceledSub.merchantId },
          data: { status: 'CANCELLED' },
        });
      }
      break;
    
    case 'subscription_paused':
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
        data: { status: 'OVERDUE' },
      });
      break;
    
    case 'subscription_resumed':
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
        data: { status: 'ACTIVE' },
      });
      break;
    
    case 'transaction_completed':
      // Update subscription amount if needed
      if (data.amount) {
        await prisma.subscription.updateMany({
          where: { paddleSubscriptionId: data.paddleSubscriptionId },
          data: {
            amount: parseFloat(data.amount) / 100, // Convert from cents
            currency: data.currency || 'USD',
            lastPaymentDate: new Date(),
          },
        });
      }
      
      // Create invoice record
      const subscription = await prisma.subscription.findFirst({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
      });
      
      if (subscription) {
        await prisma.invoice.create({
          data: {
            merchantId: subscription.merchantId,
            subscriptionId: subscription.id,
            invoiceNumber: `INV-${Date.now()}`,
            amount: parseFloat(data.amount) / 100,
            currency: data.currency || 'USD',
            status: 'PAID',
            paidAt: new Date(),
            dueDate: new Date(),
            transactionId: data.transactionId,
            paymentMethod: 'paddle',
          },
        });
      }
      break;
    
    case 'payment_failed':
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
        data: {
          status: 'OVERDUE',
          isOverdue: true,
          overdueAt: new Date(),
        },
      });
      
      // Update merchant status
      const failedSub = await prisma.subscription.findFirst({
        where: { paddleSubscriptionId: data.paddleSubscriptionId },
      });
      if (failedSub) {
        await prisma.merchant.update({
          where: { id: failedSub.merchantId },
          data: { status: 'OVERDUE' },
        });
      }
      break;
  }
}

/**
 * Map Paddle subscription status to our status
 */
function mapPaddleStatus(paddleStatus) {
  const statusMap = {
    active: 'ACTIVE',
    canceled: 'CANCELLED',
    past_due: 'OVERDUE',
    paused: 'OVERDUE',
    trialing: 'ACTIVE',
  };
  
  return statusMap[paddleStatus] || 'ACTIVE';
}
