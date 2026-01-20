'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';

export default function AdminInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/analytics?period=month`
      );
      const data = await response.json();

      if (data.success) {
        // استخدام بيانات الفواتير من analytics إذا كانت متاحة
        const invoiceStats = data.data?.invoices || {};
        setInvoices([]);
        setPagination(prev => ({
          ...prev,
          total: invoiceStats.total || 0,
          paid: invoiceStats.paid || 0,
          pending: invoiceStats.pending || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: 'مدفوعة', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      PENDING: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      CANCELLED: { label: 'ملغاة', color: 'bg-red-100 text-red-700', icon: XCircle },
      EXPIRED: { label: 'منتهية', color: 'bg-gray-100 text-gray-700', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getPlanName = (planId) => {
    const plans = {
      basic: 'الأساسية',
      premium: 'المتقدمة',
      enterprise: 'المؤسسات',
    };
    return plans[planId] || planId;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} ر.س`;
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (!search) return true;
    return (
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.merchant.toLowerCase().includes(search.toLowerCase()) ||
      invoice.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفواتير</h1>
          <p className="text-gray-600 mt-1">إدارة فواتير الاشتراكات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الفواتير</p>
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
              <p className="text-sm text-gray-600">المدفوعة</p>
              <p className="text-xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">قيد الانتظار</p>
              <p className="text-xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'PENDING').length}
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
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(invoices.reduce((sum, i) => sum + (i.amount || 0), 0))}
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
              placeholder="البحث برقم الفاتورة أو اسم التاجر..."
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
              <option value="ACTIVE">مدفوعة</option>
              <option value="PENDING">قيد الانتظار</option>
              <option value="CANCELLED">ملغاة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد فواتير</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">رقم الفاتورة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">التاجر</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الخطة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-blue-600">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.merchant}</p>
                        <p className="text-sm text-gray-500">{invoice.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{getPlanName(invoice.planId)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(invoice.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
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
