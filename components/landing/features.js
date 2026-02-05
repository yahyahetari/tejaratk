import React from 'react';
import { Star, Zap, Target, DollarSign, Shield, Headphones, Code } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: Zap, title: 'تسليم سريع', description: 'متجرك جاهز خلال 3-7 أيام', gradient: 'from-blue-500 to-blue-600' },
    { icon: Target, title: 'ذكاء اصطناعي', description: 'توصيف تلقائي للمنتجات', gradient: 'from-purple-500 to-purple-600' },
    { icon: DollarSign, title: 'أسعار منافسة', description: 'باقات تبدأ من $49', gradient: 'from-green-500 to-green-600' },
    { icon: Shield, title: 'ضمان الجودة', description: 'كود نظيف وأداء محسّن', gradient: 'from-orange-500 to-orange-600' },
    { icon: Headphones, title: 'دعم مستمر', description: 'دعم فني 24/7', gradient: 'from-pink-500 to-pink-600' },
    { icon: Code, title: 'تصميم مخصص', description: 'تصاميم تعكس هويتك', gradient: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full mb-4 border border-yellow-200">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">لماذا تختارنا</span>
          </div>
          <h3 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            مزايا حقيقية لنجاحك
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <div key={i} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}