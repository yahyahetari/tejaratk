import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const bcrypt = (await import('bcryptjs')).default;
    const prisma = (await import('@/lib/db/prisma')).default;
    const { createSession, setSessionCookie } = await import('@/lib/auth/session');
    const { sendEmailVerificationCode } = await import('@/lib/email/sender');
    const { rateLimit } = await import('@/lib/utils/rate-limit');

    const rateLimitResult = rateLimit(request, 5, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { merchant: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.verificationCode.deleteMany({
        where: { userId: user.id, purpose: 'email_verification' },
      });

      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code,
          purpose: 'email_verification',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      try {
        await sendEmailVerificationCode(user.email, code, user.merchant?.businessName || user.merchant?.contactName || 'المستخدم');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }

      return NextResponse.json({
        requiresVerification: true,
        email: user.email,
        message: 'يرجى تأكيد بريدك الإلكتروني أولاً',
      });
    }

    if (user.role === 'ADMIN') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.verificationCode.deleteMany({
        where: { userId: user.id, purpose: 'login' },
      });

      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code,
          purpose: 'login',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      try {
        await sendEmailVerificationCode(user.email, code, 'المسؤول');
      } catch (emailError) {
        console.error('Error sending admin verification:', emailError);
      }

      return NextResponse.json({
        requiresVerification: true,
        isAdmin: true,
        email: user.email,
        message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      });
    }

    const { token } = await createSession(user.id, user.role);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
      merchant: user.merchant,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}