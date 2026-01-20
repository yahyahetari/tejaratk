import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

/**
 * Button Component
 * @param {Object} props
 * @param {string} props.variant - Button variant: primary, secondary, outline, ghost, danger, success
 * @param {string} props.size - Button size: sm, md, lg, xl
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 
    font-bold rounded-xl 
    transition-all duration-200 
    focus:outline-none focus:ring-4 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 
      text-white 
      hover:from-blue-700 hover:to-indigo-700 
      focus:ring-blue-500/30
      shadow-lg shadow-blue-500/30
      hover:shadow-xl hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gray-100 
      text-gray-700 
      hover:bg-gray-200 
      focus:ring-gray-500/30
      border border-gray-200
    `,
    outline: `
      border-2 border-blue-600 
      text-blue-600 
      hover:bg-blue-50 
      focus:ring-blue-500/30
    `,
    ghost: `
      text-gray-700 
      hover:bg-gray-100 
      focus:ring-gray-500/30
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-rose-600 
      text-white 
      hover:from-red-700 hover:to-rose-700 
      focus:ring-red-500/30
      shadow-lg shadow-red-500/30
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-teal-600 
      text-white 
      hover:from-emerald-700 hover:to-teal-700 
      focus:ring-emerald-500/30
      shadow-lg shadow-emerald-500/30
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-orange-500 
      text-white 
      hover:from-amber-600 hover:to-orange-600 
      focus:ring-amber-500/30
      shadow-lg shadow-amber-500/30
    `,
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
