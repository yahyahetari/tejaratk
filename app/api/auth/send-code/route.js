import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { generateVerificationCode, saveVerificationCode } from '@/lib/auth/verification-code';
import { sendVerificationEmail } from '@/lib/email/sender';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, purpose = 'login' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // إنشاء رمز التحقق
    const code = generateVerificationCode();
    
    // حفظ رمز التحقق
    await saveVerificationCode(user.id, code, purpose);
    
    // إرسال البريد الإلكتروني
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
