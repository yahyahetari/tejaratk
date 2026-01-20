// lib/utils/pdf-generator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * توليد PDF للتقرير
 */
export function generateReportPDF(report, merchantName) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // إعداد الخط العربي (يجب تحميل خط عربي)
  doc.setLanguage('ar');
  doc.setR2L(true);

  let yPosition = 20;

  // العنوان
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('تقرير المبيعات والأرباح', 105, yPosition, { align: 'center' });
  yPosition += 10;

  // اسم المتجر
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(merchantName, 105, yPosition, { align: 'center' });
  yPosition += 10;

  // الفترة
  const periodText = getPeriodText(report.period.type);
  const dateRange = `${format(new Date(report.period.start), 'dd MMMM yyyy', { locale: ar })} - ${format(new Date(report.period.end), 'dd MMMM yyyy', { locale: ar })}`;
  doc.setFontSize(12);
  doc.text(`${periodText}: ${dateRange}`, 105, yPosition, { align: 'center' });
  yPosition += 15;

  // الملخص
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('الملخص', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const summaryData = [
    ['إجمالي الطلبات', report.summary.totalOrders.toString()],
    ['إجمالي الإيرادات', `${report.summary.totalRevenue.toFixed(2)} ر.س`],
    ['إجمالي التكاليف', `${report.summary.totalCost.toFixed(2)} ر.س`],
    ['إجمالي الأرباح', `${report.summary.totalProfit.toFixed(2)} ر.س`],
    ['هامش الربح', `${report.summary.profitMargin.toFixed(2)}%`],
    ['متوسط قيمة الطلب', `${report.summary.averageOrderValue.toFixed(2)} ر.س`],
    ['نمو الإيرادات', `${report.summary.revenueGrowth > 0 ? '+' : ''}${report.summary.revenueGrowth.toFixed(2)}%`],
    ['نمو الأرباح', `${report.summary.profitGrowth > 0 ? '+' : ''}${report.summary.profitGrowth.toFixed(2)}%`],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['المؤشر', 'القيمة']],
    body: summaryData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      halign: 'right',
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // الطلبات حسب الحالة
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('الطلبات حسب الحالة', 20, yPosition);
  yPosition += 10;

  const statusData = [
    ['قيد الانتظار', report.ordersByStatus.pending.toString()],
    ['قيد المعالجة', report.ordersByStatus.processing.toString()],
    ['تم الشحن', report.ordersByStatus.shipped.toString()],
    ['تم التوصيل', report.ordersByStatus.delivered.toString()],
    ['ملغي', report.ordersByStatus.cancelled.toString()],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['الحالة', 'العدد']],
    body: statusData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      halign: 'right',
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // أفضل المنتجات
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('أفضل 10 منتجات مبيعاً', 20, yPosition);
  yPosition += 10;

  const productsData = report.topProducts.map((product, index) => [
    (index + 1).toString(),
    product.title,
    product.quantity.toString(),
    `${product.revenue.toFixed(2)} ر.س`,
    `${product.profit.toFixed(2)} ر.س`,
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['#', 'المنتج', 'الكمية', 'الإيرادات', 'الأرباح']],
    body: productsData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      halign: 'right',
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

  // التذييل
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `صفحة ${i} من ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      `تم الإنشاء في: ${format(new Date(), 'dd MMMM yyyy - HH:mm', { locale: ar })}`,
      105,
      285,
      { align: 'center' }
    );
  }

  return doc;
}

function getPeriodText(period) {
  switch (period) {
    case 'week':
      return 'أسبوعي';
    case 'month':
      return 'شهري';
    case 'year':
      return 'سنوي';
    default:
      return 'الفترة';
  }
}

/**
 * تحميل PDF
 */
export function downloadPDF(doc, filename) {
  doc.save(filename);
}

/**
 * الحصول على PDF كـ Blob
 */
export function getPDFBlob(doc) {
  return doc.output('blob');
}
