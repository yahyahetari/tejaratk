'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  CreditCard, 
  Shield, 
  Check, 
  Loader2, 
  AlertCircle,
  Lock,
  Sparkles,
  CheckCircle,
  Zap,
  Clock,
  Gift
} from 'lucide-react';
import { PADDLE_CONFIG, getPaddlePriceId } from '@/lib/payment/paddle';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') || 'BASIC';
  const billingCycle = searchParams.get('billing') || 'MONTHLY';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [user, setUser] = useState(null);

  const plans = {
    BASIC: {
      name: 'الباقة الأساسية',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: ['50 منتج', 'قالب جاهز', 'دعم فني', 'SSL مجاني'],
      color: 'from-blue-500 to-indigo-600',
      icon: Zap,
    },
    PREMIUM: {
      name: 'الباقة الاحترافية',
      monthlyPrice: 99,
      yearlyPrice: 999,
      features: ['200 منتج', 'تصميم مخصص', 'SEO متقدم', 'إدارة مخزون'],
      color: 'from-purple-500 to-pink-600',
      icon: Sparkles,
    },
    ENTERPRISE: {
      name: 'باقة الشركات',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: ['3000 منتج', 'تصميم كامل', 'دعم VIP', 'تقارير مخصصة'],
      color: 'from-amber-500 to-orange-600',
      icon: Shield,
    },
  };

  const selectedPlan = plans[planId] || plans.BASIC;
  const price = billingCycle === 'YEARLY' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const discount = billingCycle === 'YEARLY' ? 17 : 0;
  const PlanIcon = selectedPlan.icon;

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Paddle) {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set(PADDLE_CONFIG.environment);
          window.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
          });
          setPaddleLoaded(true);
        }
      };
      document.body.appendChild(script);
    } else if (window.Paddle) {
      setPaddleLoaded(true);
    }
  }, []);

  const handleCheckout = async () => {
    if (!paddleLoaded || !window.Paddle) {
      setError('جاري تحميل بوابة الدفع، يرجى الانتظار...');
      return;
    }

    if (!user) {
      router.push('/login?redirect=/dashboard/subscription/checkout?plan=' + planId);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const priceId = getPaddlePriceId(planId, billingCycle);
      
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: {
          email: user.email,
        },
        customData: {
          merchantId: user.merchant?.id,
          userId: user.id,
          planId,
          billingCycle,
        },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'ar',
          successUrl: `${window.location.origin}/dashboard/subscription/success`,
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError('حدث خطأ أثناء فتح صفحة الدفع');
    } finally {
      setLoading(false);
    }
  };

  const guarantees = [
    { icon: Shield, text: 'ضمان استرداد 30 يوم' },
    { icon: Lock, text: 'دفع آمن ومشفر' },
    { icon: Clock, text: 'تفعيل فوري' },
    { icon: Gift, text: 'دعم مجاني' },
  ];

  return (
    <div className="min-h-screen gradient-mesh py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
          العودة للاشتراكات
        </Link>

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center shadow-lg`}>
            <PlanIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">إتمام الاشتراك</h1>
          <p className="text-gray-500">أنت على بعد خطوة واحدة من إطلاق متجرك</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-3 card-premium p-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              ملخص الطلب
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center`}>
                    <PlanIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{selectedPlan.name}</span>
                    <p className="text-sm text-gray-500">
                      {billingCycle === 'YEARLY' ? 'اشتراك سنوي' : 'اشتراك شهري'}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">${price}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-emerald-700">خصم الاشتراك السنوي</span>
                  </div>
                  <span className="font-bold text-emerald-600">-{discount}%</span>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                <div className="text-left">
                  <span className="text-3xl font-black gradient-text">${price}</span>
                  <span className="text-gray-500 text-sm mr-1">/{billingCycle === 'YEARLY' ? 'سنة' : 'شهر'}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                المميزات المتضمنة
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-premium p-6 animate-fade-in-up delay-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-purple-600" />
                </div>
                معلومات الدفع
              </h2>
              
              {/* Paddle Badge */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl mb-6 border border-blue-200">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">الدفع الآمن عبر Paddle</p>
                  <p className="text-sm text-gray-600">Visa, MasterCard, PayPal</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-6 animate-fade-in">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700">خطأ</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* User Info */}
              {user && (
                <div className="p-4 bg-gray-50 rounded-xl mb-6">
                  <p className="text-sm text-gray-500 mb-1">سيتم الاشتراك باستخدام:</p>
                  <p className="font-bold text-gray-900">{user.email}</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading || !paddleLoaded}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    إتمام الدفع - ${price}
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
                <Shield className="h-4 w-4" />
                <span className="text-sm">دفع آمن ومشفر 100%</span>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                بالضغط على &quot;إتمام الدفع&quot;، أنت توافق على{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  شروط الاستخدام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  سياسة الخصوصية
                </Link>
              </p>
            </div>

            {/* Guarantees */}
            <div className="card-premium p-6 animate-fade-in-up delay-200">
              <h3 className="font-bold text-gray-900 mb-4">ضماناتنا</h3>
              <div className="space-y-3">
                {guarantees.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
