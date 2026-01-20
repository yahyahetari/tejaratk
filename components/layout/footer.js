'use client';

import Link from 'next/link';
import { 
  ShoppingCart, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  ArrowUp,
  Heart,
  Sparkles,
  Send
} from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    product: {
      title: 'المنتج',
      links: [
        { name: 'المميزات', href: '/features' },
        { name: 'الأسعار', href: '/pricing' },
        { name: 'التحديثات', href: '/updates' },
        { name: 'الدليل', href: '/guide' },
      ],
    },
    company: {
      title: 'الشركة',
      links: [
        { name: 'من نحن', href: '/about' },
        { name: 'الوظائف', href: '/careers' },
        { name: 'المدونة', href: '/blog' },
        { name: 'الشركاء', href: '/partners' },
      ],
    },
    support: {
      title: 'الدعم',
      links: [
        { name: 'مركز المساعدة', href: '/help' },
        { name: 'تواصل معنا', href: '/contact' },
        { name: 'الأسئلة الشائعة', href: '/faq' },
        { name: 'حالة النظام', href: '/status' },
      ],
    },
    legal: {
      title: 'قانوني',
      links: [
        { name: 'الشروط والأحكام', href: '/terms' },
        { name: 'سياسة الخصوصية', href: '/privacy' },
        { name: 'سياسة الاسترجاع', href: '/refund' },
        { name: 'ملفات تعريف الارتباط', href: '/cookies' },
      ],
    },
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      
      {/* Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
                <div className="relative w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-black text-white">تجارتك</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              منصة التجارة الإلكترونية الأولى في العالم العربي. نساعدك على بناء وإدارة متجرك الإلكتروني بسهولة واحترافية.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:support@tejaratk.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@tejaratk.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-bold mb-5 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-blue-500 group-hover:w-3 transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-10 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-right">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center lg:justify-start">
                <Sparkles className="h-5 w-5 text-blue-400" />
                اشترك في نشرتنا البريدية
              </h3>
              <p className="text-gray-400">احصل على آخر الأخبار والعروض الحصرية</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 lg:w-72 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                dir="ltr"
              />
              <button className="btn-primary flex items-center gap-2">
                <Send className="h-4 w-4" />
                اشترك
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4 text-center">طرق الدفع المدعومة</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['Visa', 'Mastercard', 'Mada', 'Apple Pay', 'STC Pay'].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-white/5 rounded-xl text-gray-400 text-sm hover:bg-white/10 transition-colors border border-white/5"
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            © {new Date().getFullYear()} تجارتك. جميع الحقوق محفوظة. صنع بـ 
            <Heart className="h-4 w-4 text-red-500 fill-red-500 mx-1" />
            في السعودية
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
              الشروط
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
              الخصوصية
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
              ملفات تعريف الارتباط
            </Link>
          </div>
          
          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-blue-500/30"
            aria-label="العودة للأعلى"
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
