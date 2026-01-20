import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth/session';
import { getActivationKey } from '@/lib/activation-key';
import prisma from '@/lib/db/prisma';
import KeyDisplay from '@/components/activation-key/key-display';
import KeyInstructions from '@/components/activation-key/key-instructions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  CheckCircle, 
  Download, 
  ArrowLeft, 
  Key, 
  Store, 
  CreditCard, 
  User, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer,
  Rocket,
  Shield,
  Zap
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'تم إكمال الإعداد - تجارتك',
  description: 'تم إكمال إعداد متجرك بنجاح'
};

async function CompleteContent() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    redirect('/login');
  }

  const merchantId = auth.user.id;

  const store = await prisma.store.findUnique({
    where: { merchantId }
  });

  if (!store || !store.setupCompleted) {
    redirect('/dashboard/store-setup');
  }

  const activationKey = await getActivationKey(merchantId);

  if (!activationKey) {
    redirect('/dashboard/store-setup');
  }

  const steps = [
    { step: '1', title: 'انسخ كود التفعيل', desc: 'استخدم زر النسخ لنسخ الكود إلى الحافظة' },
    { step: '2', title: 'افتح متجرك الخارجي', desc: 'انتقل إلى لوحة تحكم متجرك (WooCommerce, Shopify, إلخ)' },
    { step: '3', title: 'أدخل كود التفعيل', desc: 'ابحث عن حقل "كود التفعيل" وألصق الكود' },
    { step: '4', title: 'تحقق من التفعيل', desc: 'سيتم التحقق من الكود تلقائياً وتفعيل المميزات' },
  ];

  const quickLinks = [
    { title: 'لوحة التحكم', href: '/dashboard', icon: Store },
    { title: 'إدارة كود التفعيل', href: '/dashboard/activation-key', icon: Key },
    { title: 'إدارة الاشتراك', href: '/dashboard/subscription', icon: CreditCard },
    { title: 'الفواتير', href: '/dashboard/invoices', icon: CreditCard },
    { title: 'الملف الشخصي', href: '/dashboard/profile', icon: User },
    { title: 'الدعم الفني', href: 'https://help.manus.im', icon: HelpCircle, external: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Success Banner */}
      <div className="relative overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 gradient-success rounded-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div className="text-center md:text-right flex-1">
              <h1 className="text-3xl md:text-4xl font-black mb-3">
                🎉 مبروك! تم إكمال إعداد متجرك بنجاح
              </h1>
              <p className="text-emerald-100 text-lg mb-4">
                متجرك <strong className="text-white">{store.brandName}</strong> جاهز الآن للاستخدام
              </p>
              <p className="text-emerald-100">
                تم إنشاء كود التفعيل الخاص بك. يمكنك الآن استخدامه في متجرك الخارجي.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                الذهاب إلى لوحة التحكم
              </button>
            </Link>
            <Link href="/dashboard/activation-key">
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                <Key className="h-5 w-5" />
                عرض كود التفعيل
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Activation Key Display */}
      <div className="card-premium p-6 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">كود التفعيل الخاص بك</h2>
            <p className="text-gray-500">استخدم هذا الكود لتفعيل متجرك</p>
          </div>
        </div>
        <KeyDisplay activationKey={activationKey} showCopyButton={true} />
      </div>

      {/* Instructions */}
      <div className="animate-fade-in-up delay-200">
        <KeyInstructions />
      </div>

      {/* Next Steps */}
      <div className="card-premium p-6 animate-fade-in-up delay-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">الخطوات التالية</h2>
            <p className="text-gray-500">ماذا تفعل بعد الحصول على كود التفعيل؟</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {steps.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
          
          {/* Success Step */}
          <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-700 mb-1">ابدأ البيع! 🚀</h3>
              <p className="text-sm text-emerald-600">متجرك جاهز الآن. يمكنك البدء في استقبال الطلبات والمبيعات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Info */}
      <div className="card-premium p-6 animate-fade-in-up delay-400">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">حفظ المعلومات</h2>
            <p className="text-gray-500">احتفظ بنسخة من كود التفعيل والتعليمات</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
            <Download className="h-5 w-5" />
            تحميل PDF (قريباً)
          </button>
          <button 
            className="btn-secondary flex items-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-5 w-5" />
            طباعة الصفحة
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <strong>نصيحة:</strong> احتفظ بكود التفعيل في مكان آمن. يمكنك دائماً الوصول إليه من لوحة التحكم.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card-premium p-6 animate-fade-in-up delay-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">روابط مفيدة</h2>
            <p className="text-gray-500">وصول سريع للأقسام المهمة</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-3">
          {quickLinks.map((link, i) => (
            link.external ? (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer">
                <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-3 text-right">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <link.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-900 flex-1">{link.title}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </button>
              </a>
            ) : (
              <Link key={i} href={link.href}>
                <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-3 text-right">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <link.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-900 flex-1">{link.title}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="card-premium p-6 border-2 border-blue-200 bg-blue-50 animate-fade-in-up delay-600">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">نصائح أمنية</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                لا تشارك كود التفعيل مع أي شخص غير موثوق
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                احتفظ بنسخة احتياطية من الكود في مكان آمن
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                في حالة الشك بتسريب الكود، قم بإعادة توليده فوراً
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-3xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
