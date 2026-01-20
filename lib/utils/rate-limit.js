// lib/utils/rate-limit.js
// نظام Rate Limiting بسيط باستخدام Map في الذاكرة

/**
 * تخزين محاولات الوصول
 * @type {Map<string, {count: number, resetTime: number}>}
 */
const rateLimitStore = new Map();

/**
 * تنظيف السجلات المنتهية (يعمل كل دقيقة)
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000);

/**
 * التحقق من Rate Limit
 * @param {string} identifier - المعرف (عنوان IP أو معرف آخر)
 * @param {number} limit - الحد الأقصى للطلبات
 * @param {number} windowMs - فترة النافذة بالميلي ثانية
 * @returns {{success: boolean, remaining: number, resetIn: number}}
 */
export function checkRateLimit(identifier, limit = 5, windowMs = 60000) {
    const now = Date.now();
    const key = identifier;

    const record = rateLimitStore.get(key);

    if (!record || record.resetTime < now) {
        // إنشاء سجل جديد
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });

        return {
            success: true,
            remaining: limit - 1,
            resetIn: windowMs
        };
    }

    if (record.count >= limit) {
        // تم تجاوز الحد
        return {
            success: false,
            remaining: 0,
            resetIn: record.resetTime - now
        };
    }

    // زيادة العداد
    record.count++;

    return {
        success: true,
        remaining: limit - record.count,
        resetIn: record.resetTime - now
    };
}

/**
 * الحصول على عنوان IP من الطلب
 * @param {Request} request - طلب HTTP
 * @returns {string} - عنوان IP
 */
export function getClientIP(request) {
    // جرب x-forwarded-for أولاً (للخوادم العكسية)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    // جرب x-real-ip
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // افتراضي
    return 'unknown';
}

/**
 * Middleware helper للـ Rate Limiting
 * @param {Request} request - طلب HTTP
 * @param {number} limit - الحد الأقصى
 * @param {number} windowMs - فترة النافذة
 * @returns {{allowed: boolean, response?: Response}}
 */
export function rateLimit(request, limit = 5, windowMs = 60000) {
    const ip = getClientIP(request);
    const endpoint = new URL(request.url).pathname;
    const identifier = `${ip}:${endpoint}`;

    const result = checkRateLimit(identifier, limit, windowMs);

    if (!result.success) {
        const resetInSeconds = Math.ceil(result.resetIn / 1000);
        return {
            allowed: false,
            error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${resetInSeconds} ثانية`,
            resetIn: resetInSeconds
        };
    }

    return {
        allowed: true,
        remaining: result.remaining
    };
}
