import React from 'react';
import { Star, Zap, Target, DollarSign, Shield, Headphones, Code } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'تسليم سريع',
      description: 'متجرك جاهز خلال 3-7 أيام عمل بتصميم كامل ومحتوى جاهز للإطلاق',
      gradient: 'from-brand-600 to-brand-700',
      highlight: 'سريع',
    },
    {
      icon: Target,
      title: 'ذكاء اصطناعي',
      description: 'إضافة وتوصيف المنتجات تلقائياً باستخدام أحدث تقنيات AI',
      gradient: 'from-gold-600 to-gold-700',
      highlight: 'ذكي',
    },
    {
      icon: DollarSign,
      title: 'أسعار منافسة',
      description: 'باقات مرنة تبدأ من $49 تناسب جميع أحجام المتاجر والميزانيات',
      gradient: 'from-emerald-500 to-teal-600',
      highlight: 'مرن',
    },
    {
      icon: Shield,
      title: 'ضمان الجودة',
      description: 'كود نظيف ومحسّن مع أعلى معايير الأمان وحماية البيانات',
      gradient: 'from-walnut-600 to-walnut-700',
      highlight: 'آمن',
    },
    {
      icon: Headphones,
      title: 'دعم فني متواصل',
      description: 'فريق دعم متخصص جاهز لمساعدتك على مدار الساعة',
      gradient: 'from-brand-500 to-brand-600',
      highlight: '24/7',
    },
    {
      icon: Code,
      title: 'تصميم مخصص',
      description: 'تصاميم فريدة مصممة خصيصاً لتعكس هوية علامتك التجارية',
      gradient: 'from-gold-500 to-walnut-600',
      highlight: 'فريد',
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-700 rounded-full mb-5 shadow-lg shadow-gold-600/20">
            <Star className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white">لماذا تختارنا</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
            مزايا حقيقية لنجاح <span className="bg-gradient-to-r from-brand-400 via-gold-400 to-brand-300 bg-clip-text text-transparent">متجرك</span>
          </h2>
          <p className="text-lg text-gray-500">
            نقدم لك كل ما تحتاجه لإطلاق متجر إلكتروني ناجح ومميز
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.03] rounded-2xl p-7 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${item.gradient} text-white shadow-sm`}>
                    {item.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}