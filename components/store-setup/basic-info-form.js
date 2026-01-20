'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Store, Mail, Phone } from 'lucide-react';

/**
 * نموذج المعلومات الأساسية - الخطوة 1
 */
export default function BasicInfoForm({ initialData = {}, onNext, loading = false }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    brandName: initialData.brandName || '',
    email: initialData.email || '',
    phone: initialData.phone || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'اسم العلامة التجارية مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
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
    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المعلومات الأساسية</CardTitle>
        <CardDescription>
          أدخل معلوماتك الشخصية ومعلومات متجرك
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم الكامل */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* اسم العلامة التجارية */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Store className="h-4 w-4" />
              اسم العلامة التجارية <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="اسم متجرك أو علامتك التجارية"
              value={formData.brandName}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className={errors.brandName ? 'border-red-500' : ''}
            />
            {errors.brandName && (
              <p className="text-sm text-red-500">{errors.brandName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              هذا الاسم سيظهر في كود التفعيل والفواتير
            </p>
          </div>

          {/* البريد الإلكتروني */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              البريد الإلكتروني <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="+966 5X XXX XXXX"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              سنستخدم هذا الرقم للتواصل معك عند الحاجة
            </p>
          </div>

          {/* الأزرار */}
          <div className="flex justify-end pt-4">
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
