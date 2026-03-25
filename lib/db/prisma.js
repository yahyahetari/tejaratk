// lib/db/prisma.js
// Prisma Client محسّن مع Connection Pool و Auto-Reconnect

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

/**
 * إعدادات Prisma Client المحسّنة
 */
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL;

  if (!baseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    return '';
  }

  // إضافة معاملات Connection Pool
  const separator = baseUrl.includes('?') ? '&' : '?';

  // إعدادات محسّنة للـ CockroachDB Serverless
  const poolSettings = [
    'connection_limit=10',       // تقليل الاتصالات لـ serverless
    'pool_timeout=15',           // مدة انتظار اتصال من الـ pool
    'connect_timeout=15',        // مدة انتظار إنشاء اتصال جديد
  ].join('&');

  return `${baseUrl}${separator}${poolSettings}`;
};

/**
 * إنشاء Prisma Client جديد
 */
function createPrismaClient() {
  const client = new PrismaClient({
    // تسجيل الأخطاء فقط في Production
    log: process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error'],

    // Datasource مع Connection Pool settings
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

  return client;
}

/**
 * إنشاء Prisma Client singleton
 */
export const prisma = globalForPrisma.prisma || createPrismaClient();

/**
 * تخزين الـ client في global في Development فقط
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * إغلاق الاتصال عند إيقاف التطبيق
 */
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

/**
 * Helper لتنفيذ query مع إعادة المحاولة عند فشل الاتصال
 * @param {Function} queryFn - دالة الاستعلام
 * @param {number} maxRetries - عدد المحاولات
 * @param {number} timeoutMs - المدة القصوى بالميلي ثانية
 */
export async function withRetry(queryFn, maxRetries = 3, timeoutMs = 30000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs);
      });
      return await Promise.race([queryFn(), timeoutPromise]);
    } catch (error) {
      const isConnectionError =
        error.message?.includes('ConnectionReset') ||
        error.message?.includes('connection was forcibly closed') ||
        error.message?.includes('Connection refused') ||
        error.message?.includes('Connection timed out') ||
        error.code === 'P1001' ||
        error.code === 'P1002' ||
        error.code === 'P1017';

      if (isConnectionError && attempt < maxRetries) {
        console.warn(`⚠️ Connection error (attempt ${attempt}/${maxRetries}), reconnecting...`);
        try {
          await prisma.$disconnect();
          await prisma.$connect();
        } catch (reconnectError) {
          // إنتظار قبل إعادة المحاولة
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
        continue;
      }
      throw error;
    }
  }
}

/**
 * Alias للتوافق مع الكود القديم
 */
export const withQueryTimeout = withRetry;

/**
 * Helper للتعامل مع أخطاء Prisma
 */
export function handlePrismaError(error) {
  const errorMap = {
    'P2002': 'هذا السجل موجود بالفعل',
    'P2025': 'السجل غير موجود',
    'P2003': 'خطأ في العلاقات',
    'P2014': 'تم انتهاك قيد فريد',
    'P1001': 'لا يمكن الاتصال بقاعدة البيانات',
    'P1002': 'انتهت مهلة الاتصال بقاعدة البيانات',
    'P1003': 'قاعدة البيانات غير موجودة',
    'P1017': 'الخادم قطع الاتصال',
  };

  const code = error?.code || 'UNKNOWN';
  const message = errorMap[code] || 'حدث خطأ في قاعدة البيانات';

  return { code, message };
}

export default prisma;