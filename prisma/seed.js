const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء تهيئة قاعدة البيانات...');

  // إنشاء المستخدم المسؤول
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tejaratk.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    console.log(`✅ تم إنشاء المستخدم المسؤول: ${admin.email}`);
  } else {
    console.log(`ℹ️ المستخدم المسؤول موجود مسبقاً: ${adminEmail}`);
  }

  // إنشاء مستخدم تجريبي (اختياري)
  const demoEmail = 'demo@tejaratk.com';
  const demoPassword = 'Demo@123456';

  const existingDemo = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingDemo) {
    const hashedPassword = await bcrypt.hash(demoPassword, 12);

    // حساب تاريخ انتهاء الفترة التجريبية (30 يوم)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        password: hashedPassword,
        role: 'MERCHANT',
        emailVerified: true,
        merchant: {
          create: {
            businessName: 'متجر تجريبي',
            contactName: 'مستخدم تجريبي',
            phone: '+96812345678',
            status: 'ACTIVE',
            trialEndDate: trialEndDate,
            storeName: 'متجر تجريبي',
            storeSlug: 'demo-store',
            storeDescription: 'هذا متجر تجريبي لاختبار منصة تجارتك',
            currency: 'OMR',
            timezone: 'Asia/Muscat',
            language: 'ar',
          },
        },
      },
      include: {
        merchant: true,
      },
    });

    console.log(`✅ تم إنشاء المستخدم التجريبي: ${demoUser.email}`);
  } else {
    console.log(`ℹ️ المستخدم التجريبي موجود مسبقاً: ${demoEmail}`);
  }

  console.log('✨ تمت تهيئة قاعدة البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
