import { buildMetadata } from "@/lib/seo/metadata";
import prisma from '@/lib/db/prisma';
import StoresTable from '@/components/admin/stores-table';
import { 
  Store, 
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp
} from 'lucide-react';

export const metadata = buildMetadata({ 
  title: "إدارة المتاجر", 
  path: "/admin/stores", 
  noIndex: true 
});

async function getStores(searchParams) {
  const page = parseInt(searchParams?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const search = searchParams?.search || '';
  const status = searchParams?.status || '';

  const where = {};
  
  if (search) {
    where.OR = [
      { businessName: { contains: search, mode: 'insensitive' } },
      { contactName: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (status) {
    where.status = status;
  }

  try {
    const [stores, total] = await Promise.all([
      prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true }
          },
          subscription: {
            select: { plan: true, status: true }
          }
        }
      }),
      prisma.merchant.count({ where })
    ]);

    return {
      stores,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching stores:', error);
    return { stores: [], total: 0, pages: 0, currentPage: 1 };
  }
}

async function getStoreStats() {
  try {
    const [total, active, pending, suspended] = await Promise.all([
      prisma.merchant.count(),
      prisma.merchant.count({ where: { status: 'ACTIVE' } }),
      prisma.merchant.count({ where: { status: 'PENDING' } }),
      prisma.merchant.count({ where: { status: 'SUSPENDED' } })
    ]);

    return { total, active, pending, suspended };
  } catch (error) {
    return { total: 0, active: 0, pending: 0, suspended: 0 };
  }
}

export default async function AdminStoresPage({ searchParams }) {
  const [data, stats] = await Promise.all([
    getStores(searchParams),
    getStoreStats()
  ]);

  const statCards = [
    { label: 'إجمالي المتاجر', value: stats.total, icon: Store, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'المتاجر النشطة', value: stats.active, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'في انتظار التفعيل', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { label: 'المتاجر المعلقة', value: stats.suspended, icon: XCircle, gradient: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إدارة المتاجر</h1>
            <p className="text-gray-500">عرض وإدارة جميع المتاجر في المنصة</p>
          </div>
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

      {/* Stores Table */}
      <StoresTable 
        stores={data.stores} 
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        searchParams={searchParams}
      />
    </div>
  );
}
