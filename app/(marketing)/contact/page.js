'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, Sparkles, ArrowLeft, Headphones } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-brand-950 text-white overflow-hidden">
      <Navbar />

      {/* Header / Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-700/5 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <ScrollReveal animation="animate-fade-in-up" threshold={0.01}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6 backdrop-blur-sm">
                <Headphones className="h-4 w-4 text-gold-400" />
                <span className="text-sm font-bold text-brand-300">متاحون دائماً لمساعدتك</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">تواصل معنا</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                نحن هنا للإجابة على استفساراتك ودعمك في كل خطوة. لا تتردد في مراسلتنا أو الاتصال بنا.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Grid */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info Sidebar */}
            <ScrollReveal animation="animate-fade-in-right" className="space-y-6">
              <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-7 hover:border-brand-700/30 transition-all">
                <div className="w-12 h-12 bg-brand-700/20 rounded-2xl flex items-center justify-center mb-5 border border-brand-700/20">
                  <Mail className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-500 text-sm mb-4">للاستفسارات العامة والتقنية</p>
                <a href="mailto:support@tejaratk.com" className="text-lg font-bold text-brand-300 hover:text-gold-400 transition-colors">
                  support@tejaratk.com
                </a>
              </div>

              <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-7 hover:border-emerald-700/30 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/20">
                  <MessageCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">واتساب</h3>
                <p className="text-gray-500 text-sm mb-4">للدعم السريع والمباشر</p>
                <a href="https://wa.me/96812345678" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  +968 1234 5678
                </a>
              </div>

              <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-7 hover:border-gold-700/30 transition-all">
                <div className="w-12 h-12 bg-gold-600/10 rounded-2xl flex items-center justify-center mb-5 border border-gold-600/20">
                  <Phone className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">الهاتف</h3>
                <p className="text-gray-500 text-sm mb-4">من الأحد إلى الخميس، 9ص - 5م</p>
                <a href="tel:+96812345678" className="text-lg font-bold text-gray-300 hover:text-white transition-colors" dir="ltr">
                  +968 1234 5678
                </a>
              </div>

              <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-7 hover:border-walnut-700/30 transition-all">
                <div className="w-12 h-12 bg-walnut-600/10 rounded-2xl flex items-center justify-center mb-5 border border-walnut-600/20">
                  <MapPin className="h-6 w-6 text-walnut-400" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">العنوان</h3>
                <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                  مسقط، سلطنة عمان<br />
                  شارع السلطان قابوس، قلب العاصمة
                </p>
              </div>
            </ScrollReveal>

            {/* Contact Form Main */}
            <ScrollReveal animation="animate-fade-in-left" className="lg:col-span-2">
              <div className="bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-8 lg:p-12 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700/5 rounded-full blur-[100px]"></div>
                
                <h2 className="text-3xl font-black text-white mb-8">أرسل لنا رسالة</h2>
                
                {success ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-2xl">
                        <Send className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-gray-500 text-lg mb-8">سنقوم بالرد عليك عبر بريدك الإلكتروني في أقرب وقت ممكن.</p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-brand-400 font-bold hover:text-gold-400 transition-colors flex items-center gap-2 mx-auto"
                    >
                        إرسال رسالة أخرى
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-1">الاسم الكامل</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none"
                          placeholder="أدخل اسمك الكريم"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-1">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-1">الموضوع</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none"
                        placeholder="ما الذي تود مناقشته؟"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-1">الرسالة</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all outline-none resize-none"
                        placeholder="اكتب تفاصيل استفسارك هنا..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-brand-700 to-brand-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-700/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          إرسال الرسالة
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
