// scripts/create-admin.js
// Run with: node scripts/create-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // بيانات المسؤول
    const adminEmail = 'tejaratuk1@gmail.com';
    const adminPassword = 'Admin@yahya2026king'; // غير هذا إلى كلمة مرور قوية
    
    console.log('🔍 التحقق من وجود حساب المسؤول...');
    
    // التحقق من عدم وجود المسؤول
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log('⚠️  حساب المسؤول موجود مسبقاً');
      console.log('📧 البريد:', existingAdmin.email);
      console.log('🔑 الدور:', existingAdmin.role);
      console.log('✅ تم التحقق من البريد:', existingAdmin.emailVerified);
      
      // إذا كان موجود لكن ليس Admin، قم بترقيته
      if (existingAdmin.role !== 'ADMIN') {
        console.log('🔄 ترقية المستخدم إلى مسؤول...');
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            role: 'ADMIN',
            emailVerified: true,
            emailVerifiedAt: new Date(),
          }
        });
        console.log('✅ تم ترقية المستخدم إلى مسؤول بنجاح!');
      }
      
      return;
    }
    
    console.log('📝 إنشاء حساب المسؤول...');
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // إنشاء حساب المسؤول
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      }
    });
    
    console.log('✅ تم إنشاء حساب المسؤول بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 البريد الإلكتروني:', adminEmail);
    console.log('🔒 كلمة المرور:', adminPassword);
    console.log('🔑 الدور: ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  تأكد من تغيير كلمة المرور بعد أول تسجيل دخول!');
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المسؤول:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();