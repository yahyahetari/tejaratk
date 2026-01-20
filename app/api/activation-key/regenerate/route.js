import { NextResponse } from 'next/server';
import { regenerateActivationKey } from '@/lib/activation-key';
import { verifyAuth } from '@/lib/auth/session';

/**
 * API لإعادة توليد كود التفعيل
 * POST /api/activation-key/regenerate
 * Body: { reason?: string }
 */
export async function POST(request) {
  try {
    // التحقق من المصادقة
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const merchantId = auth.user.id;
    const body = await request.json();
    const { reason } = body;

    // إعادة توليد الكود
    const newKey = await regenerateActivationKey(
      merchantId, 
      reason || 'طلب التاجر'
    );

    return NextResponse.json({
      success: true,
      message: 'تم إعادة توليد كود التفعيل بنجاح',
      data: {
        id: newKey.id,
        key: newKey.key,
        status: newKey.status,
        expiresAt: newKey.expiresAt,
        createdAt: newKey.createdAt
      }
    });

  } catch (error) {
    console.error('Error in activation key regeneration API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء إعادة توليد كود التفعيل'
      },
      { status: 500 }
    );
  }
}
