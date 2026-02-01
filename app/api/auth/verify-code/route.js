import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { createSession, setSessionCookie } = await import('@/lib/auth/session');

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'البيانات المطلوبة غير مكتملة' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: code,
        purpose: 'login',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!verificationCode) {
      return NextResponse.json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' }, { status: 400 });
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true, usedAt: new Date() }
    });

    const { token } = await createSession(user.id, user.role);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق' },
      { status: 500 }
    );
  }
}