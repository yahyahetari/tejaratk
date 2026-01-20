'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  Crown,
  Star
} from 'lucide-react';

export default function SubscriptionsTable({ subscriptions, total, pages, currentPage, searchParams }) {
  const router = useRouter();
  const [planFilter, setPlanFilter] = useState(searchParams?.plan || '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.status || '');
  const [openMenu, setOpenMenu] = useState(null);

  const handlePlanFilter = (plan) => {
    const params = new URLSearchParams(searchParams);
    if (plan) {
      params.set('plan', plan);
    } else {
      params.delete('plan');
    }
    params.set('page', '1');
    setPlanFilter(plan);
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const handleStatusFilter = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    setStatusFilter(status);
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/admin/subscriptions?${params.toString()}`);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'نشط', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' };
      case 'TRIAL':
        return { label: 'تجريبي', icon: Clock, color: 'bg-blue-100 text-blue-700' };
      case 'EXPIRED':
        return { label: 'منتهي', icon: XCircle, color: 'bg-red-100 text-red-700' };
      case 'CANCELLED':
        return { label: 'ملغي', icon: XCircle, color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: status || 'غير محدد', icon: Clock, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const getPlanInfo = (plan) => {
    switch (plan) {
      case 'FREE':
        return { label: 'مجاني', icon: Star, color: 'bg-gray-100 text-gray-700', gradient: 'from-gray-400 to-gray-600' };
      case 'BASIC':
        return { label: 'أساسي', icon: Zap, color: 'bg-blue-100 text-blue-700', gradient: 'from-blue-500 to-indigo-600' };
      case 'PRO':
        return { label: 'احترافي', icon: Crown, color: 'bg-purple-100 text-purple-700', gradient: 'from-purple-500 to-pink-600' };
      case 'ENTERPRISE':
        return { label: 'مؤسسي', icon: Crown, color: 'bg-amber-100 text-amber-700', gradient: 'from-amber-500 to-orange-600' };
      default:
        return { label: plan || 'غير محدد', icon: Star, color: 'bg-gray-100 text-gray-700', gradient: 'from-gray-400 to-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Plan Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={planFilter}
              onChange={(e) => handlePlanFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">جميع الخطط</option>
              <option value="FREE">مجاني</option>
              <option value="BASIC">أساسي</option>
              <option value="PRO">احترافي</option>
              <option value="ENTERPRISE">مؤسسي</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="TRIAL">تجريبي</option>
              <option value="EXPIRED">منتهي</option>
              <option value="CANCELLED">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">المتجر</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الخطة</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">تاريخ البدء</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">تاريخ الانتهاء</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.length > 0 ? subscriptions.map((sub) => {
              const statusInfo = getStatusInfo(sub.status);
              const planInfo = getPlanInfo(sub.plan);
              
              return (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planInfo.gradient} flex items-center justify-center`}>
                        <planInfo.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sub.merchant?.businessName || '-'}</p>
                        <p className="text-sm text-gray-500">{sub.merchant?.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${planInfo.color}`}>
                      <planInfo.icon className="h-3.5 w-3.5" />
                      {planInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>
                      <statusInfo.icon className="h-3.5 w-3.5" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {formatDate(sub.startDate)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {formatDate(sub.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === sub.id ? null : sub.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {openMenu === sub.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenu(null)}
                          />
                          <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Edit className="h-4 w-4" />
                              تعديل الخطة
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                              <RefreshCw className="h-4 w-4" />
                              تجديد الاشتراك
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">لا يوجد اشتراكات</p>
                  <p className="text-sm">لم يتم العثور على اشتراكات مطابقة للفلتر</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="p-4 lg:p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            عرض {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} من {total} اشتراك
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              let pageNum;
              if (pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pages - 2) {
                pageNum = pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pages}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
