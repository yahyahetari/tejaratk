import { cn } from '@/lib/utils/helpers';

/**
 * Badge Component
 * @param {Object} props
 * @param {string} props.variant - Badge variant: default, success, warning, danger, info, primary, secondary
 * @param {string} props.size - Badge size: sm, md, lg
 * @param {boolean} props.dot - Show dot indicator
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  className, 
  ...props 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent',
    secondary: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    primary: 'bg-white',
    secondary: 'bg-purple-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-bold border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

// Status Badge with predefined states
export function StatusBadge({ status, className, ...props }) {
  const statusConfig = {
    active: { variant: 'success', label: 'نشط', dot: true },
    inactive: { variant: 'default', label: 'غير نشط', dot: true },
    pending: { variant: 'warning', label: 'قيد الانتظار', dot: true },
    expired: { variant: 'danger', label: 'منتهي', dot: true },
    suspended: { variant: 'danger', label: 'معلق', dot: true },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge 
      variant={config.variant} 
      dot={config.dot}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
}
