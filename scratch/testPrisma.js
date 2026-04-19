const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testInsert() {
  const merchantId = 'test_merchant_id_123';
  const prismaStatus = 'ACTIVE';
  const planId = 'BASIC';
  const planName = 'Basic Plan';
  const planType = 'BASIC';
  const billingCycle = 'MONTHLY';
  const currentPeriodStart = new Date().toISOString();
  const currentPeriodEnd = new Date().toISOString();
  const paddleSubscriptionId = 'sub_123_456';

  try {
    const result = await prisma.subscription.upsert({
      where: { merchantId },
      update: { 
        status: prismaStatus, 
        planId: planId || planType || 'BASIC',
        planName: planName || planType || 'Basic Plan',
        planType: planType || 'BASIC', 
        billingCycle: billingCycle || 'MONTHLY', 
        startDate: currentPeriodStart ? new Date(currentPeriodStart) : undefined, 
        endDate: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
        paddleSubscriptionId,
        updatedAt: new Date() 
      },
      create: { 
        merchantId, 
        status: prismaStatus, 
        planId: planId || planType || 'BASIC',
        planName: planName || planType || 'Basic Plan',
        planType: planType || 'BASIC', 
        billingCycle: billingCycle || 'MONTHLY', 
        startDate: currentPeriodStart ? new Date(currentPeriodStart) : new Date(), 
        endDate: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
        paddleSubscriptionId,
        amount: 0 
      }
    });
    console.log("SUCCESS:", result);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
  }
}

testInsert().finally(() => prisma.$disconnect());
