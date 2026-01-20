import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { verifyAuth } from '@/lib/auth/session';

export async function GET(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        businessName: true,
        contactName: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        country: true,
        currency: true,
        taxRate: true,
        shippingCost: true,
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 });
    }

    const settings = {
      storeName: merchant.businessName || '',
      storeDescription: '',
      storeEmail: merchant.email || '',
      storePhone: merchant.phone || '',
      storeAddress: merchant.address || '',
      storeCity: merchant.city || '',
      storeCountry: merchant.country || '',
      currency: merchant.currency || 'SAR',
      taxRate: merchant.taxRate || 0,
      shippingCost: merchant.shippingCost || 0,
    };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const {
      storeName,
      storeEmail,
      storePhone,
      storeAddress,
      storeCity,
      storeCountry,
      currency,
      taxRate,
      shippingCost,
    } = body;

    const merchant = await prisma.merchant.update({
      where: { userId: session.userId },
      data: {
        businessName: storeName,
        email: storeEmail,
        phone: storePhone,
        address: storeAddress,
        city: storeCity,
        country: storeCountry,
        currency: currency || 'SAR',
        taxRate: parseFloat(taxRate) || 0,
        shippingCost: parseFloat(shippingCost) || 0,
      },
    });

    return NextResponse.json({ success: true, merchant });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
