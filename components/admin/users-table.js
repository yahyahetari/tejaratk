'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

export default function UsersTable({ users, total, pages, currentPage, searchParams }) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams?.search || '');
  const [roleFilter, setRoleFilter] = useState(searchParams?.role || '');
  const [openMenu, setOpenMenu] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleRoleFilter = (role) => {
    const params = new URLSearchParams(searchParams);
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    params.set('page', '1');
    setRoleFilter(role);
    router.push(`/admin/users?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'مسؤول', icon: Shield, color: 'bg-purple-100 text-purple-700' };
      case 'MERCHANT':
        return { label: 'تاجر', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' };
      default:
        return { label: role, icon: Users, color: 'bg-gray-100 text-gray-700' };
    }
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
                placeholder="بحث بالبريد الإلكتروني..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">جميع الأدوار</option>
              <option value="ADMIN">المسؤولين</option>
              <option value="MERCHANT">التجار</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">المستخدم</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الدور</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">المتجر</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">الحالة</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">تاريخ التسجيل</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 ? users.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              const statusInfo = getStatusInfo(user.merchant?.status);
              
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                        user.role === 'ADMIN' ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-indigo-600'
                      } flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${roleInfo.color}`}>
                      <roleInfo.icon className="h-3.5 w-3.5" />
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.merchant ? (
                      <span className="text-gray-900 font-medium">{user.merchant.businessName}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.merchant ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>
                        <statusInfo.icon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      {openMenu === user.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenu(null)}
                          />
                          <div className="absolute left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Eye className="h-4 w-4" />
                              عرض التفاصيل
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Edit className="h-4 w-4" />
                              تعديل
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 className="h-4 w-4" />
                              حذف
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
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">لا يوجد مستخدمين</p>
                  <p className="text-sm">لم يتم العثور على مستخدمين مطابقين للبحث</p>
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
            عرض {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} من {total} مستخدم
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
