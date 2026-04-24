'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Save, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        paddleEnabled: true,
        paddleVendorId: '',
        paddleApiKey: '',
        paddleWebhookSecret: '',
        paddleEnvironment: 'sandbox'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.success && data.settings?.payment) {
                setSettings(prev => ({ ...prev, ...data.settings.payment }));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'payment', settings })
            });
            const data = await response.json();
            if (data.success) {
                alert('تم حفظ الإعدادات بنجاح');
            } else {
                alert(data.error || 'حدث خطأ');
            }
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gold-700" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/settings" className="hover:text-gold-700">الإعدادات</Link>
                <ArrowRight className="w-4 h-4" />
                <span className="text-gray-900">بوابات الدفع</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-600 to-walnut-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">بوابات الدفع</h1>
                    <p className="text-gray-500">إعداد بوابات الدفع الافتراضية</p>
                </div>
            </div>

            {/* Paddle Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-brand-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Paddle</h3>
                            <p className="text-sm text-gray-500">بوابة دفع عالمية</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, paddleEnabled: !settings.paddleEnabled })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${settings.paddleEnabled ? 'bg-gold-600' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.paddleEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>

                {settings.paddleEnabled && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor ID</label>
                                <input
                                    type="text"
                                    value={settings.paddleVendorId}
                                    onChange={(e) => setSettings({ ...settings, paddleVendorId: e.target.value })}
                                    placeholder="أدخل Vendor ID"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">البيئة</label>
                                <select
                                    value={settings.paddleEnvironment}
                                    onChange={(e) => setSettings({ ...settings, paddleEnvironment: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-600"
                                >
                                    <option value="sandbox">Sandbox (تجريبي)</option>
                                    <option value="production">Production (إنتاج)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                            <input
                                type="password"
                                value={settings.paddleApiKey}
                                onChange={(e) => setSettings({ ...settings, paddleApiKey: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
                            <input
                                type="password"
                                value={settings.paddleWebhookSecret}
                                onChange={(e) => setSettings({ ...settings, paddleWebhookSecret: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-600"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gold-700 hover:bg-gold-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
