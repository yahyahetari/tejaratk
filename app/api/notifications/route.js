import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    // محاولة جلب الإشعارات من قاعدة البيانات
    let notifications = [];
    let unreadCount = 0;

    try {
      // التحقق من وجود جدول الإشعارات
      notifications = await prisma.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      unreadCount = await prisma.notification.count({
        where: { 
          userId: session.userId,
          read: false
        }
      });
    } catch (dbError) {
      // إذا لم يكن جدول الإشعارات موجوداً، نعيد بيانات فارغة
      console.log('Notifications table may not exist:', dbError.message);
    }

    // تنسيق الإشعارات
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
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
      total: 0
    });
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { notificationId, markAllRead } = await request.json();

    if (markAllRead) {
      // تحديث جميع الإشعارات كمقروءة
      await prisma.notification.updateMany({
        where: { 
          userId: session.userId,
          read: false
        },
        data: { read: true }
      });
    } else if (notificationId) {
      // تحديث إشعار واحد
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
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
  
  return new Date(date).toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'short'
  });
}
