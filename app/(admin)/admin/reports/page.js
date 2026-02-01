'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Store,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    usersThisMonth: 0, merchantsThisMonth: 0, userGrowth: 0, merchantGrowth: 0,
    totalUsers: 0, totalMerchants: 0, activeMerchants: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics?period=month');
      const result = await response.json();
      if (result.success) {
        setData({
          usersThisMonth: result.data?.merchants?.thisMonth || 0,
          merchantsThisMonth: result.data?.merchants?.thisMonth || 0,
          userGrowth: result.data?.merchants?.growthRate || 0,
          merchantGrowth: result.data?.merchants?.growthRate || 0,
          totalUsers: result.data?.merchants?.total || 0,
          totalMerchants: result.data?.merchants?.total || 0,
          activeMerchants: result.data?.merchants?.active || 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const mainStats = [
    { title: 'إجمالي المستخدمين', value: data.totalUsers, change: data.userGrowth, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { title: 'إجمالي المتاجر', value: data.totalMerchants, change: data.merchantGrowth, icon: Store, gradient: 'from-emerald-500 to-teal-600' },
    { title: 'المتاجر النشطة', value: data.activeMerchants, percentage: data.totalMerchants > 0 ? Math.round((data.activeMerchants / data.totalMerchants) * 100) : 0, icon: TrendingUp, gradient: 'from-purple-500 to-pink-600' },
    { title: 'معدل التحويل', value: data.totalUsers > 0 ? Math.round((data.totalMerchants / data.totalUsers) * 100) : 0, suffix: '%', icon: BarChart3, gradient: 'from-amber-500 to-orange-600' }
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

        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
          <Download className="h-4 w-4" />
          <span>تصدير</span>
        </button>
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
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
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
          </div>
        ))}
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
