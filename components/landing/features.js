import React from 'react';
import { Star, Zap, Target, DollarSign, Shield, Headphones, Code } from 'lucide-react';

export default function Features() {
  const whyChoose = [
    {
      icon: Zap,
      title: 'تسليم سريع',
      description: 'متجرك جاهز خلال 3-7 أيام مع إمكانية التعديل والتخصيص',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: Target,
      title: 'ذكاء اصطناعي',
      description: 'دمج تقنيات الذكاء الاصطناعي لتوصيف المنتجات واختصار الوقت',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: DollarSign,
      title: 'أسعار منافسة',
      description: 'باقات مرنة تبدأ من $49 مع شهر مجاني لجميع الباقات',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: Shield,
      title: 'ضمان الجودة',
      description: 'كود نظيف، تصميم احترافي، وأداء محسّن لمحركات البحث',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: Headphones,
      title: 'دعم مستمر',
      description: 'دعم فني متواصل عبر البريد الإلكتروني 24/7 لحل أي مشكلة',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: Code,
      title: 'تصميم مخصص',
      description: 'تصاميم فريدة تعكس هوية علامتك التجارية بشكل احترافي',
      gradient: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom ">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full mb-6 border border-yellow-200">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">لماذا تختار خدماتي</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            مزايا حقيقية تحصل عليها عند العمل معي
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChoose.map((item, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}