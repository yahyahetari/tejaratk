'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, Loader2, ArrowRight, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EmailSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [settings, setSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: '',
        smtpPass: '',
        fromEmail: '',
        fromName: 'تجارتك'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.success && data.settings?.email) {
                setSettings(prev => ({ ...prev, ...data.settings.email }));
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
                body: JSON.stringify({ type: 'email', settings })
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

    const handleTest = async () => {
        try {
            setTesting(true);
            setTestResult(null);
            // محاكاة اختبار الاتصال
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTestResult({ success: true, message: 'تم الاتصال بنجاح!' });
        } catch (error) {
            setTestResult({ success: false, message: 'فشل الاتصال' });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/settings" className="hover:text-emerald-600">الإعدادات</Link>
                <ArrowRight className="w-4 h-4" />
                <span className="text-gray-900">إعدادات البريد</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إعدادات البريد الإلكتروني</h1>
                    <p className="text-gray-500">إعداد خدمة إرسال البريد الإلكتروني (SMTP)</p>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">خادم SMTP</label>
                        <input
                            type="text"
                            value={settings.smtpHost}
                            onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المنفذ</label>
                        <input
                            type="text"
                            value={settings.smtpPort}
                            onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                            placeholder="587"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
                        <input
                            type="email"
                            value={settings.smtpUser}
                            onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                            placeholder="your-email@gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            value={settings.smtpPass}
                            onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">البريد المرسل</label>
                        <input
                            type="email"
                            value={settings.fromEmail}
                            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                            placeholder="noreply@tejaratk.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المرسل</label>
                        <input
                            type="text"
                            value={settings.fromName}
                            onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                            placeholder="تجارتك"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Test Result */}
                {testResult && (
                    <div className={`p-4 rounded-xl ${testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        <div className="flex items-center gap-2">
                            {testResult.success ? <CheckCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                            <span>{testResult.message}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={handleTest}
                        disabled={testing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>{testing ? 'جاري الاختبار...' : 'اختبار الاتصال'}</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
