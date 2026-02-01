import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const prisma = (await import("@/lib/db/prisma")).default;
    const { generateVerificationCode, saveVerificationCode } = await import("@/lib/auth/verification");
    const { sendEmailVerificationCode } = await import("@/lib/email/sender");

    const body = await req.json();
    const { email, userId } = body;

    if (!email && !userId) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو معرف المستخدم مطلوب" },
        { status: 400 }
      );
    }

    let user;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { merchant: true }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { merchant: true }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "البريد الإلكتروني مؤكد مسبقاً" }, { status: 400 });
    }

    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        purpose: 'email_verification',
        createdAt: { gte: new Date(Date.now() - 60 * 1000) }
      }
    });

    if (recentCode) {
      return NextResponse.json({ error: "يرجى الانتظار قبل طلب رمز جديد" }, { status: 429 });
    }

    const verificationCode = generateVerificationCode();
    await saveVerificationCode(user.id, verificationCode, 'email_verification');

    try {
      await sendEmailVerificationCode(user.email, verificationCode, user.merchant?.contactName || 'المستخدم');
    } catch (emailError) {
      console.error("خطأ في إرسال البريد:", emailError);
      return NextResponse.json(
        { error: "فشل في إرسال البريد الإلكتروني، يرجى المحاولة لاحقاً" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "تم إرسال رمز التحقق بنجاح" });

  } catch (error) {
    console.error("خطأ في إعادة إرسال رمز التحقق:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
