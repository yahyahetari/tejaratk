import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateVerificationCode, saveVerificationCode } from "@/lib/auth/verification";
import { sendEmailVerificationCode } from "@/lib/email/sender";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, userId } = body;

    // التحقق من وجود البيانات المطلوبة
    if (!email && !userId) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو معرف المستخدم مطلوب" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
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
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من أن البريد لم يتم تأكيده مسبقاً
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مؤكد مسبقاً" },
        { status: 400 }
      );
    }

    // التحقق من عدم إرسال رمز جديد خلال فترة قصيرة (منع الإساءة)
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        purpose: 'email_verification',
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000) // خلال آخر دقيقة
        }
      }
    });

    if (recentCode) {
      return NextResponse.json(
        { error: "يرجى الانتظار قبل طلب رمز جديد" },
        { status: 429 }
      );
    }

    // توليد رمز جديد وحفظه
    const verificationCode = generateVerificationCode();
    await saveVerificationCode(user.id, verificationCode, 'email_verification');

    // إرسال رمز التحقق عبر البريد الإلكتروني
    try {
      await sendEmailVerificationCode(
        user.email,
        verificationCode,
        user.merchant?.contactName || 'المستخدم'
      );
    } catch (emailError) {
      console.error("خطأ في إرسال البريد:", emailError);
      return NextResponse.json(
        { error: "فشل في إرسال البريد الإلكتروني، يرجى المحاولة لاحقاً" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "تم إرسال رمز التحقق بنجاح",
    });

  } catch (error) {
    console.error("خطأ في إعادة إرسال رمز التحقق:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
