'use client';

import { Suspense, useState } from 'react';
import { redirect } from 'next/navigation';
import RenewalForm from '@/components/subscription/renewal-form';
import Link from 'next/link';
import { 
  ArrowRight, 
  RefreshCw, 
  Shield, 
  Clock, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function RenewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscription/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = '/dashboard/subscription?renewed=true';
      } else {
        setError(result.error || 'حدث خطأ أثناء التجديد');
      }
    } catch (error) {
      console.error('Error renewing subscription:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: CheckCircle, text: 'استمرار جميع المميزات' },
    { icon: Shield, text: 'حماية بياناتك ومتجرك' },
    { icon: Clock, text: 'دعم فني متواصل' },
    { icon: Sparkles, text: 'تحديثات مجانية' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Back Link */}
      <Link href="/dashboard/subscription" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowRight className="h-5 w-5" />
        <span>العودة للاشتراك</span>
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary rounded-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-10 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            تجديد الاشتراك
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            اختر الخطة المناسبة وأكمل عملية التجديد للاستمرار في الاستفادة من جميع المميزات
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        {benefits.map((benefit, i) => (
          <div key={i} className="card-premium p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
              <benefit.icon className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">{benefit.text}</p>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">خطأ</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Renewal Form */}
      <div className="card-premium p-6 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">اختر خطة التجديد</h2>
            <p className="text-gray-500">حدد الخطة والمدة المناسبة</p>
          </div>
        </div>
        
        <RenewalForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {/* Info Card */}
      <div className="card-premium p-6 border-2 border-blue-200 bg-blue-50 animate-fade-in-up delay-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ملاحظة مهمة</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                سيتم تفعيل التجديد فور إتمام الدفع
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                جميع بياناتك ومنتجاتك ستبقى كما هي
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                يمكنك الترقية أو التخفيض في أي وقت
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
