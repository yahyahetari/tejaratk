'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Features from '@/components/landing/features';
import Link from 'next/link';
import { Sparkles, Zap, Shield, Globe, BarChart3, Palette, Package, CreditCard, Users, Search, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function FeaturesPage() {
  const mainFeatures = [
    { icon: Sparkles, title: 'ذكاء اصطناعي', description: 'إنشاء أوصاف وتصنيفات تلقائية', color: 'from-purple-500 to-pink-600', features: ['أوصاف احترافية', 'تصنيف ذكي', 'SEO تلقائي'] },
    { icon: Palette, title: 'تصاميم احترافية', description: 'قوالب قابلة للتخصيص الكامل', color: 'from-blue-500 to-indigo-600', features: ['قوالب متعددة', 'تخصيص كامل', 'تصميم متجاوب'] },
    { icon: CreditCard, title: 'بوابات دفع', description: 'دعم جميع بوابات الدفع العربية', color: 'from-emerald-500 to-teal-600', features: ['مدى', 'Apple Pay', 'STC Pay', 'Visa/MC'] },
    { icon: BarChart3, title: 'تحليلات متقدمة', description: 'رؤى تفصيلية لأداء متجرك', color: 'from-amber-500 to-orange-600', features: ['تقارير المبيعات', 'تحليل الزوار', 'توقعات ذكية'] },
    { icon: Shield, title: 'أمان عالي', description: 'حماية متقدمة مع تشفير SSL', color: 'from-red-500 to-rose-600', features: ['تشفير SSL', 'حماية DDoS', 'نسخ احتياطي'] },
    { icon: Globe, title: 'وصول عالمي', description: 'دعم متعدد اللغات والعملات', color: 'from-cyan-500 to-blue-600', features: ['متعدد اللغات', 'عملات متعددة', 'شحن دولي'] },
  ];

  const additionalFeatures = [
    { icon: Package, title: 'إدارة المخزون', desc: 'تتبع تلقائي' },
    { icon: Users, title: 'إدارة العملاء', desc: 'قاعدة بيانات' },
    { icon: Search, title: 'تحسين SEO', desc: 'ظهور أفضل' },
    { icon: Clock, title: 'دعم 24/7', desc: 'دعم متواصل' },
    { icon: Zap, title: 'سرعة فائقة', desc: 'تحميل سريع' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-20 right-10 w-72 h-72 blob blob-blue"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 blob blob-purple"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="badge-gradient mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="mr-2">مميزات قوية</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              كل ما تحتاجه <span className="gradient-text">لمتجر ناجح</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              أدوات متقدمة لإنشاء وإدارة متجرك بسهولة
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <button className="btn-primary flex items-center gap-2">
                  ابدأ الآن مجاناً
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="btn-secondary">عرض الأسعار</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Features />

      {/* Main Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">مميزات رئيسية</h2>
            <p className="text-lg text-gray-600">أدوات تساعدك على النجاح</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, i) => (
              <div key={i} className="card-premium p-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">المزيد من المميزات</h2>
            <p className="text-lg text-gray-600">أدوات إضافية لتحسين تجربتك</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {additionalFeatures.map((feature, i) => (
              <div key={i} className="card-premium p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative">
        <div className="absolute inset-0 gradient-primary"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-4">جاهز لتجربة هذه المميزات؟</h2>
            <p className="text-lg text-blue-100 mb-8">ابدأ الآن واكتشف كيف نساعدك في النجاح</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-2">
                  ابدأ الآن مجاناً
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-3.5 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                  تواصل معنا
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