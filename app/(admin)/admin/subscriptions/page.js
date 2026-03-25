'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, CheckCircle, Clock, XCircle, Search, Filter, Loader2,
  X, Calendar, Mail, Globe, User, Package, Sparkles
} from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, trial: 0, expired: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewedSubs, setViewedSubs] = useState([]);

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('viewedSubscriptions') || '[]');
      setViewedSubs(viewed);
    } catch { setViewedSubs([]); }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscriptions?status=${statusFilter}`);
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.subscriptions || []);
        setStats({
          total: data.pagination?.total || 0,
          active: data.stats?.byStatus?.find(s => s.status === 'ACTIVE')?._count || 0,
          trial: data.stats?.byStatus?.find(s => s.status === 'TRIALING')?._count || 0,
          expired: data.stats?.byStatus?.find(s => s.status === 'EXPIRED')?._count || 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchSubscriptions(); }, [fetchSubscriptions]);

  const isNewSub = (sub) => !viewedSubs.includes(sub.id);

  const handleViewSub = async (sub) => {
    try {
      setDetailLoading(true);
      setShowModal(true);

      const newViewed = [...new Set([...viewedSubs, sub.id])];
      setViewedSubs(newViewed);
      localStorage.setItem('viewedSubscriptions', JSON.stringify(newViewed));

      // جلب تفاصيل التاجر المرتبط
      if (sub.merchantId) {
        const response = await fetch(`/api/admin/merchants/${sub.merchantId}`);
        const data = await response.json();
        if (data.success) {
          setSelectedSub({ ...sub, merchantDetails: data.merchant });
        } else {
          setSelectedSub(sub);
        }
      } else {
        setSelectedSub(sub);
      }
    } catch {
      setSelectedSub(sub);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : 'غير محدد';
  const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'غير محدد';

  const getStatusBadge = (status) => {
    const cfg = {
      ACTIVE: { l: 'نشط', c: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      TRIALING: { l: 'تجريبي', c: 'bg-blue-100 text-blue-700', icon: Clock },
      EXPIRED: { l: 'منتهي', c: 'bg-red-100 text-red-700', icon: XCircle },
      CANCELLED: { l: 'ملغي', c: 'bg-gray-100 text-gray-700', icon: XCircle },
      PAUSED: { l: 'متوقف', c: 'bg-yellow-100 text-yellow-700', icon: Clock },
      PAST_DUE: { l: 'متأخر', c: 'bg-orange-100 text-orange-700', icon: Clock },
      OVERDUE: { l: 'متأخر', c: 'bg-orange-100 text-orange-700', icon: Clock },
    };
    const s = cfg[status] || { l: status || 'غير محدد', c: 'bg-gray-100 text-gray-700', icon: Clock };
    const Icon = s.icon;
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${s.c}`}><Icon className="w-3.5 h-3.5" />{s.l}</span>;
  };

  const daysRemaining = (endDate) => {
    if (!endDate) return null;
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const statCards = [
    { label: 'إجمالي الاشتراكات', value: stats.total, icon: CreditCard, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'اشتراكات نشطة', value: stats.active, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'فترة تجريبية', value: stats.trial, icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { label: 'جدد (لم يتم عرضهم)', value: subscriptions.filter(s => isNewSub(s)).length, icon: Sparkles, gradient: 'from-pink-500 to-rose-600' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
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
            <option value="TRIALING">تجريبي</option>
            <option value="EXPIRED">منتهي</option>
          </select>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {subscriptions.length === 0 ? (
          <div className="p-12 text-center text-gray-500"><CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>لا يوجد اشتراكات</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {subscriptions.map((sub) => {
              const days = daysRemaining(sub.endDate || sub.currentPeriodEnd);
              return (
                <div key={sub.id} className="p-4 lg:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        {isNewSub(sub) && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">جـ</span>
                        )}
                      </div>
                      <div>
                        <button onClick={() => handleViewSub(sub)}
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                          {sub.merchant?.businessName || 'غير محدد'}
                        </button>
                        <p className="text-sm text-gray-500">{sub.planName || sub.planType || 'أساسي'} • {sub.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {days !== null && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${days <= 0 ? 'bg-red-100 text-red-700' : days <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          {days <= 0 ? 'منتهي' : `${days} يوم متبقي`}
                        </span>
                      )}
                      {getStatusBadge(sub.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal تفاصيل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل الاشتراك</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {detailLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
            ) : selectedSub && (
              <div className="p-6 space-y-6">
                {/* معلومات التاجر */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {(selectedSub.merchant?.businessName || selectedSub.merchantDetails?.businessName || 'S').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedSub.merchant?.businessName || selectedSub.merchantDetails?.businessName || 'غير محدد'}</h3>
                    <p className="text-gray-500">{selectedSub.planName || selectedSub.planType || 'أساسي'}</p>
                    {getStatusBadge(selectedSub.status)}
                  </div>
                </div>

                {/* الجدول الزمني */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-600" />الجدول الزمني للاشتراك</h4>
                  <div className="space-y-3">
                    {selectedSub.merchantDetails && (
                      <>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">📝 تسجيل الحساب</span>
                          <span className="font-medium">{formatDateTime(selectedSub.merchantDetails.user?.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">📋 إضافة بيانات التاجر</span>
                          <span className="font-medium">{formatDateTime(selectedSub.merchantDetails.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="text-sm text-gray-600">🔑 آخر تسجيل دخول</span>
                          <span className="font-medium">{selectedSub.merchantDetails.lastLogin ? formatDateTime(selectedSub.merchantDetails.lastLogin) : 'لم يسجل دخول بعد'}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">💳 بداية الاشتراك</span>
                      <span className="font-medium">{formatDateTime(selectedSub.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">⏰ نهاية الاشتراك</span>
                      <span className={`font-medium ${selectedSub.endDate && new Date(selectedSub.endDate) < new Date() ? 'text-red-600' : ''}`}>
                        {formatDateTime(selectedSub.endDate || selectedSub.currentPeriodEnd)}
                      </span>
                    </div>
                    {selectedSub.nextBillingDate && (
                      <div className="flex items-center justify-between bg-white rounded-lg p-3">
                        <span className="text-sm text-gray-600">📅 الدفع القادم</span>
                        <span className="font-medium">{formatDate(selectedSub.nextBillingDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* تفاصيل الاشتراك */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-600" />تفاصيل الخطة</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">الخطة</p><p className="font-bold">{selectedSub.planName || 'أساسي'}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">الدورة</p><p className="font-medium">{selectedSub.billingCycle === 'YEARLY' ? 'سنوي' : 'شهري'}</p></div>
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">المبلغ</p><p className="font-bold">{(selectedSub.amount || 0).toLocaleString()} {selectedSub.currency || 'OMR'}</p></div>
                  </div>
                </div>

                {/* تفاصيل المتجر */}
                {selectedSub.merchantDetails?.store && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-600" />المتجر</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">اسم المتجر</p><p className="font-bold">{selectedSub.merchantDetails.store.brandName || '-'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">الشعار</p><p className="font-medium">{selectedSub.merchantDetails.store.tagline || '-'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">العملة</p><p className="font-medium">{selectedSub.merchantDetails.store.currency || 'OMR'}</p></div>
                      <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">اللغة</p><p className="font-medium">{selectedSub.merchantDetails.store.language === 'ar' ? 'العربية' : 'English'}</p></div>
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
