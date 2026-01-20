'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Pricing from '@/components/landing/pricing';
import { 
  Shield, 
  Zap, 
  Clock, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const faqs = [
    {
      question: 'هل يمكنني تغيير خطتي لاحقاً؟',
      answer: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. سيتم احتساب الفرق بشكل تناسبي.'
    },
    {
      question: 'هل هناك فترة تجريبية مجانية؟',
      answer: 'نعم، نقدم فترة تجريبية مجانية لمدة 14 يوماً لجميع الخطط.'
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل جميع بطاقات الائتمان الرئيسية، مدى، Apple Pay، و STC Pay.'
    },
    {
      question: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
      answer: 'نعم، يمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية.'
    },
  ];

  const guarantees = [
    { icon: Shield, title: 'ضمان استرداد المال', desc: '30 يوم ضمان استرداد كامل' },
    { icon: Zap, title: 'دعم فوري', desc: 'فريق دعم متاح على مدار الساعة' },
    { icon: Clock, title: 'بدون التزام', desc: 'إلغاء في أي وقت بدون رسوم' },
    { icon: Sparkles, title: 'تحديثات مجانية', desc: 'جميع التحديثات مجانية للأبد' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-20 right-10 w-72 h-72 blob blob-blue"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 blob blob-purple"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="badge-gradient mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="mr-2">أسعار شفافة</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              اختر الخطة المناسبة
              <span className="gradient-text"> لنمو أعمالك</span>
            </h1>
            <p className="text-xl text-gray-600">
              خطط مرنة تناسب جميع الأحجام. ابدأ مجاناً وقم بالترقية عندما تحتاج.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Component */}
      <Pricing />

      {/* Guarantees Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              ضمانات تجعلك مطمئناً
            </h2>
            <p className="text-xl text-gray-600">
              نحن واثقون من جودة خدماتنا
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {guarantees.map((item, i) => (
              <div 
                key={i} 
                className="card-premium p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-6 animate-fade-in-up">
              هل تحتاج مساعدة في اختيار الخطة المناسبة؟
            </h2>
            <p className="text-xl text-blue-100 mb-10 animate-fade-in-up delay-200">
              فريقنا جاهز لمساعدتك في اختيار أفضل خطة لاحتياجاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  تواصل معنا
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  ابدأ مجاناً
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
