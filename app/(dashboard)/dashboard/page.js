import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import QuickActions from '@/components/dashboard/quick-actions';
import ScrollReveal from '@/components/ui/scroll-reveal';
import {
  Store,
  CreditCard,
  CheckCircle,
  Settings,
  ArrowUpRight,
  Clock,
  Sparkles,
  Zap,
  ShoppingCart,
  FileText,
  Bell,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp
} from 'lucide-react';

// دالة لتنسيق الوقت منذ
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { merchant } = session;

  const merchantData = {
    id: merchant?.id || null,
    contactName: merchant?.contactName || null,
    businessName: merchant?.businessName || null,
    status: merchant?.status || null,
    hasStoreSetup: !!merchant?.storeSetup?.isCompleted,
    storeSetupStep: merchant?.storeSetup?.currentStep || 1,
    planType: merchant?.subscription?.planType || null,
    subscriptionStatus: merchant?.subscription?.status || null,
    email: merchant?.email || 'user@example.com',
    createdAt: merchant?.createdAt || new Date()
  };

  const hasSubscription = merchantData.subscriptionStatus === 'ACTIVE';

  const recentActivities = [
    {
      icon: Store,
      text: 'تم إنشاء الحساب',
      time: formatTimeAgo(merchantData.createdAt),
      color: 'blue'
    },
    {
      icon: CheckCircle,
      text: 'مرحباً بك في منصة تجارتك',
      time: formatTimeAgo(merchantData.createdAt),
      color: 'green'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0e0e16]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-end h-16 px-4">
          <Link href="/dashboard" className="absolute mt-5 right-2 flex gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-lg mt-1 font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">تجارتك</span>
          </Link>
        </div>
      </div>

      {/* Top spacing for mobile header */}
      <div className="lg:hidden h-16"></div>

      {/* Main Container */}
      <div className="w-full h-full">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-fade-in">

            {/* Welcome Header */}
            <ScrollReveal animation="animate-fade-in-up">
              <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-5">
                    <div className="text-white">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/15 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <span className="px-2.5 sm:px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                          لوحة التحكم
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black mb-1.5 sm:mb-2">
                        مرحباً، {merchantData.contactName || 'المستخدم'}! 👋
                      </h1>
                      <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                        مرحباً بك في منصة تجارتك لإدارة الاشتراكات وإعداد متجرك.
                      </p>
                    </div>

                    <div className="flex flex-row gap-2 sm:gap-3">
                      <Link href="/dashboard/store-setup" className="flex-1 sm:flex-initial">
                        <button className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white text-blue-600 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base">
                          <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>إعداد المتجر</span>
                        </button>
                      </Link>
                      <Link href="/dashboard/subscription" className="flex-1 sm:flex-initial">
                        <button className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold hover:bg-white/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>الاشتراكات</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Subscription Banner */}
            {!hasSubscription && (
              <div className="p-4 sm:p-5 lg:p-6 border border-amber-500/20 bg-amber-500/5 rounded-xl lg:rounded-2xl animate-fade-in-up">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">🚀 ابدأ رحلتك الآن</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400">
                        اشترك في إحدى باقاتنا للاستفادة من جميع المميزات وإطلاق متجرك!
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/subscription" className="w-full sm:w-auto">
                    <button className="whitespace-nowrap text-xs sm:text-sm lg:text-base w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                      عرض الباقات
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[
                { title: 'إجمالي المبيعات', value: '$0.00', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { title: 'الطلبات النشطة', value: '0', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { title: 'زيارات المتجر', value: '0', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { title: 'صافي الأرباح', value: '$0.00', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((stat, i) => (
                <ScrollReveal
                  key={i}
                  delay={i * 100}
                  threshold={0.1}
                >
                  <div
                    className={`bg-white/[0.03] p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-white/5 shadow-lg shadow-black/10 h-full`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
                      <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Quick Actions */}
            <QuickActions hasStoreSetup={merchantData.hasStoreSetup} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Recent Activity */}
              <ScrollReveal animation="animate-fade-in-up" delay={500} className="lg:col-span-3">
                <div className="bg-white/[0.03] p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-white/5 h-full">
                  <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white">النشاط الأخير</h2>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="mr-1">اليوم</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => {
                      const ActivityIcon = activity.icon;
                      const bgColorClass = activity.color === 'blue' ? 'bg-blue-500/10' : 'bg-emerald-500/10';
                      const textColorClass = activity.color === 'blue' ? 'text-blue-400' : 'text-emerald-400';
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl transition-colors border border-white/5"
                        >
                          <div className={`w-9 h-9 rounded-lg ${bgColorClass} flex items-center justify-center flex-shrink-0`}>
                            <ActivityIcon className={`h-4 w-4 ${textColorClass}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-200 text-sm truncate">{activity.text}</p>
                            <p className="text-xs text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Setup Progress */}
                  {!merchantData.hasStoreSetup && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">تقدم الإعداد</span>
                        <span className="text-xs text-gray-500">{merchantData.storeSetupStep}/4</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${(merchantData.storeSetupStep / 4) * 100}% ` }}
                        ></div>
                      </div>
                      <Link href="/dashboard/store-setup" className="mt-3 block">
                        <button className="w-full text-sm text-blue-400 font-semibold hover:text-blue-300">
                          متابعة الإعداد →
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
