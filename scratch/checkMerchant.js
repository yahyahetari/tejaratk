const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const u = await prisma.user.findUnique({ 
    where: { email: "yahyaalhetari5@gmail.com" }, 
    include: { merchant: true } 
  });
  console.log(JSON.stringify(u, null, 2));
}

checkUser().finally(() => prisma.$disconnect());
