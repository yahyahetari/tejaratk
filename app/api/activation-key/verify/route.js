import { NextResponse } from 'next/server';
import { verifyActivationKey } from '@/lib/activation-key';
import { headers } from 'next/headers';

/**
 * API للتحقق من صحة كود التفعيل
 * هذا الـ endpoint يُستخدم من المتجر الخارجي للتحقق من الكود
 * 
 * POST /api/activation-key/verify
 * Body: { key: string, storeUrl?: string, storeDomain?: string }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { key, storeUrl, storeDomain, storeVersion } = body;

    // التحقق من وجود الكود
    if (!key) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'كود التفعيل مطلوب',
          code: 'KEY_REQUIRED'
        },
        { status: 400 }
      );
    }

    // الحصول على معلومات الطلب
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // بيانات الطلب
    const requestData = {
      ipAddress,
      userAgent,
      storeUrl: storeUrl || null,
      storeDomain: storeDomain || null,
      storeVersion: storeVersion || null,
      timestamp: new Date().toISOString()
    };

    // التحقق من الكود
    const result = await verifyActivationKey(key, requestData);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          error: result.error,
          code: result.code,
          status: result.status || null
        },
        { status: 401 }
      );
    }

    // إرجاع النتيجة الناجحة
    return NextResponse.json({
      success: true,
      valid: true,
      message: 'كود التفعيل صالح',
      data: {
        merchant: result.merchant,
        subscription: result.subscription,
        store: result.store,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in activation key verification API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء التحقق من كود التفعيل',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * GET method للتحقق السريع (اختياري)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'كود التفعيل مطلوب',
        code: 'KEY_REQUIRED'
      },
      { status: 400 }
    );
  }

  try {
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    const requestData = {
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString()
    };

    const result = await verifyActivationKey(key, requestData);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          error: result.error,
          code: result.code
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      message: 'كود التفعيل صالح'
    });

  } catch (error) {
    console.error('Error in activation key verification API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء التحقق من كود التفعيل',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
