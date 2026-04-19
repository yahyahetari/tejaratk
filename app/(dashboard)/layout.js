import { getSession } from '@/lib/auth/session';
import DashboardSidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/header';

export const dynamic = 'force-dynamic';

/**
 * Dashboard Layout Component
 * Note: Authentication is handled by middleware
 */
export default async function DashboardLayout({ children }) {
  // Get session (middleware already verified authentication)
  const session = await getSession();

  // This should never happen due to middleware, but just in case
  if (!session || !session.merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">خطأ في الجلسة</h1>
          <p className="text-gray-400 mb-4">لم يتم العثور على بيانات الجلسة</p>
          <a href="/login" className="text-blue-400 hover:underline">
            العودة لتسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 flex relative">
      {/* Sidebar */}
      <DashboardSidebar merchant={session.merchant} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-emerald-900 lg:rounded-tr-[2.5rem] border-r border-emerald-800/50 relative z-10 transition-all duration-300">
        {/* Header */}
        <DashboardHeader session={session} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:p-8 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}