'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Activity,
  LogOut,
  ChevronLeft,
  ShoppingCart,
  Menu,
  X,
  Bell,
  Shield
} from 'lucide-react';

const menuItems = [
  {
    title: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'المستخدمين',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'المتاجر',
    href: '/admin/stores',
    icon: Store,
  },
  {
    title: 'الاشتراكات',
    href: '/admin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'التقارير',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'الفواتير',
    href: '/admin/invoices',
    icon: FileText,
  },
  {
    title: 'سجل النشاط',
    href: '/admin/activity',
    icon: Activity,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white">تجارتك</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">لوحة المسؤول</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
              <span className="font-medium">{item.title}</span>
              {isActive && <ChevronLeft className="h-4 w-4 mr-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 right-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 right-0 w-72 bg-gray-900 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
