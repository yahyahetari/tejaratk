import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { createSession, setSessionCookie } = await import('@/lib/auth/session');
    const { validateEnv, getSafeEnvSnapshot } = await import('@/lib/utils/env-check');

    // التشخيص في بيئة الإنتاج
    if (process.env.NODE_ENV === 'production') {
      const envCheck = validateEnv();
      if (!envCheck.valid) {
        console.error('Environment check failed:', getSafeEnvSnapshot());
      }
    }

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
    console.error('CRITICAL VERIFY CODE ERROR:', {
      message: error.message,
      stack: error.stack,
      env: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    });

    if (error.message.includes('JWT_SECRET') || error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: `خطأ في إعدادات الخادم: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء التحقق. يرجى مراجعة سجلات الخادم.' },
      { status: 500 }
    );
  }
}