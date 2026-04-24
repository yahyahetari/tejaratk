import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Pricing from '@/components/landing/pricing';
import { 
  Shield, 
  Zap, 
  Clock, 
  Sparkles, 
  HelpCircle,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/scroll-reveal';

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
    <div className="min-h-screen bg-brand-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-700/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.01}>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span className="text-sm font-bold text-brand-300">خطط مرنة وشفافة</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                اختر الخطة المناسبة <br />
                <span className="bg-gradient-to-r from-brand-400 via-gold-400 to-brand-300 bg-clip-text text-transparent">لنمو أعمالك</span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                أفضل استثمار لمتجرك الإلكتروني يبدأ من هنا. ابدأ مجاناً وقم بالترقية عندما تكبر تجارتك.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Component (already should be brand aligned) */}
      <Pricing />

      {/* Guarantees Section */}
      <section className="py-20 bg-brand-900/10">
        <div className="container-custom">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">ضمانات تجعلك مطمئناً</h2>
              <p className="text-gray-500">نحن نؤمن بجودة ما نقدمه، ولذلك نضع ضمانات حقيقية لراحتك</p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-4 gap-6">
            {guarantees.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group bg-white/[0.03] rounded-3xl p-8 text-center border border-white/5 hover:border-brand-700/30 transition-all duration-300 h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-brand-950">
        <div className="container-custom">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">الأسئلة الشائعة</h2>
              <p className="text-gray-500">كل ما تريد معرفته عن الباقات والاشتراك</p>
            </div>
          </ScrollReveal>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 hover:border-brand-600/30 transition-all">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-gold-400" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm pr-8">
                    {faq.answer}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-gold-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        
        <div className="container-custom relative z-10 text-center text-white">
          <ScrollReveal animation="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">هل تحتاج لمساعدة في الاختيار؟</h2>
            <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">فريق خبرائنا جاهز لمساعدتك في تحديد الباقة الأنسب لأهداف تجارتك الإلكترونية</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <button className="group px-10 py-4 bg-white text-brand-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  تواصل معنا الآن
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/register">
                <button className="px-10 py-4 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                  ابدأ مجاناً
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
