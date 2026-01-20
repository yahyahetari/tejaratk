import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/auth/session
 * Returns current session status
 */
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        merchant: null,
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      merchant: session.merchant,
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({
      authenticated: false,
      user: null,
      merchant: null,
      error: error.message,
    }, { status: 500 });
  }
}