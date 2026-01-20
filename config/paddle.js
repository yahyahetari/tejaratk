/**
 * Paddle Configuration
 */

export const PADDLE_CONFIG = {
  vendorId: process.env.PADDLE_VENDOR_ID,
  apiKey: process.env.PADDLE_API_KEY,
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET,
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox',
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
};

/**
 * Paddle API Endpoints
 */
export const PADDLE_API_BASE = 
  PADDLE_CONFIG.environment === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

export const PADDLE_ENDPOINTS = {
  subscriptions: `${PADDLE_API_BASE}/subscriptions`,
  transactions: `${PADDLE_API_BASE}/transactions`,
  prices: `${PADDLE_API_BASE}/prices`,
  customers: `${PADDLE_API_BASE}/customers`,
  webhooks: `${PADDLE_API_BASE}/webhooks`,
};