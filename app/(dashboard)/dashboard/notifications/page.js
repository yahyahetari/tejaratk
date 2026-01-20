'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  ShoppingCart, 
  Package, 
  CreditCard,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'طلب جديد',
    message: 'تم استلام طلب جديد #1234 بقيمة 45.000 ر.ع',
    time: 'منذ 5 دقائق',
    read: false,
    icon: ShoppingCart,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    type: 'product',
    title: 'تنبيه المخزون',
    message: 'المنتج "قميص قطني أبيض" وصل إلى الحد الأدنى للمخزون',
    time: 'منذ ساعة',
    read: false,
    icon: Package,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 3,
    type: 'payment',
    title: 'دفعة مستلمة',
    message: 'تم استلام دفعة بقيمة 120.000 ر.ع من الطلب #1230',
    time: 'منذ 3 ساعات',
    read: true,
    icon: CreditCard,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 4,
    type: 'system',
    title: 'تحديث النظام',
    message: 'تم تحديث المنصة إلى الإصدار 2.0 مع ميزات جديدة',
    time: 'منذ يوم',
    read: true,
    icon: Info,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">الإشعارات</h1>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `لديك ${unreadCount} إشعار${unreadCount > 1 ? 'ات' : ''} غير مقروء${unreadCount > 1 ? 'ة' : ''}`
              : 'لا توجد إشعارات جديدة'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4" />
              تحديد الكل كمقروء
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              مسح الكل
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'unread', label: 'غير مقروء' },
          { value: 'read', label: 'مقروء' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد إشعارات</h3>
            <p className="text-gray-500">ستظهر الإشعارات الجديدة هنا</p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  notification.read 
                    ? 'bg-white border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.iconBg}`}>
                  <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-0.5 ${notification.read ? 'text-gray-600' : 'text-blue-700'}`}>
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="تحديد كمقروء"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
