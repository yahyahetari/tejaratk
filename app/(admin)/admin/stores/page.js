'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

export default function AdminStoresPage() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchStores();
  }, [statusFilter]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/merchants?status=${statusFilter}`);
      const data = await response.json();
      if (data.success) {
        setStores(data.data?.merchants || []);
        setStats({
          total: data.data?.pagination?.total || 0,
          active: data.data?.merchants?.filter(m => m.status === 'ACTIVE').length || 0,
          pending: data.data?.merchants?.filter(m => m.status === 'PENDING').length || 0,
          suspended: data.data?.merchants?.filter(m => m.status === 'SUSPENDED').length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'إجمالي المتاجر', value: stats.total, icon: Store, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'المتاجر النشطة', value: stats.active, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'في انتظار التفعيل', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { label: 'المتاجر المعلقة', value: stats.suspended, icon: XCircle, gradient: 'from-red-500 to-rose-600' },
  ];

  const filteredStores = stores.filter(store =>
    !search || store.businessName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Store className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إدارة المتاجر</h1>
          <p className="text-gray-500">عرض وإدارة جميع المتاجر في المنصة</p>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="البحث باسم المتجر..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="PENDING">قيد الانتظار</option>
              <option value="SUSPENDED">موقوف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredStores.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا يوجد متاجر</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredStores.map((store) => (
              <div key={store.id} className="p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{store.businessName}</p>
                      <p className="text-sm text-gray-500">{store.user?.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${store.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                      store.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {store.status === 'ACTIVE' ? 'نشط' : store.status === 'PENDING' ? 'قيد الانتظار' : 'موقوف'}
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
