'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.merchants?.total || 0,
      icon: Users,
      color: 'blue',
      change: stats?.merchants?.growthRate ? `${stats.merchants.growthRate > 0 ? '+' : ''}${stats.merchants.growthRate}%` : 'N/A',
      trend: (stats?.merchants?.growthRate || 0) >= 0 ? 'up' : 'down',
    },
    {
      title: 'التجار النشطين',
      value: stats?.merchants?.active || 0,
      icon: ShoppingBag,
      color: 'purple',
      change: `${stats?.merchants?.conversionRate || 0}%`,
      trend: 'up',
    },
    {
      title: 'الاشتراكات النشطة',
      value: stats?.subscriptions?.active || 0,
      icon: Package,
      color: 'green',
      change: `${stats?.subscriptions?.total || 0} إجمالي`,
      trend: 'up',
    },
    {
      title: 'الفواتير المعلقة',
      value: stats?.invoices?.pending || 0,
      icon: BarChart3,
      color: 'orange',
      change: `${stats?.invoices?.overdue || 0} متأخرة`,
      trend: (stats?.invoices?.overdue || 0) > 0 ? 'down' : 'up',
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${(stats?.revenue?.total || 0).toLocaleString()} ر.س`,
      icon: DollarSign,
      color: 'emerald',
      change: `${(stats?.revenue?.avgPerMerchant || 0).toLocaleString()} متوسط`,
      trend: 'up',
    },
    {
      title: 'معدل نجاح التحقق',
      value: `${stats?.verifications?.successRate || 0}%`,
      icon: TrendingUp,
      color: 'pink',
      change: `${stats?.verifications?.total || 0} تحقق`,
      trend: 'up',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
          <p className="text-gray-600 mt-1">نظرة عامة على أداء المنصة</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
            <option value="year">هذا العام</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-600 text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات الشهرية</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>الرسم البياني قيد التطوير</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الطلبات اليومية</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>الرسم البياني قيد التطوير</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">لا يوجد نشاط حديث</p>
        </div>
      </div>
    </div>
  );
}
