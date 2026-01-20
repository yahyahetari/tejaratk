import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { createSession, setSessionCookie } from "@/lib/auth/session";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, code } = body;

    // التحقق من وجود البيانات المطلوبة
    if (!email || !code) {
      return NextResponse.json(
        { error: "البيانات المطلوبة غير مكتملة" },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم باستخدام البريد الإلكتروني
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { merchant: true }
    });

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

    // التحقق من رمز التأكيد من قاعدة البيانات
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: code,
        purpose: 'email_verification',
        used: false,
        expiresAt: {
          gt: new Date(), // أكبر من الوقت الحالي (لم تنتهي صلاحيته)
        }
      }
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "رمز التحقق غير صحيح أو منتهي الصلاحية" },
        { status: 400 }
      );
    }

    // تحديث رمز التحقق كمستخدم
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: {
        used: true,
        usedAt: new Date(),
      }
    });

    // تحديث حالة المستخدم والتاجر
    await prisma.$transaction(async (tx) => {
      // تحديث حالة تأكيد البريد للمستخدم
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      // تحديث حالة التاجر إلى نشط
      if (user.merchant) {
        await tx.merchant.update({
          where: { id: user.merchant.id },
          data: {
            status: "ACTIVE",
          },
        });
      }
    });

    // إنشاء الجلسة بعد تأكيد البريد
    const { token } = await createSession(user.id, user.role);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      message: "تم تأكيد البريد الإلكتروني بنجاح",
      user: {
        id: user.id,
        email: user.email,
        businessName: user.merchant?.businessName,
      }
    });

  } catch (error) {
    console.error("خطأ في تأكيد البريد الإلكتروني:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}