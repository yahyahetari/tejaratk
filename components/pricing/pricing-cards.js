'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { getAllPlans } from '@/config/plans';
import { formatCurrency } from '@/lib/utils/helpers';
import { initializePaddle } from '@paddle/paddle-js';

const planIcons = {
  BASIC: Zap,
  PREMIUM: Crown,
  ENTERPRISE: Rocket,
};

const planColors = {
  BASIC: {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    shadow: 'shadow-blue-500/20',
  },
  PREMIUM: {
    gradient: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    shadow: 'shadow-purple-500/20',
  },
  ENTERPRISE: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    shadow: 'shadow-amber-500/20',
  },
};

export default function PricingCards({ merchant }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(null);
  const plans = getAllPlans();

  const handleSubscribe = async (plan) => {
    setLoading(plan.id);
    
    try {
      const paddle = await initializePaddle({
        environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT,
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      });

      const priceId = plan.pricing[billingCycle].priceId;

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: {
          email: merchant?.user?.email,
        },
        customData: {
          merchantId: merchant?.id,
          planType: plan.id,
          billingCycle: billingCycle.toUpperCase(),
        },
        successUrl: `${window.location.origin}/subscription?success=true`,
      });
    } catch (error) {
      console.error('Paddle checkout error:', error);
      alert('حدث خطأ أثناء فتح صفحة الدفع');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            شهري
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            سنوي
            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
              وفّر 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = plan.pricing[billingCycle];
          const Icon = planIcons[plan.id] || Zap;
          const colors = planColors[plan.id] || planColors.BASIC;
          
          return (
            <div
              key={plan.id}
              className={`relative card-premium overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                plan.popular 
                  ? 'border-2 border-purple-500 ring-4 ring-purple-100' 
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    الأكثر شيوعاً
                  </div>
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                {/* Plan Icon & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${colors.shadow}`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">
                      {formatCurrency(price.amount)}
                    </span>
                    <span className="text-gray-500 font-medium">
                      / {billingCycle === 'monthly' ? 'شهر' : 'سنة'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && price.discount && (
                    <p className="mt-2 text-sm text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      وفّر {price.discount} مع الدفع السنوي
                    </p>
                  )}
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading !== null}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 mb-6 ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    'اشترك الآن'
                  )}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className={`h-4 w-4 ${colors.text}`} />
                    يشمل:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className={`h-3 w-3 ${colors.text}`} />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
