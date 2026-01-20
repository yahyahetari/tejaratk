'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Globe, Monitor, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * مكون عرض سجل التحققات من كود التفعيل
 * @param {Object} props
 * @param {string} props.activationKeyId - معرف كود التفعيل
 * @param {number} props.limit - عدد السجلات المراد عرضها (افتراضي: 10)
 * @param {boolean} props.autoRefresh - التحديث التلقائي (افتراضي: false)
 * @param {number} props.refreshInterval - فترة التحديث بالثواني (افتراضي: 30)
 */
export default function KeyVerificationLog({ 
  activationKeyId, 
  limit = 10,
  autoRefresh = false,
  refreshInterval = 30
}) {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activation-key/usage?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        setVerifications(data.data.verifications || []);
        setError(null);
      } else {
        setError(data.error || 'حدث خطأ أثناء جلب السجل');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();

    // التحديث التلقائي
    if (autoRefresh) {
      const interval = setInterval(fetchVerifications, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [activationKeyId, limit, autoRefresh, refreshInterval]);

  if (loading && verifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>سجل التحققات</CardTitle>
          <CardDescription>جاري التحميل...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>سجل التحققات</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchVerifications} variant="outline">
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>سجل التحققات</CardTitle>
            <CardDescription>
              آخر {limit} محاولة تحقق من كود التفعيل
            </CardDescription>
          </div>
          <Button 
            onClick={fetchVerifications} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {verifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              لا توجد محاولات تحقق حتى الآن
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div 
                key={verification.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                {/* الحالة */}
                <div className="flex-shrink-0 pt-1">
                  {verification.success ? (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>

                {/* المعلومات */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      {verification.success ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          تحقق ناجح
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          تحقق فاشل
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(verification.verifiedAt).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    {/* IP Address */}
                    {verification.ipAddress && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span className="font-mono">{verification.ipAddress}</span>
                      </div>
                    )}

                    {/* Store URL */}
                    {verification.storeUrl && (
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={verification.storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {verification.storeUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* User Agent */}
                  {verification.userAgent && (
                    <div className="text-xs text-muted-foreground truncate">
                      {verification.userAgent}
                    </div>
                  )}

                  {/* Error Message */}
                  {verification.errorMessage && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {verification.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
