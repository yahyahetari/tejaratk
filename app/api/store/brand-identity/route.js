import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const merchantId = auth.user.id;
    const body = await request.json();
    const { logo, primaryColor, secondaryColor, fontFamily } = body;

    const store = await prisma.store.findUnique({ where: { merchantId } });

    if (!store) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على المتجر' }, { status: 404 });
    }

    const existingIdentity = await prisma.brandIdentity.findUnique({ where: { storeId: store.id } });
    let brandIdentity;

    if (existingIdentity) {
      brandIdentity = await prisma.brandIdentity.update({
        where: { storeId: store.id },
        data: {
          logo: logo || existingIdentity.logo,
          primaryColor: primaryColor || existingIdentity.primaryColor,
          secondaryColor: secondaryColor || existingIdentity.secondaryColor,
          fontFamily: fontFamily || existingIdentity.fontFamily,
          updatedAt: new Date()
        }
      });
    } else {
      brandIdentity = await prisma.brandIdentity.create({
        data: {
          storeId: store.id,
          logo: logo || null,
          primaryColor: primaryColor || '#3B82F6',
          secondaryColor: secondaryColor || '#10B981',
          fontFamily: fontFamily || 'Cairo'
        }
      });
    }

    await prisma.activityLog.create({
      data: {
        merchantId, action: 'BRAND_IDENTITY_UPDATED',
        description: 'تم تحديث الهوية البصرية للمتجر',
        metadata: { brandIdentityId: brandIdentity.id }
      }
    });

    return NextResponse.json({ success: true, message: 'تم حفظ الهوية البصرية بنجاح', data: brandIdentity });

  } catch (error) {
    console.error('Error in brand identity API:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء حفظ الهوية البصرية' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const prisma = (await import('@/lib/db/prisma')).default;
    const { verifyAuth } = await import('@/lib/auth/session');

    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { merchantId: auth.user.id },
      include: { brandIdentity: true }
    });

    if (!store) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على المتجر' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: store.brandIdentity });

  } catch (error) {
    console.error('Error getting brand identity:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء جلب الهوية البصرية' }, { status: 500 });
  }
}
