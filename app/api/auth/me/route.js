import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { getSession } = await import('@/lib/auth/session');
    const prisma = (await import('@/lib/db/prisma')).default;

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        merchant: {
          select: {
            id: true,
            businessName: true,
            status: true,
            subscription: {
              select: {
                id: true,
                planType: true,
                billingCycle: true,
                status: true,
                currentPeriodStart: true,
                currentPeriodEnd: true,
                cancelAtPeriodEnd: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}
