import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';
import { calculateSubscriptionEndDate } from '@/lib/subscription-checker';
import { sendNotification } from '@/lib/notification-sender';

/**
 * API لتجديد الاشتراك
 * POST /api/subscription/renew
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

    const {
      planType,
      billingCycle,
      paymentMethod
    } = body;

    // التحقق من البيانات المطلوبة
    if (!planType || !billingCycle) {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع الخطة ودورة الفوترة مطلوبة'
        },
        { status: 400 }
      );
    }

    // التحقق من صحة القيم
    const validPlanTypes = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
    const validBillingCycles = ['MONTHLY', 'YEARLY'];

    if (!validPlanTypes.includes(planType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'نوع الخطة غير صحيح'
        },
        { status: 400 }
      );
    }

    if (!validBillingCycles.includes(billingCycle)) {
      return NextResponse.json(
        {
          success: false,
          error: 'دورة الفوترة غير صحيحة'
        },
        { status: 400 }
      );
    }

    // البحث عن الاشتراك الحالي
    const subscription = await prisma.subscription.findUnique({
      where: { merchantId }
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'لا يوجد اشتراك للتجديد'
        },
        { status: 404 }
      );
    }

    // حساب تاريخ الانتهاء الجديد
    const currentEndDate = subscription.status === 'ACTIVE' && subscription.endDate > new Date()
      ? subscription.endDate
      : new Date();

    const newEndDate = calculateSubscriptionEndDate(currentEndDate, billingCycle);

    // TODO: معالجة الدفع هنا
    // يجب التكامل مع بوابة الدفع (Tap, Stripe, إلخ)
    // const paymentResult = await processPayment({ ... });

    // تحديث الاشتراك
    const updatedSubscription = await prisma.subscription.update({
      where: { merchantId },
      data: {
        planType,
        billingCycle,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: newEndDate,
        lastPaymentDate: new Date(),
        nextPaymentDate: newEndDate,
        updatedAt: new Date()
      }
    });

    // إنشاء فاتورة
    const invoice = await prisma.invoice.create({
      data: {
        merchantId,
        subscriptionId: subscription.id,
        amount: 0, // TODO: حساب المبلغ من config/plans.js
        currency: 'SAR',
        status: 'PAID',
        paidAt: new Date(),
        dueDate: new Date(),
        items: [
          {
            description: `تجديد اشتراك ${planType} - ${billingCycle}`,
            quantity: 1,
            unitPrice: 0, // TODO
            total: 0 // TODO
          }
        ]
      }
    });

    // تسجيل الدفع
    await prisma.payment.create({
      data: {
        merchantId,
        invoiceId: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        method: paymentMethod || 'CARD',
        status: 'SUCCESS',
        transactionId: `TXN-${Date.now()}`, // TODO: من بوابة الدفع
        processedAt: new Date()
      }
    });

    // إرسال إشعار
    await sendNotification(merchantId, {
      type: 'SUBSCRIPTION',
      title: 'تم تجديد الاشتراك',
      message: `تم تجديد اشتراكك بنجاح. الاشتراك صالح حتى ${newEndDate.toLocaleDateString('ar-SA')}`,
      metadata: {
        subscriptionId: subscription.id,
        planType,
        billingCycle,
        endDate: newEndDate
      }
    });

    // تسجيل النشاط
    await prisma.activityLog.create({
      data: {
        merchantId,
        action: 'SUBSCRIPTION_RENEWED',
        description: `تم تجديد الاشتراك - ${planType} - ${billingCycle}`,
        metadata: {
          subscriptionId: subscription.id,
          invoiceId: invoice.id,
          endDate: newEndDate
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تجديد الاشتراك بنجاح',
      data: {
        subscription: updatedSubscription,
        invoice: {
          id: invoice.id,
          amount: invoice.amount,
          status: invoice.status
        }
      }
    });

  } catch (error) {
    console.error('Error in subscription renewal API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ أثناء تجديد الاشتراك'
      },
      { status: 500 }
    );
  }
}
