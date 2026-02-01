import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
  try {
    const { getSession } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    const session = await getSession();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    const validStatuses = ['ACTIVE', 'PENDING', 'SUSPENDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صالحة' },
        { status: 400 }
      );
    }

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

    try {
      await prisma.activityLog.create({
        data: {
          merchantId: id,
          action: 'STORE_STATUS_CHANGE',
          description: `Status changed to ${status}`,
          metadata: {
            newStatus: status,
            storeName: merchant.businessName
          }
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
