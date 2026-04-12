'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // حالة التحقق من البريد
  const [showVerification, setShowVerification] = useState(false);
  const [isAdminVerification, setIsAdminVerification] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`خطأ في الخادم (Status ${response.status}). يرجى التحقق من سجلات Vercel.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      // إذا كان يتطلب تأكيد البريد
      if (data.requiresVerification) {
        setUserId(data.userId);
        setUserEmail(data.email || formData.email);
        setIsAdminVerification(data.isAdmin || false);
        setShowVerification(true);
        startResendCooldown();
        return;
      }

      // تسجيل دخول ناجح
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // التعامل مع إدخال رمز التحقق
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setVerificationCode(newCode);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  // تأكيد رمز التحقق
  const handleVerifyCode = async () => {
    const code = verificationCode.join('');

    if (code.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // استخدام endpoint مختلف للـ Admin
      const endpoint = isAdminVerification ? '/api/auth/verify-code' : '/api/auth/verify-email';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحقق');
      }

      // تم التحقق بنجاح - توجيه حسب الدور
      const redirectPath = isAdminVerification ? '/admin/dashboard' : redirectTo;
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  // إعادة إرسال رمز التحقق
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إعادة الإرسال');
      }

      startResendCooldown();
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // شاشة التحقق من البريد
  if (showVerification) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <div className="card-premium p-8 md:p-10 max-w-md w-full animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 rounded-full"></div>
              <div className="relative w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Mail className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-3">
              {isAdminVerification ? 'تحقق المسؤول 🔐' : 'تأكيد البريد الإلكتروني 📧'}
            </h1>
            <p className="text-gray-500">
              أرسلنا رمز تحقق مكون من 6 أرقام إلى
            </p>
            <p className="text-blue-600 font-semibold mt-1" dir="ltr">
              {userEmail}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3 animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Code Input */}
          <div className="flex justify-center gap-2 mb-6" dir="ltr">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                onPaste={handleCodePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                disabled={verifying}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyCode}
            disabled={verifying || verificationCode.join('').length !== 6}
            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {verifying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                تأكيد الرمز
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">لم تستلم الرمز؟</p>
            <button
              onClick={handleResendCode}
              disabled={resending || resendCooldown > 0}
              className="text-blue-600 font-semibold hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  إعادة الإرسال بعد {resendCooldown} ثانية
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  إعادة إرسال الرمز
                </>
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setShowVerification(false);
                setVerificationCode(['', '', '', '', '', '']);
                setError('');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  // شاشة تسجيل الدخول الرئيسية
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-white relative order-2 lg:order-1">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <Link href="/" className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black gradient-text">
              تجارتك
            </span>
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-3">
              مرحباً بعودتك! 👋
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">
              سجل دخولك للوصول إلى لوحة التحكم
            </p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-2 border-red-100 rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-3 animate-fade-in">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs sm:text-sm font-bold">!</span>
              </div>
              <div>
                <p className="text-red-700 font-medium text-sm sm:text-base">خطأ في تسجيل الدخول</p>
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-premium pr-10 sm:pr-12 text-right text-sm sm:text-base"
                  placeholder="your@email.com"
                  disabled={loading}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-premium pr-10 sm:pr-12 pl-10 sm:pl-12 text-sm sm:text-base"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center hover:scale-110 transition-transform"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
                />
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  تذكرني
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">تسجيل الدخول</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 sm:px-4 bg-white text-gray-400 text-xs sm:text-sm font-medium">أو</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600">
              ليس لديك حساب؟{' '}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
              >
                سجل الآن مجاناً
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </p>
          </div>

          <div className="mt-6 sm:mt-10 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>محمي بتشفير SSL من الدرجة العسكرية</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}