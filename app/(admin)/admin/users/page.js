import { buildMetadata } from "@/lib/seo/metadata";
import prisma from '@/lib/db/prisma';
import UsersTable from '@/components/admin/users-table';
import { 
  Users, 
  UserPlus,
  Search,
  Filter,
  Download,
  Shield,
  ShoppingBag
} from 'lucide-react';

export const metadata = buildMetadata({ 
  title: "إدارة المستخدمين", 
  path: "/admin/users", 
  noIndex: true 
});

async function getUsers(searchParams) {
  const page = parseInt(searchParams?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const search = searchParams?.search || '';
  const role = searchParams?.role || '';

  const where = {};
  
  if (search) {
    where.email = { contains: search, mode: 'insensitive' };
  }
  
  if (role) {
    where.role = role;
  }

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: {
            select: {
              id: true,
              businessName: true,
              status: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0, pages: 0, currentPage: 1 };
  }
}

async function getUserStats() {
  try {
    const [total, admins, merchants, thisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'MERCHANT' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    return { total, admins, merchants, thisMonth };
  } catch (error) {
    return { total: 0, admins: 0, merchants: 0, thisMonth: 0 };
  }
}

export default async function AdminUsersPage({ searchParams }) {
  const [data, stats] = await Promise.all([
    getUsers(searchParams),
    getUserStats()
  ]);

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats.total, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'المسؤولين', value: stats.admins, icon: Shield, gradient: 'from-purple-500 to-pink-600' },
    { label: 'التجار', value: stats.merchants, icon: ShoppingBag, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'هذا الشهر', value: stats.thisMonth, icon: UserPlus, gradient: 'from-amber-500 to-orange-600' },
  ];

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
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
            <Download className="h-4 w-4" />
            <span>تصدير</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all">
            <UserPlus className="h-4 w-4" />
            <span>إضافة مستخدم</span>
          </button>
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

      {/* Users Table */}
      <UsersTable 
        users={data.users} 
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        searchParams={searchParams}
      />
    </div>
  );
}
