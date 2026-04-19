'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Key,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingCart,
  FileText,
  User,
  Sparkles,
  X,
  Menu,
  Loader2
} from 'lucide-react';

export default function Sidebar({ merchant }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isDashboardRoute = pathname.startsWith('/dashboard');

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  if (!isDashboardRoute) {
    return null;
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      } else {
        console.error('Logout failed');
        setLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const menuItems = [
    { title: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
    { title: 'إعداد المتجر', href: '/dashboard/store-setup', icon: Store },
    { title: 'الاشتراك', href: '/dashboard/subscription', icon: CreditCard, badge: 'PRO' },
    { title: 'الفواتير', href: '/dashboard/invoices', icon: FileText },
    { title: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
    { title: 'المساعدة', href: '/dashboard/help', icon: HelpCircle },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const displayName = merchant?.contactName || merchant?.businessName || 'المستخدم';
  const displayEmail = merchant?.email || 'user@example.com';

  const LogoutButton = ({ isCollapsed = false }) => (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      {loggingOut ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <LogOut className="h-5 w-5" />
      )}
      {!isCollapsed && (
        <span className="font-semibold">
          {loggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
        </span>
      )}
    </button>
  );

  const SidebarContent = ({ showLogo = true }) => (
    <>
      {/* Logo */}
      {showLogo && (
        <div className="p-5 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
            {!collapsed && (
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                تجارتك
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group
                  ${active
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.title : undefined}
              >
                {active && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-blue-500 rounded-l-full"></div>
                )}
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'} transition-colors`} />
                {!collapsed && (
                  <>
                    <span className={`font-semibold flex-1 ${active ? 'text-blue-400' : ''}`}>{item.title}</span>
                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade Card */}
      {!collapsed && (
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-gray-200">ترقية الخطة</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">احصل على مميزات إضافية مع الخطة الاحترافية</p>
            <Link href="/dashboard/subscription">
              <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                ترقية الآن
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Collapse Button - Desktop */}
      <div className="hidden lg:block p-4 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-white/5 hover:text-gray-400 rounded-xl transition-all"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">طي القائمة</span>
            </>
          )}
        </button>
      </div>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-200 truncate">{displayName}</p>
              <p className="text-xs text-gray-600 truncate">{displayEmail}</p>
            </div>
          </div>
        )}
        <LogoutButton isCollapsed={collapsed} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-emerald-900 rounded-xl shadow-lg flex items-center justify-center text-emerald-100 hover:text-white transition-colors border border-emerald-700/30"
        aria-label="فتح القائمة"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40 animate-fade-in backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex
          bg-emerald-950 border-r border-emerald-800/50 min-h-screen transition-all duration-300 flex-col
          ${collapsed ? 'w-20' : 'w-72'}
        `}
      >
        <SidebarContent showLogo={true} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-50 bg-emerald-950 border-r border-emerald-800/50 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out w-72
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-200">القائمة الرئيسية</h2>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 p-4">
            <div className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group
                      ${active
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-blue-500 rounded-l-full"></div>
                    )}
                    <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-gray-600 group-hover:text-gray-400'} transition-colors`} />
                    <span className={`font-semibold flex-1 ${active ? 'text-blue-400' : ''}`}>{item.title}</span>
                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Upgrade Card - Mobile */}
          <div className="p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-200">ترقية الخطة</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">احصل على مميزات إضافية مع الخطة الاحترافية</p>
              <Link href="/dashboard/subscription">
                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                  ترقية الآن
                </button>
              </Link>
            </div>
          </div>

          {/* User & Logout - Mobile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-200 truncate">{displayName}</p>
                <p className="text-xs text-gray-600 truncate">{displayEmail}</p>
              </div>
            </div>
            <LogoutButton isCollapsed={false} />
          </div>
        </div>
      </aside>
    </>
  );
}