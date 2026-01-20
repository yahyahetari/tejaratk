import { cn } from "@/lib/utils/helpers";
import { forwardRef } from "react";

const Input = forwardRef(({ 
  className, 
  type = 'text',
  label,
  error,
  hint,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full rounded-xl border-2 bg-white px-4 py-3 text-gray-900 placeholder-gray-400",
            "outline-none transition-all duration-200",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" 
              : "border-gray-200 hover:border-gray-300",
            Icon && "pr-12",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
export default Input;

// Textarea variant
export const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  hint,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-xl border-2 bg-white px-4 py-3 text-gray-900 placeholder-gray-400",
          "outline-none transition-all duration-200 resize-none",
          "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" 
            : "border-gray-200 hover:border-gray-300",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
