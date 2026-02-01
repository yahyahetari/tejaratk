import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { generateVerificationCode, saveVerificationCode } = await import('@/lib/auth/verification-code');
    const { sendPasswordResetEmail } = await import('@/lib/email/sender');

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط الاستعادة',
      });
    }

    const code = generateVerificationCode();
    await saveVerificationCode(user.id, code, 'password_reset');

    try {
      await sendPasswordResetEmail(email, code);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط الاستعادة',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
