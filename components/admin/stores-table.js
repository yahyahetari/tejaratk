'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Power,
  Ban
} from 'lucide-react';

export default function StoresTable({ stores, total, pages, currentPage, searchParams }) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams?.search || '');
  const [statusFilter, setStatusFilter] = useState(searchParams?.status || '');
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/stores?${params.toString()}`);
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
    router.push(`/admin/stores?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/admin/stores?${params.toString()}`);
  };

  const handleStatusChange = async (storeId, newStatus) => {
    setLoading(storeId);
    try {
      const response = await fetch(`/api/admin/stores/${storeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(null);
      setOpenMenu(null);
    }
  };

  const formatDate = (date) => {
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
      case 'PENDING':
        return { label: 'في الانتظار', icon: Clock, color: 'bg-amber-100 text-amber-700' };
      case 'SUSPENDED':
        return { label: 'معلق', icon: XCircle, color: 'bg-red-100 text-red-700' };
      default:
        return { label: status || 'غير محدد', icon: Clock, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const getPlanInfo = (plan) => {
    switch (plan) {
      case 'FREE':
        return { label: 'مجاني', color: 'bg-gray-100 text-gray-700' };
      case 'BASIC':
        return { label: 'أساسي', color: 'bg-blue-100 text-blue-700' };
      case 'PRO':
        return { label: 'احترافي', color: 'bg-purple-100 text-purple-700' };
      case 'ENTERPRISE':
        return { label: 'مؤسسي', color: 'bg-amber-100 text-amber-700' };
      default:
        return { label: plan || 'غير محدد', color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث باسم المتجر أو صاحب المتجر..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="PENDING">في الانتظار</option>
              <option value="SUSPENDED">معلق</option>
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
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">البريد الإلكتروني</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الخطة</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">تاريخ التسجيل</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stores.length > 0 ? stores.map((store) => {
              const statusInfo = getStatusInfo(store.status);
              const planInfo = getPlanInfo(store.subscription?.plan);
              
              return (
                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Store className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{store.businessName}</p>
                        <p className="text-sm text-gray-500">{store.contactName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{store.user?.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${planInfo.color}`}>
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
                    {formatDate(store.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === store.id ? null : store.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                        disabled={loading === store.id}
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {openMenu === store.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenu(null)}
                          />
                          <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </button>
                            {store.subdomain && (
                              <a 
                                href={`https://${store.subdomain}.tejaratk.com`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                                زيارة المتجر
                              </a>
                            )}
                            <hr className="my-1" />
                            {store.status !== 'ACTIVE' && (
                              <button 
                                onClick={() => handleStatusChange(store.id, 'ACTIVE')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Power className="h-4 w-4" />
                                تفعيل المتجر
                              </button>
                            )}
                            {store.status !== 'SUSPENDED' && (
                              <button 
                                onClick={() => handleStatusChange(store.id, 'SUSPENDED')}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Ban className="h-4 w-4" />
                                تعليق المتجر
                              </button>
                            )}
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
                  <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">لا يوجد متاجر</p>
                  <p className="text-sm">لم يتم العثور على متاجر مطابقة للبحث</p>
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
            عرض {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} من {total} متجر
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
