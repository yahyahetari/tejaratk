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

  // Only show sidebar in dashboard routes
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
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

  // Don't render sidebar if not in dashboard
  if (!isDashboardRoute) {
    return null;
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    
    setLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
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
    {
      title: 'لوحة التحكم',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'إعداد المتجر',
      href: '/dashboard/store-setup',
      icon: Store,
      badge: null,
    },
    {
      title: 'الاشتراك',
      href: '/dashboard/subscription',
      icon: CreditCard,
      badge: 'PRO',
    },
    {
      title: 'كود التفعيل',
      href: '/dashboard/activation-key',
      icon: Key,
      badge: null,
    },
    {
      title: 'الفواتير',
      href: '/dashboard/invoices',
      icon: FileText,
      badge: null,
    },
    {
      title: 'الإعدادات',
      href: '/dashboard/settings',
      icon: Settings,
      badge: null,
    },
    {
      title: 'المساعدة',
      href: '/dashboard/help',
      icon: HelpCircle,
      badge: null,
    },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const displayName = merchant?.contactName || merchant?.businessName || 'المستخدم';
  const displayEmail = merchant?.email || 'user@example.com';

  const LogoutButton = ({ isCollapsed = false }) => (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all
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
      {/* Logo - Only show on desktop */}
      {showLogo && (
        <div className="p-5 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
              <div className="relative w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
            {!collapsed && (
              <span className="text-xl font-black gradient-text">
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
                    ? 'gradient-primary text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
                {!collapsed && (
                  <>
                    <span className="font-semibold flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {active && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade Card */}
      {!collapsed && (
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-gray-900">ترقية الخطة</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">احصل على مميزات إضافية مع الخطة الاحترافية</p>
            <Link href="/dashboard/subscription">
              <button className="w-full btn-primary text-sm py-2.5">
                ترقية الآن
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Collapse Button - Desktop Only */}
      <div className="hidden lg:block p-4 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-xl transition-all"
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
      <div className="p-4 border-t border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
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
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors border border-gray-200"
        aria-label="فتح القائمة"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 animate-fade-in backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden lg:flex
          bg-white border-r border-gray-100 min-h-screen transition-all duration-300 flex-col shadow-xl shadow-gray-200/50
          ${collapsed ? 'w-20' : 'w-72'}
        `}
      >
        <SidebarContent showLogo={true} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-gray-100 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out w-72
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">القائمة الرئيسية</h2>
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
                        ? 'gradient-primary text-white shadow-lg shadow-blue-500/30' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
                    <span className="font-semibold flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Upgrade Card - Mobile */}
          <div className="p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-gray-900">ترقية الخطة</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">احصل على مميزات إضافية مع الخطة الاحترافية</p>
              <Link href="/dashboard/subscription">
                <button className="w-full btn-primary text-sm py-2.5">
                  ترقية الآن
                </button>
              </Link>
            </div>
          </div>

          {/* User & Logout - Mobile */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
              </div>
            </div>
            
            <LogoutButton isCollapsed={false} />
          </div>
        </div>
      </aside>
    </>
  );
}