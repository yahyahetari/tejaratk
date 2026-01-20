import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import QuickActions from '@/components/dashboard/quick-actions';
import { 
  Store, 
  CreditCard, 
  CheckCircle, 
  Key,
  Settings,
  ArrowUpRight,
  Clock,
  Sparkles,
  Zap,
  ShoppingCart,
  FileText,
  Bell
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

  // بيانات النشاطات الافتراضية
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Logo on the far right */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-end h-16 px-4">
          {/* Logo - on the far right */}
          <Link href="/dashboard" className="absolute mt-5 right-2 flex gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
              <div className="relative w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-lg mt-1 font-black gradient-text">تجارتك</span>
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
            <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-lg">
              <div className="absolute inset-0 gradient-primary"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-5">
                  <div className="text-white">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <span className="px-2.5 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
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
                      <button className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white text-blue-600 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base">
                        <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>إعداد المتجر</span>
                      </button>
                    </Link>
                    <Link href="/dashboard/subscription" className="flex-1 sm:flex-initial">
                      <button className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>الاشتراكات</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription Banner */}
            {!hasSubscription && (
              <div className="card-premium p-4 sm:p-5 lg:p-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 animate-fade-in-up rounded-xl lg:rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">🚀 ابدأ رحلتك الآن</h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                        اشترك في إحدى باقاتنا للاستفادة من جميع المميزات وإطلاق متجرك!
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/subscription" className="w-full sm:w-auto">
                    <button className="btn-primary whitespace-nowrap text-xs sm:text-sm lg:text-base w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5">
                      عرض الباقات
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <QuickActions hasStoreSetup={merchantData.hasStoreSetup} />
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Quick Links */}
              <div className="lg:col-span-2 card-premium p-4 sm:p-5 lg:p-6 animate-fade-in-up rounded-xl lg:rounded-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">الإجراءات السريعة</h2>
                    <p className="text-xs sm:text-sm text-gray-500">إدارة متجرك واشتراكك</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Store Setup */}
                  <Link href="/dashboard/store-setup" className="group">
                    <div className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all border-2 border-transparent hover:border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Store className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">إعداد المتجر</h3>
                          <p className="text-xs text-gray-500">إعداد بيانات متجرك الأساسية</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                  
                  {/* Subscription */}
                  <Link href="/dashboard/subscription" className="group">
                    <div className="p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all border-2 border-transparent hover:border-emerald-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CreditCard className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">الاشتراك</h3>
                          <p className="text-xs text-gray-500">إدارة خطة اشتراكك</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                  
                  {/* Activation Key */}
                  <Link href="/dashboard/activation-key" className="group">
                    <div className="p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all border-2 border-transparent hover:border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Key className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">مفتاح التفعيل</h3>
                          <p className="text-xs text-gray-500">عرض مفتاح تفعيل متجرك</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                  
                  {/* Invoices */}
                  <Link href="/dashboard/invoices" className="group">
                    <div className="p-4 bg-gray-50 hover:bg-amber-50 rounded-xl transition-all border-2 border-transparent hover:border-amber-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">الفواتير</h3>
                          <p className="text-xs text-gray-500">عرض سجل الفواتير</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="card-premium p-4 sm:p-5 lg:p-6 animate-fade-in-up rounded-xl lg:rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">النشاط الأخير</h2>
                  </div>
                  <span className="badge-primary text-xs">
                    <Clock className="h-3 w-3" />
                    <span className="mr-1">اليوم</span>
                  </span>
                </div>
                
                <div className="space-y-3">
                  {recentActivities.map((activity, i) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-lg bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                          <ActivityIcon className={`h-4 w-4 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Setup Progress */}
                {!merchantData.hasStoreSetup && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">تقدم الإعداد</span>
                      <span className="text-xs text-gray-500">{merchantData.storeSetupStep}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${(merchantData.storeSetupStep / 4) * 100}%` }}
                      ></div>
                    </div>
                    <Link href="/dashboard/store-setup" className="mt-3 block">
                      <button className="w-full text-sm text-blue-600 font-semibold hover:text-blue-700">
                        متابعة الإعداد →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
