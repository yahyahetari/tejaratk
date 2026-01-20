import { PADDLE_CONFIG, PADDLE_ENDPOINTS } from '@/config/paddle';

/**
 * Paddle API Client
 */
class PaddleClient {
  constructor() {
    this.apiKey = PADDLE_CONFIG.apiKey;
    this.baseHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make API request to Paddle
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...this.baseHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Paddle API request failed');
      }

      return data;
    } catch (error) {
      console.error('Paddle API error:', error);
      throw error;
    }
  }

  /**
   * Create a subscription
   * @param {Object} params - Subscription parameters
   * @returns {Promise<Object>} Created subscription
   */
  async createSubscription(params) {
    return this.request(PADDLE_ENDPOINTS.subscriptions, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Get subscription by ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Subscription data
   */
  async getSubscription(subscriptionId) {
    return this.request(`${PADDLE_ENDPOINTS.subscriptions}/${subscriptionId}`);
  }

  /**
   * Update subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated subscription
   */
  async updateSubscription(subscriptionId, updates) {
    return this.request(`${PADDLE_ENDPOINTS.subscriptions}/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} params - Cancellation parameters
   * @returns {Promise<Object>} Cancelled subscription
   */
  async cancelSubscription(subscriptionId, params = {}) {
    return this.request(`${PADDLE_ENDPOINTS.subscriptions}/${subscriptionId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Resume subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Resumed subscription
   */
  async resumeSubscription(subscriptionId) {
    return this.request(`${PADDLE_ENDPOINTS.subscriptions}/${subscriptionId}/resume`, {
      method: 'POST',
    });
  }

  /**
   * Get prices
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Prices data
   */
  async getPrices(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`${PADDLE_ENDPOINTS.prices}?${queryParams}`);
  }

  /**
   * Create or get customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Customer data
   */
  async createCustomer(customerData) {
    return this.request(PADDLE_ENDPOINTS.customers, {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  /**
   * Get customer by ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer data
   */
  async getCustomer(customerId) {
    return this.request(`${PADDLE_ENDPOINTS.customers}/${customerId}`);
  }

  /**
   * Get transactions
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Transactions data
   */
  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`${PADDLE_ENDPOINTS.transactions}?${queryParams}`);
  }
}

export default new PaddleClient();