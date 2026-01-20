/**
 * Paddle Payment Integration
 * بوابة الدفع الوحيدة المستخدمة في المنصة
 */

// Paddle Configuration
export const PADDLE_CONFIG = {
  vendorId: process.env.PADDLE_VENDOR_ID || '',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  sandboxUrl: 'https://sandbox-checkout.paddle.com',
  productionUrl: 'https://checkout.paddle.com',
};

// Product IDs for each plan
export const PADDLE_PRODUCTS = {
  BASIC: {
    monthly: process.env.PADDLE_BASIC_MONTHLY_PRICE_ID || 'pri_basic_monthly',
    yearly: process.env.PADDLE_BASIC_YEARLY_PRICE_ID || 'pri_basic_yearly',
  },
  PREMIUM: {
    monthly: process.env.PADDLE_PREMIUM_MONTHLY_PRICE_ID || 'pri_premium_monthly',
    yearly: process.env.PADDLE_PREMIUM_YEARLY_PRICE_ID || 'pri_premium_yearly',
  },
  ENTERPRISE: {
    monthly: process.env.PADDLE_ENTERPRISE_MONTHLY_PRICE_ID || 'pri_enterprise_monthly',
    yearly: process.env.PADDLE_ENTERPRISE_YEARLY_PRICE_ID || 'pri_enterprise_yearly',
  },
};

/**
 * Get Paddle Price ID based on plan and billing cycle
 * @param {string} planId - Plan ID (BASIC, PREMIUM, ENTERPRISE)
 * @param {string} billingCycle - Billing cycle (MONTHLY, YEARLY)
 * @returns {string} Paddle Price ID
 */
export function getPaddlePriceId(planId, billingCycle = 'MONTHLY') {
  const plan = PADDLE_PRODUCTS[planId];
  if (!plan) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  
  return billingCycle === 'YEARLY' ? plan.yearly : plan.monthly;
}

/**
 * Initialize Paddle checkout
 * @param {Object} options - Checkout options
 * @returns {Object} Checkout configuration
 */
