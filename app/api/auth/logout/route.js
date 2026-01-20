import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

/**
 * Logout API Route
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    // Destroy session cookie
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}