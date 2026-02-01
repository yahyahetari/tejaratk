import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const bcrypt = (await import("bcryptjs")).default;
    const prisma = (await import("@/lib/db/prisma")).default;
    const { generateVerificationCode, saveVerificationCode } = await import("@/lib/auth/verification");
    const { sendEmailVerificationCode } = await import("@/lib/email/sender");
    const { rateLimit } = await import("@/lib/utils/rate-limit");

    const rateLimitResult = rateLimit(req, 3, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");
    const businessName = body.businessName ? String(body.businessName).trim() : null;
    const contactName = body.contactName ? String(body.contactName).trim() : null;
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "كلمات المرور غير متطابقة" }, { status: 400 });
    }

    if (!businessName || businessName.length < 2) {
      return NextResponse.json({ error: "اسم النشاط التجاري مطلوب" }, { status: 400 });
    }

    if (!contactName || contactName.length < 2) {
      return NextResponse.json({ error: "اسم جهة الاتصال مطلوب" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً يرجى الانتقال الى صفحة تسجيل الدخول" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, role: "MERCHANT", emailVerified: false },
      });

      const merchant = await tx.merchant.create({
        data: { userId: user.id, businessName, contactName, phone, email, status: "PENDING", trialEndDate },
      });

      return { user, merchant };
    });

    const verificationCode = generateVerificationCode();
    await saveVerificationCode(result.user.id, verificationCode, 'email_verification');

    try {
      await sendEmailVerificationCode(email, verificationCode, contactName);
    } catch (emailError) {
      console.error("خطأ في إرسال البريد:", emailError);
    }

    return NextResponse.json({
      ok: true,
      requiresVerification: true,
      message: "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.",
      email: result.user.email,
    });

  } catch (error) {
    console.error("خطأ في إنشاء الحساب:", error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم مسبقاً يرجى الانتقال الى صفحة تسجيل الدخول" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
