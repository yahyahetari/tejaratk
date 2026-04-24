'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, LogOut, Trash2, CreditCard,
  Eye, EyeOff, Loader2, Check, AlertCircle, Shield,
  ChevronLeft, XCircle
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تغيير كلمة المرور
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // إلغاء الاشتراك
  const [cancelLoading, setCancelLoading] = useState(false);

  // حذف الحساب
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // تسجيل الخروج
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    } finally {
      setLoading(false);
    }
  };

  // تغيير كلمة المرور
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwords.new.length < 6) {
      setPasswordMsg({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'كلمات المرور غير متطابقة' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'فشل تغيير كلمة المرور' });
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'حدث خطأ في الاتصال' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // إلغاء الاشتراك
  const handleCancelSubscription = async () => {
    if (!window.confirm('هل أنت متأكد من إلغاء اشتراكك؟\n\nستفقد الوصول إلى الميزات المدفوعة عند انتهاء فترة الاشتراك الحالية.')) return;

    setCancelLoading(true);
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        alert('تم إلغاء الاشتراك بنجاح. ستبقى مميزاتك فعالة حتى نهاية الفترة الحالية.');
        fetchUserInfo();
      } else {
        alert(data.error || 'فشل إلغاء الاشتراك');
      }
    } catch {
      alert('حدث خطأ في الاتصال');
    } finally {
      setCancelLoading(false);
    }
  };

  // حذف الحساب
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'حذف حسابي') return;

    setDeleteLoading(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        alert(data.error || 'فشل حذف الحساب');
      }
    } catch {
      alert('حدث خطأ في الاتصال');
    } finally {
      setDeleteLoading(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إدارة حسابك وإعداداتك الشخصية</p>
      </div>

      {/* معلومات الحساب */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-brand-700" />
            معلومات الحساب
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> الاسم
              </p>
              <p className="font-bold text-gray-900 text-lg">
                {user?.merchant?.contactName || user?.merchant?.businessName || user?.name || '-'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني
              </p>
              <p className="font-bold text-gray-900 text-lg" dir="ltr">{user?.email || '-'}</p>
            </div>
          </div>
          {user?.merchant?.subscription && (
            <div className="mt-4 bg-gradient-to-l from-brand-50 to-indigo-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> الاشتراك الحالي
              </p>
              <div className="flex items-center gap-3">
                <p className="font-bold text-gray-900">{user.merchant.subscription.planName || 'أساسي'}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.merchant.subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    user.merchant.subscription.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {user.merchant.subscription.status === 'ACTIVE' ? 'فعال' :
                    user.merchant.subscription.status === 'PAUSED' ? 'متوقف' :
                      user.merchant.subscription.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* تغيير كلمة المرور */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-amber-600" />
            تغيير كلمة المرور
          </h2>

          {passwordMsg.text && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* كلمة المرور الحالية */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">كلمة المرور الحالية</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none transition-all"
                  dir="ltr"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none transition-all"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">تأكيد كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none transition-all"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={passwordLoading}
              className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50">
              {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              تغيير كلمة المرور
            </button>
          </form>
        </div>
      </div>

      {/* إلغاء الاشتراك */}
      {user?.merchant?.subscription?.status === 'ACTIVE' && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-amber-600" />
              إلغاء الاشتراك
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              عند إلغاء الاشتراك، ستبقى مميزاتك فعالة حتى نهاية فترة الاشتراك الحالية. لن يتم تجديد الاشتراك تلقائياً.
            </p>
            <button onClick={handleCancelSubscription} disabled={cancelLoading}
              className="px-6 py-3 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
              {cancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              إلغاء الاشتراك
            </button>
          </div>
        </div>
      )}

      {/* تسجيل الخروج */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
            <LogOut className="w-5 h-5 text-gray-600" />
            تسجيل الخروج
          </h2>
          <p className="text-sm text-gray-500 mb-4">تسجيل الخروج من حسابك في جميع الأجهزة.</p>
          <button onClick={handleLogout} disabled={logoutLoading}
            className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
            {logoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* حذف الحساب */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5" />
            حذف الحساب نهائياً
          </h2>
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-800 font-medium">⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!</p>
            <p className="text-sm text-red-600 mt-1">سيتم حذف جميع بياناتك، متجرك، اشتراكك، وفواتيرك بشكل نهائي.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                اكتب &quot;<span className="text-red-600">حذف حسابي</span>&quot; للتأكيد
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="حذف حسابي"
                className="w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'حذف حسابي' || deleteLoading}
              className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              حذف حسابي نهائياً
            </button>
          </div>
        </div>
      </div>

      <div className="h-8"></div>
    </div>
  );
}
