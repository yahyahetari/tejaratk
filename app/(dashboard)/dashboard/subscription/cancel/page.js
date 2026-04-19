'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white border border-gray-100 rounded-2xl shadow-xl text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">تم إلغاء الاشتراك المجدول</h2>
        <p className="text-gray-600 mb-8">
          لقد تلقينا طلبك بنجاح. سيبقى متجرك ومميزاتك فعالة حتى انتهاء فترتك المدفوعة الحالية.
        </p>
        <Link href="/dashboard/subscription">
          <button className="btn-primary w-full">العودة إلى الاشتراكات</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 mb-12 animate-fade-in-up">
      <div className="mb-6">
        <Link href="/dashboard/subscription" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6">
          <ArrowRight className="h-4 w-4" /> العودة للاشتراكات
        </Link>
      </div>
      
      <div className="p-8 bg-white border border-red-100 rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-4">تأكيد إلغاء الاشتراك</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          هل أنت متأكد من رغبتك في إلغاء الاشتراك؟ 
          <br /><br />
          لن يتم سحب أي مبالغ منك بعد الآن، وستبقى مميزات باقتك فعالة حتى تنتهي صلاحية دورتك الشرائية الحالية.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> جاري الإلغاء...</>
            ) : (
              'نعم، قم بإلغاء اشتراكي'
            )}
          </button>
          
          <Link href="/dashboard/subscription" className="flex-1">
            <button
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              تراجع
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