export function initPaddleCheckout(options) {
  const {
    priceId,
    customerEmail,
    customerId,
    successUrl,
    cancelUrl,
    passthrough,
  } = options;

  return {
    items: [{ priceId, quantity: 1 }],
    customer: {
      email: customerEmail,
      id: customerId,
    },
    settings: {
      displayMode: 'overlay',
      theme: 'light',
      locale: 'ar',
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription/success`,
      allowLogout: false,
    },
    customData: passthrough,
  };
}

/**
 * Verify Paddle webhook signature
 * @param {string} rawBody - Raw request body
 * @param {string} signature - Paddle signature header
 * @returns {boolean} Is signature valid
 */
export function verifyPaddleWebhook(rawBody, signature) {
  const crypto = require('crypto');
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('PADDLE_WEBHOOK_SECRET not configured');
    return false;
  }
  
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}

/**
 * Handle Paddle webhook events
 * @param {Object} event - Paddle webhook event
 * @returns {Promise<Object>} Processing result
 */
export async function handlePaddleWebhook(event) {
  const { event_type, data } = event;
  
  switch (event_type) {
    case 'subscription.created':
      return handleSubscriptionCreated(data);
    
    case 'subscription.updated':
      return handleSubscriptionUpdated(data);
    
    case 'subscription.canceled':
      return handleSubscriptionCanceled(data);
    
    case 'subscription.paused':
      return handleSubscriptionPaused(data);
    
    case 'subscription.resumed':
      return handleSubscriptionResumed(data);
    
    case 'transaction.completed':
      return handleTransactionCompleted(data);
    
    case 'transaction.payment_failed':
      return handlePaymentFailed(data);
    
    default:
      console.log(`Unhandled Paddle event: ${event_type}`);
      return { success: true, message: 'Event not handled' };
  }
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(data) {
  const { id, customer_id, items, status, current_billing_period } = data;
  
  // Extract plan from items
  const planItem = items[0];
  const priceId = planItem?.price?.id;
  
  // Determine plan type from price ID
  const planType = getPlanTypeFromPriceId(priceId);
  const billingCycle = priceId?.includes('yearly') ? 'YEARLY' : 'MONTHLY';
  
  return {
    success: true,
    action: 'subscription_created',
    data: {
      paddleSubscriptionId: id,
      paddleCustomerId: customer_id,
      planType,
      billingCycle,
      status,
      currentPeriodStart: current_billing_period?.starts_at,
      currentPeriodEnd: current_billing_period?.ends_at,
    },
  };
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(data) {
  const { id, status, current_billing_period, scheduled_change } = data;
  
  return {
    success: true,
    action: 'subscription_updated',
    data: {
      paddleSubscriptionId: id,
      status,
      currentPeriodStart: current_billing_period?.starts_at,
      currentPeriodEnd: current_billing_period?.ends_at,
      scheduledChange: scheduled_change,
    },
  };
}

/**
 * Handle subscription canceled event
 */
async function handleSubscriptionCanceled(data) {
  const { id, status, canceled_at } = data;
  
  return {
    success: true,
    action: 'subscription_canceled',
    data: {
      paddleSubscriptionId: id,
      status,
      canceledAt: canceled_at,
    },
  };
}

/**
 * Handle subscription paused event
 */
async function handleSubscriptionPaused(data) {
  const { id, status, paused_at } = data;
  
  return {
    success: true,
    action: 'subscription_paused',
    data: {
      paddleSubscriptionId: id,
      status,
      pausedAt: paused_at,
    },
  };
}

/**
 * Handle subscription resumed event
 */
async function handleSubscriptionResumed(data) {
  const { id, status } = data;
  
  return {
    success: true,
    action: 'subscription_resumed',
    data: {
      paddleSubscriptionId: id,
      status,
    },
  };
}

/**
 * Handle transaction completed event
 */
async function handleTransactionCompleted(data) {
  const { id, subscription_id, customer_id, details } = data;
  
  return {
    success: true,
    action: 'transaction_completed',
    data: {
      transactionId: id,
      paddleSubscriptionId: subscription_id,
      paddleCustomerId: customer_id,
      amount: details?.totals?.total,
      currency: details?.totals?.currency_code,
    },
  };
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(data) {
  const { id, subscription_id, customer_id } = data;
  
  return {
    success: true,
    action: 'payment_failed',
    data: {
      transactionId: id,
      paddleSubscriptionId: subscription_id,
      paddleCustomerId: customer_id,
    },
  };
}

/**
 * Get plan type from Paddle price ID
 */
function getPlanTypeFromPriceId(priceId) {
  if (!priceId) return 'BASIC';
  
  if (priceId.includes('enterprise')) return 'ENTERPRISE';
  if (priceId.includes('premium')) return 'PREMIUM';
  return 'BASIC';
}

/**
 * Cancel Paddle subscription
 * @param {string} subscriptionId - Paddle subscription ID
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelPaddleSubscription(subscriptionId) {
  const apiKey = process.env.PADDLE_API_KEY;
  const baseUrl = PADDLE_CONFIG.environment === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';
  
  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        effective_from: 'next_billing_period',
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to cancel subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error canceling Paddle subscription:', error);
    throw error;
  }
}

/**
 * Resume Paddle subscription
 * @param {string} subscriptionId - Paddle subscription ID
 * @returns {Promise<Object>} Resume result
 */
export async function resumePaddleSubscription(subscriptionId) {
  const apiKey = process.env.PADDLE_API_KEY;
  const baseUrl = PADDLE_CONFIG.environment === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';
  
  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduled_change: null,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to resume subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error resuming Paddle subscription:', error);
    throw error;
  }
}

export default {
  PADDLE_CONFIG,
  PADDLE_PRODUCTS,
  getPaddlePriceId,
  initPaddleCheckout,
  verifyPaddleWebhook,
  handlePaddleWebhook,
  cancelPaddleSubscription,
  resumePaddleSubscription,
};
