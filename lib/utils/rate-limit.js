// lib/utils/rate-limit.js
// نظام Rate Limiting محسّن مع دعم Redis و fallback للـ memory

import redis from '../cache/redis.js';

/**
 * تخزين محاولات الوصول (in-memory fallback)
 * @type {Map<string, {count: number, resetTime: number}>}
 */
const rateLimitStore = new Map();

/**
 * تنظيف السجلات المنتهية (يعمل كل دقيقة) - للـ memory fallback فقط
 */
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitStore.entries()) {
            if (value.resetTime < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 60000);
}

/**
 * التحقق من Rate Limit باستخدام Redis
 * @param {string} identifier - المعرف
 * @param {number} limit - الحد الأقصى
 * @param {number} windowMs - فترة النافذة بالميلي ثانية
 * @returns {Promise<{success: boolean, remaining: number, resetIn: number}>}
 */
async function checkRateLimitRedis(identifier, limit, windowMs) {
    const key = `ratelimit:${identifier}`;
    const windowSeconds = Math.ceil(windowMs / 1000);

    try {
        // زيادة العداد
        const count = await redis.incr(key);

        // إذا كان أول طلب، تعيين TTL
        if (count === 1) {
            await redis.expire(key, windowSeconds);
        }

        // الحصول على TTL المتبقي
        const ttl = await redis.ttl(key);
        const resetIn = ttl > 0 ? ttl * 1000 : windowMs;

        if (count > limit) {
            return {
                success: false,
                remaining: 0,
                resetIn,
            };
        }

        return {
            success: true,
            remaining: limit - count,
            resetIn,
        };
    } catch (error) {
        console.error('Redis rate limit error:', error);
        // Fallback إلى memory
        return checkRateLimitMemory(identifier, limit, windowMs);
    }
}

/**
 * التحقق من Rate Limit باستخدام Memory (fallback)
 * @param {string} identifier - المعرف
 * @param {number} limit - الحد الأقصى
 * @param {number} windowMs - فترة النافذة بالميلي ثانية
 * @returns {{success: boolean, remaining: number, resetIn: number}}
 */
function checkRateLimitMemory(identifier, limit, windowMs) {
    const now = Date.now();
    const key = identifier;

    const record = rateLimitStore.get(key);

    if (!record || record.resetTime < now) {
        // إنشاء سجل جديد
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });

        return {
            success: true,
            remaining: limit - 1,
            resetIn: windowMs,
        };
    }

    if (record.count >= limit) {
        // تم تجاوز الحد
        return {
            success: false,
            remaining: 0,
            resetIn: record.resetTime - now,
        };
    }

    // زيادة العداد
    record.count++;

    return {
        success: true,
        remaining: limit - record.count,
        resetIn: record.resetTime - now,
    };
}

/**
 * التحقق من Rate Limit
 * يستخدم Redis إذا متوفر، وإلا يستخدم Memory
 * 
 * @param {string} identifier - المعرف (عنوان IP أو معرف آخر)
 * @param {number} limit - الحد الأقصى للطلبات
 * @param {number} windowMs - فترة النافذة بالميلي ثانية
 * @returns {Promise<{success: boolean, remaining: number, resetIn: number}>}
 */
export async function checkRateLimit(identifier, limit = 5, windowMs = 60000) {
    if (redis.isConfigured) {
        return checkRateLimitRedis(identifier, limit, windowMs);
    }
    return checkRateLimitMemory(identifier, limit, windowMs);
}

/**
 * الحصول على عنوان IP من الطلب
 * @param {Request} request - طلب HTTP
 * @returns {string} - عنوان IP
 */
export function getClientIP(request) {
    // جرب x-forwarded-for أولاً (للخوادم العكسية مثل Vercel)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    // جرب x-real-ip
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // جرب cf-connecting-ip (Cloudflare)
    const cfIP = request.headers.get('cf-connecting-ip');
    if (cfIP) {
        return cfIP;
    }

    // افتراضي
    return 'unknown';
}

/**
 * Middleware helper للـ Rate Limiting
 * @param {Request} request - طلب HTTP
 * @param {number} limit - الحد الأقصى
 * @param {number} windowMs - فترة النافذة
 * @returns {Promise<{allowed: boolean, error?: string, resetIn?: number, remaining?: number}>}
 */
export async function rateLimit(request, limit = 5, windowMs = 60000) {
    const ip = getClientIP(request);
    const endpoint = new URL(request.url).pathname;
    const identifier = `${ip}:${endpoint}`;

    const result = await checkRateLimit(identifier, limit, windowMs);

    if (!result.success) {
        const resetInSeconds = Math.ceil(result.resetIn / 1000);
        return {
            allowed: false,
            error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${resetInSeconds} ثانية`,
            resetIn: resetInSeconds,
        };
    }

    return {
        allowed: true,
        remaining: result.remaining,
    };
}

/**
 * Rate limit presets للاستخدامات الشائعة
 */
export const RateLimitPresets = {
    // تسجيل الدخول: 5 محاولات / دقيقة
    LOGIN: { limit: 5, windowMs: 60000 },

    // التسجيل: 3 محاولات / دقيقة
    REGISTER: { limit: 3, windowMs: 60000 },

    // API عام: 100 طلب / دقيقة
    API: { limit: 100, windowMs: 60000 },

    // API محدود: 30 طلب / دقيقة
    API_STRICT: { limit: 30, windowMs: 60000 },

    // رفع الملفات: 10 / دقيقة
    UPLOAD: { limit: 10, windowMs: 60000 },

    // إرسال الإيميل: 5 / 5 دقائق
    EMAIL: { limit: 5, windowMs: 300000 },
};
