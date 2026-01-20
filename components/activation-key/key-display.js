'use client';

import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Key, 
  Calendar, 
  Activity, 
  Clock,
  ExternalLink,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban
} from 'lucide-react';

export default function KeyDisplay({ activationKey, showCopyButton = true }) {
  const [copied, setCopied] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activationKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const displayKey = showFullKey 
    ? activationKey.key 
    : activationKey.key.substring(0, 20) + '••••••••';

  const getStatusInfo = (status) => {
    const statusMap = {
      ACTIVE: { 
        text: 'نشط', 
        icon: CheckCircle, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
      },
      EXPIRED: { 
        text: 'منتهي', 
        icon: XCircle, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        border: 'border-red-200'
      },
      SUSPENDED: { 
        text: 'معلق', 
        icon: AlertCircle, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50',
        border: 'border-amber-200'
      },
      REVOKED: { 
        text: 'ملغي', 
        icon: Ban, 
        color: 'text-gray-600', 
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      }
    };
    return statusMap[status] || statusMap.ACTIVE;
  };

  const statusInfo = getStatusInfo(activationKey.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Key Display Box */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Key className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-bold text-gray-900">كود التفعيل</span>
          </div>
          <button
            onClick={() => setShowFullKey(!showFullKey)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showFullKey ? (
              <>
                <EyeOff className="w-4 h-4" />
                إخفاء
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                إظهار الكل
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-dashed border-blue-300">
          <div className="flex items-center justify-between gap-4">
            <code className="text-lg font-mono font-bold text-blue-600 break-all flex-1" dir="ltr">
              {displayKey}
            </code>
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all flex-shrink-0 ${
                  copied 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    نسخ
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Shield className="h-4 w-4" />
            <span>الحالة</span>
          </div>
          <div className={`flex items-center gap-2 ${statusInfo.color}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="font-bold">{statusInfo.text}</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4" />
            <span>تاريخ الانتهاء</span>
          </div>
          <p className="font-bold text-gray-900">
            {activationKey.expiresAt 
              ? new Date(activationKey.expiresAt).toLocaleDateString('ar-SA')
              : 'غير محدد'}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Activity className="h-4 w-4" />
            <span>عدد التحققات</span>
          </div>
          <p className="font-bold text-gray-900">
            {activationKey.verificationCount || 0}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Clock className="h-4 w-4" />
            <span>آخر استخدام</span>
          </div>
          <p className="font-bold text-gray-900">
            {activationKey.lastVerifiedAt 
              ? new Date(activationKey.lastVerifiedAt).toLocaleDateString('ar-SA')
              : 'لم يستخدم بعد'}
          </p>
        </div>
      </div>

      {/* Store URL */}
      {activationKey.storeUrl && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <ExternalLink className="h-4 w-4" />
            <span>رابط المتجر المرتبط</span>
          </div>
          <a 
            href={activationKey.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            {activationKey.storeUrl}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
