import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminTopbar from '@/components/admin/admin-topbar';

export default async function AdminLayout({ children }) {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="lg:mr-72">
        {/* Top Bar */}
        <AdminTopbar user={session.user} />
        
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}