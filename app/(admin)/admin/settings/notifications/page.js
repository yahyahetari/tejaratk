'use client';

import { useState, useEffect } from 'react';
import { Bell, Save, Loader2, ArrowRight, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        emailNewUser: true,
        emailNewOrder: true,
        emailSubscription: true,
        emailPayment: true,
        pushEnabled: false,
        smsEnabled: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            const data = await response.json();
            if (data.success && data.settings?.notifications) {
                setSettings(prev => ({ ...prev, ...data.settings.notifications }));
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
                body: JSON.stringify({ type: 'notifications', settings })
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
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    const emailNotifications = [
        { key: 'emailNewUser', label: 'مستخدم جديد', description: 'إشعار عند تسجيل مستخدم جديد' },
        { key: 'emailNewOrder', label: 'طلب جديد', description: 'إشعار عند وصول طلب جديد' },
        { key: 'emailSubscription', label: 'تحديث الاشتراك', description: 'إشعار عند تغيير حالة الاشتراك' },
        { key: 'emailPayment', label: 'عمليات الدفع', description: 'إشعار عند نجاح أو فشل الدفع' },
    ];

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/settings" className="hover:text-amber-600">الإعدادات</Link>
                <ArrowRight className="w-4 h-4" />
                <span className="text-gray-900">الإشعارات</span>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إعدادات الإشعارات</h1>
                    <p className="text-gray-500">إدارة الإشعارات والتنبيهات</p>
                </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">إشعارات البريد الإلكتروني</h3>
                </div>

                {emailNotifications.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                            className={`relative w-14 h-7 rounded-full transition-colors ${settings[item.key] ? 'bg-amber-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Other Channels */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">قنوات أخرى</h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <p className="font-medium text-gray-900">إشعارات Push</p>
                        <p className="text-sm text-gray-500">إشعارات فورية للمتصفح</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, pushEnabled: !settings.pushEnabled })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${settings.pushEnabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.pushEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <p className="font-medium text-gray-900">إشعارات SMS</p>
                        <p className="text-sm text-gray-500">رسائل نصية قصيرة</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, smsEnabled: !settings.smsEnabled })}
                        className={`relative w-14 h-7 rounded-full transition-colors ${settings.smsEnabled ? 'bg-amber-500' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.smsEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
                </button>
            </div>
        </div>
    );
}
