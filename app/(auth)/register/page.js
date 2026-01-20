'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ShoppingCart,
  ArrowRight,
  Shield,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    contactName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // حالة التحقق من البريد
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
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

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    if (!acceptTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إنشاء الحساب');
      }

      // إذا كان يتطلب تأكيد البريد
      if (data.requiresVerification) {
        setVerificationEmail(data.email || formData.email);
        setShowVerification(true);
        startResendCooldown();
      } else {
        // تسجيل دخول مباشر (للتوافق مع الإصدارات القديمة)
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 2000);
      }
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
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحقق');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
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
        body: JSON.stringify({ email: verificationEmail }),
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

  // شاشة النجاح
  if (success) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <div className="card-premium p-10 text-center max-w-md w-full animate-scale-in">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 gradient-success rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">مبروك! 🎉</h2>
          <p className="text-gray-600 text-lg mb-2">تم تأكيد بريدك الإلكتروني وإنشاء حسابك بنجاح</p>
          <p className="text-blue-600 font-semibold">جاري تحويلك إلى لوحة التحكم...</p>
          <div className="mt-8">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  // شاشة التحقق من البريد
  if (showVerification) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <div className="card-premium p-8 md:p-10 max-w-md w-full animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 rounded-full"></div>
              <div className="relative w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Mail className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-3">
              تأكيد البريد الإلكتروني 📧
            </h1>
            <p className="text-gray-500">
              أرسلنا رمز تحقق مكون من 6 أرقام إلى
            </p>
            <p className="text-blue-600 font-semibold mt-1" dir="ltr">
              {formData.email}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

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

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setShowVerification(false);
                setVerificationCode(['', '', '', '', '', '']);
                setError('');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← العودة لصفحة التسجيل
            </button>
          </div>
        </div>
      </div>
    );
  }

  // شاشة التسجيل الرئيسية
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        <div className="w-full max-w-lg relative z-10 animate-fade-in-up py-8">
          <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
              <div className="relative w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
            </div>
            <span className="text-3xl font-black gradient-text">
              تجارتك
            </span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-3">
              إنشاء حساب جديد 🚀
            </h1>
            <p className="text-gray-500 text-lg">
              أنشئ حسابك وابدأ متجرك في دقائق
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium">خطأ</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  {error.includes('مستخدم مسبقاً') && (
                    <Link href="/login" className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      اذهب إلى صفحة تسجيل الدخول ←
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700">
                  اسم النشاط التجاري
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input-premium pr-12"
                    placeholder="متجر الإلكترونيات"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700">
                  اسم جهة الاتصال
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="input-premium pr-12"
                    placeholder="أحمد محمد"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-premium pr-12 text-right"
                  placeholder="your@email.com"
                  disabled={loading}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  كلمة المرور
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-premium pr-12 pl-12"
                    placeholder="8 أحرف على الأقل"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-4 flex items-center hover:scale-110 transition-transform"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                  تأكيد كلمة المرور
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-premium pr-12"
                    placeholder="أعد كتابة كلمة المرور"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${formData.password.length >= i * 2
                        ? formData.password.length >= 8
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                        : 'bg-gray-200'
                      }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {formData.password.length < 8
                  ? `${8 - formData.password.length} أحرف متبقية للحد الأدنى`
                  : 'كلمة مرور قوية ✓'
                }
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-blue-600 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-all"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                بالتسجيل، أوافق على{' '}
                <Link href="/terms" className="text-blue-600 hover:underline font-semibold">
                  الشروط والأحكام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">
                  سياسة الخصوصية
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  إنشاء حساب جديد
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-400 text-sm font-medium">أو</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                سجل دخولك
              </Link>
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Shield className="h-4 w-4" />
            <span>بياناتك محمية ومشفرة بالكامل</span>
          </div>
        </div>
      </div>
    </div>
  );
}