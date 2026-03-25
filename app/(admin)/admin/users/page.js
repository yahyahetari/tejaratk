'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Search, Filter, Download, Shield, ShoppingBag,
  Loader2, CheckCircle, X, Calendar, CreditCard, Mail, Globe, User,
  Clock, Package, Sparkles
} from 'lucide-react';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, merchants: 0, thisMonth: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewedUsers, setViewedUsers] = useState([]);

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('viewedUsers') || '[]');
      setViewedUsers(viewed);
    } catch { setViewedUsers([]); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/merchants?role=${roleFilter}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data?.merchants || []);
        setStats({
          total: data.data?.pagination?.total || 0,
          admins: 0,
          merchants: data.data?.pagination?.total || 0,
          thisMonth: 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const isNewUser = (user) => !viewedUsers.includes(user.id);

  const handleViewUser = async (user) => {
    try {
      setDetailLoading(true);
      setShowModal(true);

      const newViewed = [...new Set([...viewedUsers, user.id])];
      setViewedUsers(newViewed);
      localStorage.setItem('viewedUsers', JSON.stringify(newViewed));

      const response = await fetch(`/api/admin/merchants/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedUser(data.merchant);
      } else {
        setSelectedUser(user);
      }
    } catch {
      setSelectedUser(user);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const csvData = users.map(u => ({
        'الاسم': u.businessName || 'غير محدد',
        'البريد': u.user?.email || u.email || '',
        'الهاتف': u.phone || '',
        'الحالة': u.status === 'ACTIVE' ? 'نشط' : 'غير نشط',
        'التسجيل': u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-SA') : ''
      }));
      const headers = Object.keys(csvData[0] || {});
      const csv = [headers.join(','), ...csvData.map(r => headers.map(h => `"${r[h] || ''}"`).join(','))].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch { alert('حدث خطأ أثناء التصدير'); } finally { setExporting(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : 'غير محدد';
  const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير محدد';

  const getSubStatusBadge = (status) => {
    const cfg = { ACTIVE: { l: 'نشط', c: 'bg-emerald-100 text-emerald-700' }, TRIALING: { l: 'تجريبي', c: 'bg-blue-100 text-blue-700' }, EXPIRED: { l: 'منتهي', c: 'bg-red-100 text-red-700' } };
    const s = cfg[status] || { l: status || 'غير محدد', c: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.c}`}>{s.l}</span>;
  };

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats.total, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'المسؤولين', value: stats.admins, icon: Shield, gradient: 'from-purple-500 to-pink-600' },
    { label: 'التجار', value: stats.merchants, icon: ShoppingBag, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'جدد (لم يتم عرضهم)', value: users.filter(u => isNewUser(u)).length, icon: Sparkles, gradient: 'from-amber-500 to-orange-600' },
  ];

  const filteredUsers = users.filter(u =>
    !search || u.businessName?.toLowerCase().includes(search.toLowerCase()) || u.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-500">عرض وإدارة جميع المستخدمين في المنصة</p>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting || users.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>{exporting ? 'جاري التصدير...' : 'تصدير CSV'}</span>
        </button>
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
            <input type="text" placeholder="البحث بالبريد أو الاسم..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">جميع الأدوار</option>
              <option value="ADMIN">مسؤول</option>
              <option value="MERCHANT">تاجر</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500"><Users className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>لا يوجد مستخدمين</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user.businessName?.charAt(0) || user.user?.email?.charAt(0) || 'U'}
                      </div>
                      {isNewUser(user) && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">جـ</span>
                      )}
                    </div>
                    <div>
                      <button onClick={() => handleViewUser(user)}
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                        {user.businessName || 'غير محدد'}
                      </button>
                      <p className="text-sm text-gray-500">{user.user?.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal تفاصيل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل المستخدم</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {detailLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : selectedUser && (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selectedUser.businessName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.businessName || 'غير محدد'}</h3>
                    <p className="text-gray-500">{selectedUser.user?.email || selectedUser.email}</p>
                  </div>
                </div>

                {/* الجدول الزمني */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />الجدول الزمني</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">📝 تاريخ التسجيل</span>
                      <span className="font-medium text-gray-900">{formatDateTime(selectedUser.user?.createdAt || selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">📋 تاريخ إضافة البيانات</span>
                      <span className="font-medium text-gray-900">{formatDateTime(selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">🔑 آخر تسجيل دخول</span>
                      <span className="font-medium text-gray-900">{selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'لم يسجل دخول بعد'}</span>
                    </div>
                    {selectedUser.subscription && (
                      <>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">💳 تاريخ الاشتراك</span>
                          <span className="font-medium">{formatDateTime(selectedUser.subscription.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">⏰ انتهاء الاشتراك</span>
                          <span className={`font-medium ${selectedUser.subscription.endDate && new Date(selectedUser.subscription.endDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDateTime(selectedUser.subscription.endDate || selectedUser.subscription.currentPeriodEnd)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* الاشتراك */}
                {selectedUser.subscription && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-600" />الاشتراك</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">الخطة</p><p className="font-bold">{selectedUser.subscription.planName || 'أساسي'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">الحالة</p>{getSubStatusBadge(selectedUser.subscription.status)}</div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">المبلغ</p><p className="font-bold">{(selectedUser.subscription.amount || 0).toLocaleString()} ر.ع</p></div>
                    </div>
                  </div>
                )}

                {/* المتجر */}
                {selectedUser.store && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-600" />المتجر</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">اسم المتجر</p><p className="font-bold">{selectedUser.store.brandName || selectedUser.storeName || '-'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">الشعار</p><p className="font-medium">{selectedUser.store.tagline || '-'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">العملة</p><p className="font-medium">{selectedUser.store.currency || 'OMR'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">اللغة</p><p className="font-medium">{selectedUser.store.language === 'ar' ? 'العربية' : 'English'}</p></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
