import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import UnifiedStoreSetupForm from '@/components/store-setup/unified-store-setup-form';
import { buildMetadata } from '@/lib/seo/metadata';

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
  let storeSetup = null;
  if (session.merchant?.id) {
    storeSetup = await prisma.merchant.findUnique({
      where: { id: session.merchant.id },
      select: {
        id: true,
        businessName: true,
        contactName: true,
        phone: true,
        status: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });
  }

  const initialData = storeSetup ? {
    fullName: storeSetup.contactName || '',
    brandName: storeSetup.businessName || '',
    email: storeSetup.user?.email || session.email || '',
    phone: storeSetup.phone || '',
  } : {
    email: session.email || ''
  };
  
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <UnifiedStoreSetupForm 
          merchantId={session.merchant?.id}
          initialData={initialData}
          isUpdate={!!storeSetup}
        />
      </div>
    </div>
  );
}
