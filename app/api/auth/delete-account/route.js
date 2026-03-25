import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request) {
    try {
        const prisma = (await import('@/lib/db/prisma')).default;
        const { verifyAuth, destroySession } = await import('@/lib/auth/session');

        const auth = await verifyAuth(request);
        if (!auth.authenticated) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        // حذف المستخدم (cascade يحذف Merchant وكل البيانات المرتبطة)
        await prisma.user.delete({
            where: { id: auth.user.id }
        });

        // حذف الجلسة
        try {
            await destroySession();
        } catch (e) { /* تجاهل */ }

        return NextResponse.json({ success: true, message: 'تم حذف الحساب بنجاح' });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء حذف الحساب' }, { status: 500 });
    }
}
