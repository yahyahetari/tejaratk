import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { generateVerificationCode, saveVerificationCode } = await import('@/lib/auth/verification-code');
    const { sendVerificationEmail } = await import('@/lib/email/sender');

    const body = await request.json();
    const { email, purpose = 'login' } = body;

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const code = generateVerificationCode();
    await saveVerificationCode(user.id, code, purpose);
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
    });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال رمز التحقق' },
      { status: 500 }
    );
  }
}
