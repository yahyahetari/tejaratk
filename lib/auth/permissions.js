/**
 * Permissions and Authorization Helpers
 */

/**
 * Check if user can access resource
 * @param {Object} session - User session
 * @param {string} resource - Resource name
 * @param {string} action - Action to perform
 * @returns {boolean}
 */
export function canAccess(session, resource, action) {
  if (!session) return false;
  
  // Admins have full access
  if (session.role === 'ADMIN') return true;
  
  // Merchants can access their own resources
  if (session.role === 'MERCHANT') {
    switch (resource) {
      case 'dashboard':
      case 'store-setup':
      case 'subscription':
      case 'export':
      case 'account':
        return true;
      
      case 'admin':
        return false;
      
      default:
        return false;
    }
  }
  
  return false;
}

/**
 * Check if merchant owns resource
 * @param {Object} session - User session
 * @param {string} resourceOwnerId - Resource owner ID
 * @returns {boolean}
 */
export function ownsResource(session, resourceOwnerId) {
  if (!session || !session.merchant) return false;
  
  // Admins can access any resource
  if (session.role === 'ADMIN') return true;
  
  // Check if merchant owns the resource
  return session.merchant.id === resourceOwnerId;
}