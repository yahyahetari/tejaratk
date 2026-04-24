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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">الاشتراك والفواتير</h1>
          </div>
          <p className="text-gray-400 text-lg">
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
        <div className="relative group">
          {/* Decorative Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-gold-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[1px]">
                    <div className="w-full h-full rounded-2xl bg-[#12121a] flex items-center justify-center">
                      <Check className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">الاشتراك الحالي</h2>
                    <p className="text-gray-400 font-medium">نظرة عامة على باقتك ونظام الفوترة</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    نشط الآن
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Plan Info */}
                <div className="relative p-6 bg-white/[0.03] border border-white/5 rounded-2xl group/card hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-brand-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-brand-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">الباقة</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    {getPlanById(subscription.planId?.toUpperCase() || subscription.planType?.toUpperCase())?.name || subscription.planName || subscription.planType || 'خطة مخصصة'}
                  </p>
                </div>
                
                {/* Pricing Info */}
                <div className="relative p-6 bg-white/[0.03] border border-white/5 rounded-2xl group/card hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">تكلفة الاشتراك</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white" dir="ltr">
                      {formatCurrency(
                        subscription.amount !== undefined && subscription.amount !== null
                          ? (subscription.amount / 100) // Assuming stored in cents
                          : (getPlanById(subscription.planId?.toUpperCase() || subscription.planType?.toUpperCase())?.[subscription.billingCycle === 'YEARLY' ? 'annualPrice' : 'monthlyPrice'] || 0), 
                        subscription.currency || 'USD'
                      )}
                    </span>
                    <span className="text-gray-500 font-bold">/ {subscription.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'}</span>
                  </div>
                </div>
                
                {/* Renewal Info */}
                <div className="relative p-6 bg-white/[0.03] border border-white/5 rounded-2xl group/card hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gold-500/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gold-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">التجديد القادم</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>
              
              {subscription.cancelAtPeriodEnd && (
                <div className="mb-8 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">الاشتراك قيد الإلغاء</h3>
                    <p className="text-gray-400 text-sm">
                      ستفقد صلاحيات الوصول في تاريخ {formatDate(subscription.currentPeriodEnd)}. يمكنك العودة في أي وقت.
                    </p>
                  </div>
                  <Link href="/dashboard/subscription/resume" className="mr-auto">
                    <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      استئناف
                    </button>
                  </Link>
                </div>
              )}
              
              <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-500 font-medium">مدعوم بواسطة Paddle لضمان أعلى مستويات الأمان</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {!subscription.cancelAtPeriodEnd ? (
                    <button 
                      onClick={() => window.location.href = '/dashboard/subscription/cancel'}
                      className="text-gray-500 hover:text-red-400 font-bold transition-colors text-sm underline underline-offset-4 decoration-white/10"
                    >
                      إلغاء الاشتراك التلقائي
                    </button>
                  ) : null}
                  
                  <button className="btn-secondary py-3 px-6 rounded-2xl flex items-center gap-2 group/btn font-bold">
                    إدارة وسيلة الدفع
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Pricing Plans Section */}
      {!hasActiveSubscription ? (
        <div id="plans" className="scroll-mt-8">
          <Pricing
            showHeader={true} 
            ctaLink="/dashboard/subscription/checkout"
          />
        </div>
      ) : (
        <div id="plans" className="scroll-mt-8 bg-gray-950 rounded-[2.5rem] mt-16 pt-12 border border-gray-800 shadow-2xl shadow-brand-500/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-gold-700/10 pointer-events-none"></div>
          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600/20 to-gold-600/20 rounded-full mb-4 border border-brand-600/30">
              <Sparkles className="h-4 w-4 text-gold-400" />
              <span className="text-sm font-bold text-gold-300">أطلق العنان لمتجرك</span>
            </div>
            <h2 className="text-3xl font-black text-white">ترقية الباقة</h2>
            <p className="text-gray-400 mt-2">هل تحتاج إلى مميزات أقوى؟ اختر الباقة الأنسب لتوسيع تجارتك.</p>
          </div>
          <Pricing
            showHeader={false} 
            ctaLink="/dashboard/subscription/checkout"
            activePlanId={subscription.planId || subscription.planType}
          />
        </div>
      )}
      
      {/* Invoices Card */}
      <div className="bg-[#12121a] border border-white/5 rounded-[2rem] p-6 mt-12 mb-12 animate-fade-in-up delay-400 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">الفواتير</h2>
            <p className="text-gray-400">سجل فواتيرك السابقة</p>
          </div>
        </div>
        
        <div className="text-center py-12 bg-white/5 border border-white/5 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
            <CreditCard className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-2">لا توجد فواتير متاحة</p>
          <p className="text-sm text-gray-500">ستظهر فواتيرك هنا بعد الاشتراك</p>
        </div>
      </div>
    </div>
  );
}