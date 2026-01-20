'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CreditCard, Check } from 'lucide-react';
import { paymentGateways as PAYMENT_GATEWAYS } from '@/config/payment-gateways';

/**
 * نموذج اختيار بوابات الدفع - الخطوة 3
 */
export default function PaymentGatewaySelector({ initialData = {}, onNext, onPrevious, loading = false }) {
  const [selectedGateways, setSelectedGateways] = useState(initialData.paymentGateways || []);
  const [gatewayConfigs, setGatewayConfigs] = useState(initialData.gatewayConfigs || {});
  const [expandedGateway, setExpandedGateway] = useState(null);

  const handleToggleGateway = (gatewayId) => {
    if (selectedGateways.includes(gatewayId)) {
      setSelectedGateways(prev => prev.filter(id => id !== gatewayId));
      // إزالة الإعدادات
      const newConfigs = { ...gatewayConfigs };
      delete newConfigs[gatewayId];
      setGatewayConfigs(newConfigs);
    } else {
      setSelectedGateways(prev => [...prev, gatewayId]);
      setExpandedGateway(gatewayId);
    }
  };

  const handleConfigChange = (gatewayId, field, value) => {
    setGatewayConfigs(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onNext({
      paymentGateways: selectedGateways,
      gatewayConfigs
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>بوابات الدفع</CardTitle>
        <CardDescription>
          اختر بوابات الدفع التي تريد استخدامها في متجرك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* قائمة البوابات */}
          <div className="space-y-4">
            {PAYMENT_GATEWAYS.map(gateway => {
              const isSelected = selectedGateways.includes(gateway.id);
              const isExpanded = expandedGateway === gateway.id;

              return (
                <div
                  key={gateway.id}
                  className={`
                    border rounded-lg transition-all
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  `}
                >
                  {/* رأس البوابة */}
                  <div
                    className="p-4 cursor-pointer flex items-center justify-between"
                    onClick={() => handleToggleGateway(gateway.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}
                      `}>
                        {isSelected ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <CreditCard className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{gateway.nameAr}</h3>
                        <p className="text-sm text-muted-foreground">{gateway.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {gateway.recommended && (
                        <Badge className="bg-green-100 text-green-800">موصى به</Badge>
                      )}
                      {gateway.popular && (
                        <Badge className="bg-blue-100 text-blue-800">الأكثر استخداماً</Badge>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل البوابة */}
                  {isSelected && isExpanded && (
                    <div className="border-t p-4 space-y-4 bg-white">
                      <p className="text-sm text-muted-foreground mb-4">
                        أدخل مفاتيح API الخاصة بـ {gateway.nameAr}
                      </p>

                      {gateway.setupFields.map(field => (

                        <div key={field.name} className="space-y-2">
                          <label className="text-sm font-semibold">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                          </label>
                          <Input
                            type={field.type === 'password' ? 'password' : 'text'}
                            placeholder={field.label}
                            value={gatewayConfigs[gateway.id]?.[field.name] || ''}
                            onChange={(e) => handleConfigChange(gateway.id, field.name, e.target.value)}
                          />

                        </div>
                      ))}

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedGateway(null)}
                        >
                          حفظ
                        </Button>
                        <a
                          href={gateway.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          زيارة موقع {gateway.nameAr}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ملاحظة */}
          {selectedGateways.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>تنبيه:</strong> لم تقم باختيار أي بوابة دفع. يمكنك إضافتها لاحقاً من لوحة التحكم.
              </p>
            </div>
          )}

          {selectedGateways.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>تم اختيار {selectedGateways.length} بوابة دفع</strong>
              </p>
              <p className="text-xs text-blue-800 mt-1">
                يمكنك تعديل الإعدادات لاحقاً من لوحة التحكم
              </p>
            </div>
          )}

          {/* الأزرار */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={loading}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
              السابق
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loading ? 'جاري الحفظ...' : 'التالي'}
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
