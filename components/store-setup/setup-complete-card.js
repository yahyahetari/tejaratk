'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Store, Mail, Phone, FileText, Globe, CreditCard, Palette } from 'lucide-react';
import { PAYMENT_GATEWAYS } from '@/config/payment-gateways';
import { COUNTRIES } from '@/config/countries';

/**
 * بطاقة المراجعة والإكمال - الخطوة 5
 */
export default function SetupCompleteCard({ formData, onComplete, onPrevious, loading = false }) {
  const getCountryName = (code) => {
    const country = COUNTRIES.find(c => c.code === code);
    return country ? `${country.flag} ${country.nameAr}` : code;
  };

  const getGatewayNames = (gatewayIds) => {
    if (!gatewayIds || gatewayIds.length === 0) return 'لم يتم اختيار بوابات دفع';
    return gatewayIds.map(id => {
      const gateway = PAYMENT_GATEWAYS.find(g => g.id === id);
      return gateway ? gateway.nameAr : id;
    }).join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>مراجعة المعلومات</CardTitle>
        <CardDescription>
          راجع جميع المعلومات قبل إكمال الإعداد
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* المعلومات الأساسية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            المعلومات الأساسية
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mr-7">
            <div>
              <p className="text-sm text-muted-foreground">الاسم الكامل</p>
              <p className="font-medium">{formData.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">اسم العلامة التجارية</p>
              <p className="font-medium">{formData.brandName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="font-medium">{formData.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم الهاتف</p>
              <p className="font-medium">{formData.phone || '-'}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4"></div>

        {/* الترخيص */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            الترخيص التجاري
          </h3>
          <div className="mr-7">
            {formData.hasLicense ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">رقم الترخيص</p>
                  <p className="font-medium">{formData.licenseNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الدولة</p>
                  <p className="font-medium">{formData.country ? getCountryName(formData.country) : '-'}</p>
                </div>
                {formData.licenseDocument && (
                  <div>
                    <p className="text-sm text-muted-foreground">المستند</p>
                    <p className="font-medium text-green-600">✓ تم الرفع</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">لا يوجد ترخيص</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4"></div>

        {/* بوابات الدفع */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            بوابات الدفع
          </h3>
          <div className="mr-7">
            <p className="font-medium">{getGatewayNames(formData.paymentGateways)}</p>
            {formData.paymentGateways && formData.paymentGateways.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {formData.paymentGateways.length} بوابة مفعّلة
              </p>
            )}
          </div>
        </div>

        <div className="border-t pt-4"></div>

        {/* الهوية البصرية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600" />
            الهوية البصرية
          </h3>
          <div className="mr-7 space-y-3">
            {formData.logo ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">الشعار</p>
                <img 
                  src={formData.logo} 
                  alt="Logo" 
                  className="h-16 object-contain border rounded p-2"
                />
              </div>
            ) : (
              <p className="text-muted-foreground">لم يتم رفع شعار</p>
            )}

            {(formData.primaryColor || formData.secondaryColor) && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">الألوان</p>
                <div className="flex gap-2">
                  {formData.primaryColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <span className="text-sm font-mono">{formData.primaryColor}</span>
                    </div>
                  )}
                  {formData.secondaryColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <span className="text-sm font-mono">{formData.secondaryColor}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4"></div>

        {/* رسالة التأكيد */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">جاهز للإكمال!</p>
              <p className="text-sm text-green-800 mt-1">
                بالضغط على &quot;إكمال الإعداد&quot; سيتم:
              </p>
              <ul className="text-sm text-green-800 mt-2 mr-4 space-y-1">
                <li>• حفظ جميع معلومات متجرك</li>
                <li>• توليد كود التفعيل الخاص بك</li>
                <li>• تفعيل اشتراكك</li>
                <li>• إرسال بريد إلكتروني بالتفاصيل</li>
              </ul>
            </div>
          </div>
        </div>

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
            تعديل
          </Button>
          <Button 
            type="button"
            size="lg"
            onClick={onComplete}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'جاري الإكمال...' : 'إكمال الإعداد'}
            <Check className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
