import Link from "next/link";
import Image from "next/image";

export default function Logo({ size = 'default', showText = true }) {
  const sizes = {
    small: { container: 'w-10 h-10', text: 'text-lg' },
    default: { container: 'w-14 h-14', text: 'text-2xl' },
    large: { container: 'w-24 h-24', text: 'text-3xl' },
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700/30 to-gold-600/30 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
        
        {/* Logo Container */}
        <div className={`relative ${currentSize.container} rounded-xl overflow-hidden shadow-xl shadow-brand-700/20 group-hover:scale-105 transition-transform bg-white border border-brand-100/50`}>
          <Image
            src="/images/WhatsApp Image 2026-04-23 at 6.58.50 AM.jpeg"
            alt="تجارتك"
            fill
            sizes="256px"
            className="object-cover scale-[1.5] transform-gpu"
            quality={100}
            priority
          />
        </div>
      </div>
      {showText && (
        <span className={`${currentSize.text} font-black gradient-text tracking-tight`}>
          تجارتك
        </span>
      )}
    </Link>
  );
}
