"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, BookOpen, Phone } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-2.5 flex justify-around items-center z-50"
      style={{ borderColor: "rgba(201,168,76,0.15)", transform: "translate3d(0,0,0)" }}
    >
      <Link 
        href="/" 
        className={`flex flex-col items-center gap-1 text-[10px] ${
          pathname === "/" ? "text-gold-600 font-semibold" : "text-gray-500 hover:text-maroon-700"
        }`}
      >
        <Home size={18} className={pathname === "/" ? "text-gold-600" : "text-gray-500"} />
        <span>Home</span>
      </Link>
      <Link 
        href="/shop" 
        className={`flex flex-col items-center gap-1 text-[10px] ${
          pathname.startsWith("/shop") ? "text-gold-600 font-semibold" : "text-gray-500 hover:text-maroon-700"
        }`}
      >
        <ShoppingBag size={18} className={pathname.startsWith("/shop") ? "text-gold-600" : "text-gray-500"} />
        <span>Shop</span>
      </Link>
      <Link 
        href="/wishlist" 
        className={`flex flex-col items-center gap-1 text-[10px] relative ${
          pathname === "/wishlist" ? "text-gold-600 font-semibold" : "text-gray-500 hover:text-maroon-700"
        }`}
      >
        <div className="relative">
          <Heart size={18} className={pathname === "/wishlist" ? "text-gold-600 fill-gold-600" : "text-gray-500"} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gold-600 text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>
      <Link 
        href="/blog" 
        className={`flex flex-col items-center gap-1 text-[10px] ${
          pathname.startsWith("/blog") ? "text-gold-600 font-semibold" : "text-gray-500 hover:text-maroon-700"
        }`}
      >
        <BookOpen size={18} className={pathname.startsWith("/blog") ? "text-gold-600" : "text-gray-500"} />
        <span>Journal</span>
      </Link>
      <Link 
        href="/contact-us" 
        className={`flex flex-col items-center gap-1 text-[10px] ${
          pathname === "/contact-us" ? "text-gold-600 font-semibold" : "text-gray-500 hover:text-maroon-700"
        }`}
      >
        <Phone size={18} className={pathname === "/contact-us" ? "text-gold-600" : "text-gray-500"} />
        <span>Contact</span>
      </Link>
    </div>
  );
}
