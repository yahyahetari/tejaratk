'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeCity: '',
    storeCountry: '',
    currency: 'SAR',
    taxRate: 0,
    shippingCost: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/store/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/store/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('تم حفظ الإعدادات بنجاح');
      } else {
        toast.error('فشل حفظ الإعدادات');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إعدادات المتجر</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* معلومات المتجر */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات المتجر</CardTitle>
              <CardDescription>قم بتحديث معلومات متجرك الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">اسم المتجر</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="storeDescription">وصف المتجر</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.storeDescription}
                  onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeEmail">البريد الإلكتروني</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="storePhone">رقم الهاتف</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* العنوان */}
          <Card>
            <CardHeader>
              <CardTitle>العنوان</CardTitle>
              <CardDescription>عنوان المتجر الفعلي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeAddress">العنوان</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeCity">المدينة</Label>
                  <Input
                    id="storeCity"
                    value={settings.storeCity}
                    onChange={(e) => setSettings({ ...settings, storeCity: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="storeCountry">الدولة</Label>
                  <Input
                    id="storeCountry"
                    value={settings.storeCountry}
                    onChange={(e) => setSettings({ ...settings, storeCountry: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* الإعدادات المالية */}
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات المالية</CardTitle>
              <CardDescription>العملة والضرائب والشحن</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <select
                    id="currency"
                    className="w-full p-2 border rounded-md"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="taxRate">نسبة الضريبة (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="shippingCost">تكلفة الشحن الافتراضية</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={settings.shippingCost}
                    onChange={(e) => setSettings({ ...settings, shippingCost: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </form>
    </div>
  );
}
