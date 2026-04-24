'use client';

import { useState, useEffect } from 'react';
import { Palette, Save, Loader2, ArrowRight, Sun, Moon, Monitor } from 'lucide-react';
import Link from 'next/link';

export default function AppearanceSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        theme: 'light',
        primaryColor: '#3B82F6',
        accentColor: '#8B5CF6',
        logoUrl: '',
        faviconUrl: ''
    });

    const colors = [
        { name: 'أزرق', value: '#3B82F6' },
        { name: 'أخضر', value: '#10B981' },
        { name: 'بنفسجي', value: '#8B5CF6' },
        { name: 'وردي', value: '#EC4899' },
        { name: 'برتقالي', value: '#F59E0B' },
        { name: 'أحمر', value: '#EF4444' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.success && data.settings?.appearance) {
                setSettings(prev => ({ ...prev, ...data.settings.appearance }));
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
                body: JSON.stringify({ type: 'appearance', settings })
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
                <Loader2 className="w-8 h-8 animate-spin text-walnut-600" />
            </div>
        );
    }

    const themes = [
        { key: 'light', label: 'فاتح', icon: Sun },
        { key: 'dark', label: 'داكن', icon: Moon },
        { key: 'system', label: 'النظام', icon: Monitor },
    ];

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/settings" className="hover:text-walnut-600">الإعدادات</Link>
                <ArrowRight className="w-4 h-4" />
                <span className="text-gray-900">المظهر</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-walnut-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">المظهر</h1>
                    <p className="text-gray-500">تخصيص مظهر المنصة</p>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">السمة</h3>
                <div className="grid grid-cols-3 gap-4">
                    {themes.map((theme) => (
                        <button
                            key={theme.key}
                            onClick={() => setSettings({ ...settings, theme: theme.key })}
                            className={`p-4 rounded-xl border-2 transition-all ${settings.theme === theme.key ? 'border-walnut-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <theme.icon className={`w-8 h-8 mx-auto mb-2 ${settings.theme === theme.key ? 'text-walnut-600' : 'text-gray-400'}`} />
                            <p className={`text-center font-medium ${settings.theme === theme.key ? 'text-walnut-600' : 'text-gray-600'}`}>
                                {theme.label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">اللون الأساسي</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setSettings({ ...settings, primaryColor: color.value })}
                            className={`w-12 h-12 rounded-xl transition-all ${settings.primaryColor === color.value ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : ''}`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-12 h-12 rounded-xl cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">مخصص</span>
                    </div>
                </div>
            </div>

            {/* Logo & Favicon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <h3 className="font-semibold text-gray-900">الشعار والأيقونة</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رابط الشعار</label>
                        <input
                            type="url"
                            value={settings.logoUrl}
                            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رابط الأيقونة (Favicon)</label>
                        <input
                            type="url"
                            value={settings.faviconUrl}
                            onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                            placeholder="https://example.com/favicon.ico"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-walnut-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-walnut-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                </button>
            </div>
        </div>
    );
}
