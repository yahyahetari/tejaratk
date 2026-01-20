import React from 'react';
import { cn } from '@/lib/utils/helpers';

export function Card({ className = '', variant = 'default', hover = false, children, ...props }) {
  const variants = {
    default: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
    elevated: 'bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100',
    outlined: 'bg-white rounded-2xl border-2 border-gray-200',
    gradient: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-lg',
  };

  return (
    <div
      className={cn(
        variants[variant],
        hover && 'hover:shadow-xl hover:shadow-gray-200/50 hover:scale-[1.01] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={cn('text-xl font-bold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p
      className={cn('text-sm text-gray-500 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={cn('p-6 pt-0 flex items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Premium Card variant for special sections
export function CardPremium({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
