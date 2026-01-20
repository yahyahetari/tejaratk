'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * مكون تحذير التأخير في الدفع
 * @param {Object} props
 * @param {Object} props.statusInfo - معلومات حالة الاشتراك
 * @param {boolean} props.dismissible - إمكانية إخفاء التحذير (افتراضي: false)
 */
export default function OverdueWarning({ statusInfo, dismissible = false }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // عرض التحذير فقط إذا كان الاشتراك متأخر أو في فترة السماح
  if (!statusInfo.isOverdue && !statusInfo.isInGracePeriod && !statusInfo.needsRenewal) {
    return null;
  }

  const getWarningLevel = () => {
    if (statusInfo.isOverdue) return 'critical';
    if (statusInfo.isInGracePeriod) return 'high';
    if (statusInfo.needsRenewal && statusInfo.daysRemaining <= 3) return 'medium';
    if (statusInfo.needsRenewal) return 'low';
    return 'info';
  };

  const warningLevel = getWarningLevel();

  const warningStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      icon: 'text-red-600',
      text: 'text-red-900',
      button: 'bg-red-600 hover:bg-red-700'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      icon: 'text-orange-600',
      text: 'text-orange-900',
      button: 'bg-orange-600 hover:bg-orange-700'
    },
    medium: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      icon: 'text-amber-600',
      text: 'text-amber-900',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    low: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    }
  };

  const style = warningStyles[warningLevel];

  const getMessage = () => {
    if (statusInfo.isOverdue) {
      return {
        title: '❌ اشتراكك منتهي ومعلق',
        description: 'خدماتك معلقة حالياً. يجب تجديد الاشتراك فوراً لإعادة تفعيل جميع المميزات.',
        action: 'جدد الآن'
      };
    }

    if (statusInfo.isInGracePeriod) {
      return {
        title: `⚠️ فترة السماح: ${statusInfo.daysInGracePeriod} يوم متبقية`,
        description: 'اشتراكك منتهي ولكن لا زالت الخدمة تعمل. جدد الآن قبل انتهاء فترة السماح لتجنب تعليق الخدمة.',
        action: 'جدد الآن'
      };
    }

    if (statusInfo.needsRenewal && statusInfo.daysRemaining <= 3) {
      return {
        title: `⚠️ اشتراكك سينتهي خلال ${statusInfo.daysRemaining} يوم`,
        description: 'اشتراكك على وشك الانتهاء. جدد الآن لتجنب انقطاع الخدمة.',
        action: 'جدد الآن'
      };
    }

    if (statusInfo.needsRenewal) {
      return {
        title: `تنبيه: ${statusInfo.daysRemaining} يوم متبقية على انتهاء الاشتراك`,
        description: 'يُنصح بتجديد اشتراكك مبكراً لضمان استمرارية الخدمة.',
        action: 'جدد الاشتراك'
      };
    }

    return null;
  };

  const message = getMessage();
  if (!message) return null;

  return (
    <Card className={`${style.bg} ${style.border} border-2`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* الأيقونة */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center`}>
              <AlertTriangle className={`h-7 w-7 ${style.icon}`} />
            </div>
          </div>

          {/* المحتوى */}
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${style.text}`}>
              {message.title}
            </h3>
            <p className={`text-sm mt-2 ${style.text}`}>
              {message.description}
            </p>

            {/* الأزرار */}
            <div className="flex gap-3 mt-4">
              <Link href="/dashboard/subscription/renew">
                <Button className={`${style.button} text-white`}>
                  <CreditCard className="ml-2 h-4 w-4" />
                  {message.action}
                </Button>
              </Link>
              <Link href="/dashboard/subscription">
                <Button variant="outline">
                  عرض التفاصيل
                </Button>
              </Link>
            </div>
          </div>

          {/* زر الإغلاق */}
          {dismissible && warningLevel !== 'critical' && (
            <button
              onClick={() => setDismissed(true)}
              className={`flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors ${style.text}`}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
