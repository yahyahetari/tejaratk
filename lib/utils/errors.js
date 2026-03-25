// lib/utils/errors.js
// Error handling utilities محسّنة

import { NextResponse } from 'next/server';

/**
 * Application Error class
 */
export class AppError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }
}

/**
 * Error codes و رسائلها
 */
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: { status: 401, message: 'غير مصرح بالوصول' },
  FORBIDDEN: { status: 403, message: 'ليس لديك صلاحية للوصول' },
  TOKEN_EXPIRED: { status: 401, message: 'انتهت صلاحية الجلسة' },
  INVALID_CREDENTIALS: { status: 401, message: 'بيانات الاعتماد غير صحيحة' },

  // Validation
  VALIDATION_ERROR: { status: 400, message: 'خطأ في البيانات المدخلة' },
  MISSING_FIELD: { status: 400, message: 'حقل مطلوب مفقود' },
  INVALID_FORMAT: { status: 400, message: 'تنسيق غير صالح' },

  // Resources
  NOT_FOUND: { status: 404, message: 'المورد غير موجود' },
  ALREADY_EXISTS: { status: 409, message: 'المورد موجود مسبقاً' },

  // Rate Limiting
  RATE_LIMITED: { status: 429, message: 'تم تجاوز الحد المسموح، حاول لاحقاً' },

  // Server
  INTERNAL_ERROR: { status: 500, message: 'حدث خطأ غير متوقع' },
  DATABASE_ERROR: { status: 500, message: 'خطأ في قاعدة البيانات' },
  EXTERNAL_SERVICE_ERROR: { status: 502, message: 'خطأ في الخدمة الخارجية' },
};

/**
 * تحويل خطأ إلى Response
 * @param {Error} err - الخطأ
 * @returns {Response}
 */
export function toErrorResponse(err) {
  const status = err?.status || 500;
  const code = err?.code || 'INTERNAL_ERROR';
  const message = status === 500 ? 'حدث خطأ غير متوقع.' : err.message;

  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', { code, message, stack: err.stack });
  }

  return Response.json({
    ok: false,
    success: false,
    code,
    message
  }, { status });
}

/**
 * إنشاء NextResponse للخطأ
 * @param {string} code - كود الخطأ من ErrorCodes
 * @param {string} customMessage - رسالة مخصصة (اختياري)
 * @returns {NextResponse}
 */
export function errorResponse(code, customMessage = null) {
  const errorDef = ErrorCodes[code] || ErrorCodes.INTERNAL_ERROR;
  const message = customMessage || errorDef.message;

  return NextResponse.json(
    {
      success: false,
      error: message,
      code
    },
    { status: errorDef.status }
  );
}

/**
 * إنشاء NextResponse للنجاح
 * @param {any} data - البيانات
 * @param {string} message - رسالة (اختياري)
 * @param {number} status - HTTP status (افتراضي: 200)
 * @returns {NextResponse}
 */
export function successResponse(data, message = null, status = 200) {
  const response = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return NextResponse.json(response, { status });
}

/**
 * Wrapper لـ API routes مع error handling تلقائي
 * @param {Function} handler - API handler function
 * @returns {Function}
 * 
 * @example
 * export const GET = withErrorHandler(async (request) => {
 *   // your code here
 *   return successResponse({ data: 'test' });
 * });
 */
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('[API Error]', error);

      // Handle known errors
      if (error instanceof AppError) {
        return errorResponse(error.code, error.message);
      }

      // Handle Prisma errors
      if (error?.code?.startsWith('P')) {
        const prismaErrors = {
          'P2002': 'ALREADY_EXISTS',
          'P2025': 'NOT_FOUND',
          'P2003': 'VALIDATION_ERROR',
        };
        const code = prismaErrors[error.code] || 'DATABASE_ERROR';
        return errorResponse(code);
      }

      // Default error
      return errorResponse('INTERNAL_ERROR');
    }
  };
}

/**
 * التحقق من الحقول المطلوبة
 * @param {Object} data - البيانات
 * @param {string[]} fields - الحقول المطلوبة
 * @throws {AppError}
 */
export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new AppError(
      `الحقول التالية مطلوبة: ${missing.join(', ')}`,
      400,
      'MISSING_FIELD'
    );
  }
}
