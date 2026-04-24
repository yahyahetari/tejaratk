import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ArrowLeft, Cookie, Info } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

export const metadata = {
  title: 'سياسة ملفات تعريف الارتباط | تجارتك',
  description: 'سياسة استخدام ملفات تعريف الارتباط (Cookies) في منصة تجارتك',
};

export default function CookiesPage() {
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
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">سياسة ملفات تعريف الارتباط</h1>
            <p className="text-gray-500 font-bold">آخر تحديث: يناير 2026</p>
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
                    <div className="w-10 h-10 rounded-xl bg-gold-600/10 flex items-center justify-center border border-gold-600/20">
                        <Cookie className="h-5 w-5 text-gold-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white">ما هي ملفات تعريف الارتباط؟</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg">
                    ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمات أفضل.
                </p>
              </section>

              <section className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-8">أنواع ملفات تعريف الارتباط التي نستخدمها</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'ضرورية', desc: 'لعمل الموقع وتأمين الجلسات' },
                    { title: 'تحليلية', desc: 'لفهم كيفية تحسين الأداء' },
                    { title: 'وظيفية', desc: 'لتذكر تفضيلاتك كاللغة' },
                    { title: 'تسويقية', desc: 'لعرض ما يهمك من عروض' }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <h3 className="font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="relative z-10 py-8 px-8 bg-brand-900/20 rounded-3xl border border-brand-800/30 flex items-start gap-4">
                <Info className="h-6 w-6 text-brand-400 flex-shrink-0 mt-1" />
                <div>
                    <h2 className="text-xl font-black text-white mb-2">إدارة الملفات</h2>
                    <p className="text-gray-400 leading-relaxed">
                        يمكنك دائماً التحكم في تعطيل أو تفعيل ملفات تعريف الارتباط من خلال إعدادات متصفحك الخاص، ولكن قد يؤثر ذلك على عمل بعض ميزات المنصة.
                    </p>
                </div>
              </section>

              <section className="relative z-10 pt-8 border-t border-white/5 text-center">
                <h2 className="text-2xl font-black text-white mb-6">للتواصل</h2>
                <a href="mailto:privacy@tejaratk.com" className="px-10 py-4 bg-white/5 text-gray-300 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black inline-block">
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
