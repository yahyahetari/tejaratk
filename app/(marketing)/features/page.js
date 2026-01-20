'use client';

import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Features from '@/components/landing/features';
import Link from 'next/link';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Palette,
  Package,
  CreditCard,
  Users,
  Search,
  Smartphone,
  Clock,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Sparkles,
      title: 'ذكاء اصطناعي متقدم',
      description: 'أضف صور منتجاتك فقط وسيقوم الذكاء الاصطناعي بإنشاء الأوصاف والتصنيفات تلقائياً',
      color: 'from-purple-500 to-pink-600',
      features: ['توليد أوصاف احترافية', 'تصنيف ذكي للمنتجات', 'تحسين SEO تلقائي']
    },
    {
      icon: Palette,
      title: 'تصاميم احترافية',
      description: 'قوالب جاهزة وقابلة للتخصيص بالكامل لتناسب هوية علامتك التجارية',
      color: 'from-blue-500 to-indigo-600',
      features: ['قوالب متعددة', 'تخصيص كامل', 'تصميم متجاوب']
    },
    {
      icon: CreditCard,
      title: 'بوابات دفع متعددة',
      description: 'دعم لجميع بوابات الدفع الرئيسية في المنطقة العربية',
      color: 'from-emerald-500 to-teal-600',
      features: ['مدى', 'Apple Pay', 'STC Pay', 'Visa/Mastercard']
    },
    {
      icon: BarChart3,
      title: 'تحليلات متقدمة',
      description: 'رؤى تفصيلية حول أداء متجرك وسلوك العملاء',
      color: 'from-amber-500 to-orange-600',
      features: ['تقارير المبيعات', 'تحليل الزوار', 'توقعات ذكية']
    },
    {
      icon: Shield,
      title: 'أمان عالي المستوى',
      description: 'حماية متقدمة لبيانات متجرك وعملائك مع تشفير SSL',
      color: 'from-red-500 to-rose-600',
      features: ['تشفير SSL', 'حماية DDoS', 'نسخ احتياطي']
    },
    {
      icon: Globe,
      title: 'وصول عالمي',
      description: 'بيع منتجاتك في أي مكان في العالم مع دعم متعدد اللغات',
      color: 'from-cyan-500 to-blue-600',
      features: ['متعدد اللغات', 'عملات متعددة', 'شحن دولي']
    },
  ];

  const additionalFeatures = [
    { icon: Package, title: 'إدارة المخزون', desc: 'تتبع المخزون تلقائياً' },
    { icon: Users, title: 'إدارة العملاء', desc: 'قاعدة بيانات شاملة' },
    { icon: Search, title: 'تحسين SEO', desc: 'ظهور أفضل في البحث' },
    { icon: Smartphone, title: 'تطبيق موبايل', desc: 'إدارة من أي مكان' },
    { icon: Clock, title: 'دعم 24/7', desc: 'فريق دعم متواصل' },
    { icon: Zap, title: 'سرعة فائقة', desc: 'تحميل سريع للصفحات' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-20 right-10 w-72 h-72 blob blob-blue"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 blob blob-purple"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="badge-gradient mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="mr-2">مميزات قوية</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              كل ما تحتاجه لبناء
              <span className="gradient-text"> متجر ناجح</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              أدوات متقدمة وميزات احترافية تساعدك على إنشاء وإدارة متجرك الإلكتروني بسهولة
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="btn-primary text-lg flex items-center gap-2">
                  ابدأ الآن مجاناً
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="btn-secondary text-lg">
                  عرض الأسعار
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Features Component */}
      <Features />

      {/* Main Features Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              مميزات رئيسية
            </h2>
            <p className="text-xl text-gray-600">
              اكتشف الأدوات التي ستساعدك على النجاح
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, i) => (
              <div 
                key={i} 
                className="card-premium p-8 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              والمزيد من المميزات
            </h2>
            <p className="text-xl text-gray-600">
              أدوات إضافية لتحسين تجربتك
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {additionalFeatures.map((feature, i) => (
              <div 
                key={i} 
                className="card-premium p-6 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
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


      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-6 animate-fade-in-up">
              جاهز لتجربة هذه المميزات؟
            </h2>
            <p className="text-xl text-blue-100 mb-10 animate-fade-in-up delay-200">
              ابدأ الآن مجاناً واكتشف كيف يمكن لتجارتك مساعدتك في النجاح
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-2">
                  ابدأ الآن مجاناً
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
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
