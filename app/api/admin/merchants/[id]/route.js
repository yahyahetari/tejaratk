import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/merchants/[id] - تفاصيل تاجر واحد
 */
export async function GET(request, { params }) {
    try {
        const { verifyAuth } = await import('@/lib/auth/session');
        const prisma = (await import('@/lib/db/prisma')).default;

        const auth = await verifyAuth(request);
        if (!auth.authenticated || auth.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'غير مصرح' },
                { status: 403 }
            );
        }

        const merchantId = params.id;

        const merchant = await prisma.merchant.findUnique({
            where: { id: merchantId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        emailVerified: true,
                        emailVerifiedAt: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                subscription: {
                    include: {
                        payments: {
                            orderBy: { createdAt: 'desc' },
                            take: 5,
                            select: {
                                id: true,
                                amount: true,
                                currency: true,
                                status: true,
                                paidAt: true,
                                createdAt: true,
                            }
                        }
                    }
                },
                store: true,
                storeSetup: true,
                brandIdentity: {
                    select: {
                        primaryColor: true,
                        secondaryColor: true,
                        logo: true,
                    }
                },
                _count: {
                    select: {
                        invoices: true,
                        notifications: true,
                        activityLogs: true,
                    }
                }
            }
        });

        if (!merchant) {
            return NextResponse.json(
                { success: false, error: 'التاجر غير موجود' },
                { status: 404 }
            );
        }

        // جلب آخر نشاط تسجيل دخول
        const lastLogin = await prisma.activity.findFirst({
            where: {
                userId: merchant.userId,
                type: 'login'
            },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
        });

        return NextResponse.json({
            success: true,
            merchant: {
                ...merchant,
                lastLogin: lastLogin?.createdAt || null,
            }
        });
    } catch (error) {
        console.error('Error fetching merchant:', error);
        return NextResponse.json(
            { success: false, error: 'حدث خطأ في جلب البيانات' },
            { status: 500 }
        );
    }
}
