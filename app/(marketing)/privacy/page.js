import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ArrowLeft, Shield, Eye, Lock, FileCheck } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

export const metadata = {
  title: 'سياسة الخصوصية | تجارتك',
  description: 'سياسة الخصوصية وحماية البيانات الشخصية في منصة تجارتك - التزامنا بحماية بياناتك وفقاً للمعايير الدولية',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-950 text-white overflow-hidden">
      <Navbar />
      
      {/* Header section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.01}>
            <Link href="/" className="inline-flex items-center gap-2 text-brand-400 hover:text-gold-400 mb-6 font-bold transition-all group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              العودة للرئيسية
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">سياسة الخصوصية</h1>
            <p className="text-gray-500 font-bold">آخر تحديث: فبراير 2026</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main content body */}
      <section className="pb-24">
        <div className="container-custom max-w-4xl mx-auto">
          <ScrollReveal animation="animate-fade-in-up">
            <div className="bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-8 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700/5 rounded-full blur-[100px]"></div>

              <section className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Shield className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white">1. مقدمة</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg">
                    نحن في منصة تجارتك نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وتخزين وحماية المعلومات التي تقدمها لنا عند استخدام خدماتنا.
                </p>
              </section>

              <section className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-8">2. المعلومات التي نجمعها</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-700/20 transition-all">
                    <h3 className="font-bold text-white mb-3 text-lg">أ. معلومات تقدمها مباشرة</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">الاسم، البريد الإلكتروني، رقم الهاتف، ومعلومات النشاط التجاري التي يتم تقديمها عند التسجيل.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-700/20 transition-all">
                    <h3 className="font-bold text-white mb-3 text-lg">ب. معلومات نجمعها تلقائياً</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">بيانات الاستخدام، سجلات الدخول، نوع المتصفح، وعنوان الـ IP لتحسين تجربة التصفح.</p>
                  </div>
                </div>
              </section>

              <section className="relative z-10 py-8 px-8 bg-brand-900/20 rounded-3xl border border-brand-800/30">
                <h2 className="text-2xl font-black text-white mb-6">3. حماية البيانات</h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                    نتخذ إجراءات أمنية صارمة تشمل تشفير البيانات (TLS/SSL)، وجدران حماية متقدمة، ومراقبة أمنية مستمرة لضمان سلامة بياناتك ومنع الوصول غير المصرح به.
                </p>
              </section>

              <section className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-6">4. حقوقك</h2>
                <div className="space-y-4">
                  {[
                    'حق الوصول لبياناتك الشخصية',
                    'حق تصحيح المعلومات غير الدقيقة',
                    'حق طلب حذف البيانات نهائياً',
                    'حق الاعتراض على المعالجة لأغراض التسويق'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                      <FileCheck className="h-5 w-5 text-gold-400" />
                      <span className="text-gray-300 font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="relative z-10 pt-8 border-t border-white/5 text-center">
                <h2 className="text-2xl font-black text-white mb-6">للتواصل بشأن الخصوصية</h2>
                <a href="mailto:privacy@tejaratk.com" className="inline-block px-10 py-4 bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  privacy@tejaratk.com
                </a>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
