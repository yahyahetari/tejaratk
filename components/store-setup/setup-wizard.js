'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import BasicInfoForm from './basic-info-form';
import LicenseForm from './license-form';
import PaymentGatewaySelector from './payment-gateway-selector';
import BrandIdentityForm from './brand-identity-form';
import SetupCompleteCard from './setup-complete-card';

/**
 * مكون Wizard لإعداد المتجر - 5 خطوات
 * @param {Object} props
 * @param {Object} props.initialData - البيانات الأولية إن وجدت
 * @param {number} props.initialStep - الخطوة الأولية (افتراضي: 1)
 */
export default function SetupWizard({ initialData = {}, initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'المعلومات الأساسية', description: 'الاسم والبريد والهاتف' },
    { id: 2, title: 'الترخيص', description: 'معلومات الترخيص التجاري' },
    { id: 3, title: 'بوابات الدفع', description: 'اختيار وإعداد بوابات الدفع' },
    { id: 4, title: 'الهوية البصرية', description: 'الشعار والألوان' },
    { id: 5, title: 'المراجعة والإكمال', description: 'مراجعة جميع المعلومات' }
  ];

  const handleNext = async (stepData) => {
    setLoading(true);
    
    try {
      // دمج البيانات الجديدة
      const updatedData = { ...formData, ...stepData };
      setFormData(updatedData);

      // حفظ البيانات في الخادم
      const response = await fetch('/api/store/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedData,
          setupStep: currentStep
        })
      });

      const result = await response.json();

      if (result.success) {
        // الانتقال للخطوة التالية
        if (currentStep < 5) {
          setCurrentStep(currentStep + 1);
        }
      } else {
        alert(result.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      console.error('Error saving step:', error);
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/store/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        // إعادة التوجيه لصفحة الإكمال
        window.location.href = '/dashboard/store-setup/complete';
      } else {
        alert(result.error || 'حدث خطأ أثناء إكمال الإعداد');
      }
    } catch (error) {
      console.error('Error completing setup:', error);
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* الدائرة */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      transition-all duration-300
                      ${
                        currentStep > step.id
                          ? 'bg-green-600 text-white'
                          : currentStep === step.id
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* العنوان */}
                  <div className="mt-3 text-center">
                    <div
                      className={`
                        text-sm font-semibold
                        ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                      `}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* الخط الفاصل */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4 rounded transition-all duration-300
                      ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* محتوى الخطوة */}
      <div>
        {currentStep === 1 && (
          <BasicInfoForm
            initialData={formData}
            onNext={handleNext}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <LicenseForm
            initialData={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <PaymentGatewaySelector
            initialData={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )}

        {currentStep === 4 && (
          <BrandIdentityForm
            initialData={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )}

        {currentStep === 5 && (
          <SetupCompleteCard
            formData={formData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
