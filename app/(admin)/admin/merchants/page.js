'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ShoppingCart,
  DollarSign,
  Loader2,
  MoreVertical,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

export default function AdminMerchantsPage() {
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    fetchMerchants();
  }, [pagination.page, statusFilter]);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/merchants?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}`
      );
      const data = await response.json();

      if (data.success) {
        const merchantData = data.data.merchants.map(merchant => ({
          id: merchant.id,
          businessName: merchant.businessName || 'غير محدد',
          storeName: merchant.store?.brandName || '',
          contactName: merchant.contactName || '',
          email: merchant.email || '',
          status: merchant.status || 'ACTIVE',
          subscriptionStatus: merchant.subscription?.status,
          planType: merchant.subscription?.planType,
          createdAt: merchant.createdAt,
          stats: merchant.stats
        }));
        setMerchants(merchantData);
        setPagination(prev => ({ ...prev, total: data.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      INACTIVE: { label: 'غير نشط', color: 'bg-gray-100 text-gray-700', icon: XCircle },
      SUSPENDED: { label: 'موقوف', color: 'bg-red-100 text-red-700', icon: Ban },
      PENDING: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.ACTIVE;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (planType) => {
    const plans = {
      BASIC: { label: 'الأساسية', color: 'bg-blue-100 text-blue-700' },
      PREMIUM: { label: 'المتقدمة', color: 'bg-purple-100 text-purple-700' },
      ENTERPRISE: { label: 'المؤسسات', color: 'bg-orange-100 text-orange-700' },
    };
    const plan = plans[planType] || { label: planType || 'غير محدد', color: 'bg-gray-100 text-gray-700' };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.color}`}>
        {plan.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} ر.س`;
  };

  const filteredMerchants = merchants.filter(merchant => {
    if (!search) return true;
    return (
      merchant.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.storeName?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(search.toLowerCase()) ||
      merchant.phone?.includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التجار</h1>
          <p className="text-gray-600 mt-1">إدارة حسابات التجار والمتاجر</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي التجار</p>
              <p className="text-xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">النشطون</p>
              <p className="text-xl font-bold text-gray-900">
                {merchants.filter(m => m.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المنتجات</p>
              <p className="text-xl font-bold text-gray-900">
                {merchants.reduce((sum, m) => sum + (m.totalProducts || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المبيعات</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(merchants.reduce((sum, m) => sum + (m.totalRevenue || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث باسم التاجر أو المتجر أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="INACTIVE">غير نشط</option>
              <option value="SUSPENDED">موقوف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا يوجد تجار</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">التاجر</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">التواصل</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الخطة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">المنتجات</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الطلبات</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الإيرادات</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">تاريخ التسجيل</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {merchant.businessName?.charAt(0) || 'T'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{merchant.businessName}</p>
                          <p className="text-sm text-gray-500">{merchant.storeName || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          {merchant.email || '-'}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          {merchant.phone || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getPlanBadge(merchant.planType)}</td>
                    <td className="px-6 py-4">{getStatusBadge(merchant.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Package className="w-4 h-4" />
                        {merchant.totalProducts}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <ShoppingCart className="w-4 h-4" />
                        {merchant.totalOrders}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(merchant.totalRevenue)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(merchant.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            السابق
          </button>
          <span className="text-gray-600">
            صفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
