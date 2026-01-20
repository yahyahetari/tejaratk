'use client';

import { 
  Store, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Eye
} from 'lucide-react';

const iconMap = {
  Store: Store,
  CreditCard: CreditCard,
  Calendar: Calendar,
  CheckCircle: CheckCircle,
  Activity: Activity,
  Users: Users,
  ShoppingBag: ShoppingBag,
  DollarSign: DollarSign,
  Package: Package,
  Eye: Eye,
};

const colorClasses = {
  success: {
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    shadow: 'shadow-emerald-500/30',
  },
  warning: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    shadow: 'shadow-amber-500/30',
  },
  info: {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    shadow: 'shadow-blue-500/30',
  },
  danger: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    shadow: 'shadow-red-500/30',
  },
  primary: {
    gradient: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    shadow: 'shadow-purple-500/30',
  },
};

export default function StatsCard({ stat }) {
  const Icon = iconMap[stat.icon] || Store;
  const colors = colorClasses[stat.color] || colorClasses.primary;
  const isPositiveTrend = stat.trendValue && stat.trendValue > 0;

  return (
    <div className="card-premium p-3 sm:p-4 lg:p-5 group hover:scale-[1.02] transition-all duration-300 h-full rounded-lg sm:rounded-xl lg:rounded-2xl">
      <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md sm:shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-white" />
        </div>
        {stat.badge && (
          <span className={`px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 ${colors.bg} ${colors.text} text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap`}>
            {stat.badge}
          </span>
        )}
      </div>
      
      <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-gray-500 mb-1 sm:mb-1.5 truncate">{stat.name}</h3>
      <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 mb-1 sm:mb-2 truncate">{stat.value}</p>
      
      {stat.trend && (
        <div className={`flex items-center gap-1 ${isPositiveTrend ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositiveTrend ? (
            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
          ) : (
            <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
          )}
          <span className="text-[10px] sm:text-xs lg:text-sm font-semibold">{stat.trend}</span>
        </div>
      )}
      
      {stat.progress !== null && stat.progress !== undefined && (
        <div className="mt-2 sm:mt-3 lg:mt-4">
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5">
            <span className="text-gray-500">التقدم</span>
            <span className={`font-bold ${colors.text}`}>{stat.progress}%</span>
          </div>
          <div className="h-1.5 sm:h-2 lg:h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        </div>
      )}

      {stat.description && (
        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 mt-1.5 sm:mt-2 lg:mt-3 line-clamp-2">{stat.description}</p>
      )}
    </div>
  );
}