const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testInsert() {
  const merchantId = 'test_merchant_id_123';
  const prismaStatus = 'ACTIVE';
  const planType = 'PREMIUM';
  const billingCycle = 'MONTHLY';
  const currentPeriodStart = new Date().toISOString();
  const currentPeriodEnd = new Date().toISOString();
  const paddleSubscriptionId = 'sub_123';

  try {
    const result = await prisma.subscription.upsert({
      where: { merchantId },
      update: { 
        status: prismaStatus, 
        planType, 
        billingCycle, 
        startDate: currentPeriodStart ? new Date(currentPeriodStart) : undefined, 
        endDate: currentPeriodEnd ? new Date(currentPeriodEnd) : undefined,
        paddleSubscriptionId,
        updatedAt: new Date() 
      },
      create: { 
        merchantId, 
        status: prismaStatus, 
        planType: planType || 'BASIC', 
        billingCycle: billingCycle || 'MONTHLY', 
        startDate: currentPeriodStart ? new Date(currentPeriodStart) : new Date(), 
        endDate: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
        paddleSubscriptionId,
        amount: 0 // Default value, will be synced properly from transactions later
      }
    });
    console.log("SUCCESS:", result);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
  }
}

testInsert().finally(() => prisma.$disconnect());
