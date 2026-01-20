'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload, Image as ImageIcon, Palette } from 'lucide-react';

/**
 * نموذج الهوية البصرية - الخطوة 4
 */
export default function BrandIdentityForm({ initialData = {}, onNext, onPrevious, loading = false }) {
  const [formData, setFormData] = useState({
    logo: initialData.logo || '',
    primaryColor: initialData.primaryColor || '#3B82F6',
    secondaryColor: initialData.secondaryColor || '#10B981',
    fontFamily: initialData.fontFamily || 'Cairo'
  });

  const [logoPreview, setLogoPreview] = useState(initialData.logo || null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: رفع الملف للخادم
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const colorPresets = [
    { name: 'أزرق', primary: '#3B82F6', secondary: '#10B981' },
    { name: 'أخضر', primary: '#10B981', secondary: '#3B82F6' },
    { name: 'بنفسجي', primary: '#8B5CF6', secondary: '#EC4899' },
    { name: 'برتقالي', primary: '#F97316', secondary: '#EAB308' },
    { name: 'أحمر', primary: '#EF4444', secondary: '#F59E0B' },
    { name: 'رمادي', primary: '#6B7280', secondary: '#3B82F6' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>الهوية البصرية</CardTitle>
        <CardDescription>
          اختر الشعار والألوان الخاصة بمتجرك (اختياري)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* رفع الشعار */}
          <div className="space-y-4">
            <label className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              شعار المتجر
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              {/* منطقة الرفع */}
              <div>
                <label className="block">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      اضغط لرفع الشعار
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, SVG (حتى 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>

              {/* معاينة الشعار */}
              <div className="border rounded-lg p-6 flex items-center justify-center bg-gray-50">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">معاينة الشعار</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* الألوان */}
          <div className="space-y-4">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4" />
              ألوان العلامة التجارية
            </label>

            {/* الألوان الجاهزة */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">اختر من الألوان الجاهزة:</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      handleChange('primaryColor', preset.primary);
                      handleChange('secondaryColor', preset.secondary);
                    }}
                    className={`
                      p-3 rounded-lg border-2 transition-all hover:scale-105
                      ${formData.primaryColor === preset.primary ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}
                    `}
                  >
                    <div className="flex gap-1 mb-2">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <p className="text-xs">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* اختيار مخصص */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">اللون الأساسي</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">اللون الثانوي</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                    placeholder="#10B981"
                  />
                </div>
              </div>
            </div>

            {/* معاينة الألوان */}
            <div className="border rounded-lg p-4 bg-white">
              <p className="text-sm font-medium mb-3">معاينة الألوان:</p>
              <div className="flex gap-3">
                <Button 
                  type="button"
                  style={{ backgroundColor: formData.primaryColor }}
                  className="text-white"
                >
                  زر بالون الأساسي
                </Button>
                <Button 
                  type="button"
                  style={{ backgroundColor: formData.secondaryColor }}
                  className="text-white"
                >
                  زر بالون الثانوي
                </Button>
              </div>
            </div>
          </div>

          {/* ملاحظة */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ملاحظة:</strong> الهوية البصرية اختيارية ويمكنك تعديلها لاحقاً من لوحة التحكم.
            </p>
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
