'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  Store,
  Rocket,
  Gift,
  Star
} from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const nextSteps = [
    { icon: Store, title: 'أكمل إعداد المتجر', desc: 'أضف معلومات متجرك', href: '/dashboard/store-setup' },
    { icon: Rocket, title: 'ابدأ البيع', desc: 'أضف منتجاتك وابدأ', href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 blob blob-blue"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 blob blob-purple"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto gradient-success rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center animate-ping">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="card-premium p-10 text-center animate-fade-in-up delay-100">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            🎉 مبروك!
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            تم تفعيل اشتراكك بنجاح
          </p>
          <p className="text-gray-500 mb-8">
            شكراً لثقتك بنا. يمكنك الآن الاستمتاع بجميع المميزات!
          </p>

          {/* Countdown */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
            <p className="text-gray-600 mb-2">
              سيتم تحويلك إلى لوحة التحكم خلال
            </p>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-4xl font-black gradient-text">{countdown}</span>
              <span className="text-gray-500 text-lg">ثانية</span>
            </div>
          </div>

          {/* Manual Navigation */}
          <Link href="/dashboard">
            <button className="btn-primary text-lg flex items-center gap-2 mx-auto">
              الذهاب للوحة التحكم
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="card-premium p-6 mt-6 animate-fade-in-up delay-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-600" />
            الخطوات التالية
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {nextSteps.map((step, i) => (
              <Link key={i} href={step.href}>
                <div className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-center group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-gray-500 animate-fade-in-up delay-300">
          هل تحتاج مساعدة؟{' '}
          <Link href="/contact" className="text-blue-600 hover:underline font-semibold">
            تواصل معنا
          </Link>
        </p>
      </div>
    </div>
  );
}
