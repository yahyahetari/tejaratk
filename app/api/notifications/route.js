import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { getSession } = await import('@/lib/auth/session');

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    let notifications = [];
    let unreadCount = 0;

    try {
      notifications = await prisma.notification.findMany({
        where: { userId: session.user?.id },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      unreadCount = await prisma.notification.count({
        where: { userId: session.user?.id, read: false }
      });
    } catch (dbError) {
      console.log('Notifications table may not exist:', dbError.message);
    }

    const formattedNotifications = notifications.map(n => ({
      id: n.id,
      message: n.message,
      type: n.type,
      read: n.read,
      time: formatTimeAgo(n.createdAt),
      createdAt: n.createdAt
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ notifications: [], unreadCount: 0, total: 0 });
  }
}

export async function PATCH(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { getSession } = await import('@/lib/auth/session');

    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { notificationId, markAllRead } = await request.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.user?.id, read: false },
        data: { read: true }
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;

  return new Date(date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
}
