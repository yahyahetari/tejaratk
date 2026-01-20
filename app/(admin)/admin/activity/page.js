import { buildMetadata } from "@/lib/seo/metadata";
import prisma from '@/lib/db/prisma';
import {
  Activity,
  User,
  Store,
  CreditCard,
  LogIn,
  LogOut,
  Settings,
  FileText,
  Clock,
  Filter,
  Key,
  Mail
} from 'lucide-react';

export const metadata = buildMetadata({
  title: "سجل النشاط",
  path: "/admin/activity",
  noIndex: true
});

async function getActivityLogs() {
  try {
    const logs = await prisma.activityLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          select: {
            businessName: true,
            user: { select: { email: true } }
          }
        }
      }
    });
    return logs;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${days} يوم`;
}

function getActivityIcon(action) {
  const actionLower = action?.toLowerCase() || '';
  if (actionLower.includes('login')) return { icon: LogIn, color: 'bg-emerald-100 text-emerald-600' };
  if (actionLower.includes('logout')) return { icon: LogOut, color: 'bg-gray-100 text-gray-600' };
  if (actionLower.includes('store') || actionLower.includes('merchant')) return { icon: Store, color: 'bg-blue-100 text-blue-600' };
  if (actionLower.includes('subscription') || actionLower.includes('payment')) return { icon: CreditCard, color: 'bg-purple-100 text-purple-600' };
  if (actionLower.includes('user') || actionLower.includes('register')) return { icon: User, color: 'bg-amber-100 text-amber-600' };
  if (actionLower.includes('setting')) return { icon: Settings, color: 'bg-indigo-100 text-indigo-600' };
  if (actionLower.includes('invoice')) return { icon: FileText, color: 'bg-teal-100 text-teal-600' };
  if (actionLower.includes('key') || actionLower.includes('activation')) return { icon: Key, color: 'bg-orange-100 text-orange-600' };
  if (actionLower.includes('email') || actionLower.includes('verification')) return { icon: Mail, color: 'bg-pink-100 text-pink-600' };
  return { icon: Activity, color: 'bg-gray-100 text-gray-600' };
}

export default async function AdminActivityPage() {
  const activityLogs = await getActivityLogs();

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">سجل النشاط</h1>
            <p className="text-gray-500">متابعة جميع الأنشطة في المنصة</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">آخر الأنشطة</h2>
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {activityLogs.length} نشاط
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {activityLogs.length > 0 ? activityLogs.map((log) => {
            const { icon: Icon, color } = getActivityIcon(log.action);

            return (
              <div key={log.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{log.description || log.action}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {log.merchant?.user?.email || log.merchant?.businessName || 'النظام'}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(log.createdAt)}</span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-sm text-gray-400 flex-shrink-0 hidden lg:block">
                    {new Date(log.createdAt).toLocaleString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>لا يوجد أنشطة مسجلة بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

