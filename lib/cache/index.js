// lib/cache/index.js
// Cache utilities للتطبيق
// يستخدم Redis إذا متوفر، وإلا يستخدم in-memory cache

import redis from './redis';

/**
 * In-memory cache كـ fallback
 * @type {Map<string, {value: any, expiresAt: number}>}
 */
const memoryCache = new Map();

/**
 * تنظيف الـ memory cache كل 5 دقائق
 */
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of memoryCache.entries()) {
            if (entry.expiresAt < now) {
                memoryCache.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

/**
 * الحصول على قيمة من الـ cache
 * @param {string} key - المفتاح
 * @returns {Promise<any>} - القيمة أو null
 */
export async function cacheGet(key) {
    // حاول Redis أولاً
    if (redis.isConfigured) {
        const value = await redis.getJson(key);
        if (value !== null) return value;
    }

    // Fallback إلى memory cache
    const entry = memoryCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
        return entry.value;
    }

    // انتهت الصلاحية
    if (entry) {
        memoryCache.delete(key);
    }

    return null;
}

/**
 * تعيين قيمة في الـ cache
 * @param {string} key - المفتاح
 * @param {any} value - القيمة
 * @param {number} ttlSeconds - مدة الصلاحية بالثواني (افتراضي: 5 دقائق)
 * @returns {Promise<boolean>}
 */
export async function cacheSet(key, value, ttlSeconds = 300) {
    try {
        // Redis
        if (redis.isConfigured) {
            await redis.setJson(key, value, ttlSeconds);
        }

        // Memory cache أيضاً للـ fallback
        memoryCache.set(key, {
            value,
            expiresAt: Date.now() + (ttlSeconds * 1000),
        });

        return true;
    } catch (error) {
        console.error('Cache set error:', error);
        return false;
    }
}

/**
 * حذف قيمة من الـ cache
 * @param {string} key - المفتاح
 * @returns {Promise<boolean>}
 */
export async function cacheDelete(key) {
    try {
        if (redis.isConfigured) {
            await redis.del(key);
        }
        memoryCache.delete(key);
        return true;
    } catch (error) {
        console.error('Cache delete error:', error);
        return false;
    }
}

/**
 * حذف مفاتيح بنمط معين
 * @param {string} pattern - النمط (مثل: 'analytics:*')
 * @returns {Promise<boolean>}
 */
export async function cacheDeletePattern(pattern) {
    try {
        // Memory cache - حذف المفاتيح المطابقة
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        for (const key of memoryCache.keys()) {
            if (regex.test(key)) {
                memoryCache.delete(key);
            }
        }
        return true;
    } catch (error) {
        console.error('Cache delete pattern error:', error);
        return false;
    }
}

/**
 * Cache-aside pattern helper
 * يحاول الحصول على القيمة من الـ cache، وإذا لم تكن موجودة يستدعي الدالة ويخزن النتيجة
 * 
 * @param {string} key - مفتاح الـ cache
 * @param {Function} fetchFn - دالة جلب البيانات (async)
 * @param {number} ttlSeconds - مدة الصلاحية بالثواني
 * @returns {Promise<any>}
 * 
 * @example
 * const data = await withCache('analytics:daily', async () => {
 *   return await fetchAnalytics();
 * }, 300);
 */
export async function withCache(key, fetchFn, ttlSeconds = 300) {
    // حاول الحصول من الـ cache
    const cached = await cacheGet(key);
    if (cached !== null) {
        return cached;
    }

    // جلب البيانات
    const data = await fetchFn();

    // تخزين في الـ cache
    await cacheSet(key, data, ttlSeconds);

    return data;
}

/**
 * Cache keys المستخدمة في التطبيق
 */
export const CacheKeys = {
    // Analytics
    ANALYTICS: (period) => `analytics:${period}`,
    ANALYTICS_MERCHANTS: 'analytics:merchants',

    // Settings
    ADMIN_SETTINGS: 'settings:admin',

    // Plans
    SUBSCRIPTION_PLANS: 'plans:all',

    // Rate Limiting
    RATE_LIMIT: (ip, endpoint) => `ratelimit:${ip}:${endpoint}`,
};

/**
 * Cache TTL values (بالثواني)
 */
export const CacheTTL = {
    SHORT: 60,        // دقيقة واحدة
    MEDIUM: 300,      // 5 دقائق
    LONG: 900,        // 15 دقيقة
    HOUR: 3600,       // ساعة
    DAY: 86400,       // يوم
};

const cacheUtils = {
    get: cacheGet,
    set: cacheSet,
    delete: cacheDelete,
    deletePattern: cacheDeletePattern,
    withCache,
    keys: CacheKeys,
    ttl: CacheTTL,
};

export default cacheUtils;
