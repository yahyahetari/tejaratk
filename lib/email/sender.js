// lib/email/sender.js
import nodemailer from 'nodemailer';

// Singleton pattern للـ transporter
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * إرسال بريد إلكتروني
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || '"تجارتك" <noreply@tejaratk.com>',
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * إرسال رمز تأكيد البريد الإلكتروني للتاجر الجديد
 */
export async function sendEmailVerificationCode(email, code, contactName = 'المستخدم') {
  const CODE_EXPIRES_IN_MINUTES = parseInt(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10;

  const subject = 'تأكيد البريد الإلكتروني - تجارتك';

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
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 36px;
          margin: 0;
        }
        .welcome-box {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          margin: 20px 0;
        }
        .welcome-box h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .welcome-box p {
          margin: 0;
          opacity: 0.9;
        }
        .code-box {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          color: white;
          padding: 35px;
          border-radius: 16px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        .code {
          font-size: 52px;
          font-weight: bold;
          letter-spacing: 12px;
          margin: 15px 0;
          font-family: 'Courier New', monospace;
        }
        .code-expiry {
          font-size: 13px;
          opacity: 0.85;
        }
        .message {
          color: #4B5563;
          line-height: 1.9;
          font-size: 16px;
          text-align: center;
        }
        .steps {
          background: #F3F4F6;
          padding: 20px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .steps h3 {
          color: #374151;
          margin: 0 0 15px 0;
          font-size: 16px;
        }
        .steps ol {
          margin: 0;
          padding-right: 20px;
          color: #4B5563;
        }
        .steps li {
          margin: 10px 0;
        }
        .warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-right: 4px solid #F59E0B;
          padding: 20px;
          margin: 25px 0;
          border-radius: 12px;
        }
        .warning strong {
          color: #92400E;
        }
        .warning ul {
          margin: 12px 0 0 0;
          padding-right: 20px;
          color: #78350F;
        }
        .warning li {
          margin: 8px 0;
        }
        .footer {
          text-align: center;
          color: #9CA3AF;
          font-size: 13px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #E5E7EB;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🛍️ تجارتك</h1>
        </div>
        
        <div class="welcome-box">
          <h2>مرحباً ${contactName}! 🎉</h2>
          <p>شكراً لانضمامك إلى منصة تجارتك</p>
        </div>
        
        <div class="message">
          <p>لإكمال عملية التسجيل وتفعيل حسابك، يرجى إدخال رمز التحقق التالي:</p>
        </div>

        <div class="code-box">
          <div class="code-label">رمز تأكيد البريد الإلكتروني</div>
          <div class="code">${code}</div>
          <div class="code-expiry">⏱️ صالح لمدة ${CODE_EXPIRES_IN_MINUTES} دقائق</div>
        </div>

        <div class="steps">
          <h3>📋 خطوات تفعيل الحساب:</h3>
          <ol>
            <li>أدخل رمز التحقق المكون من 6 أرقام في صفحة التأكيد</li>
            <li>بعد التأكيد، سيتم تفعيل حسابك تلقائياً</li>
            <li>يمكنك البدء في إعداد متجرك واختيار خطة الاشتراك</li>
          </ol>
        </div>

        <div class="warning">
          <strong>⚠️ تنبيه أمني:</strong>
          <ul>
            <li>لا تشارك هذا الرمز مع أي شخص</li>
            <li>إذا لم تقم بالتسجيل في تجارتك، يرجى تجاهل هذه الرسالة</li>
          </ul>
        </div>

        <div class="footer">
          <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
          <p>© ${new Date().getFullYear()} تجارتك - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * إرسال رمز التحقق عبر البريد الإلكتروني (لتسجيل دخول المسؤول)
 */
export async function sendVerificationEmail(email, code) {
  const CODE_EXPIRES_IN_MINUTES = parseInt(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10;

  const subject = 'رمز التحقق - تسجيل دخول المسؤول';

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
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 36px;
          margin: 0;
        }
        .code-box {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          color: white;
          padding: 35px;
          border-radius: 16px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        .code {
          font-size: 52px;
          font-weight: bold;
          letter-spacing: 12px;
          margin: 15px 0;
          font-family: 'Courier New', monospace;
        }
        .code-expiry {
          font-size: 13px;
          opacity: 0.85;
        }
        .message {
          color: #4B5563;
          line-height: 1.9;
          font-size: 16px;
          text-align: center;
        }
        .warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-right: 4px solid #F59E0B;
          padding: 20px;
          margin: 25px 0;
          border-radius: 12px;
        }
        .warning strong {
          color: #92400E;
        }
        .warning ul {
          margin: 12px 0 0 0;
          padding-right: 20px;
          color: #78350F;
        }
        .warning li {
          margin: 8px 0;
        }
        .footer {
          text-align: center;
          color: #9CA3AF;
          font-size: 13px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #E5E7EB;
        }
        .footer p {
          margin: 5px 0;
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
          <p>لقد تلقينا طلباً لتسجيل الدخول إلى لوحة تحكم المسؤول.</p>
          <p>استخدم رمز التحقق التالي لإكمال عملية تسجيل الدخول:</p>
        </div>

        <div class="code-box">
          <div class="code-label">رمز التحقق الخاص بك</div>
          <div class="code">${code}</div>
          <div class="code-expiry">⏱️ صالح لمدة ${CODE_EXPIRES_IN_MINUTES} دقائق</div>
        </div>

        <div class="warning">
          <strong>⚠️ تنبيه أمني مهم:</strong>
          <ul>
            <li>لا تشارك هذا الرمز مع أي شخص مطلقاً</li>
            <li>فريق تجارتك لن يطلب منك هذا الرمز أبداً</li>
            <li>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة وتأمين حسابك</li>
          </ul>
        </div>

        <div class="footer">
          <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
          <p>© ${new Date().getFullYear()} تجارتك - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * التحقق من إعدادات البريد الإلكتروني
 */
export async function verifyEmailConfig() {
  try {
    await getTransporter().verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}


/**
 * إرسال رابط استعادة كلمة المرور عبر البريد الإلكتروني
 */
export async function sendPasswordResetEmail(email, code) {
  const CODE_EXPIRES_IN_MINUTES = parseInt(process.env.VERIFICATION_CODE_EXPIRES_IN) || 10;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tejaratk.com';

  const subject = 'استعادة كلمة المرور - تجارتك';

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
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 36px;
          margin: 0;
        }
        .code-box {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          color: white;
          padding: 35px;
          border-radius: 16px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
        }
        .code {
          font-size: 52px;
          font-weight: bold;
          letter-spacing: 12px;
          margin: 15px 0;
          font-family: 'Courier New', monospace;
        }
        .code-expiry {
          font-size: 13px;
          opacity: 0.85;
        }
        .message {
          color: #4B5563;
          line-height: 1.9;
          font-size: 16px;
          text-align: center;
        }
        .warning {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-right: 4px solid #F59E0B;
          padding: 20px;
          margin: 25px 0;
          border-radius: 12px;
        }
        .warning strong {
          color: #92400E;
        }
        .warning p {
          margin: 8px 0;
          color: #78350F;
        }
        .footer {
          text-align: center;
          color: #9CA3AF;
          font-size: 13px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #E5E7EB;
        }
        .footer p {
          margin: 5px 0;
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
          <p>لقد تلقينا طلباً لاستعادة كلمة المرور الخاصة بحسابك.</p>
          <p>استخدم الرمز التالي لإعادة تعيين كلمة المرور:</p>
        </div>

        <div class="code-box">
          <div class="code-label">رمز استعادة كلمة المرور</div>
          <div class="code">${code}</div>
          <div class="code-expiry">⏱️ صالح لمدة ${CODE_EXPIRES_IN_MINUTES} دقائق</div>
        </div>

        <div class="warning">
          <strong>⚠️ تنبيه:</strong>
          <p>إذا لم تطلب استعادة كلمة المرور، يرجى تجاهل هذه الرسالة. حسابك آمن ولن يتم إجراء أي تغييرات.</p>
        </div>

        <div class="footer">
          <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
          <p>© ${new Date().getFullYear()} تجارتك - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
  });
}
