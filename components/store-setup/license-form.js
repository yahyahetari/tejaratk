'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, FileText, Globe, Upload } from 'lucide-react';
import { COUNTRIES, getCountriesByRegion } from '@/config/countries';

/**
 * نموذج الترخيص - الخطوة 2
 */
export default function LicenseForm({ initialData = {}, onNext, onPrevious, loading = false }) {
  const [formData, setFormData] = useState({
    hasLicense: initialData.hasLicense !== undefined ? initialData.hasLicense : false,
    licenseNumber: initialData.licenseNumber || '',
    licenseDocument: initialData.licenseDocument || '',
    country: initialData.country || ''
  });

  const [errors, setErrors] = useState({});

  // دول الخليج (تتطلب ترخيص)
  const gccCountries = getCountriesByRegion('gcc');

  const validate = () => {
    const newErrors = {};

    // إذا كان لديه ترخيص
    if (formData.hasLicense) {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'رقم الترخيص مطلوب';
      }

      if (!formData.country) {
        newErrors.country = 'الدولة مطلوبة';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onNext(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الترخيص التجاري</CardTitle>
        <CardDescription>
          معلومات الترخيص التجاري (اختياري)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* هل يوجد ترخيص؟ */}
          <div className="space-y-4">
            <label className="text-sm font-semibold">
              هل لديك ترخيص تجاري؟
            </label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.hasLicense ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleChange('hasLicense', true)}
              >
                نعم، لدي ترخيص
              </Button>
              <Button
                type="button"
                variant={!formData.hasLicense ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleChange('hasLicense', false)}
              >
                لا، ليس لدي ترخيص
              </Button>
            </div>
          </div>

          {/* إذا كان لديه ترخيص */}
          {formData.hasLicense && (
            <>
              {/* رقم الترخيص */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  رقم الترخيص <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="أدخل رقم الترخيص التجاري"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  className={errors.licenseNumber ? 'border-red-500' : ''}
                />
                {errors.licenseNumber && (
                  <p className="text-sm text-red-500">{errors.licenseNumber}</p>
                )}
              </div>

              {/* الدولة */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  الدولة <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : ''}`}
                >
                  <option value="">اختر الدولة</option>
                  <optgroup label="دول الخليج">
                    {gccCountries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.nameAr}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="دول أخرى">
                    {COUNTRIES.filter(c => c.region !== 'gcc').map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.nameAr}
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              {/* رفع المستند */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  رفع صورة الترخيص (اختياري)
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    اضغط لرفع ملف أو اسحبه هنا
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (حتى 5MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      // TODO: رفع الملف
                      console.log('File selected:', e.target.files[0]);
                    }}
                  />
                </div>
                {formData.licenseDocument && (
                  <p className="text-sm text-green-600">
                    ✓ تم رفع المستند بنجاح
                  </p>
                )}
              </div>
            </>
          )}

          {/* ملاحظة */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ملاحظة:</strong> الترخيص التجاري اختياري ولكنه يساعد في:
            </p>
            <ul className="text-sm text-blue-800 mt-2 mr-4 space-y-1">
              <li>• زيادة مصداقية متجرك</li>
              <li>• الحصول على دعم أسرع</li>
              <li>• إمكانية الوصول لمميزات إضافية</li>
            </ul>
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
