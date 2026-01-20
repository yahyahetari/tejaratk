import { cookies } from 'next/headers';
import { verifyToken, generateToken } from './jwt';
import prisma from '@/lib/db/prisma';

const SESSION_COOKIE_NAME = 'tejaratk_session';
const SESSION_EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS || '168');

/**
 * Create Session and return token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<{token: string}>} Session with token
 */
export async function createSession(userId, role) {
  const token = await generateToken({
    userId,
    role,
  });

  return { token };
}

/**
 * Set Session Cookie
 * @param {string} token - JWT token
 * @returns {void}
 */
export async function setSessionCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_HOURS * 60 * 60,
    path: '/',
  });
}

/**
 * Get Session from Cookie
 * @returns {Promise<Object|null>} User session or null
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        merchant: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
            email: true,
            subscription: {
              select: {
                id: true,
                status: true,
                planId: true,
                planName: true,
              }
            }
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      merchant: user.merchant,
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

/**
 * Destroy Session
 * @returns {void}
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require Authentication
 * @returns {Promise<Object>} User session
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Check if user is admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === 'ADMIN';
}

/**
 * Require Admin Authentication
 * Throws error if not authenticated or not admin
 * @returns {Promise<Object>} Admin session
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized - يجب تسجيل الدخول');
  }

  if (session.user.role !== 'ADMIN') {
    throw new Error('Forbidden - صلاحيات المسؤول مطلوبة');
  }

  return session;
}

/**
 * Verify Authentication from Request
 * For API routes that need to verify auth from request headers/cookies
 * @param {Request} request - The request object
 * @returns {Promise<{authenticated: boolean, user: Object|null}>}
 */
export async function verifyAuth(request) {
  try {
    const session = await getSession();

    if (!session) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: session.user
    };
  } catch (error) {
    console.error('verifyAuth error:', error);
    return { authenticated: false, user: null };
  }
}