import Link from 'next/link';
import Image from 'next/image';
import { Store } from 'lucide-react';

/**
 * Auth Layout Component
 * Shared layout for all authentication pages
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-950 flex flex-col relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-800/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-700/10 rounded-full blur-[120px]"></div>

      {/* Header */}
      <header className="w-full py-6 relative z-10">
        <div className="container-custom">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-brand-700/40 group-hover:scale-105 transition-transform bg-white border-2 border-brand-100/30">
              <Image src="/images/WhatsApp Image 2026-04-23 at 6.58.50 AM.jpeg" alt="تجارتك" fill sizes="256px" quality={100} className="object-cover scale-[1.5] transform-gpu" priority />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-brand-400 to-gold-400 bg-clip-text text-transparent">تجارتك</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-500 relative z-10">
        <p>
          © {new Date().getFullYear()} تجارتك. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}