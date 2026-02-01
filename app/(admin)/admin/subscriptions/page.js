'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, expired: 0 });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscriptions?status=${statusFilter}`);
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.data?.subscriptions || []);
        setStats({
          total: data.data?.pagination?.total || 0,
          active: data.data?.stats?.active || 0,
          trial: data.data?.stats?.trial || 0,
          expired: data.data?.stats?.expired || 0
        });
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'إجمالي الاشتراكات', value: stats.total, icon: CreditCard, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'اشتراكات نشطة', value: stats.active, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'فترة تجريبية', value: stats.trial, icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { label: 'منتهية', value: stats.expired, icon: XCircle, gradient: 'from-red-500 to-rose-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إدارة الاشتراكات</h1>
          <p className="text-gray-500">عرض وإدارة جميع اشتراكات المتاجر</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value.toLocaleString('ar-SA')}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="all">جميع الحالات</option>
            <option value="ACTIVE">نشط</option>
            <option value="TRIAL">تجريبي</option>
            <option value="EXPIRED">منتهي</option>
          </select>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {subscriptions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا يوجد اشتراكات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{sub.merchant?.businessName || 'غير محدد'}</p>
                      <p className="text-sm text-gray-500">{sub.planType || sub.plan || 'أساسي'}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'TRIAL' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {sub.status === 'ACTIVE' ? 'نشط' : sub.status === 'TRIAL' ? 'تجريبي' : 'منتهي'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
