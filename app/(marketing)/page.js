'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  Check, 
  Clock, 
  DollarSign, 
  Headphones, 
  Palette, 
  Search, 
  Package, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Smartphone,
  Shield,
  Zap,
  Globe,
  Users,
  Star,
  ChevronRight,
  Play,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Features from '@/components/landing/features';
import Pricing from '@/components/landing/pricing';
import About from '@/components/landing/about';

export default function LandingPage() {
  const stats = [
    { number: '$49', label: 'سعر البداية', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
    { number: '3-7', label: 'أيام التسليم', icon: Clock, color: 'from-blue-500 to-indigo-600' },
    { number: '8 - 8', label: 'دعم فني متواصل', icon: Headphones, color: 'from-purple-500 to-pink-600' },
  ];

  const services = [
    {
      icon: Palette,
      title: 'تصاميم المتاجر',
      description: 'تصاميم احترافية تجمع بين الإبداع والوظائف لإنشاء متاجر إلكترونية جذابة وسهلة الاستخدام',
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
    },
    {
      icon: Search,
      title: 'تحسين محركات البحث',
      description: 'تحسين المتجر الإلكتروني لزيادة ظهوره في نتائج محركات البحث وزيادة الزوار',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Shield,
      title: 'استضافة آمنة',
      description: 'خدمات استضافة موثوقة وسريعة تضمن أن متجرك يعمل دائماً بأمان تام',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      icon: Zap,
      title: 'أداء فائق السرعة',
      description: 'تقنيات متقدمة لضمان سرعة تحميل فائقة وتجربة مستخدم سلسة',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
    },
  ];

  const aiFeatures = [
    {
      icon: Sparkles,
      title: 'إضافة ذكية بالصور',
      description: 'فقط أضف صور منتجاتك وسيقوم الذكاء الاصطناعي بإنشاء الوصف والتصنيف تلقائياً',
      stat: '90%',
      statLabel: 'توفير الوقت',
    },
    {
      icon: Package,
      title: 'تصنيف تلقائي',
      description: 'توليد أوصاف احترافية وتصنيف ذكي للمنتجات بدقة عالية',
      stat: '99%',
      statLabel: 'دقة التصنيف',
    },
    {
      icon: Target,
      title: 'تحليلات متقدمة',
      description: 'رؤى ذكية حول سلوك العملاء وتوقعات المبيعات',
      stat: '3x',
      statLabel: 'زيادة المبيعات',
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-20 right-10 w-72 h-72 blob blob-blue"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 blob blob-purple"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full border border-blue-200/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700">
                منصة التجارة الإلكترونية الأولى عربياً خلال السنوات القادمة
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="block text-gray-900">حوّل فكرتك إلى</span>
                <span className="block gradient-text mt-3">
                  متجر ناجح
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                منصة متكاملة لإنشاء وإدارة متجرك الإلكتروني بكل سهولة واحترافية. 
                ابدأ رحلتك في عالم التجارة الإلكترونية اليوم.
              </p>

              {/* Features Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {['تصميم احترافي', 'ذكاء اصطناعي', 'دعم مستمر', 'أمان عالي'].map((feature, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2 hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <Check className="h-4 w-4 text-blue-600" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/register">
                  <button className="group w-full sm:w-auto btn-primary flex items-center justify-center gap-3 text-lg">
                    ابدأ الآن مجاناً
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-3 text-lg">
                    <Play className="h-5 w-5" />
                    شاهد العرض التوضيحي
                  </button>
                </Link>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-fade-in delay-300">
              <div className="relative">
                {/* Main Card */}
                <div className="glass rounded-3xl p-2 shadow-2xl shadow-blue-500/10">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-hidden">
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-lg px-4 py-1.5 text-gray-400 text-sm text-center">
                        tejaratk.com/store
                      </div>
                    </div>
                    {/* Content Preview */}
                    <div className="space-y-4">
                      <div className="h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-blue-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 h-10 bg-blue-600 rounded-lg"></div>
                        <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">المبيعات اليوم</p>
                      <p className="text-lg font-bold text-gray-900">+127%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">عملاء جدد</p>
                      <p className="text-lg font-bold text-gray-900">+48</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="card-premium p-6 text-center group animate-fade-in-up"
                style={{ animationDelay: `${i * 100 + 400}ms` }}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Services Section */}
      <section id="services" className="section-padding bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <div className="badge-gradient mb-6">
              <Target className="h-4 w-4" />
              <span className="mr-2">خدماتنا المميزة</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              حلول متكاملة لنجاح
              <span className="gradient-text"> متجرك الإلكتروني</span>
            </h2>
            <p className="text-xl text-gray-600">
              نقدم لك كل ما تحتاجه لبناء وتنمية متجرك الإلكتروني بنجاح
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="group card-premium p-8 hover:border-blue-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <Link href="/features" className="inline-flex items-center text-blue-600 font-semibold hover:gap-3 gap-2 transition-all">
                  اعرف المزيد
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full border border-purple-200/50 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">مدعوم بالذكاء الاصطناعي</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              تقنيات متقدمة توفر عليك
              <span className="gradient-text"> الوقت والجهد</span>
            </h2>
            <p className="text-xl text-gray-600">
              استفد من قوة الذكاء الاصطناعي لأتمتة المهام المتكررة وتحسين أداء متجرك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, i) => (
              <div
                key={i}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative card-gradient h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-blue-100 leading-relaxed mb-6">{feature.description}</p>
                    
                    <div className="pt-6 border-t border-white/20">
                      <div className="text-4xl font-black">{feature.stat}</div>
                      <div className="text-blue-200 text-sm">{feature.statLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Work Section */}
      <section id="work" className="section-padding bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <div className="badge-warning mb-6">
              <Package className="h-4 w-4" />
              <span className="mr-2">نماذج أعمالنا</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
              مشاريع حقيقية ونتائج
              <span className="gradient-text"> ملموسة</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group card-premium overflow-hidden animate-fade-in-up">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="h-20 w-20 text-blue-400/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">لوحة التحكم</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  نظام إدارة شامل لمراجعة المبيعات والطلبات والمنتجات بلمحة واحدة مع تقارير تفصيلية
                </p>
              </div>
            </div>

            <div className="group card-premium overflow-hidden animate-fade-in-up delay-200">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="h-20 w-20 text-purple-400/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">متجر متجاوب</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  متجر إلكتروني متكامل يعمل بشكل مثالي على جميع الأجهزة مع تصميم عصري وسهولة استخدام
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 animate-fade-in-up">
              جاهز لبدء رحلتك في التجارة الإلكترونية؟
            </h2>
            <p className="text-xl text-blue-100 mb-10 animate-fade-in-up delay-200">
              انضم إلى آلاف التجار الناجحين وابدأ متجرك الإلكتروني اليوم
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link href="/register">
                <button className="group w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3">
                  ابدأ الآن مجاناً
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
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
