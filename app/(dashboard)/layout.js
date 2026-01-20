import { getSession } from '@/lib/auth/session';
import DashboardSidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/header';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ في الجلسة</h1>
          <p className="text-gray-600 mb-4">لم يتم العثور على بيانات الجلسة</p>
          <a href="/login" className="text-blue-600 hover:underline">
            العودة لتسجيل الدخول
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar merchant={session.merchant} />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <DashboardHeader session={session} />
        
        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}