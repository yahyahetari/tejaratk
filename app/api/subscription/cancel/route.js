import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const prisma = (await import('@/lib/db/prisma')).default;
        const { verifyAuth } = await import('@/lib/auth/session');

        const auth = await verifyAuth(request);
        if (!auth.authenticated) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const merchantId = auth.merchant?.id;
        if (!merchantId) {
            return NextResponse.json({ error: 'لم يتم العثور على حساب التاجر' }, { status: 404 });
        }

        const subscription = await prisma.subscription.findUnique({
            where: { merchantId }
        });

        if (!subscription) {
            return NextResponse.json({ error: 'لا يوجد اشتراك فعال' }, { status: 404 });
        }

        // Call Paddle API to cancel the subscription (prevents future charges)
        if (subscription.paddleSubscriptionId) {
            const { cancelPaddleSubscription } = await import('@/lib/payment/paddle');
            const paddleCancel = await cancelPaddleSubscription(subscription.paddleSubscriptionId);
            
            if (!paddleCancel.success && paddleCancel.error !== 'Subscription is already canceled') {
                 console.error('Failed to cancel Paddle subscription:', paddleCancel.error);
                 // We log it, but optionally proceed to update DB or fail early
                 // return NextResponse.json({ error: 'حدث خطأ أثناء إلغاء الاشتراك من بوابة الدفع' }, { status: 500 });
            }
        }

        // إلغاء الاشتراك - يبقى فعال حتى نهاية الفترة
        await prisma.subscription.update({
            where: { merchantId },
            data: {
                status: 'CANCELLED',
                cancelAtPeriodEnd: true, // It's better to flag this so the UI knows it's pending cancellation
                cancelledAt: new Date(),
            }
        });

        return NextResponse.json({
            success: true,
            message: 'تم إلغاء الاشتراك. ستبقى مميزاتك فعالة حتى نهاية الفترة الحالية.'
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء إلغاء الاشتراك' }, { status: 500 });
    }
}
