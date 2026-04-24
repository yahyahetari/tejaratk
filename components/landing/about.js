import React from 'react';
import { Target, Lightbulb, Code, Smartphone, Headphones, Zap, Heart, Award } from 'lucide-react';

export default function About() {
  const capabilities = [
    { icon: Code, title: 'تطوير احترافي', desc: 'كود نظيف ومحسّن', gradient: 'from-brand-600 to-brand-700' },
    { icon: Smartphone, title: 'تصاميم متجاوبة', desc: 'جميع الأجهزة', gradient: 'from-gold-600 to-gold-700' },
    { icon: Headphones, title: 'دعم متواصل', desc: 'متابعة مستمرة', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Zap, title: 'تسليم سريع', desc: 'أيام معدودة', gradient: 'from-walnut-600 to-walnut-700' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-700/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-700/5 rounded-full blur-[100px]"></div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Vision Card */}
          <div className="relative animate-fade-in-up">
            <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-gold-700 rounded-3xl p-10 text-white shadow-2xl shadow-brand-700/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-4">رؤيتي</h3>
                <p className="text-brand-100 leading-relaxed text-lg mb-8">
                  أؤمن بقوة التجارة الإلكترونية في تحويل الأفكار إلى مشاريع ناجحة. هدفي مساعدتك في بناء متجر احترافي يعكس هوية علامتك ويحقق أهدافك باستخدام أحدث التقنيات والذكاء الاصطناعي.
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-gold-300" />
                    <span className="text-brand-100 text-sm font-semibold">شغف بالتطوير</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold-300" />
                    <span className="text-brand-100 text-sm font-semibold">جودة عالية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-6 animate-fade-in-up delay-200">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-700 to-brand-600 rounded-full shadow-lg shadow-brand-700/20">
              <Target className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">من أنا</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              مطور متخصص في<br />
              <span className="bg-gradient-to-r from-brand-400 via-gold-400 to-brand-300 bg-clip-text text-transparent">المتاجر الإلكترونية</span>
            </h2>

            <p className="text-lg text-gray-400 leading-relaxed">
              أنا يحيى، مطور متخصص في التجارة الإلكترونية. أستخدم أحدث التقنيات والذكاء الاصطناعي لتطوير حلول مبتكرة تساعد أصحاب الأعمال في النجاح عبر الإنترنت.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {capabilities.map((cap, i) => (
                <div key={i} className="group flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <cap.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-200 text-sm">{cap.title}</div>
                    <div className="text-xs text-gray-500">{cap.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}