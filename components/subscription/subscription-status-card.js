'use client';

import Link from 'next/link';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  CreditCard,
  Clock,
  Zap,
  Crown,
  Rocket,
  RefreshCw,
  Shield
} from 'lucide-react';

const planIcons = {
  BASIC: Zap,
  PREMIUM: Crown,
  ENTERPRISE: Rocket,
};

const planColors = {
  BASIC: 'from-blue-500 to-indigo-600',
  PREMIUM: 'from-purple-500 to-pink-600',
  ENTERPRISE: 'from-amber-500 to-orange-600',
};

export default function SubscriptionStatusCard({ subscription, statusInfo }) {
  const getStatusBadge = () => {
    if (statusInfo.isActive && !statusInfo.needsRenewal) {
      return (
        <span className="badge-success flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          نشط
        </span>
      );
    }

    if (statusInfo.needsRenewal) {
      return (
        <span className="badge-warning flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          يحتاج تجديد
        </span>
      );
    }

    if (statusInfo.isInGracePeriod) {
      return (
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          فترة سماح
        </span>
      );
    }

    if (statusInfo.isExpired || statusInfo.isOverdue) {
      return (
        <span className="badge-danger flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          منتهي
        </span>
      );
    }

    if (statusInfo.isSuspended) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
          معلق
        </span>
      );
    }

    return null;
  };

  const getPlanName = (planType) => {
    const plans = {
      BASIC: 'الباقة الأساسية',
      PREMIUM: 'الباقة المميزة',
      ENTERPRISE: 'باقة الشركات'
    };
    return plans[planType] || planType;
  };

  const getBillingCycleName = (cycle) => {
    return cycle === 'MONTHLY' ? 'شهري' : 'سنوي';
  };

  const PlanIcon = planIcons[subscription.planType] || Zap;
  const planColor = planColors[subscription.planType] || planColors.BASIC;

  const cardBorderClass = statusInfo.needsRenewal 
    ? 'border-2 border-amber-300' 
    : statusInfo.isInGracePeriod 
      ? 'border-2 border-orange-300' 
      : statusInfo.isOverdue 
        ? 'border-2 border-red-300' 
        : '';

  return (
    <div className={`card-premium overflow-hidden ${cardBorderClass}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${planColor} flex items-center justify-center shadow-lg`}>
              <PlanIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-gray-900">حالة الاشتراك</h3>
                {getStatusBadge()}
              </div>
              <p className="text-gray-500">
                {getPlanName(subscription.planType)} - {getBillingCycleName(subscription.billingCycle)}
              </p>
            </div>
          </div>
          {(statusInfo.needsRenewal || statusInfo.isInGracePeriod || statusInfo.isOverdue) && (
            <Link href="/dashboard/subscription/renew">
              <button className="btn-primary flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                تجديد الآن
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Info Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Calendar className="h-4 w-4" />
              <span>تاريخ البدء</span>
            </div>
            <p className="font-bold text-gray-900">
              {new Date(subscription.startDate).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Calendar className="h-4 w-4" />
              <span>تاريخ الانتهاء</span>
            </div>
            <p className={`font-bold ${
              statusInfo.needsRenewal || statusInfo.isInGracePeriod || statusInfo.isOverdue 
                ? 'text-red-600' 
                : 'text-gray-900'
            }`}>
              {new Date(subscription.endDate).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {subscription.lastPaymentDate && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CreditCard className="h-4 w-4" />
                <span>آخر دفعة</span>
              </div>
              <p className="font-bold text-gray-900">
                {new Date(subscription.lastPaymentDate).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {subscription.nextPaymentDate && statusInfo.isActive && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CreditCard className="h-4 w-4" />
                <span>الدفعة القادمة</span>
              </div>
              <p className="font-bold text-gray-900">
                {new Date(subscription.nextPaymentDate).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Days Remaining */}
        {statusInfo.isActive && statusInfo.daysRemaining > 0 && (
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${statusInfo.daysRemaining <= 7 ? 'text-amber-600' : 'text-emerald-600'}`} />
                <span className="text-gray-600 font-medium">الأيام المتبقية</span>
              </div>
              <span className={`text-3xl font-black ${
                statusInfo.daysRemaining <= 7 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {statusInfo.daysRemaining} يوم
              </span>
            </div>
            {statusInfo.daysRemaining <= 30 && (
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    statusInfo.daysRemaining <= 7 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${Math.min((statusInfo.daysRemaining / 30) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Grace Period Warning */}
        {statusInfo.isInGracePeriod && (
          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-orange-800 mb-1">
                  أنت في فترة السماح
                </p>
                <p className="text-sm text-orange-700">
                  يتبقى {statusInfo.daysInGracePeriod} يوم قبل تعليق الخدمة. قم بالتجديد الآن للحفاظ على خدماتك.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expired Warning */}
        {statusInfo.isOverdue && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-red-800 mb-1">
                  اشتراكك منتهي ومعلق
                </p>
                <p className="text-sm text-red-700">
                  يجب تجديد الاشتراك لإعادة تفعيل الخدمة والوصول إلى متجرك.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Status Info */}
        {statusInfo.isActive && !statusInfo.needsRenewal && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-emerald-800">اشتراكك نشط</p>
                <p className="text-sm text-emerald-700">جميع الخدمات متاحة لك</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
