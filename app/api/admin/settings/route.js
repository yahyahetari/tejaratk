// app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// مسار ملف الإعدادات
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

// الإعدادات الافتراضية
const DEFAULT_SETTINGS = {
  general: {
    appName: 'تجارتك',
    appDescription: 'منصة SaaS متكاملة لإنشاء وإدارة المتاجر الإلكترونية',
    supportEmail: 'support@tejaratk.com',
    defaultCurrency: 'OMR',
    defaultLanguage: 'ar',
    defaultTimezone: 'Asia/Muscat',
    maintenanceMode: false
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    fromName: 'تجارتك'
  },
  payment: {
    paddleEnabled: true,
    paddleVendorId: '',
    paddleApiKey: '',
    paddleWebhookSecret: '',
    paddleEnvironment: 'sandbox'
  },
  security: {
    requireEmailVerification: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableTwoFactor: false
  },
  notifications: {
    emailNewUser: true,
    emailNewOrder: true,
    emailSubscription: true,
    emailPayment: true,
    pushEnabled: false,
    smsEnabled: false
  },
  appearance: {
    theme: 'light',
    primaryColor: '#3B82F6',
    accentColor: '#8B5CF6',
    logoUrl: '',
    faviconUrl: ''
  }
};

// قراءة الإعدادات من الملف
async function getSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    // إذا لم يوجد الملف، أرجع الإعدادات الافتراضية
    return DEFAULT_SETTINGS;
  }
}

// حفظ الإعدادات في الملف
async function saveSettings(settings) {
  try {
    // إنشاء مجلد data إذا لم يكن موجوداً
    const dir = path.dirname(SETTINGS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// GET /api/admin/settings - الحصول على إعدادات النظام
export async function GET(request) {
  try {
    const { requireAdmin } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    await requireAdmin();

    // جلب الإعدادات المحفوظة
    const settings = await getSettings();

    // جلب الإحصائيات
    const [
      totalUsers,
      totalMerchants,
      totalStores,
      totalSubscriptions,
      activeSubscriptions,
      totalPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.store.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      settings,
      stats: {
        totalUsers,
        totalMerchants,
        totalStores,
        totalSubscriptions,
        totalRevenue: totalPayments._sum.amount || 0,
        activeSubscriptions,
      },
    });
  } catch (error) {
    console.error('Admin get settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء جلب الإعدادات' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

// PUT /api/admin/settings - تحديث إعدادات النظام
export async function PUT(request) {
  try {
    const { requireAdmin } = await import('@/lib/auth/session');

    await requireAdmin();

    const body = await request.json();
    const { type, settings: newSettings } = body;

    if (!type || !newSettings) {
      return NextResponse.json(
        { success: false, message: 'نوع الإعدادات والبيانات مطلوبة' },
        { status: 400 }
      );
    }

    // جلب الإعدادات الحالية
    const currentSettings = await getSettings();

    // تحديث القسم المحدد
    if (type in currentSettings) {
      currentSettings[type] = { ...currentSettings[type], ...newSettings };
    } else {
      currentSettings[type] = newSettings;
    }

    // حفظ الإعدادات
    const saved = await saveSettings(currentSettings);

    if (!saved) {
      return NextResponse.json(
        { success: false, message: 'فشل في حفظ الإعدادات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
      settings: currentSettings
    });
  } catch (error) {
    console.error('Admin update settings error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء تحديث الإعدادات' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}
