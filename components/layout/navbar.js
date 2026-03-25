'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/common/logo';
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Detect if we're inside a dark theme
    const themeEl = document.querySelector('[data-theme]');
    if (themeEl) {
      setIsDark(themeEl.getAttribute('data-theme') === 'dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/features', label: 'المميزات' },
    { href: '/pricing', label: 'الأسعار' },
    { href: '/about', label: 'من نحن' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? isDark
          ? 'bg-[#0a0a0f]/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${isActive(link.href)
                  ? isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'
                  : isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/dashboard">
              <button className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 rounded-xl ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
                <LayoutDashboard className="h-4 w-4" />
                لوحة التحكم
              </button>
            </Link>
            <Link href="/login">
              <button className={`px-5 py-2.5 font-semibold transition-colors flex items-center gap-2 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}>
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-primary flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                ابدأ مجاناً
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 shadow-xl transition-all duration-300 ${isDark ? 'bg-[#12121a] border-b border-white/5' : 'bg-white border-b border-gray-100'} ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="container-custom py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-semibold transition-all ${isActive(link.href)
                ? isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50'
                : isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl font-semibold transition-all ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-white/5' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              لوحة التحكم
            </span>
          </Link>

          <div className={`pt-4 mt-4 space-y-3 ${isDark ? 'border-t border-white/5' : 'border-t border-gray-100'}`}>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <button className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isDark ? 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10' : 'btn-secondary'}`}>
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </button>
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                <UserPlus className="h-4 w-4" />
                ابدأ مجاناً
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
