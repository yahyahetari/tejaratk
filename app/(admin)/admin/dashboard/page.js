'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ShoppingBag,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  BarChart3,
  Loader2
} from 'lucide-react';

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

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    activeMerchants: 0,
    pendingMerchants: 0,
    recentUsers: [],
    recentMerchants: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics?period=month');
      const data = await response.json();
      if (data.success) {
        setStats({
          totalUsers: data.data?.merchants?.total || 0,
          totalMerchants: data.data?.merchants?.total || 0,
          activeMerchants: data.data?.merchants?.active || 0,
          pendingMerchants: data.data?.merchants?.pending || 0,
          recentUsers: [],
          recentMerchants: []
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      name: 'إجمالي المستخدمين',
      value: stats.totalUsers.toLocaleString('ar-SA'),
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      name: 'المتاجر النشطة',
      value: stats.activeMerchants.toLocaleString('ar-SA'),
      change: '+8%',
      changeType: 'increase',
      icon: Store,
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/20'
    },
    {
      name: 'في انتظار التفعيل',
      value: stats.pendingMerchants.toLocaleString('ar-SA'),
      change: stats.pendingMerchants > 0 ? 'يتطلب مراجعة' : 'لا يوجد',
      changeType: stats.pendingMerchants > 0 ? 'warning' : 'neutral',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20'
    },
    {
      name: 'إجمالي التجار',
      value: stats.totalMerchants.toLocaleString('ar-SA'),
      change: '+15%',
      changeType: 'increase',
      icon: ShoppingBag,
      gradient: 'from-purple-500 to-pink-600',
      shadowColor: 'shadow-purple-500/20'
    },
  ];

  const quickActions = [
    { title: 'إدارة المستخدمين', desc: 'عرض وإدارة جميع المستخدمين', icon: Users, href: '/admin/users', gradient: 'from-blue-500 to-indigo-600' },
    { title: 'إدارة المتاجر', desc: 'مراجعة وإدارة المتاجر', icon: Store, href: '/admin/stores', gradient: 'from-emerald-500 to-teal-600' },
    { title: 'الاشتراكات', desc: 'إدارة خطط الاشتراك', icon: CreditCard, href: '/admin/subscriptions', gradient: 'from-purple-500 to-pink-600' },
    { title: 'التقارير', desc: 'عرض التقارير والإحصائيات', icon: BarChart3, href: '/admin/reports', gradient: 'from-amber-500 to-orange-600' },
  ];

  const systemStatus = [
    { name: 'الخوادم', status: 'operational', uptime: '99.9%' },
    { name: 'قاعدة البيانات', status: 'operational', uptime: '99.8%' },
    { name: 'بوابة الدفع', status: 'operational', uptime: '99.9%' },
    { name: 'خدمات API', status: 'operational', uptime: '99.7%' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900">لوحة تحكم المسؤول</h1>
              <p className="text-gray-500">نظرة عامة على المنصة</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className={`bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${stat.shadowColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.changeType !== 'neutral' && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${stat.changeType === 'increase' ? 'bg-emerald-100 text-emerald-700' :
                    stat.changeType === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {stat.changeType === 'increase' && <TrendingUp className="h-3 w-3" />}
                  {stat.changeType === 'warning' && <AlertCircle className="h-3 w-3" />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-sm text-gray-500 mb-1">{stat.name}</h3>
            <p className="text-2xl lg:text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">إجراءات سريعة</h2>
              <p className="text-sm text-gray-500">وصول سريع للأقسام</p>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all hover:shadow-md group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">{action.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 lg:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">حالة النظام</h2>
              <p className="text-sm text-gray-500">جميع الخدمات تعمل بشكل طبيعي</p>
            </div>
          </div>
        </div>

        <div className="p-5 lg:p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((service, i) => (
              <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{service.name}</span>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-sm text-emerald-700">وقت التشغيل: {service.uptime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
