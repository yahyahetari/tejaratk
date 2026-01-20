import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'تجارتك - منصة إنشاء المتاجر الإلكترونية',
  description: 'أنشئ متجرك الإلكتروني في دقائق مع تجارتك. منصة SaaS احترافية لإدارة متجرك بسهولة.',
  keywords: 'متجر إلكتروني, SaaS, تجارة إلكترونية, تجارتك',
};

/**
 * Root Layout Component
 */
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        {children}
      </body>
    </html>
  );
}