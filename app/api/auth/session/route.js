import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const { getSession } = await import('@/lib/auth/session');
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