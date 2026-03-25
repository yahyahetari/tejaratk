// lib/utils/api.js
// API Utilities محسّنة

import { NextResponse } from 'next/server';

/**
 * إضافة Cache Headers للـ Response
 * @param {NextResponse} response - الـ response
 * @param {Object} options - خيارات الـ cache
 * @returns {NextResponse}
 */
export function withCacheHeaders(response, options = {}) {
  const {
    maxAge = 0,
    staleWhileRevalidate = 0,
    isPrivate = true,
    noStore = false,
  } = options;

  if (noStore) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  } else if (maxAge > 0) {
    const directives = [
      isPrivate ? 'private' : 'public',
      `max-age=${maxAge}`,
    ];

    if (staleWhileRevalidate > 0) {
      directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    }

    response.headers.set('Cache-Control', directives.join(', '));
  }

  return response;
}

/**
 * Cache presets للاستخدامات الشائعة
 */
export const CachePresets = {
  // لا يوجد caching
  NO_CACHE: { noStore: true },

  // Cache قصير (1 دقيقة)
  SHORT: { maxAge: 60, staleWhileRevalidate: 30 },

  // Cache متوسط (5 دقائق)
  MEDIUM: { maxAge: 300, staleWhileRevalidate: 60 },

  // Cache طويل (1 ساعة)
  LONG: { maxAge: 3600, staleWhileRevalidate: 300 },

  // Cache ثابت (1 يوم) - للبيانات الثابتة
  STATIC: { maxAge: 86400, staleWhileRevalidate: 3600, isPrivate: false },
};

/**
 * تحويل URL search params إلى object
 * @param {URL} url - الـ URL
 * @returns {Object}
 */
export function getQueryParams(url) {
  const params = {};
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

/**
 * Pagination helper
 * @param {Object} options - الخيارات
 * @returns {Object}
 */
export function getPaginationParams(searchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * إنشاء pagination response object
 * @param {number} page - الصفحة الحالية
 * @param {number} limit - عدد العناصر
 * @param {number} total - العدد الإجمالي
 * @returns {Object}
 */
export function createPagination(page, limit, total) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Sort helper
 * @param {URLSearchParams} searchParams 
 * @param {string[]} allowedFields - الحقول المسموح بها للترتيب
 * @param {string} defaultField - الترتيب الافتراضي
 * @returns {Object}
 */
export function getSortParams(searchParams, allowedFields = ['createdAt'], defaultField = 'createdAt') {
  let sortBy = searchParams.get('sortBy') || defaultField;
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  // التحقق من أن الحقل مسموح به
  if (!allowedFields.includes(sortBy)) {
    sortBy = defaultField;
  }

  return {
    orderBy: {
      [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
    },
  };
}

/**
 * Filter helper لبناء where clause
 * @param {Object} filters - الفلاتر
 * @param {Object} fieldMappings - تحويل الحقول
 * @returns {Object}
 */
export function buildWhereClause(filters, fieldMappings = {}) {
  const where = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '' || value === 'all') {
      continue;
    }

    const mapping = fieldMappings[key];

    if (mapping) {
      // استخدام التحويل المخصص
      if (typeof mapping === 'function') {
        Object.assign(where, mapping(value));
      } else {
        where[mapping] = value;
      }
    } else {
      where[key] = value;
    }
  }

  return where;
}

/**
 * Select fields helper لتقليل البيانات المرجعة
 * @param {string[]} fields - الحقول المطلوبة
 * @returns {Object}
 */
export function selectFields(fields) {
  const select = {};
  for (const field of fields) {
    select[field] = true;
  }
  return select;
}

/**
 * Prisma select presets للنماذج الشائعة
 */
export const SelectPresets = {
  // User - بيانات أساسية فقط
  USER_BASIC: {
    id: true,
    email: true,
    role: true,
    emailVerified: true,
  },

  // Merchant - بيانات أساسية
  MERCHANT_BASIC: {
    id: true,
    businessName: true,
    contactName: true,
    status: true,
  },

  // Subscription - بيانات أساسية
  SUBSCRIPTION_BASIC: {
    id: true,
    planId: true,
    planType: true,
    status: true,
    startDate: true,
    endDate: true,
  },

  // Store - بيانات أساسية
  STORE_BASIC: {
    id: true,
    brandName: true,
    currency: true,
    language: true,
  },
};
