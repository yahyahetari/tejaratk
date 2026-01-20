'use client';

import Link from 'next/link';
import { Store, CreditCard, FileDown, Palette, ArrowLeft, Sparkles, Zap } from 'lucide-react';

export default function QuickActions({ hasStoreSetup = false }) {
  const actions = [
    {
      title: 'إعداد المتجر',
      description: hasStoreSetup ? 'تعديل إعدادات المتجر' : 'قم بإعداد متجرك الإلكتروني',
      icon: Store,
      href: '/dashboard/store-setup',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      shadow: 'shadow-blue-500/30',
      featured: !hasStoreSetup,
    },
    {
      title: 'إدارة الاشتراك',
      description: 'عرض وإدارة اشتراكك',
      icon: CreditCard,
      href: '/dashboard/subscription',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      shadow: 'shadow-emerald-500/30',
    },
    {
      title: 'الفواتير',
      description: 'تحميل وعرض الفواتير',
      icon: FileDown,
      href: '/dashboard/invoices',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      shadow: 'shadow-purple-500/30',
    },
    {
      title: 'تخصيص التصميم',
      description: 'تخصيص مظهر متجرك',
      icon: Palette,
      href: '/dashboard/design',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      shadow: 'shadow-amber-500/30',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">إجراءات سريعة</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div className={`card-premium p-3 sm:p-4 lg:p-5 group hover:scale-[1.03] transition-all duration-300 relative h-full rounded-lg sm:rounded-xl lg:rounded-2xl ${
                action.featured 
                  ? 'border-2 border-blue-500 ring-2 sm:ring-4 ring-blue-100' 
                  : ''
              }`}>
                {action.featured && (
                  <div className="absolute top-8  right-24  lg:right-24 gradient-primary text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="inline">ابدأ هنا</span>
                  </div>
                )}
                
                <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 shadow-md sm:shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-white" />
                </div>
                
                <h3 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {action.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mb-2 sm:mb-3 lg:mb-4 line-clamp-2">{action.description}</p>
                
                <div className="flex items-center text-blue-600 text-[10px] sm:text-xs lg:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>المتابعة</span>
                  <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}