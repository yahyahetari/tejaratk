import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
    try {
        const prisma = (await import('@/lib/db/prisma')).default;
        const { getSession } = await import('@/lib/auth/session');

        const session = await getSession();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 50;

        const logs = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                merchant: {
                    select: {
                        businessName: true,
                        user: { select: { email: true } }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, logs });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json({ success: true, logs: [] });
    }
}
