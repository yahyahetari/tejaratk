import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth/session';
import Link from 'next/link';
import {
  CheckCircle,
  ArrowLeft,
  Store,
  CreditCard,
  Settings,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Rocket,
  Zap
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'تم إكمال الإعداد - تجارتك',
  description: 'تم إكمال إعداد متجرك بنجاح'
};

export default async function CompletePage() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    redirect('/login');
  }

  const merchantId = auth.user.id;

  const prisma = (await import('@/lib/db/prisma')).default;

  const store = await prisma.store.findUnique({
    where: { merchantId }
  });

  const storeSetup = await prisma.storeSetup.findUnique({
    where: { merchantId }
  });

  if (!storeSetup || !storeSetup.isCompleted) {
    redirect('/dashboard/store-setup');
  }

  const quickLinks = [
    { title: 'لوحة التحكم', href: '/dashboard', icon: Store },
    { title: 'إدارة الاشتراك', href: '/dashboard/subscription', icon: CreditCard },
    { title: 'الفواتير', href: '/dashboard/invoices', icon: FileText },
    { title: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
    { title: 'الدعم الفني', href: '/dashboard/help', icon: HelpCircle },
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
                متجرك <strong className="text-white">{store?.brandName || 'متجرك'}</strong> جاهز الآن للاستخدام
              </p>
              <p className="text-emerald-100">
                يمكنك الآن البدء في استخدام جميع مميزات المنصة
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
            <Link href="/dashboard/subscription">
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                إدارة الاشتراك
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card-premium p-6 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">الخطوات التالية</h2>
            <p className="text-gray-500">ماذا يمكنك فعله الآن؟</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Store className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">استخدم نظام متجرك</h3>
              <p className="text-sm text-gray-500">قم بتحميل وتثبيت نظام المتجر الخاص بك</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">تابع اشتراكك</h3>
              <p className="text-sm text-gray-500">راقب حالة اشتراكك وجدده في الوقت المناسب</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-700 mb-1">ابدأ البيع! 🚀</h3>
              <p className="text-sm text-emerald-600">متجرك جاهز الآن. يمكنك البدء في إضافة المنتجات واستقبال الطلبات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card-premium p-6 animate-fade-in-up delay-200">
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
            <Link key={i} href={link.href}>
              <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-3 text-right">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                  <link.icon className="h-5 w-5 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-900 flex-1">{link.title}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="card-premium p-6 border-2 border-blue-200 bg-blue-50 animate-fade-in-up delay-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">نصائح مهمة</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                تأكد من تفعيل نظام متجرك باستخدام إعدادات الاشتراك
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                راقب فواتيرك باستمرار من قسم الفواتير
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                في حال واجهتك أي مشكلة، تواصل معنا عبر الدعم الفني
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
