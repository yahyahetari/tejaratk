import React from 'react';
import { Target, Lightbulb, Code, Smartphone, Headphones, Zap } from 'lucide-react';

export default function About() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold mb-6">رؤيتي</h3>
              <p className="text-blue-100 leading-relaxed text-lg">
                أؤمن بقوة التجارة الإلكترونية في تحويل الأفكار إلى مشاريع ناجحة. هدفي هو مساعدتك في بناء متجر احترافي يعكس هوية علامتك التجارية ويحقق أهدافك التجارية. أستخدم أحدث التقنيات الحديثة والذكاء الاصطناعي لتقديم حلول مبتكرة تميز متجرك عن المنافسين.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">🎯 من أنا</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              مطور متخصص في بناء المتاجر الإلكترونية الحديثة
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              أساعدك في إطلاق متجرك الإلكتروني بشكل احترافي!
            </p>

            <p className="text-gray-600 leading-relaxed">
              أنا يحيى، مطور متخصص في التجارة الإلكترونية بشغف كبير لبناء المتاجر الرقمية. أستخدم أحدث التقنيات والذكاء الاصطناعي لتطوير حلول مبتكرة تساعد أصحاب الأعمال في النجاح عبر الإنترنت. أركز على تقديم تصاميم عصرية وتجربة مستخدم سلسة تحقق نتائج ملموسة.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">تطوير احترافي</div>
                  <div className="text-sm text-gray-600">كود نظيف ومعايير عالمية</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">تصاميم متجاوبة</div>
                  <div className="text-sm text-gray-600">تجربة مثالية على جميع الأجهزة</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">دعم متواصل</div>
                  <div className="text-sm text-gray-600">متابعة مستمرة وصيانة دورية</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">تسليم سريع</div>
                  <div className="text-sm text-gray-600">جاهز في أيام معدودة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}