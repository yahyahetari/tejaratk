import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// التحقق من وجود JWT_SECRET
const JWT_SECRET_VALUE = process.env.JWT_SECRET;
if (!JWT_SECRET_VALUE) {
  console.error('❌ JWT_SECRET environment variable is required');
}

const JWT_SECRET = JWT_SECRET_VALUE
  ? new TextEncoder().encode(JWT_SECRET_VALUE)
  : null;

/**
 * Middleware to protect routes and handle authentication
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('tejaratk_session')?.value;

  // Public routes that don't require authentication
  const publicPaths = ['/', '/features', '/pricing', '/about', '/contact', '/help', '/terms', '/privacy'];

  // Auth routes (should redirect to dashboard if authenticated)
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

  // Check if path is public
  const isPublicPath = publicPaths.includes(pathname);
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isAdminPath = pathname.startsWith('/admin');

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Verify token if exists
  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch (error) {
      // Invalid token - clear it and redirect if on protected route
      if (isDashboardPath || isAdminPath) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('tejaratk_session');
        return response;
      }
      // For other routes, just clear the cookie
      const response = NextResponse.next();
      response.cookies.delete('tejaratk_session');
      return response;
    }
  }

  // Handle auth paths (login, register, etc.)
  if (isAuthPath) {
    if (user) {
      // Already authenticated - redirect to appropriate dashboard
      const dashboardUrl = user.role === 'ADMIN'
        ? new URL('/admin/dashboard', request.url)
        : new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Not authenticated - allow access
    return NextResponse.next();
  }

  // Handle admin paths
  if (isAdminPath) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Handle dashboard paths
  if (isDashboardPath) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Authenticated - allow access
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - public files (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};