import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { generateVerificationCode, saveVerificationCode } from "@/lib/auth/verification";
import { sendEmailVerificationCode } from "@/lib/email/sender";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function POST(req) {
  try {
    // التحقق من Rate Limit (3 طلبات / دقيقة)
    const rateLimitResult = rateLimit(req, 3, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    const body = await req.json();

    // استخراج البيانات من الطلب
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");
    const businessName = body.businessName ? String(body.businessName).trim() : null;
    const contactName = body.contactName ? String(body.contactName).trim() : null;
    const phone = body.phone ? String(body.phone).trim() : null;

    // التحقق من صحة البيانات
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "كلمات المرور غير متطابقة" },
        { status: 400 }
      );
    }

    if (!businessName || businessName.length < 2) {
      return NextResponse.json(
        { error: "اسم النشاط التجاري مطلوب" },
        { status: 400 }
      );
    }

    if (!contactName || contactName.length < 2) {
      return NextResponse.json(
        { error: "اسم جهة الاتصال مطلوب" },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود البريد مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً يرجى الانتقال الى صفحة تسجيل الدخول" },
        { status: 409 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // حساب تاريخ انتهاء الفترة التجريبية (30 يوم من الآن)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    // إنشاء المستخدم والتاجر في معاملة واحدة
    const result = await prisma.$transaction(async (tx) => {
      // إنشاء المستخدم - البريد غير مؤكد
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "MERCHANT",
          emailVerified: false,
        },
      });

      // إنشاء التاجر المرتبط بالمستخدم
      const merchant = await tx.merchant.create({
        data: {
          userId: user.id,
          businessName,
          contactName,
          phone,
          email,
          status: "PENDING", // حالة معلقة حتى تأكيد البريد
          trialEndDate: trialEndDate,
        },
      });

      return { user, merchant };
    });

    // توليد رمز التحقق وحفظه
    const verificationCode = generateVerificationCode();
    await saveVerificationCode(result.user.id, verificationCode, 'email_verification');

    // إرسال رمز التحقق عبر البريد الإلكتروني
    try {
      await sendEmailVerificationCode(email, verificationCode, contactName);
    } catch (emailError) {
      console.error("خطأ في إرسال البريد:", emailError);
      // لا نفشل العملية إذا فشل إرسال البريد، يمكن للمستخدم طلب إعادة الإرسال
    }

    // إرجاع الاستجابة - لا نقوم بإنشاء جلسة حتى يتم تأكيد البريد
    return NextResponse.json({
      ok: true,
      requiresVerification: true,
      message: "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.",
      email: result.user.email,
    });

  } catch (error) {
    console.error("خطأ في إنشاء الحساب:", error);

    // معالجة أخطاء Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً يرجى الانتقال الى صفحة تسجيل الدخول" },
        { status: 409 }
      );
    }

    // معالجة أخطاء العلاقات
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "خطأ في إنشاء الحساب، يرجى المحاولة مرة أخرى" },
        { status: 500 }
      );
    }

    // معالجة أخطاء قاعدة البيانات الأخرى
    if (error.code?.startsWith('P')) {
      return NextResponse.json(
        { error: "حدث خطأ في قاعدة البيانات" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
