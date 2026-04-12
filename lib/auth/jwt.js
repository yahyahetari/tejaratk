import { SignJWT, jwtVerify } from 'jose';

// الحصول على JWT_SECRET بأمان
function getJwtSecret() {
  const secretValue = process.env.JWT_SECRET;
  if (!secretValue) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  if (secretValue.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return new TextEncoder().encode(secretValue);
}

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT Token
 * @param {Object} payload - Token payload
 * @returns {Promise<string>} JWT token
 */
export async function generateToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRY)
      .sign(getJwtSecret());
    
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
}

// Alias for generateToken for backward compatibility
export const createToken = generateToken;

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Token payload
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode JWT Token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
export function decodeToken(token) {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64').toString('utf-8')
    );
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
