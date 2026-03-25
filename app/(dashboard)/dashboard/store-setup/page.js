import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import UnifiedStoreSetupForm from '@/components/store-setup/unified-store-setup-form';
import { buildMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'إعداد المتجر',
  path: '/dashboard/store-setup',
  noIndex: true
});

export default async function StoreSetupPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // جلب بيانات الإعداد الحالية إن وجدت
  let merchantData = null;
  if (session.merchant?.id) {
    const prisma = (await import('@/lib/db/prisma')).default;
    merchantData = await prisma.merchant.findUnique({
      where: { id: session.merchant.id },
      select: {
        id: true,
        businessName: true,
        contactName: true,
        phone: true,
        email: true,
        status: true,
        storeLogo: true,
        user: {
          select: {
            email: true
          }
        },
        store: {
          select: {
            brandName: true,
            email: true,
            phone: true,
            country: true,
          }
        },
        storeSetup: {
          select: {
            basicInfoCompleted: true,
            licenseCompleted: true,
            paymentSetupCompleted: true,
            brandIdentityCompleted: true,
            paymentGateway: true,
          }
        },
        brandIdentity: {
          select: {
            primaryColor: true,
            secondaryColor: true,
            logo: true,
          }
        }
      }
    });
  }

  const initialData = merchantData ? {
    fullName: merchantData.contactName || '',
    brandName: merchantData.store?.brandName || merchantData.businessName || '',
    email: merchantData.store?.email || merchantData.email || merchantData.user?.email || session.email || '',
    phone: merchantData.store?.phone || merchantData.phone || '',
    hasLicense: merchantData.storeSetup?.licenseCompleted || false,
    country: merchantData.store?.country || '',
    paymentGateways: merchantData.storeSetup?.paymentConfig?.selected || (merchantData.storeSetup?.paymentGateway ? merchantData.storeSetup.paymentGateway.split(',').filter(Boolean) : []),
    logo: merchantData.brandIdentity?.logo || merchantData.storeLogo || '',
    primaryColor: merchantData.brandIdentity?.primaryColor || '#3B82F6',
    secondaryColor: merchantData.brandIdentity?.secondaryColor || '#10B981',
  } : {
    email: session.email || ''
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <UnifiedStoreSetupForm
          merchantId={session.merchant?.id}
          initialData={initialData}
          isUpdate={!!merchantData}
        />
      </div>
    </div>
  );
}
