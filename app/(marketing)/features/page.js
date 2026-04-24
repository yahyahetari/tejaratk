import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Features from '@/components/landing/features';
import Link from 'next/link';
import { Sparkles, Zap, Shield, Globe, BarChart3, Palette, Package, CreditCard, Users, Search, Clock, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

export default function FeaturesPage() {
  const mainFeatures = [
    { icon: Sparkles, title: 'ذكاء اصطناعي', description: 'إنشاء أوصاف وتصنيفات تلقائية', color: 'from-gold-600 to-gold-700', features: ['أوصاف احترافية', 'تصنيف ذكي', 'SEO تلقائي'] },
    { icon: Palette, title: 'تصاميم احترافية', description: 'قوالب قابلة للتخصيص الكامل', color: 'from-brand-600 to-brand-700', features: ['قوالب متعددة', 'تخصيص كامل', 'تصميم متجاوب'] },
    { icon: CreditCard, title: 'بوابات دفع', description: 'دعم جميع بوابات الدفع العربية', color: 'from-emerald-500 to-teal-600', features: ['مدى', 'Apple Pay', 'STC Pay', 'Visa/MC'] },
    { icon: BarChart3, title: 'تحليلات متقدمة', description: 'رؤى تفصيلية لأداء متجرك', color: 'from-brand-500 to-brand-600', features: ['تقارير المبيعات', 'تحليل الزوار', 'توقعات ذكية'] },
    { icon: Shield, title: 'أمان عالي', description: 'حماية متقدمة مع تشفير SSL', color: 'from-gold-500 to-gold-600', features: ['تشفير SSL', 'حماية DDoS', 'نسخ احتياطي'] },
    { icon: Globe, title: 'وصول عالمي', description: 'دعم متعدد اللغات والعملات', color: 'from-brand-700 to-brand-800', features: ['متعدد اللغات', 'عملات متعددة', 'شحن دولي'] },
  ];

  const additionalFeatures = [
    { icon: Package, title: 'إدارة المخزون', desc: 'تتبع تلقائي' },
    { icon: Users, title: 'إدارة العملاء', desc: 'قاعدة بيانات' },
    { icon: Search, title: 'تحسين SEO', desc: 'ظهور أفضل' },
    { icon: Clock, title: 'دعم 24/7', desc: 'دعم متواصل' },
    { icon: Zap, title: 'سرعة فائقة', desc: 'تحميل سريع' },
  ];

  return (
    <div className="min-h-screen bg-brand-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Hero */}
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
                <span className="text-sm font-bold text-brand-300">مميزات قوية وحلول ذكية</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                كل ما تحتاجه <br />
                <span className="bg-gradient-to-r from-brand-400 via-gold-400 to-brand-300 bg-clip-text text-transparent">لمتجر ناجح</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                أدوات متقدمة مدعومة بالذكاء الاصطناعي لإنشاء وإدارة متجرك الإلكتروني بكل سهولة واحترافية.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <button className="group px-8 py-4 bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-700/20 hover:shadow-2xl transition-all flex items-center gap-3">
                    ابدأ الآن مجاناً
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="px-8 py-4 bg-white/5 text-gray-300 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                    عرض الباقات
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-brand-900/10">
        <div className="container-custom">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">مميزات رئيسية</h2>
              <p className="text-gray-500">أدوات ذكية متكاملة مصممة خصيصاً لنمو تجارتك</p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group relative bg-white/[0.03] rounded-3xl p-8 border border-white/5 hover:border-brand-700/30 hover:bg-white/[0.05] transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Component Section */}
      <Features />

      {/* Additional Features Bento */}
      <section className="py-20 bg-brand-950">
        <div className="container-custom">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">المزيد من المميزات</h2>
              <p className="text-gray-500">تفاصيل صغيرة تصنع فرقاً كبيراً في متجرك</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {additionalFeatures.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl p-6 text-center border border-white/5 hover:border-brand-600/30 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-700/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-brand-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        
        <div className="container-custom relative z-10 text-center text-white">
          <ScrollReveal animation="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">جاهز لإطلاق متجرك؟</h2>
            <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">انضم إلى آلاف التجار الناجحين وابدأ رحلتك اليوم مع أفضل الأدوات والتقنيات</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="w-full sm:w-auto px-10 py-4 bg-white text-brand-700 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2">
                  ابدأ الآن مجاناً
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                  تواصل معنا
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