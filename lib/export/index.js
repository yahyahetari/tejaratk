// lib/export/index.js

/**
 * تصدير البيانات إلى CSV
 * @param {array} data - البيانات
 * @param {array} columns - الأعمدة
 * @returns {string}
 */
export function exportToCSV(data, columns) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // إنشاء رأس الجدول
  const headers = columns.map(col => col.label || col.key).join(',');

  // إنشاء الصفوف
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // معالجة القيم الخاصة
      if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else if (typeof value === 'string') {
        // تنظيف النص وإضافة علامات اقتباس إذا لزم الأمر
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          value = `"${value}"`;
        }
      }
      
      return value;
    }).join(',');
  });

  // إضافة BOM للدعم العربي
  const BOM = '\uFEFF';
  return BOM + headers + '\n' + rows.join('\n');
}

/**
 * تصدير المنتجات
 * @param {array} products - المنتجات
 * @returns {string}
 */
export function exportProducts(products) {
  const columns = [
    { key: 'title', label: 'اسم المنتج' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'السعر' },
    { key: 'cost', label: 'التكلفة' },
    { key: 'stock', label: 'المخزون' },
    { key: 'category', label: 'الفئة' },
    { key: 'status', label: 'الحالة' },
    { key: 'createdAt', label: 'تاريخ الإنشاء' }
  ];

  const formattedData = products.map(product => ({
    title: product.title,
    sku: product.variants?.[0]?.sku || '',
    price: product.variants?.[0]?.price || 0,
    cost: product.variants?.[0]?.cost || 0,
    stock: product.variants?.[0]?.stock || 0,
    category: product.category?.name || '',
    status: product.isActive ? 'نشط' : 'غير نشط',
    createdAt: new Date(product.createdAt).toLocaleDateString('ar-OM')
  }));

  return exportToCSV(formattedData, columns);
}

/**
 * تصدير الطلبات
 * @param {array} orders - الطلبات
 * @returns {string}
 */
export function exportOrders(orders) {
  const columns = [
    { key: 'orderNumber', label: 'رقم الطلب' },
    { key: 'customerName', label: 'اسم العميل' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'totalAmount', label: 'المبلغ الإجمالي' },
    { key: 'status', label: 'الحالة' },
    { key: 'paymentStatus', label: 'حالة الدفع' },
    { key: 'createdAt', label: 'تاريخ الطلب' }
  ];

  const statusMap = {
    PENDING: 'قيد الانتظار',
    CONFIRMED: 'مؤكد',
    PROCESSING: 'قيد المعالجة',
    SHIPPED: 'تم الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
    REFUNDED: 'مسترد'
  };

  const paymentStatusMap = {
    PENDING: 'قيد الانتظار',
    PAID: 'مدفوع',
    FAILED: 'فشل',
    REFUNDED: 'مسترد'
  };

  const formattedData = orders.map(order => ({
    orderNumber: order.orderNumber,
    customerName: `${order.firstName} ${order.lastName}`,
    email: order.email,
    phone: order.phone,
    totalAmount: order.totalAmount,
    status: statusMap[order.status] || order.status,
    paymentStatus: paymentStatusMap[order.paymentStatus] || order.paymentStatus,
    createdAt: new Date(order.createdAt).toLocaleDateString('ar-OM')
  }));

  return exportToCSV(formattedData, columns);
}

/**
 * تصدير العملاء
 * @param {array} customers - العملاء
 * @returns {string}
 */
export function exportCustomers(customers) {
  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'city', label: 'المدينة' },
    { key: 'totalOrders', label: 'عدد الطلبات' },
    { key: 'totalSpent', label: 'إجمالي الإنفاق' },
    { key: 'createdAt', label: 'تاريخ التسجيل' }
  ];

  const formattedData = customers.map(customer => ({
    name: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    phone: customer.phone || '',
    city: customer.city || '',
    totalOrders: customer.totalOrders,
    totalSpent: customer.totalSpent,
    createdAt: new Date(customer.createdAt).toLocaleDateString('ar-OM')
  }));

  return exportToCSV(formattedData, columns);
}

/**
 * تصدير تقرير المبيعات
 * @param {object} report - بيانات التقرير
 * @returns {string}
 */
export function exportSalesReport(report) {
  const columns = [
    { key: 'date', label: 'التاريخ' },
    { key: 'orders', label: 'عدد الطلبات' },
    { key: 'revenue', label: 'الإيرادات' },
    { key: 'profit', label: 'الأرباح' },
    { key: 'avgOrderValue', label: 'متوسط قيمة الطلب' }
  ];

  return exportToCSV(report.data || [], columns);
}

/**
 * تحميل ملف CSV
 * @param {string} content - محتوى الملف
 * @param {string} filename - اسم الملف
 */
export function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * تصدير البيانات إلى JSON
 * @param {any} data - البيانات
 * @returns {string}
 */
export function exportToJSON(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * تحميل ملف JSON
 * @param {string} content - محتوى الملف
 * @param {string} filename - اسم الملف
 */
export function downloadJSON(content, filename) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
