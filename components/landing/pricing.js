"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  Shield, 
  Clock, 
  Headphones, 
  ShoppingCart, 
  Star, 
  Check, 
  Zap, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Gift, 
  X 
} from 'lucide-react';
import Link from 'next/link';
import { plans, calculateSavings } from '@/config/plans';

// Mapping للأيقونات
const iconMap = {
  ShoppingCart: ShoppingCart,
  Crown: Crown,
  Star: Star
};

export default function Pricing({ 
  showHeader = true, 
  ctaLink = '/register' 
}) {
  const [isAnnual, setIsAnnual] = useState(true);

  const guarantees = [
    { icon: Shield, title: 'دفع آمن 100%', color: 'from-blue-500 to-blue-600', emoji: '🔐' },
    { icon: DollarSign, title: 'ضمان استرداد الأموال', color: 'from-green-500 to-emerald-600', emoji: '💰' },
    { icon: Clock, title: 'تفعيل خلال 3-7 أيام', color: 'from-purple-500 to-purple-600', emoji: '⏱️' },
    { icon: Headphones, title: 'دعم فني 24/7', color: 'from-pink-500 to-rose-600', emoji: '🎧' }
  ];

  const benefits = [
    { icon: TrendingUp, text: 'زيادة المبيعات بنسبة 300%', color: 'text-green-600' },
    { icon: Award, text: 'تصميم احترافي يعزز الثقة', color: 'text-blue-600' },
    { icon: Zap, text: 'سرعة تحميل فائقة', color: 'text-purple-600' },
    { icon: Gift, text: 'هدايا وعروض حصرية', color: 'text-orange-600' }
  ];

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 px-4 py-12">
        {/* Enhanced Header */}
        {showHeader && (
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
              <span className="text-sm font-bold text-white">عروض خاصة لفترة محدودة</span>
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              اختر الباقة
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mt-2">
                التي تناسب طموحك
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              حوّل فكرتك إلى متجر إلكتروني ناجح مع باقاتنا المصممة خصيصاً لك
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {benefits.map((benefit, i) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
                    <BenefitIcon className={`h-8 w-8 mx-auto mb-2 ${benefit.color}`} />
                    <p className="text-xs font-bold text-gray-700">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                !isAnnual 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-bold transition-all relative ${
                isAnnual 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              سنوي
              {isAnnual && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  -17%
                </div>
              )}
            </button>
          </div>
        </div>

        {isAnnual && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-base font-bold shadow-lg animate-pulse">
              <Gift className="h-5 w-5" />
              🎉 شهر مجاني + خصم 17% عند الاشتراك السنوي
            </div>
          </div>
        )}

        {/* Guarantee Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          {guarantees.map((item, i) => {
            const GuaranteeIcon = item.icon;
            return (
              <div 
                key={i} 
                className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <GuaranteeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, i) => {
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice);
            const Icon = iconMap[plan.iconName] || ShoppingCart;
            
            return (
              <div
                key={i}
                className={`relative bg-white/95 backdrop-blur-sm rounded-3xl transition-all duration-500 hover:scale-105 group ${
                  plan.popular 
                    ? 'md:-mt-8 md:mb-8 shadow-2xl shadow-blue-500/30 border-4 border-blue-500' 
                    : 'shadow-xl hover:shadow-2xl border-2 border-gray-200'
                }`}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.iconBg} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`}></div>

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-black shadow-2xl flex items-center gap-2 animate-pulse">
                      <Star className="h-5 w-5 fill-white" />
                      الأكثر اختياراً
                      <Star className="h-5 w-5 fill-white" />
                    </div>
                  </div>
                )}

                {/* Savings Badge */}
                {isAnnual && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      وفر ${savings}
                    </div>
                  </div>
                )}

                <div className="relative p-8 pt-12">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${plan.iconBg} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">{plan.description}</p>
                    <p className="text-xs text-gray-400">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
                        ${displayPrice}
                      </span>
                      <span className="text-gray-500 text-sm">/{isAnnual ? 'سنة' : 'شهر'}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-gray-500">
                        أي ${Math.round(plan.annualPrice / 12)}/شهر
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.allFeatures.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.highlight 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gray-200'
                        }`}>
                          <Check className={`h-4 w-4 ${feature.highlight ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className={`text-sm ${feature.highlight ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                          {feature.icon} {feature.text}
                        </span>
                      </li>
                    ))}
                    {plan.unavailableFeatures && plan.unavailableFeatures.map((feature, j) => (
                      <li key={`unavailable-${j}`} className="flex items-start gap-3 opacity-50">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-400 line-through">
                          {feature.icon} {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={`${ctaLink}?plan=${plan.id}`}>
                    <button className={`w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${plan.buttonGradient} shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}>
                      {plan.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            الأسئلة الشائعة
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'هل يمكنني تغيير الباقة لاحقاً؟',
                a: 'نعم، يمكنك الترقية أو تغيير باقتك في أي وقت من لوحة التحكم.'
              },
              {
                q: 'ما هي طرق الدفع المتاحة؟',
                a: 'نقبل الدفع عبر البطاقات الائتمانية (Visa, MasterCard) من خلال بوابة Paddle الآمنة.'
              },
              {
                q: 'هل هناك ضمان استرداد الأموال؟',
                a: 'نعم، نقدم ضمان استرداد الأموال خلال 14 يوم من تاريخ الاشتراك.'
              },
              {
                q: 'كم يستغرق تفعيل المتجر؟',
                a: 'يتم تفعيل متجرك خلال 3-7 أيام عمل من تاريخ الاشتراك.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}