import { NextResponse } from 'next/server';
import { getActivationKey, getKeyVerifications } from '@/lib/activation-key';
import { verifyAuth } from '@/lib/auth/session';

/**
 * API للحصول على سجل استخدام كود التفعيل
 * GET /api/activation-key/usage?limit=50
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // الحصول على كود التفعيل
    const activationKey = await getActivationKey(merchantId);

    if (!activationKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'لا يوجد كود تفعيل'
        },
        { status: 404 }
      );
    }

    // الحصول على سجل التحققات
    const verifications = await getKeyVerifications(activationKey.id, limit);

    return NextResponse.json({
      success: true,
      data: {
        key: {
          id: activationKey.id,
          status: activationKey.status,
          verificationCount: activationKey.verificationCount,
          lastVerifiedAt: activationKey.lastVerifiedAt
        },
        verifications: verifications.map(v => ({
          id: v.id,
          ipAddress: v.ipAddress,
          userAgent: v.userAgent,
          storeUrl: v.storeUrl,
          success: v.success,
          errorMessage: v.errorMessage,
          verifiedAt: v.verifiedAt
        })),
        total: verifications.length
      }
    });

  } catch (error) {
    console.error('Error in activation key usage API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء جلب سجل الاستخدام'
      },
      { status: 500 }
    );
  }
}
