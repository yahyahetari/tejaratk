import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const prisma = (await import('@/lib/db/prisma')).default;
        const { verifyAuth } = await import('@/lib/auth/session');
        const bcrypt = (await import('bcryptjs')).default;

        const auth = await verifyAuth(request);
        if (!auth.authenticated) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
        }

        // جلب المستخدم مع كلمة المرور
        const user = await prisma.user.findUnique({
            where: { id: auth.user.id },
            select: { id: true, password: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
        }

        // التحقق من كلمة المرور الحالية
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
        }

        // تشفير وحفظ كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: auth.user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء تغيير كلمة المرور' }, { status: 500 });
    }
}
