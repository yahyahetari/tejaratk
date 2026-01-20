import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function PATCH(request, { params }) {
  try {
    // التحقق من صلاحيات المسؤول
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    // التحقق من صحة الحالة
    const validStatuses = ['ACTIVE', 'PENDING', 'SUSPENDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صالحة' },
        { status: 400 }
      );
    }

    // تحديث حالة المتجر
    const merchant = await prisma.merchant.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        businessName: true,
        status: true,
        user: {
          select: { email: true }
        }
      }
    });

    // تسجيل النشاط
    try {
      await prisma.activityLog.create({
        data: {
          type: 'STORE_STATUS_CHANGE',
          userId: session.userId,
          merchantId: id,
          details: JSON.stringify({
            newStatus: status,
            storeName: merchant.businessName
          })
        }
      });
    } catch (logError) {
      console.error('Error logging activity:', logError);
    }

    return NextResponse.json({
      success: true,
      merchant
    });

  } catch (error) {
    console.error('Error updating store status:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'المتجر غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث حالة المتجر' },
      { status: 500 }
    );
  }
}
