'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Store, Search, Filter, Eye, Ban, CheckCircle, XCircle, Clock,
  Package, ShoppingCart, DollarSign, Loader2, MoreVertical, Mail,
  Phone, Calendar, PlayCircle, PauseCircle, X, User, CreditCard,
  Globe, Sparkles
} from 'lucide-react';

export default function AdminMerchantsPage() {
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [viewedMerchants, setViewedMerchants] = useState([]);

  // تحميل قائمة التجار الذين تم عرضهم من localStorage
  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('viewedMerchants') || '[]');
      setViewedMerchants(viewed);
    } catch { setViewedMerchants([]); }
  }, []);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/merchants?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}`
      );
      const data = await response.json();
      if (data.success) {
        setMerchants(data.data.merchants || []);
        setPagination(prev => ({ ...prev, total: data.data.pagination.total }));
      }
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => { fetchMerchants(); }, [fetchMerchants]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // عرض تفاصيل التاجر + تسجيل أنه تم عرضه
  const handleViewMerchant = async (merchant) => {
    try {
      setDetailLoading(true);
      setShowModal(true);

      // تسجيل أنه تم عرض هذا التاجر
      const newViewed = [...new Set([...viewedMerchants, merchant.id])];
      setViewedMerchants(newViewed);
      localStorage.setItem('viewedMerchants', JSON.stringify(newViewed));

      // جلب التفاصيل الكاملة
      const response = await fetch(`/api/admin/merchants/${merchant.id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedMerchant(data.merchant);
      } else {
        setSelectedMerchant(merchant);
      }
    } catch (error) {
      setSelectedMerchant(merchant);
    } finally {
      setDetailLoading(false);
    }
  };

  const isNewMerchant = (merchant) => {
    return !viewedMerchants.includes(merchant.id);
  };

  const handleAction = async (merchantId, action) => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/admin/merchants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, action })
      });
      const data = await response.json();
      if (data.success) {
        fetchMerchants();
        setDropdownOpen(null);
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      alert('حدث خطأ في تنفيذ الإجراء');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const cfg = {
      ACTIVE: { label: 'نشط', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      INACTIVE: { label: 'غير نشط', color: 'bg-gray-100 text-gray-700', icon: XCircle },
      SUSPENDED: { label: 'موقوف', color: 'bg-red-100 text-red-700', icon: Ban },
      PENDING: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      CANCELLED: { label: 'ملغي', color: 'bg-gray-100 text-gray-700', icon: XCircle },
      OVERDUE: { label: 'متأخر', color: 'bg-orange-100 text-orange-700', icon: Clock },
    };
    const c = cfg[status] || cfg.ACTIVE;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {c.label}
      </span>
    );
  };

  const getSubStatusBadge = (status) => {
    const cfg = {
      ACTIVE: { label: 'نشط', color: 'bg-emerald-100 text-emerald-700' },
      TRIALING: { label: 'تجريبي', color: 'bg-blue-100 text-blue-700' },
      EXPIRED: { label: 'منتهي', color: 'bg-red-100 text-red-700' },
      CANCELLED: { label: 'ملغي', color: 'bg-gray-100 text-gray-700' },
      PAUSED: { label: 'متوقف', color: 'bg-yellow-100 text-yellow-700' },
      PAST_DUE: { label: 'متأخر', color: 'bg-orange-100 text-orange-700' },
      OVERDUE: { label: 'متأخر', color: 'bg-orange-100 text-orange-700' },
    };
    const c = cfg[status] || { label: status || 'غير محدد', color: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
  };

  const formatDate = (date) => {
    if (!date) return 'غير محدد';
    return new Date(date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (date) => {
    if (!date) return 'غير محدد';
    return new Date(date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount) => `${(amount || 0).toLocaleString()} ر.ع`;

  const filteredMerchants = merchants.filter(m => {
    if (!search) return true;
    return (
      m.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      m.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
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
            <div className="p-2 bg-blue-100 rounded-lg"><Store className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">إجمالي التجار</p>
              <p className="text-xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">النشطون</p>
              <p className="text-xl font-bold text-gray-900">{merchants.filter(m => m.status === 'ACTIVE').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg"><Sparkles className="w-5 h-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-gray-600">جدد (لم يتم عرضهم)</p>
              <p className="text-xl font-bold text-gray-900">{merchants.filter(m => isNewMerchant(m)).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><Ban className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-600">موقوفين</p>
              <p className="text-xl font-bold text-gray-900">{merchants.filter(m => m.status === 'SUSPENDED').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="البحث باسم التاجر أو البريد..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الاشتراك</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">تاريخ التسجيل</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {merchant.businessName?.charAt(0) || 'T'}
                          </div>
                          {isNewMerchant(merchant) && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                              جـ
                            </span>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => handleViewMerchant(merchant)}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {merchant.businessName}
                          </button>
                          <p className="text-sm text-gray-500">{merchant.store?.brandName || merchant.contactName || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          {merchant.email || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {merchant.subscription ? getSubStatusBadge(merchant.subscription.status) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">بدون اشتراك</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(merchant.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(merchant.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewMerchant(merchant)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض التفاصيل">
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === merchant.id ? null : merchant.id); }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {dropdownOpen === merchant.id && (
                            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
                              {merchant.status === 'ACTIVE' ? (
                                <button onClick={() => handleAction(merchant.id, 'suspend')} disabled={actionLoading}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                  <PauseCircle className="w-4 h-4" />إيقاف الحساب
                                </button>
                              ) : (
                                <button onClick={() => handleAction(merchant.id, 'activate')} disabled={actionLoading}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                                  <PlayCircle className="w-4 h-4" />تفعيل الحساب
                                </button>
                              )}
                              <button onClick={() => handleAction(merchant.id, 'extend')} disabled={actionLoading}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                                <Clock className="w-4 h-4" />تمديد الاشتراك
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف حساب "${merchant.businessName}" نهائياً؟\n\nسيتم حذف جميع البيانات المرتبطة بشكل نهائي ولا يمكن التراجع.`)) {
                                  handleAction(merchant.id, 'delete');
                                }
                              }} disabled={actionLoading}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                                <XCircle className="w-4 h-4" />حذف الحساب نهائياً
                              </button>
                            </div>
                          )}
                        </div>
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
          <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">السابق</button>
          <span className="text-gray-600">صفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}</span>
          <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50">التالي</button>
        </div>
      )}

      {/* Modal تفاصيل التاجر */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل التاجر</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : selectedMerchant && (
              <div className="p-6 space-y-6">
                {/* المعلومات الأساسية */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selectedMerchant.businessName?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMerchant.businessName}</h3>
                    <p className="text-gray-500">{selectedMerchant.contactName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedMerchant.status)}
                    </div>
                  </div>
                </div>

                {/* الجدول الزمني */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    الجدول الزمني
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">📝 تاريخ التسجيل</span>
                      <span className="font-medium text-gray-900">{formatDateTime(selectedMerchant.user?.createdAt || selectedMerchant.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">📋 تاريخ إضافة البيانات</span>
                      <span className="font-medium text-gray-900">{formatDateTime(selectedMerchant.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">🔑 آخر تسجيل دخول</span>
                      <span className="font-medium text-gray-900">{selectedMerchant.lastLogin ? formatDateTime(selectedMerchant.lastLogin) : 'لم يسجل دخول بعد'}</span>
                    </div>
                    {selectedMerchant.subscription && (
                      <>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">💳 تاريخ الاشتراك</span>
                          <span className="font-medium text-gray-900">{formatDateTime(selectedMerchant.subscription.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">⏰ تاريخ انتهاء الاشتراك</span>
                          <span className={`font-medium ${selectedMerchant.subscription.endDate && new Date(selectedMerchant.subscription.endDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDateTime(selectedMerchant.subscription.endDate || selectedMerchant.subscription.currentPeriodEnd)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* معلومات الاتصال */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    معلومات الاتصال
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        {selectedMerchant.user?.email || selectedMerchant.email || '-'}
                        {selectedMerchant.user?.emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                      <p className="font-medium text-gray-900">{selectedMerchant.phone || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">اسم التواصل</p>
                      <p className="font-medium text-gray-900">{selectedMerchant.contactName || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">النشاط التجاري</p>
                      <p className="font-medium text-gray-900">{selectedMerchant.businessName || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* معلومات الاشتراك */}
                {selectedMerchant.subscription && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      معلومات الاشتراك
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">الخطة</p>
                        <p className="font-bold text-gray-900">{selectedMerchant.subscription.planName || selectedMerchant.subscription.planType || 'أساسي'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">الدورة</p>
                        <p className="font-medium text-gray-900">{selectedMerchant.subscription.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">الحالة</p>
                        {getSubStatusBadge(selectedMerchant.subscription.status)}
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">المبلغ</p>
                        <p className="font-bold text-gray-900">{formatCurrency(selectedMerchant.subscription.amount)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">الدفع القادم</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedMerchant.subscription.nextBillingDate)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">آخر دفعة</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedMerchant.subscription.lastPaymentDate)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* تفاصيل المتجر */}
                {selectedMerchant.store && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-600" />
                      معلومات المتجر
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">اسم المتجر / العلامة التجارية</p>
                        <p className="font-bold text-gray-900">{selectedMerchant.store.brandName || selectedMerchant.storeName || '-'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">بريد المتجر</p>
                        <p className="font-medium text-gray-900">{selectedMerchant.store.email || '-'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">هاتف المتجر</p>
                        <p className="font-medium text-gray-900" dir="ltr">{selectedMerchant.store.phone || '-'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">الدولة</p>
                        <p className="font-medium text-gray-900">{selectedMerchant.store.country || '-'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">العملة</p>
                        <p className="font-medium text-gray-900">{selectedMerchant.store.currency || 'OMR'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">اللغة</p>
                        <p className="font-medium text-gray-900">{(selectedMerchant.store.language) === 'ar' ? 'العربية' : 'English'}</p>
                      </div>
                    </div>
                    {selectedMerchant.store.description && (
                      <div className="mt-4 bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">وصف المتجر</p>
                        <p className="text-sm text-gray-700">{selectedMerchant.store.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* بوابات الدفع */}
                {selectedMerchant.storeSetup?.paymentGateway && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      بوابات الدفع المفعّلة
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedMerchant.storeSetup.paymentConfig?.selected || selectedMerchant.storeSetup.paymentGateway.split(',').filter(Boolean)).map((gw) => {
                        const names = { moyasar: 'مُيسر', tap: 'تاب', paypal: 'باي بال', stripe: 'سترايب', cod: 'الدفع عند الاستلام' };
                        return (
                          <span key={gw} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-lg text-sm font-medium">
                            {names[gw] || gw}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* الهوية البصرية */}
                {selectedMerchant.brandIdentity && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600" />
                      الهوية البصرية
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* الشعار */}
                      <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                        {selectedMerchant.brandIdentity.logo ? (
                          <img src={selectedMerchant.brandIdentity.logo} alt="شعار المتجر" className="max-h-24 max-w-full object-contain" />
                        ) : (
                          <div className="text-center text-gray-400">
                            <Package className="w-10 h-10 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">لم يتم رفع شعار</p>
                          </div>
                        )}
                      </div>
                      {/* الألوان */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600">اللون الأساسي</span>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-inner" style={{ backgroundColor: selectedMerchant.brandIdentity.primaryColor || '#3B82F6' }}></div>
                            <span className="text-xs font-mono text-gray-500">{selectedMerchant.brandIdentity.primaryColor || '#3B82F6'}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600">اللون الثانوي</span>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-inner" style={{ backgroundColor: selectedMerchant.brandIdentity.secondaryColor || '#10B981' }}></div>
                            <span className="text-xs font-mono text-gray-500">{selectedMerchant.brandIdentity.secondaryColor || '#10B981'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* حالة إعداد المتجر */}
                {selectedMerchant.storeSetup && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-600" />
                      تقدم إعداد المتجر
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'المعلومات الأساسية', done: selectedMerchant.storeSetup.basicInfoCompleted },
                        { label: 'الترخيص التجاري', done: selectedMerchant.storeSetup.licenseCompleted },
                        { label: 'بوابات الدفع', done: selectedMerchant.storeSetup.paymentSetupCompleted },
                        { label: 'الهوية البصرية', done: selectedMerchant.storeSetup.brandIdentityCompleted },
                      ].map((step, i) => (
                        <div key={i} className={`p-3 rounded-lg text-center ${step.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                          {step.done ? <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" /> : <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />}
                          <p className={`text-xs font-medium ${step.done ? 'text-green-700' : 'text-gray-500'}`}>{step.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الإحصائيات */}
                {selectedMerchant._count && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedMerchant._count.invoices || 0}</p>
                      <p className="text-xs text-gray-500">فاتورة</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedMerchant._count.notifications || 0}</p>
                      <p className="text-xs text-gray-500">إشعار</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedMerchant._count.activityLogs || 0}</p>
                      <p className="text-xs text-gray-500">نشاط</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">إغلاق</button>
              {selectedMerchant && selectedMerchant.status === 'ACTIVE' ? (
                <button onClick={() => { handleAction(selectedMerchant.id, 'suspend'); setShowModal(false); }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">إيقاف الحساب</button>
              ) : selectedMerchant && (
                <button onClick={() => { handleAction(selectedMerchant.id, 'activate'); setShowModal(false); }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">تفعيل الحساب</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
