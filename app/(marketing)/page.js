'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  BarChart3,
  Smartphone,
  Shield,
  Zap,
  Users,
  Play,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Layers,
  Star,
  ChevronLeft,
  Store,
  CreditCard,
  Truck,
  Settings,
  Eye,
  MousePointerClick
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Features from '@/components/landing/features';
import Pricing from '@/components/landing/pricing';
import About from '@/components/landing/about';
import ScrollReveal from '@/components/ui/scroll-reveal';

// Counter animation hook
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

function StatCard({ stat, i }) {
  const counterHook = useCountUp(stat.number, 1500);
  return (
    <ScrollReveal
      delay={i * 100}
      threshold={0.2}
    >
      <div
        ref={counterHook.ref}
        className="group relative bg-white/[0.03] rounded-2xl p-5 border border-white/5 hover:border-white/10 shadow-lg shadow-black/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
        <div className="relative z-10 text-center">
          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white mb-0.5" dir="ltr">
            {stat.prefix}{counterHook.count}{stat.suffix}
          </div>
          <div className="text-xs md:text-sm text-gray-500 font-semibold">{stat.label}</div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: 49, prefix: '$', label: 'سعر البداية', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
    { number: 7, prefix: '', suffix: '-3', label: 'أيام التسليم', icon: Clock, color: 'from-blue-500 to-indigo-600' },
    { number: 24, prefix: '', suffix: '/7', label: 'دعم فني متواصل', icon: Headphones, color: 'from-purple-500 to-pink-600' },
    { number: 100, prefix: '', suffix: '%', label: 'رضا العملاء', icon: Star, color: 'from-amber-500 to-orange-600' },
  ];

  const services = [
    {
      icon: Palette,
      title: 'تصاميم احترافية',
      description: 'تصاميم عصرية مصممة خصيصاً لهوية متجرك تجمع بين الجمال والوظائف العملية لجذب عملائك',
      gradient: 'from-violet-500 to-purple-600',
      stat: 'مخصصة 100%',
    },
    {
      icon: Search,
      title: 'تحسين محركات البحث',
      description: 'ظهور أقوى في Google ومحركات البحث لزيادة عدد الزوار والعملاء المحتملين لمتجرك',
      gradient: 'from-blue-500 to-cyan-600',
      stat: 'SEO متقدم',
    },
    {
      icon: Shield,
      title: 'استضافة آمنة وسريعة',
      description: 'خوادم عالمية سريعة وموثوقة مع شهادة SSL وحماية متقدمة ضد الاختراقات',
      gradient: 'from-emerald-500 to-teal-600',
      stat: '99.9% uptime',
    },
    {
      icon: Zap,
      title: 'أداء فائق السرعة',
      description: 'تحميل خاطف للصفحات يقلل معدل الارتداد ويحسن تجربة التصفح لعملائك',
      gradient: 'from-amber-500 to-orange-600',
      stat: '< 2 ثانية',
    },
  ];

  const aiFeatures = [
    {
      icon: Sparkles,
      title: 'إضافة ذكية للمنتجات',
      description: 'ارفع صورة المنتج وسيقوم الذكاء الاصطناعي بكتابة الوصف وتحديد التصنيف تلقائياً',
      stat: '90%',
      statLabel: 'توفير في الوقت',
    },
    {
      icon: Package,
      title: 'تصنيف وتوصيف تلقائي',
      description: 'أوصاف احترافية ومحسّنة لمحركات البحث يتم إنشاؤها تلقائياً لكل منتج',
      stat: '99%',
      statLabel: 'دقة في التصنيف',
    },
    {
      icon: Target,
      title: 'تحليلات ذكية',
      description: 'رؤى وتقارير متقدمة حول سلوك العملاء والمبيعات لاتخاذ قرارات أفضل',
      stat: '3x',
      statLabel: 'تحسين في المبيعات',
    },
  ];

  const howItWorks = [
    { icon: CreditCard, title: 'اختر باقتك', description: 'اختر الباقة المناسبة لاحتياجات متجرك' },
    { icon: Settings, title: 'أعد إعداد متجرك', description: 'أضف منتجاتك وخصص تصميم متجرك' },
    { icon: Globe, title: 'انطلق للعالم', description: 'متجرك جاهز لاستقبال العملاء والطلبات' },
    { icon: TrendingUp, title: 'نمّي أعمالك', description: 'تابع الأداء وطوّر مبيعاتك باستمرار' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden text-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════ */}
      {/*                  HERO SECTION                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0a0a0f] to-[#0a0a0f]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <ScrollReveal animation="animate-fade-in-right" className="text-center lg:text-right space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="text-sm font-bold text-blue-300">
                  منصتك المتكاملة للتجارة الإلكترونية
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black leading-[1.15] tracking-tight">
                <span className="block text-white">أنشئ متجرك</span>
                <span className="block text-white">الإلكتروني</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  باحترافية وسهولة
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                منصة متكاملة تمنحك كل الأدوات لبناء وإدارة متجرك الإلكتروني — من التصميم الاحترافي إلى الذكاء الاصطناعي
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {[
                  { text: 'تصميم مخصص', icon: Palette },
                  { text: 'ذكاء اصطناعي', icon: Sparkles },
                  { text: 'دعم 24/7', icon: Headphones },
                  { text: 'أمان متقدم', icon: Shield },
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="group px-4 py-2 bg-white/5 rounded-xl text-sm font-semibold text-gray-400 border border-white/5 flex items-center gap-2 hover:bg-white/10 hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
                  >
                    <tag.icon className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    {tag.text}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/register">
                  <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    ابدأ الآن مجاناً
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1.5 transition-transform" />
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-gray-300 rounded-2xl font-bold text-lg border border-white/10 hover:border-blue-500/40 hover:text-white hover:bg-white/10 shadow-sm transition-all flex items-center justify-center gap-3">
                    <DollarSign className="h-5 w-5" />
                    استعرض الباقات
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Hero Visual - Dashboard Mockup */}
            <ScrollReveal animation="animate-fade-in-left" delay={300} className="relative">
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-[#12121a] rounded-3xl shadow-2xl shadow-black/50 border border-white/5 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16162a] px-6 py-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <Store className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-300 font-bold text-sm">لوحة تحكم متجرك</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-5 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/10">
                        <p className="text-xs text-blue-400 font-semibold">المبيعات</p>
                        <p className="text-xl font-black text-white">$12,450</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-bold">+23%</span>
                        </div>
                      </div>
                      <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/10">
                        <p className="text-xs text-emerald-400 font-semibold">الطلبات</p>
                        <p className="text-xl font-black text-white">284</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-bold">+18%</span>
                        </div>
                      </div>
                      <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/10">
                        <p className="text-xs text-purple-400 font-semibold">الزوار</p>
                        <p className="text-xl font-black text-white">5,832</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Eye className="h-3 w-3 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-bold">+45%</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-300">إيرادات الأسبوع</span>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">+32%</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/60 to-indigo-500/80 hover:from-blue-500 hover:to-indigo-400 transition-all" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {['سبت', 'أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'].map((d, i) => (
                          <span key={i} className="text-[10px] text-gray-600 flex-1 text-center">{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="space-y-2">
                      {[
                        { name: 'طلب #1024', status: 'مكتمل', color: 'text-emerald-400 bg-emerald-500/10', amount: '$89' },
                        { name: 'طلب #1023', status: 'قيد التجهيز', color: 'text-blue-400 bg-blue-500/10', amount: '$156' },
                      ].map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-sm font-bold text-gray-300">{order.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${order.color}`}>{order.status}</span>
                            <span className="text-sm font-black text-white">{order.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-[#1a1a2e]/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl animate-float border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium">نمو المبيعات</p>
                      <p className="text-lg font-black text-white">+127%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[#1a1a2e]/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-xl animate-float-delayed border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium">عملاء جدد اليوم</p>
                      <p className="text-lg font-black text-white">+48</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -left-8 bg-[#1a1a2e]/90 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-lg animate-float border border-white/10 hidden lg:block">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold text-gray-300">AI جاهز</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*            STATS BENTO SECTION                  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-6 relative -mt-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*               FEATURES SECTION                  */}
      {/* ═══════════════════════════════════════════════ */}
      <Features />

      {/* ═══════════════════════════════════════════════ */}
      {/*          SERVICES BENTO SECTION                 */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="services" className="py-20 relative">
        <div className="absolute inset-0 bg-[#0d0d16]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="container-custom relative z-10">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-5 shadow-lg shadow-blue-500/20">
                <Layers className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">خدماتنا</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
                كل ما تحتاجه لنجاح<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">متجرك الإلكتروني</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                أدوات وخدمات متكاملة مصممة لمساعدتك في بناء وتنمية تجارتك الإلكترونية
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <ScrollReveal
                key={i}
                delay={i * 100}
                threshold={0.1}
              >
                <div
                  className="group relative bg-white/[0.03] rounded-2xl p-7 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg">{service.stat}</span>
                      <Link href="/features" className="inline-flex items-center text-blue-400 font-semibold hover:gap-3 gap-2 transition-all text-sm opacity-0 group-hover:opacity-100">
                        المزيد
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*            AI FEATURES SECTION                  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0f]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px]"></div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <ScrollReveal animation="animate-fade-in-right" className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-5 shadow-lg shadow-purple-500/20">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">ذكاء اصطناعي متقدم</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
                تقنيات ذكية توفر<br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">الوقت والجهد</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                استفد من قوة الذكاء الاصطناعي لأتمتة المهام المتكررة وتحسين أداء متجرك بشكل مستمر
              </p>

              <div className="space-y-4">
                {aiFeatures.map((feature, i) => (
                  <ScrollReveal
                    key={i}
                    delay={i * 150}
                    animation="animate-fade-in-up"
                    threshold={0.1}
                  >
                    <div
                      className="group flex gap-4 p-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-purple-500/20 hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{feature.stat}</div>
                        <div className="text-xs text-gray-600">{feature.statLabel}</div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            {/* AI Visual Side */}
            <ScrollReveal animation="animate-fade-in-left" delay={300} className="order-1 lg:order-2">
              <div className="relative">
                <div className="bg-[#12121a] rounded-3xl p-6 shadow-2xl shadow-black/50 border border-white/5">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span className="text-purple-300 font-bold text-sm">معالجة AI للمنتج</span>
                  </div>

                  <div className="bg-purple-500/5 rounded-2xl p-4 mb-4 border border-purple-500/10">
                    <div className="flex items-center justify-center gap-6">
                      <div className="w-20 h-20 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/10">
                        <ShoppingCart className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-green-400 text-xs font-bold">جاري التحليل...</span>
                        </div>
                        <div className="h-2 bg-purple-500/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-shimmer" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <span className="text-gray-600 text-xs block mb-1">العنوان المقترح</span>
                      <span className="text-gray-200 text-sm font-semibold">حقيبة يد جلدية فاخرة - تصميم عصري</span>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <span className="text-gray-600 text-xs block mb-1">التصنيف</span>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-500/15 text-purple-300 px-2 py-1 rounded-full border border-purple-500/10">حقائب</span>
                        <span className="text-xs bg-pink-500/15 text-pink-300 px-2 py-1 rounded-full border border-pink-500/10">جلد طبيعي</span>
                        <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/10">نسائي</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                      <span className="text-gray-600 text-xs block mb-1">الوصف</span>
                      <span className="text-gray-400 text-xs leading-relaxed">حقيبة يد أنيقة مصنوعة من الجلد الطبيعي الفاخر بتصميم عصري يناسب جميع المناسبات...</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*         HOW IT WORKS SECTION                    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[#0d0d16]"></div>
        <div className="container-custom relative z-10">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-5 shadow-lg shadow-amber-500/20">
                <MousePointerClick className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">كيف يعمل</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
                أربع خطوات نحو<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">متجرك الناجح</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {howItWorks.map((step, i) => (
              <ScrollReveal
                key={i}
                delay={i * 100}
                threshold={0.1}
              >
                <div
                  className={`group relative text-center p-6 rounded-2xl transition-all duration-500 cursor-pointer h-full ${activeStep === i
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 scale-105'
                    : 'bg-white/[0.03] border border-white/5 hover:border-white/10 hover:-translate-y-1'
                    }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-4 flex items-center justify-center text-sm font-black ${activeStep === i ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                    {i + 1}
                  </div>

                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all ${activeStep === i
                    ? 'bg-white/20 shadow-lg'
                    : 'bg-white/[0.03] border border-white/5 group-hover:scale-110'
                    }`}>
                    <step.icon className={`h-7 w-7 ${activeStep === i ? 'text-white' : 'text-blue-400'}`} />
                  </div>
                  <h3 className={`font-bold mb-2 ${activeStep === i ? 'text-white' : 'text-gray-300'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${activeStep === i ? 'text-blue-100' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*            PORTFOLIO / WORK SECTION             */}
      {/* ═══════════════════════════════════════════════ */}
      <section id="work" className="py-20 relative">
        <div className="absolute inset-0 bg-[#0a0a0f]"></div>
        <div className="container-custom relative z-10">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-5 shadow-lg shadow-emerald-500/20">
                <Package className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">ما نقدمه</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                أدوات ونتائج <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ملموسة</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {/* Large Card */}
            <ScrollReveal animation="animate-fade-in-up" className="md:col-span-2">
              <div className="group bg-[#12121a] rounded-3xl overflow-hidden shadow-xl shadow-black/30 border border-white/5 hover:border-white/10 transition-all h-full">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">لوحة تحكم متقدمة</h3>
                      <p className="text-gray-500 text-sm">أدِر متجرك بالكامل من مكان واحد</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {['المبيعات', 'الطلبات', 'الزوار'].map((title, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                        <p className="text-gray-600 text-xs mb-1">{title}</p>
                        <p className="text-white font-black text-lg">{['$4.2K', '156', '2.8K'][i]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end gap-1 h-24">
                    {[30, 50, 35, 70, 45, 85, 60, 90, 55, 75, 65, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-600/30 to-blue-400/50 group-hover:from-blue-500/40 group-hover:to-blue-300/60 transition-all" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Small Card 1 */}
            <ScrollReveal animation="animate-fade-in-up" delay={200}>
              <div className="group bg-white/[0.03] rounded-3xl p-7 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">متجر متجاوب</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  متجرك يعمل بشكل مثالي على جميع الأجهزة — هاتف، تابلت، وحاسوب
                </p>
                <div className="flex gap-2">
                  {['📱', '💻', '🖥️'].map((emoji, i) => (
                    <span key={i} className="text-2xl">{emoji}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Small Card 2 */}
            <ScrollReveal animation="animate-fade-in-up" delay={300}>
              <div className="group bg-white/[0.03] rounded-3xl p-7 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">بوابات دفع</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  دعم لأشهر بوابات الدفع العالمية والمحلية
                </p>
              </div>
            </ScrollReveal>

            {/* Wide CTA Card */}
            <ScrollReveal animation="animate-fade-in-up" delay={400} className="md:col-span-2">
              <div className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl shadow-blue-600/10 transition-all text-white relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">جاهز لإطلاق متجرك؟</h3>
                    <p className="text-blue-100 leading-relaxed mb-5">
                      ابدأ اليوم واحصل على متجر إلكتروني احترافي يعكس هوية علامتك التجارية
                    </p>
                    <Link href="/register">
                      <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                        ابدأ الآن
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*              ABOUT SECTION                      */}
      {/* ═══════════════════════════════════════════════ */}
      <About />

      {/* ═══════════════════════════════════════════════ */}
      {/*              PRICING SECTION                    */}
      {/* ═══════════════════════════════════════════════ */}
      <Pricing />

      {/* ═══════════════════════════════════════════════ */}
      {/*               CTA SECTION                       */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px]"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-blue-300">ابدأ رحلتك اليوم</span>
            </div>

            <ScrollReveal animation="animate-fade-in-up" threshold={0.1}>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
                جاهز لتحويل فكرتك<br />
                إلى <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">متجر ناجح</span>؟
              </h2>

              <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
                انضم إلى التجار الذين يثقون بمنصتنا لبناء متاجرهم الإلكترونية
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <button className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3">
                    ابدأ الآن مجاناً
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1.5 transition-transform" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="w-full sm:w-auto px-10 py-4 border border-white/10 text-gray-300 rounded-2xl font-bold text-lg hover:bg-white/5 hover:border-white/20 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center gap-3">
                    تواصل معنا
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                دفع آمن
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                تفعيل سريع
              </span>
              <span className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                دعم مستمر
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}