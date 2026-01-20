'use client';

import { AlertCircle, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * مكون بانر فترة السماح
 * @param {Object} props
 * @param {number} props.daysRemaining - الأيام المتبقية في فترة السماح
 */
export default function GracePeriodBanner({ daysRemaining }) {
  if (daysRemaining < 0 || daysRemaining > 7) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" dir="rtl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* الرسالة */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <AlertCircle className="h-7 w-7" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                فترة السماح: {daysRemaining} {daysRemaining === 1 ? 'يوم' : 'أيام'} متبقية
              </h3>
              <p className="text-sm mt-1 text-white/90">
                اشتراكك منتهي ولكن الخدمة لا زالت تعمل. جدد الآن قبل تعليق الخدمة نهائياً.
              </p>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3">
            <Link href="/dashboard/subscription/renew">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold"
              >
                <CreditCard className="ml-2 h-5 w-5" />
                جدد الآن
              </Button>
            </Link>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${(daysRemaining / 7) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1 text-white/80">
            <span>تعليق الخدمة</span>
            <span>{daysRemaining} / 7 أيام</span>
          </div>
        </div>
      </div>
    </div>
  );
}
