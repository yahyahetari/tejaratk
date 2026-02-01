import { buildMetadata } from "@/lib/seo/metadata";
import prisma from '@/lib/db/prisma';
import SubscriptionsTable from '@/components/admin/subscriptions-table';
import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = buildMetadata({
  title: "إدارة الاشتراكات",
  path: "/admin/subscriptions",
  noIndex: true
});

async function getSubscriptions(searchParams) {
  const page = parseInt(searchParams?.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const plan = searchParams?.plan || '';
  const status = searchParams?.status || '';

  const where = {};

  if (plan) {
    where.plan = plan;
  }

  if (status) {
    where.status = status;
  }

  try {
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: {
            select: {
              id: true,
              businessName: true,
              contactName: true,
              user: { select: { email: true } }
            }
          }
        }
      }),
      prisma.subscription.count({ where })
    ]);

    return {
      subscriptions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return { subscriptions: [], total: 0, pages: 0, currentPage: 1 };
  }
}

async function getSubscriptionStats() {
  try {
    const [total, active, trial, expired, byPlan] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { status: 'TRIAL' } }),
      prisma.subscription.count({ where: { status: 'EXPIRED' } }),
      prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true }
      })
    ]);

    const planCounts = {};
    byPlan.forEach(p => {
      planCounts[p.plan] = p._count.plan;
    });

    return { total, active, trial, expired, planCounts };
  } catch (error) {
    return { total: 0, active: 0, trial: 0, expired: 0, planCounts: {} };
  }
}

export default async function AdminSubscriptionsPage({ searchParams }) {
  const [data, stats] = await Promise.all([
    getSubscriptions(searchParams),
    getSubscriptionStats()
  ]);

  const statCards = [
    { label: 'إجمالي الاشتراكات', value: stats.total, icon: CreditCard, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'اشتراكات نشطة', value: stats.active, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'فترة تجريبية', value: stats.trial, icon: Clock, gradient: 'from-amber-500 to-orange-600' },
    { label: 'منتهية', value: stats.expired, icon: XCircle, gradient: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إدارة الاشتراكات</h1>
            <p className="text-gray-500">عرض وإدارة جميع اشتراكات المتاجر</p>
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

      {/* Plan Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">توزيع الخطط</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { plan: 'FREE', label: 'مجاني', color: 'bg-gray-500' },
            { plan: 'BASIC', label: 'أساسي', color: 'bg-blue-500' },
            { plan: 'PRO', label: 'احترافي', color: 'bg-purple-500' },
            { plan: 'ENTERPRISE', label: 'مؤسسي', color: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.plan} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {(stats.planCounts[item.plan] || 0).toLocaleString('ar-SA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <SubscriptionsTable
        subscriptions={data.subscriptions}
        total={data.total}
        pages={data.pages}
        currentPage={data.currentPage}
        searchParams={searchParams}
      />
    </div>
  );
}
