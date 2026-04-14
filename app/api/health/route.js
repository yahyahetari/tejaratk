import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const report = {
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    checks: {}
  };

  // 1. Check environment variables
  report.checks.env = {
    DATABASE_URL: process.env.DATABASE_URL
      ? `SET (${process.env.DATABASE_URL.length} chars, starts: ${process.env.DATABASE_URL.substring(0, 20)}...)`
      : 'MISSING ❌',
    JWT_SECRET: process.env.JWT_SECRET
      ? `SET (${process.env.JWT_SECRET.length} chars)`
      : 'MISSING ❌',
    EMAIL_USER: process.env.EMAIL_USER || 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
  };

  // 2. Check Prisma connection
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    await prisma.$connect();
    const userCount = await prisma.user.count();
    report.checks.prisma = {
      status: 'OK ✅',
      connected: true,
      userCount
    };
    await prisma.$disconnect();
  } catch (err) {
    report.checks.prisma = {
      status: 'FAILED ❌',
      error: err.message,
      code: err.code,
    };
  }

  // 3. Check JWT
  try {
    const { generateToken } = await import('@/lib/auth/jwt');
    const token = await generateToken({ test: true, userId: 'test-123' });
    report.checks.jwt = {
      status: 'OK ✅',
      tokenLength: token.length
    };
  } catch (err) {
    report.checks.jwt = {
      status: 'FAILED ❌',
      error: err.message
    };
  }

  return NextResponse.json(report);
}
