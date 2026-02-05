// lib/auth/verification-code.js
import prisma from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email/sender';

const CODE_EXPIRES_IN_MINUTES = parseInt(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10;

/**
 * توليد رمز تحقق عشوائي (6 أرقام)
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Alias for backward compatibility
export const generateCode = generateVerificationCode;

/**
 * حفظ رمز التحقق في قاعدة البيانات
 */
export async function saveVerificationCode(userId, code, purpose = 'admin_verification') {
  // حذف الأكواد القديمة غير المستخدمة
  await prisma.verificationCode.deleteMany({
    where: {
      userId,
      purpose,
      OR: [
        { used: true },
        { expiresAt: { lt: new Date() } }
      ]
    }
  });

  const expiresAt = new Date(Date.now() + CODE_EXPIRES_IN_MINUTES * 60 * 1000);

  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId,
      code,
      purpose,
      expiresAt,
    },
  });

  return verificationCode;
}

/**
 * إنشاء رمز تحقق جديد (دالة مجمعة)
 */
export async function createVerificationCode(userId, purpose = 'login') {
  const code = generateVerificationCode();
  return await saveVerificationCode(userId, code, purpose);
}

/**
 * التحقق من رمز التحقق
 */
export async function verifyCode(userId, code, purpose = 'login') {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId,
      code,
      purpose,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verificationCode) {
    return { success: false, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' };
  }

  // تعليم الكود كمستخدم
  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: {
      used: true,
      usedAt: new Date(),
    },
  });

  return { success: true, message: 'تم التحقق بنجاح' };
}

/**
 * إرسال رمز التحقق عبر البريد الإلكتروني
 */
export async function sendVerificationCode(email, code, purpose = 'login') {
  const subject = purpose === 'admin_verification'
    ? 'رمز التحقق - تسجيل دخول المسؤول'
    : 'رمز التحقق - تجارتك';

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Cairo', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #3B82F6;
          font-size: 32px;
          margin: 0;
        }
        .code-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          margin: 30px 0;
        }
        .code {
          font-size: 48px;
          font-weight: bold;
          letter-spacing: 10px;
          margin: 20px 0;
        }
        .message {
          color: #666;
          line-height: 1.8;
          font-size: 16px;
        }
        .warning {
          background-color: #FEF3C7;
          border-right: 4px solid #F59E0B;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🛍️ تجارتك</h1>
        </div>
        
        <div class="message">
          <p>مرحباً،</p>
          <p>لقد تلقينا طلباً لتسجيل الدخول إلى حسابك${purpose === 'admin_verification' ? ' كمسؤول' : ''}.</p>
          <p>استخدم رمز التحقق التالي لإكمال عملية تسجيل الدخول:</p>
        </div>

        <div class="code-box">
          <div>رمز التحقق</div>
          <div class="code">${code}</div>
          <div>صالح لمدة ${CODE_EXPIRES_IN_MINUTES} دقائق</div>
        </div>

        <div class="warning">
          <strong>⚠️ تنبيه أمني:</strong>
          <ul style="margin: 10px 0; padding-right: 20px;">
            <li>لا تشارك هذا الرمز مع أي شخص</li>
            <li>فريق تجارتك لن يطلب منك هذا الرمز أبداً</li>
            <li>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة</li>
          </ul>
        </div>

        <div class="footer">
          <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
          <p>© 2024 تجارتك - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, error: error.message };
  }
}
