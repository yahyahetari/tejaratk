import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth/session';
import { getActivationKey } from '@/lib/activation-key';
import KeyDisplay from '@/components/activation-key/key-display';
import KeyInstructions from '@/components/activation-key/key-instructions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  RefreshCw, 
  History, 
  AlertCircle, 
  Key, 
  Shield, 
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Store,
  Calendar,
  Activity
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'كود التفعيل - تجارتك',
  description: 'إدارة كود التفعيل الخاص بمتجرك'
};

async function ActivationKeyContent() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    redirect('/login');
  }

  const merchantId = auth.user.id;
  const activationKey = await getActivationKey(merchantId);

  if (!activationKey) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">كود التفعيل</h1>
            <p className="text-gray-500">إدارة كود التفعيل الخاص بمتجرك</p>
          </div>
        </div>

        {/* No Key Card */}
        <div className="card-premium p-8 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-amber-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">لا يوجد كود تفعيل</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            يجب إكمال إعداد المتجر أولاً للحصول على كود التفعيل الخاص بك
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-right">
            <h3 className="font-bold text-gray-900 mb-4">للحصول على كود التفعيل، يجب عليك:</h3>
            <ul className="space-y-3">
              {[
                'التأكد من وجود اشتراك نشط',
                'إكمال جميع خطوات إعداد المتجر',
                'ملء جميع المعلومات المطلوبة',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-bold">{i + 1}</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <Link href="/dashboard/store-setup">
            <button className="btn-primary text-lg flex items-center gap-2 mx-auto">
              <Store className="h-5 w-5" />
              إكمال إعداد المتجر
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    ACTIVE: { color: 'emerald', icon: CheckCircle, label: 'نشط' },
    EXPIRED: { color: 'red', icon: Clock, label: 'منتهي' },
    SUSPENDED: { color: 'amber', icon: AlertCircle, label: 'معلق' },
    REVOKED: { color: 'gray', icon: AlertCircle, label: 'ملغي' },
  };

  const status = statusConfig[activationKey.status] || statusConfig.ACTIVE;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Key className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">كود التفعيل</h1>
          </div>
          <p className="text-gray-500 text-lg">
            استخدم هذا الكود لتفعيل متجرك الخارجي
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/activation-key/usage">
            <button className="btn-secondary flex items-center gap-2">
              <History className="h-5 w-5" />
              سجل الاستخدام
            </button>
          </Link>
          <form action="/api/activation-key/regenerate" method="POST">
            <button 
              type="submit" 
              className="btn-secondary text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              إعادة التوليد
            </button>
          </form>
        </div>
      </div>

      {/* Key Display */}
      <div className="animate-fade-in-up">
        <KeyDisplay activationKey={activationKey} />
      </div>

      {/* Instructions */}
      <div className="animate-fade-in-up delay-100">
        <KeyInstructions />
      </div>

      {/* Key Info Card */}
      <div className="card-premium p-6 animate-fade-in-up delay-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">معلومات مهمة</h2>
            <p className="text-gray-500">تفاصيل كود التفعيل الخاص بك</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-${status.color}-100 flex items-center justify-center`}>
                <status.icon className={`h-4 w-4 text-${status.color}-600`} />
              </div>
              <span className="text-sm text-gray-500">حالة الكود</span>
            </div>
            <p className={`text-xl font-bold text-${status.color}-600`}>
              {status.label}
            </p>
          </div>

          {/* Verification Count */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">عدد مرات التحقق</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {activationKey.verificationCount || 0}
            </p>
          </div>

          {/* Created At */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {new Date(activationKey.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Last Verified */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">آخر تحقق</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {activationKey.lastVerifiedAt ? (
                new Date(activationKey.lastVerifiedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              ) : (
                <span className="text-gray-400">لم يتم التحقق بعد</span>
              )}
            </p>
          </div>
        </div>

        {/* Store URL */}
        {activationKey.storeUrl && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Store className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">المتجر المرتبط</p>
                  <p className="font-bold text-gray-900">{activationKey.storeUrl}</p>
                </div>
              </div>
              <a 
                href={activationKey.storeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary text-sm flex items-center gap-2"
              >
                زيارة المتجر
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="card-premium p-6 border-2 border-blue-200 bg-blue-50 animate-fade-in-up delay-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ملاحظة أمنية</h3>
            <p className="text-gray-600">
              حافظ على سرية كود التفعيل الخاص بك ولا تشاركه مع أي شخص. 
              إذا كنت تعتقد أن الكود قد تم اختراقه، قم بإعادة توليده فوراً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivationKeyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
      </div>
    }>
      <ActivationKeyContent />
    </Suspense>
  );
}
