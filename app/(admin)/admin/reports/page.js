import { buildMetadata } from "@/lib/seo/metadata";
import prisma from '@/lib/db/prisma';
import ReportsCharts from '@/components/admin/reports-charts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Store,
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = buildMetadata({
  title: "التقارير والإحصائيات",
  path: "/admin/reports",
  noIndex: true
});

async function getReportsData() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // إحصائيات هذا الشهر
    const [
      usersThisMonth,
      usersLastMonth,
      merchantsThisMonth,
      merchantsLastMonth,
      totalUsers,
      totalMerchants,
      activeMerchants,
      monthlyGrowth
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.merchant.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.merchant.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.merchant.count({ where: { status: 'ACTIVE' } }),
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: { createdAt: { gte: startOfYear } }
      })
    ]);

    // حساب نسب النمو
    const userGrowth = usersLastMonth > 0
      ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
      : 100;

    const merchantGrowth = merchantsLastMonth > 0
      ? Math.round(((merchantsThisMonth - merchantsLastMonth) / merchantsLastMonth) * 100)
      : 100;

    // بيانات الرسم البياني الشهري
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [users, merchants] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
        prisma.merchant.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } })
      ]);

      monthlyData.push({
        month: monthStart.toLocaleDateString('ar-SA', { month: 'short' }),
        users,
        merchants
      });
    }

    return {
      usersThisMonth,
      merchantsThisMonth,
      userGrowth,
      merchantGrowth,
      totalUsers,
      totalMerchants,
      activeMerchants,
      monthlyData
    };
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return {
      usersThisMonth: 0,
      merchantsThisMonth: 0,
      userGrowth: 0,
      merchantGrowth: 0,
      totalUsers: 0,
      totalMerchants: 0,
      activeMerchants: 0,
      monthlyData: []
    };
  }
}

export default async function AdminReportsPage() {
  const data = await getReportsData();

  const mainStats = [
    {
      title: 'إجمالي المستخدمين',
      value: data.totalUsers,
      change: data.userGrowth,
      thisMonth: data.usersThisMonth,
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'إجمالي المتاجر',
      value: data.totalMerchants,
      change: data.merchantGrowth,
      thisMonth: data.merchantsThisMonth,
      icon: Store,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'المتاجر النشطة',
      value: data.activeMerchants,
      percentage: data.totalMerchants > 0 ? Math.round((data.activeMerchants / data.totalMerchants) * 100) : 0,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'معدل التحويل',
      value: data.totalUsers > 0 ? Math.round((data.totalMerchants / data.totalUsers) * 100) : 0,
      suffix: '%',
      icon: BarChart3,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">التقارير والإحصائيات</h1>
            <p className="text-gray-500">نظرة شاملة على أداء المنصة</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذه السنة</option>
            <option value="all">كل الوقت</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
            <Download className="h-4 w-4" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {mainStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.change !== undefined && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {stat.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
              {stat.percentage !== undefined && (
                <div className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                  {stat.percentage}% نشط
                </div>
              )}
            </div>
            <h3 className="text-sm text-gray-500 mb-1">{stat.title}</h3>
            <p className="text-2xl lg:text-3xl font-black text-gray-900">
              {stat.value.toLocaleString('ar-SA')}{stat.suffix || ''}
            </p>
            {stat.thisMonth !== undefined && (
              <p className="text-sm text-gray-400 mt-1">
                +{stat.thisMonth} هذا الشهر
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <ReportsCharts monthlyData={data.monthlyData} />

      {/* Detailed Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">أفضل المتاجر أداءً</h2>
            <p className="text-sm text-gray-500">بناءً على عدد المنتجات والطلبات</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {i}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">متجر {i}</span>
                      <span className="text-sm text-gray-500">{100 - i * 15}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${100 - i * 15}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">توزيع الاشتراكات</h2>
            <p className="text-sm text-gray-500">نسبة كل خطة من إجمالي الاشتراكات</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'مجاني', value: 45, color: 'bg-gray-500' },
                { name: 'أساسي', value: 30, color: 'bg-blue-500' },
                { name: 'احترافي', value: 20, color: 'bg-purple-500' },
                { name: 'مؤسسي', value: 5, color: 'bg-amber-500' },
              ].map((plan, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${plan.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{plan.name}</span>
                      <span className="text-sm text-gray-500">{plan.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${plan.color} h-2 rounded-full transition-all`}
                        style={{ width: `${plan.value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 opacity-80" />
            <h3 className="text-lg font-bold">المستخدمين الجدد</h3>
          </div>
          <p className="text-4xl font-black mb-2">{data.usersThisMonth}</p>
          <p className="text-blue-100">مستخدم جديد هذا الشهر</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Store className="h-8 w-8 opacity-80" />
            <h3 className="text-lg font-bold">المتاجر الجديدة</h3>
          </div>
          <p className="text-4xl font-black mb-2">{data.merchantsThisMonth}</p>
          <p className="text-emerald-100">متجر جديد هذا الشهر</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 opacity-80" />
            <h3 className="text-lg font-bold">معدل النمو</h3>
          </div>
          <p className="text-4xl font-black mb-2">{data.userGrowth}%</p>
          <p className="text-purple-100">نمو مقارنة بالشهر الماضي</p>
        </div>
      </div>
    </div>
  );
}
