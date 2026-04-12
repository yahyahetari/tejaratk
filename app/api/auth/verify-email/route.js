import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const prisma = (await import("@/lib/db/prisma")).default;
    const { createSession, setSessionCookie } = await import("@/lib/auth/session");
    const { validateEnv, getSafeEnvSnapshot } = await import('@/lib/utils/env-check');

    // التشخيص في بيئة الإنتاج
    if (process.env.NODE_ENV === 'production') {
      const envCheck = validateEnv();
      if (!envCheck.valid) {
        console.error('Environment check failed:', getSafeEnvSnapshot());
      }
    }

    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: "البيانات المطلوبة غير مكتملة" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { merchant: true }
    });

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "البريد الإلكتروني مؤكد مسبقاً" }, { status: 400 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: code,
        purpose: 'email_verification',
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!verificationCode) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }

    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true, usedAt: new Date() }
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { emailVerified: true, emailVerifiedAt: new Date() },
      });

      if (user.merchant) {
        await tx.merchant.update({
          where: { id: user.merchant.id },
          data: { status: "ACTIVE" },
        });
      }
    });

    const { token } = await createSession(user.id, user.role);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      message: "تم تأكيد البريد الإلكتروني بنجاح",
      user: { id: user.id, email: user.email, businessName: user.merchant?.businessName }
    });

  } catch (error) {
    console.error("CRITICAL VERIFY EMAIL ERROR:", {
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
      { error: "حدث خطأ غير متوقع أثناء تأكيد البريد الإلكتروني. يرجى مراجعة سجلات الخادم." },
      { status: 500 }
    );
  }
}