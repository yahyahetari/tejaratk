import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Logo({ size = 'default', showText = true }) {
  const sizes = {
    small: { container: 'w-8 h-8', icon: 'h-4 w-4', text: 'text-lg' },
    default: { container: 'w-11 h-11', icon: 'h-5 w-5', text: 'text-2xl' },
    large: { container: 'w-14 h-14', icon: 'h-7 w-7', text: 'text-3xl' },
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        <div className="absolute inset-0 gradient-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
        <div className={`relative ${currentSize.container} gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform`}>
          <ShoppingCart className={`${currentSize.icon} text-white`} />
        </div>
      </div>
      {showText && (
        <span className={`${currentSize.text} font-black gradient-text`}>
          تجارتك
        </span>
      )}
    </Link>
  );
}
