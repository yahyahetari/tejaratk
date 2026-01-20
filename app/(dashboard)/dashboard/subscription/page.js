import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPlanById, calculateSavings } from '@/config/plans';
import { formatCurrency, formatDate } from '@/lib/utils/helpers';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Check,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  Gift,
  DollarSign,
  Headphones,
  Star,
  Award,
  Zap,
  X
} from 'lucide-react';
import Pricing from '@/components/landing/pricing';
export default async function SubscriptionPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const { merchant } = session;
  const subscription = merchant?.subscription;
  const hasActiveSubscription = subscription?.status === 'ACTIVE';
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">الاشتراك والفواتير</h1>
          </div>
          <p className="text-gray-500 text-lg">
            إدارة اشتراكك ومعلومات الدفع
          </p>
        </div>
        {hasActiveSubscription && (
          <Link href="#plans">
            <button className="btn-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ترقية الخطة
            </button>
          </Link>
        )}
      </div>
      
      {/* Current Subscription Card */}
      {hasActiveSubscription && (
        <div className="card-premium p-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Check className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">الاشتراك الحالي</h2>
                <p className="text-gray-500">معلومات خطتك الحالية</p>
              </div>
            </div>
            <span className="badge-success flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              نشط
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">الخطة</p>
                <p className="text-lg font-bold text-gray-900">
                  {getPlanById(subscription.planType || subscription.planId)?.name || subscription.planType || subscription.planId}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">السعر</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(subscription.amount, subscription.currency)} / 
                  {subscription.billingCycle === 'MONTHLY' ? 'شهري' : 'سنوي'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">التجديد التالي</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(subscription.currentPeriodEnd || subscription.endDate)}
                </p>
              </div>
            </div>
          </div>
          
          {subscription.cancelAtPeriodEnd && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">تنبيه: الاشتراك سينتهي قريباً</p>
                <p className="text-sm text-red-600">
                  سيتم إلغاء اشتراكك في {formatDate(subscription.currentPeriodEnd || subscription.endDate)}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            {!subscription.cancelAtPeriodEnd ? (
              <Link href="/dashboard/subscription/cancel">
                <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                  إلغاء الاشتراك
                </button>
              </Link>
            ) : (
              <Link href="/dashboard/subscription/resume">
                <button className="btn-primary">
                  استئناف الاشتراك
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Pricing Plans Section */}
      <div id="plans" className="scroll-mt-8">
        <Pricing
          showHeader={!hasActiveSubscription} 
          ctaLink="/dashboard/subscription/checkout"
        />
      </div>
      
      {/* Invoices Card */}
      <div className="card-premium p-6 animate-fade-in-up delay-400">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">الفواتير</h2>
            <p className="text-gray-500">سجل فواتيرك السابقة</p>
          </div>
        </div>
        
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">لا توجد فواتير متاحة</p>
          <p className="text-sm text-gray-400">ستظهر فواتيرك هنا بعد الاشتراك</p>
        </div>
      </div>
    </div>
  );
}