import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Ban } from 'lucide-react';

/**
 * مكون عرض حالة كود التفعيل كـ Badge
 * @param {Object} props
 * @param {string} props.status - حالة الكود (ACTIVE, EXPIRED, SUSPENDED, REVOKED)
 * @param {boolean} props.showIcon - إظهار الأيقونة (افتراضي: true)
 * @param {string} props.size - حجم البادج (sm, md, lg)
 */
export default function KeyStatusBadge({ status, showIcon = true, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'نشط',
          className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
          icon: CheckCircle
        };
      case 'EXPIRED':
        return {
          label: 'منتهي',
          className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
          icon: XCircle
        };
      case 'SUSPENDED':
        return {
          label: 'معلق',
          className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',
          icon: AlertCircle
        };
      case 'REVOKED':
        return {
          label: 'ملغي',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
          icon: Ban
        };
      default:
        return {
          label: 'غير معروف',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      className={`${config.className} ${sizeClasses[size]} border font-semibold`}
    >
      {showIcon && <Icon className={`ml-1 ${iconSizes[size]}`} />}
      {config.label}
    </Badge>
  );
}
