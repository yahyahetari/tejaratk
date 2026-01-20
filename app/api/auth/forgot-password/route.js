import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { generateVerificationCode, saveVerificationCode } from '@/lib/auth/verification-code';
import { sendPasswordResetEmail } from '@/lib/email/sender';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

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

    // لا نكشف ما إذا كان البريد موجوداً أم لا لأسباب أمنية
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط الاستعادة',
      });
    }

    // إنشاء رمز استعادة كلمة المرور
    const code = generateVerificationCode();
    
    // حفظ رمز الاستعادة
    await saveVerificationCode(user.id, code, 'password_reset');
    
    // إرسال البريد الإلكتروني
    try {
      await sendPasswordResetEmail(email, code);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // نستمر حتى لو فشل إرسال البريد
    }

    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط الاستعادة',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
