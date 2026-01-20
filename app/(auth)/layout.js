import Link from 'next/link';
import { Store } from 'lucide-react';

/**
 * Auth Layout Component
 * Shared layout for all authentication pages
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-6">
        <div className="container-custom">
          <Link href="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Store className="h-8 w-8" />
            <span className="text-2xl font-bold">تجارتك</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} تجارتك. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}