'use client';

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
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'شغف بالتميز',
      description: 'نسعى دائماً لتقديم أفضل الحلول والخدمات لعملائنا',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Users,
      title: 'العميل أولاً',
      description: 'نضع احتياجات عملائنا في صميم كل قرار نتخذه',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'الابتكار المستمر',
      description: 'نستثمر في أحدث التقنيات لتقديم حلول متطورة',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'الثقة والأمان',
      description: 'نحمي بيانات عملائنا بأعلى معايير الأمان',
      color: 'from-emerald-500 to-teal-600'
    },
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
              <span className="mr-2">قصتي</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              أساعدك على بناء
              <span className="gradient-text"> مستقبل تجارتك</span>
            </h1>
            <p className="text-xl text-gray-600">
              أنا مطور من المتحمسين للتكنولوجيا والتجارة الإلكترونية، أعمل على تمكين رواد الأعمال من تحقيق أحلامهم
            </p>
          </div>
        </div>
      </section>


      {/* About Component */}
      <About />



      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <div className="badge-primary mb-6">
              <Award className="h-4 w-4" />
              <span className="mr-2">قيمنا</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              المبادئ التي توجهنا
            </h2>
            <p className="text-xl text-gray-600">
              قيم أساسية نلتزم بها في كل ما نقوم به
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="card-premium p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
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
              انضم إلى عائلة تجارتك اليوم
            </h2>
            <p className="text-xl text-blue-100 mb-10 animate-fade-in-up delay-200">
              ابدأ رحلتك معنا وكن جزءاً من قصة نجاحنا
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
