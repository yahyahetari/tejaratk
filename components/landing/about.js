import React from 'react';
import { Target, Lightbulb, Code, Smartphone, Headphones, Zap } from 'lucide-react';

export default function About() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-4">رؤيتي</h3>
              <p className="text-blue-100 leading-relaxed">
                أؤمن بقوة التجارة الإلكترونية في تحويل الأفكار إلى مشاريع ناجحة. هدفي مساعدتك في بناء متجر احترافي يعكس هوية علامتك ويحقق أهدافك باستخدام أحدث التقنيات والذكاء الاصطناعي.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">🎯 من أنا</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              مطور متخصص في المتاجر الإلكترونية
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              أساعدك في إطلاق متجرك بشكل احترافي
            </p>

            <p className="text-gray-600 leading-relaxed text-sm">
              أنا يحيى، مطور متخصص في التجارة الإلكترونية. أستخدم أحدث التقنيات والذكاء الاصطناعي لتطوير حلول مبتكرة تساعد أصحاب الأعمال في النجاح عبر الإنترنت.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">تطوير احترافي</div>
                  <div className="text-xs text-gray-600">كود نظيف</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">تصاميم متجاوبة</div>
                  <div className="text-xs text-gray-600">جميع الأجهزة</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">دعم متواصل</div>
                  <div className="text-xs text-gray-600">متابعة مستمرة</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">تسليم سريع</div>
                  <div className="text-xs text-gray-600">أيام معدودة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}