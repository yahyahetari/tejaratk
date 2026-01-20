'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import { PLANS, DISCOUNTS } from '@/config/plans';

/**
 * نموذج تجديد الاشتراك
 * @param {Object} props
 * @param {Object} props.currentSubscription - الاشتراك الحالي
 * @param {Function} props.onSubmit - دالة الإرسال
 * @param {boolean} props.loading - حالة التحميل
 */
export default function RenewalForm({ currentSubscription, onSubmit, loading = false }) {
  const [selectedPlan, setSelectedPlan] = useState(currentSubscription?.planType || 'PREMIUM');
  const [selectedCycle, setSelectedCycle] = useState(currentSubscription?.billingCycle || 'YEARLY');

  const calculatePrice = (planType, cycle) => {
    const plan = PLANS.find(p => p.type === planType);
    if (!plan) return 0;

    const basePrice = cycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice;
    
    // تطبيق الخصم للاشتراك السنوي
    if (cycle === 'YEARLY') {
      const discount = DISCOUNTS.YEARLY_DISCOUNT;
      return basePrice * (1 - discount);
    }

    return basePrice;
  };

  const calculateSavings = (planType) => {
    const monthlyTotal = calculatePrice(planType, 'MONTHLY') * 12;
    const yearlyPrice = calculatePrice(planType, 'YEARLY');
    return monthlyTotal - yearlyPrice;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const price = calculatePrice(selectedPlan, selectedCycle);
    
    onSubmit({
      planType: selectedPlan,
      billingCycle: selectedCycle,
      amount: price
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* اختيار الخطة */}
      <Card>
        <CardHeader>
          <CardTitle>اختر الخطة</CardTitle>
          <CardDescription>
            اختر الخطة المناسبة لاحتياجاتك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map(plan => {
              const isSelected = selectedPlan === plan.type;
              const price = calculatePrice(plan.type, selectedCycle);

              return (
                <button
                  key={plan.type}
                  type="button"
                  onClick={() => setSelectedPlan(plan.type)}
                  className={`
                    relative p-6 rounded-lg border-2 text-right transition-all
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300'
                    }
                    ${plan.popular ? 'ring-2 ring-blue-200' : ''}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-blue-600 text-white">
                        <Sparkles className="ml-1 h-3 w-3" />
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{plan.nameAr}</h3>
                    
                    <div className="text-3xl font-bold text-blue-600">
                      {price} ر.س
                      <span className="text-sm text-muted-foreground font-normal">
                        /{selectedCycle === 'MONTHLY' ? 'شهر' : 'سنة'}
                      </span>
                    </div>

                    {selectedCycle === 'YEARLY' && (
                      <p className="text-sm text-green-600 font-semibold">
                        وفّر {calculateSavings(plan.type)} ر.س سنوياً
                      </p>
                    )}

                    {isSelected && (
                      <div className="flex items-center justify-center pt-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* اختيار دورة الفوترة */}
      <Card>
        <CardHeader>
          <CardTitle>دورة الفوترة</CardTitle>
          <CardDescription>
            اختر بين الدفع الشهري أو السنوي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* شهري */}
            <button
              type="button"
              onClick={() => setSelectedCycle('MONTHLY')}
              className={`
                p-6 rounded-lg border-2 text-right transition-all
                ${selectedCycle === 'MONTHLY'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold">شهري</h3>
                <p className="text-sm text-muted-foreground">
                  ادفع كل شهر
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {calculatePrice(selectedPlan, 'MONTHLY')} ر.س/شهر
                </div>
              </div>
            </button>

            {/* سنوي */}
            <button
              type="button"
              onClick={() => setSelectedCycle('YEARLY')}
              className={`
                relative p-6 rounded-lg border-2 text-right transition-all
                ${selectedCycle === 'YEARLY'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="absolute -top-3 right-4">
                <Badge className="bg-green-600 text-white">
                  خصم {DISCOUNTS.YEARLY_DISCOUNT * 100}%
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold">سنوي</h3>
                <p className="text-sm text-muted-foreground">
                  ادفع مرة واحدة سنوياً
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {calculatePrice(selectedPlan, 'YEARLY')} ر.س/سنة
                </div>
                <p className="text-sm text-green-600 font-semibold">
                  وفّر {calculateSavings(selectedPlan)} ر.س
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ملخص الطلب */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>ملخص الطلب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>الخطة:</span>
            <span className="font-semibold">
              {PLANS.find(p => p.type === selectedPlan)?.nameAr}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span>دورة الفوترة:</span>
            <span className="font-semibold">
              {selectedCycle === 'MONTHLY' ? 'شهري' : 'سنوي'}
            </span>
          </div>
          {selectedCycle === 'YEARLY' && (
            <div className="flex justify-between text-lg text-green-600">
              <span>الخصم:</span>
              <span className="font-semibold">
                {DISCOUNTS.YEARLY_DISCOUNT * 100}%
              </span>
            </div>
          )}
          <div className="border-t pt-4 flex justify-between text-2xl font-bold">
            <span>الإجمالي:</span>
            <span className="text-blue-600">
              {calculatePrice(selectedPlan, selectedCycle)} ر.س
            </span>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              'جاري المعالجة...'
            ) : (
              <>
                <CreditCard className="ml-2 h-5 w-5" />
                إتمام الدفع والتجديد
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            بالضغط على &quot;إتمام الدفع&quot; فإنك توافق على شروط الخدمة وسياسة الاسترجاع
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
