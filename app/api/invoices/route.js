import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const session = await verifyAuth(request);
    if (!session || !session.authenticated) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user?.id },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: { select: { planName: true } },
      },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
