import { SignJWT, jwtVerify } from 'jose';

// التحقق من وجود JWT_SECRET
const JWT_SECRET_VALUE = process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (JWT_SECRET_VALUE.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);

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
      .sign(JWT_SECRET);
    
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
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
