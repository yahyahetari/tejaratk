'use client';

import { useState, useEffect } from 'react';
import { Shield, Save, Loader2, ArrowRight, Key, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SecuritySettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        requireEmailVerification: true,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireStrongPassword: true,
        enableTwoFactor: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.success && data.settings?.security) {
                setSettings(prev => ({ ...prev, ...data.settings.security }));
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
                body: JSON.stringify({ type: 'security', settings })
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
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    const toggleSettings = [
        { key: 'requireEmailVerification', label: 'التحقق من البريد الإلكتروني', description: 'مطلوب للتسجيل الجديد' },
        { key: 'requireStrongPassword', label: 'كلمة مرور قوية', description: 'يجب أن تحتوي على أرقام ورموز' },
        { key: 'enableTwoFactor', label: 'المصادقة الثنائية', description: 'طبقة أمان إضافية' },
    ];

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/settings" className="hover:text-red-600">الإعدادات</Link>
                <ArrowRight className="w-4 h-4" />
                <span className="text-gray-900">الأمان</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إعدادات الأمان</h1>
                    <p className="text-gray-500">إعدادات الأمان والحماية</p>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {/* Toggle Settings */}
                {toggleSettings.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                            className={`relative w-14 h-7 rounded-full transition-colors ${settings[item.key] ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                ))}

                {/* Numeric Settings */}
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مهلة الجلسة (ساعات)</label>
                        <input
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 24 })}
                            min="1"
                            max="168"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">محاولات تسجيل الدخول</label>
                        <input
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                            min="3"
                            max="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">طول كلمة المرور</label>
                        <input
                            type="number"
                            value={settings.passwordMinLength}
                            onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 8 })}
                            min="6"
                            max="20"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
