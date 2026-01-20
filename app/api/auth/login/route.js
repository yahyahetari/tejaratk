import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { sendEmailVerificationCode } from '@/lib/email/sender';
import { rateLimit } from '@/lib/utils/rate-limit';

/**
 * POST /api/auth/login
 * Login user
 */
export async function POST(request) {
  try {
    // التحقق من Rate Limit (5 محاولات / دقيقة)
    const rateLimitResult = rateLimit(request, 5, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        merchant: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate new verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Delete old verification codes
      await prisma.verificationCode.deleteMany({
        where: {
          userId: user.id,
          purpose: 'email_verification',
        },
      });

      // Create new verification code
      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code,
          purpose: 'email_verification',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      });

      // Send verification email
      try {
        await sendEmailVerificationCode(user.email, code, user.merchant?.businessName || user.merchant?.contactName || 'المستخدم');
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // Continue even if email fails
      }

      return NextResponse.json(
        {
          requiresVerification: true,
          email: user.email,
          message: 'يرجى تأكيد بريدك الإلكتروني أولاً',
        },
        { status: 200 }
      );
    }

    // Check if admin requires 2FA code
    if (user.role === 'ADMIN') {
      // Generate verification code for admin
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.verificationCode.deleteMany({
        where: {
          userId: user.id,
          purpose: 'login',
        },
      });

      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code,
          purpose: 'login',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      // Send verification code via email
      try {
        await sendEmailVerificationCode(user.email, code, 'المسؤول');
      } catch (emailError) {
        console.error('Error sending admin verification:', emailError);
      }

      return NextResponse.json(
        {
          requiresVerification: true,
          isAdmin: true,
          email: user.email,
          message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        },
        { status: 200 }
      );
    }

    // Create session
    const { token } = await createSession(user.id, user.role);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        merchant: user.merchant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}