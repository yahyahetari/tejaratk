import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth/session';
import { getActivationKey, getKeyVerifications } from '@/lib/activation-key';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Monitor,
  Activity,
  Clock,
  Shield,
  AlertCircle,
  ExternalLink,
  BarChart3
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'سجل استخدام كود التفعيل - تجارتك',
  description: 'عرض سجل التحققات من كود التفعيل'
};

async function UsageContent() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    redirect('/login');
  }

  const merchantId = auth.user.id;
  const activationKey = await getActivationKey(merchantId);

  if (!activationKey) {
    redirect('/dashboard/activation-key');
  }

  const verifications = await getKeyVerifications(activationKey.id, 100);
  const successCount = verifications.filter(v => v.success).length;
  const failCount = verifications.filter(v => !v.success).length;

  const stats = [
    { 
      title: 'إجمالي التحققات', 
      value: verifications.length, 
      icon: Activity, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'التحققات الناجحة', 
      value: successCount, 
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      title: 'التحققات الفاشلة', 
      value: failCount, 
      icon: XCircle, 
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    { 
      title: 'آخر تحقق', 
      value: activationKey.lastVerifiedAt 
        ? new Date(activationKey.lastVerifiedAt).toLocaleDateString('ar-SA', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'لا يوجد',
      icon: Clock, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">سجل استخدام كود التفعيل</h1>
          </div>
          <p className="text-gray-500 text-lg">
            عرض جميع محاولات التحقق من كود التفعيل
          </p>
        </div>
        <Link href="/dashboard/activation-key">
          <button className="btn-secondary flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            العودة
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        {stats.map((stat, i) => (
          <div key={i} className="card-premium p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm text-gray-500">{stat.title}</span>
            </div>
            <p className={`text-2xl font-black ${stat.textColor || 'text-gray-900'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Verifications Table */}
      <div className="card-premium overflow-hidden animate-fade-in-up delay-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">سجل التحققات</h2>
              <p className="text-gray-500">جميع محاولات التحقق مرتبة من الأحدث للأقدم</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {verifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد محاولات تحقق</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                سيظهر هنا سجل جميع محاولات التحقق من كود التفعيل عند استخدامه في متجرك الخارجي
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">الحالة</th>
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">التاريخ والوقت</th>
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">عنوان IP</th>
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">المتصفح</th>
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">رابط المتجر</th>
                    <th className="py-4 px-4 text-right text-sm font-bold text-gray-700">الخطأ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((verification, i) => (
                    <tr 
                      key={verification.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        {verification.success ? (
                          <span className="badge-success flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            ناجح
                          </span>
                        ) : (
                          <span className="badge-danger flex items-center gap-1 w-fit">
                            <XCircle className="h-3 w-3" />
                            فاشل
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(verification.verifiedAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Globe className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-mono text-gray-600">
                            {verification.ipAddress || 'غير متوفر'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Monitor className="h-3 w-3 text-gray-500" />
                          </div>
                          <span className="text-xs text-gray-500 max-w-[150px] truncate">
                            {verification.userAgent 
                              ? verification.userAgent.length > 30 
                                ? verification.userAgent.substring(0, 30) + '...'
                                : verification.userAgent
                              : 'غير متوفر'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {verification.storeUrl ? (
                          <a 
                            href={verification.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 hover:underline"
                          >
                            {verification.storeUrl.length > 25 
                              ? verification.storeUrl.substring(0, 25) + '...'
                              : verification.storeUrl
                            }
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {verification.errorMessage ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-red-600 max-w-[150px] truncate">
                              {verification.errorMessage}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="card-premium p-6 border-2 border-blue-200 bg-blue-50 animate-fade-in-up delay-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ملاحظة أمنية</h3>
            <p className="text-gray-600">
              إذا لاحظت محاولات تحقق مشبوهة أو من عناوين IP غير معروفة، 
              ننصحك بإعادة توليد كود التفعيل فوراً من صفحة إدارة الكود.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsagePage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    }>
      <UsageContent />
    </Suspense>
  );
}
