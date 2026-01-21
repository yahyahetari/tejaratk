import { NextResponse } from 'next/server';
import { getActivationKey } from '@/lib/activation-key';
import { verifyAuth } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * API للحصول على حالة كود التفعيل
 * GET /api/activation-key/status
 */
export async function GET(request) {
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

    // الحصول على كود التفعيل
    const activationKey = await getActivationKey(merchantId);

    if (!activationKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'لا يوجد كود تفعيل',
          hasKey: false
        },
        { status: 404 }
      );
    }

    // إرجاع معلومات الكود
    return NextResponse.json({
      success: true,
      hasKey: true,
      data: {
        id: activationKey.id,
        key: activationKey.key,
        status: activationKey.status,
        expiresAt: activationKey.expiresAt,
        isUsed: activationKey.isUsed,
        usedAt: activationKey.usedAt,
        verificationCount: activationKey.verificationCount,
        lastVerifiedAt: activationKey.lastVerifiedAt,
        storeUrl: activationKey.storeUrl,
        storeDomain: activationKey.storeDomain,
        createdAt: activationKey.createdAt
      }
    });

  } catch (error) {
    console.error('Error in activation key status API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء جلب حالة كود التفعيل'
      },
      { status: 500 }
    );
  }
}
