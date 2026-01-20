import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import PricingCards from '@/components/pricing/pricing-cards';
import Link from 'next/link';
import { 
  TrendingUp, 
  Sparkles, 
  Check, 
  X, 
  ArrowLeft,
  Shield,
  Zap,
  Clock,
  Gift
} from 'lucide-react';

export default async function UpgradePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const features = [
    { name: 'عدد المنتجات', basic: '100', enhanced: '500', advanced: 'غير محدود' },
    { name: 'مساحة التخزين', basic: '5 GB', enhanced: '25 GB', advanced: '100 GB' },
    { name: 'الدعم الفني', basic: 'أساسي', enhanced: 'ذو أولوية', advanced: '24/7 متخصص' },
    { name: 'قوالب المتجر', basic: '3', enhanced: '10', advanced: 'جميع القوالب' },
    { name: 'نطاق مخصص', basic: true, enhanced: true, advanced: 'مجاني' },
    { name: 'تحليلات متقدمة', basic: false, enhanced: true, advanced: true },
    { name: 'تقارير مخصصة', basic: false, enhanced: false, advanced: true },
    { name: 'API متقدم', basic: false, enhanced: true, advanced: true },
  ];

  const benefits = [
    { icon: Zap, title: 'ترقية فورية', desc: 'تفعيل المميزات الجديدة فوراً' },
    { icon: Shield, title: 'ضمان استرداد', desc: '30 يوم ضمان استرداد كامل' },
    { icon: Clock, title: 'دعم متواصل', desc: 'فريق دعم على مدار الساعة' },
    { icon: Gift, title: 'خصم الترقية', desc: 'خصم خاص للعملاء الحاليين' },
  ];
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Link */}
      <Link href="/dashboard/subscription" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="h-5 w-5" />
        <span>العودة للاشتراكات</span>
      </Link>

      {/* Page Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary rounded-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-10 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            اختر خطتك المثالية 🚀
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ابدأ مع خطة تناسب احتياجات متجرك وقم بالترقية في أي وقت
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        {benefits.map((benefit, i) => (
          <div key={i} className="card-premium p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
              <benefit.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h3>
            <p className="text-xs text-gray-500">{benefit.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Pricing Cards */}
      <div className="animate-fade-in-up delay-100">
        <PricingCards merchant={session.merchant} />
      </div>
      
      {/* Features Comparison */}
      <div className="card-premium p-8 animate-fade-in-up delay-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            مقارنة الخطط
          </h2>
          <p className="text-gray-500">اختر الخطة التي تناسب احتياجاتك</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  الميزة
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-gray-900">أساسية</span>
                    <span className="text-xs text-gray-500">للمبتدئين</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center bg-blue-50 rounded-t-xl">
                  <div className="inline-flex flex-col items-center">
                    <span className="badge-primary text-xs mb-1">الأكثر شعبية</span>
                    <span className="text-sm font-bold text-gray-900">محسّنة</span>
                    <span className="text-xs text-gray-500">للنمو</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-gray-900">متقدمة</span>
                    <span className="text-xs text-gray-500">للمحترفين</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.map((feature, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.basic === 'boolean' ? (
                      feature.basic ? (
                        <div className="w-6 h-6 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{feature.basic}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-center ${i % 2 === 0 ? 'bg-blue-50' : 'bg-blue-50/50'}`}>
                    {typeof feature.enhanced === 'boolean' ? (
                      feature.enhanced ? (
                        <div className="w-6 h-6 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm font-medium text-blue-600">{feature.enhanced}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.advanced === 'boolean' ? (
                      feature.advanced ? (
                        <div className="w-6 h-6 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{feature.advanced}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="card-premium p-6 animate-fade-in-up delay-300">
        <h3 className="text-lg font-bold text-gray-900 mb-4">أسئلة شائعة</h3>
        <div className="space-y-4">
          {[
            { q: 'هل يمكنني تغيير خطتي لاحقاً؟', a: 'نعم، يمكنك الترقية أو التخفيض في أي وقت.' },
            { q: 'ماذا يحدث لبياناتي عند الترقية؟', a: 'جميع بياناتك ستبقى كما هي، فقط ستحصل على مميزات إضافية.' },
            { q: 'هل هناك عقد طويل الأمد؟', a: 'لا، جميع خططنا شهرية ويمكنك الإلغاء في أي وقت.' },
          ].map((faq, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
