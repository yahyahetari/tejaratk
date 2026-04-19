const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const subs = await prisma.subscription.findMany({
    include: { merchant: true }
  });
  console.log("SUBSCRIPTIONS:", JSON.stringify(subs, null, 2));
}

main().finally(() => prisma.$disconnect());
