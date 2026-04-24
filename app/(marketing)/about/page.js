import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import About from '@/components/landing/about';
import Link from 'next/link';
import {
  Heart,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  ArrowLeft
} from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'شغف بالتميز',
      description: 'نسعى دائماً لتقديم أفضل الحلول والخدمات لعملائنا',
      color: 'from-brand-600 to-brand-700'
    },
    {
      icon: Users,
      title: 'العميل أولاً',
      description: 'نضع احتياجات عملائنا في صميم كل قرار نتخذه',
      color: 'from-gold-600 to-gold-700'
    },
    {
      icon: Zap,
      title: 'الابتكار المستمر',
      description: 'نستثمر في أحدث التقنيات لتقديم حلول متطورة',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Shield,
      title: 'الثقة والأمان',
      description: 'نحمي بيانات عملائنا بأعلى معايير الأمان',
      color: 'from-brand-700 to-brand-800'
    },
  ];

  return (
    <div className="min-h-screen bg-brand-950 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-700/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.01}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span className="text-sm font-bold text-brand-300">قصتنا ورؤيتنا</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              أساعدك على بناء <br />
              <span className="bg-gradient-to-r from-brand-400 via-gold-400 to-brand-300 bg-clip-text text-transparent">مستقبل تجارتك</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                أنا مطور من المتحمسين للتكنولوجيا والتجارة الإلكترونية، أعمل على تمكين رواد الأعمال من تحقيق أحلامهم وبناء متاجر تليق بطموحاتهم.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* About Component (Integrated) */}
      <About />

      {/* Values Section */}
      <section className="py-20 bg-brand-900/10">
        <div className="container-custom">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700/10 rounded-full border border-brand-700/20 mb-4">
                <Award className="h-4 w-4 text-gold-400" />
                <span className="text-sm font-bold text-brand-400">قيمنا الجوهرية</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">المبادئ التي توجهنا</h2>
              <p className="text-gray-500">نؤمن بالتميز والابتكار في كل تفصيلة تقنية نقدمها</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group bg-white/[0.03] rounded-3xl p-8 text-center border border-white/5 hover:border-brand-700/30 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors uppercase tracking-tight">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Collaboration CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900"></div>
        <div className="container-custom relative z-10 text-center">
          <ScrollReveal animation="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">انضم إلى عائلة تجارتك اليوم</h2>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">ابدأ رحلتك معنا وكن جزءاً من قصة نجاح ملهمة في عالم التجارة الرقمية</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="group px-10 py-4 bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3">
                  ابدأ الآن مجاناً
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1.5 transition-transform" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-10 py-4 border-2 border-white/10 text-gray-300 rounded-2xl font-bold text-lg hover:bg-white/5 hover:text-white transition-all">
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
