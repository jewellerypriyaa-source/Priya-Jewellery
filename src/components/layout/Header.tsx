"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

interface HeaderProps {
  categories?: Category[];
  logoUrl?: string;
  storeName?: string;
}

const BUDGET_RANGES = [
  { label: "Under ₹999", href: "/shop?maxPrice=999" },
  { label: "₹999 – ₹1999", href: "/shop?minPrice=999&maxPrice=1999" },
  { label: "₹1999 – ₹2999", href: "/shop?minPrice=1999&maxPrice=2999" },
  { label: "₹2999 – ₹4999", href: "/shop?minPrice=2999&maxPrice=4999" },
  { label: "Above ₹5000", href: "/shop?minPrice=5000" },
];

export default function Header({
  categories = [],
  logoUrl,
  storeName = "Priya Jewellery",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; slug: string; price: number }[]
  >([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live search autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`
          );
          const data = await res.json();
          setSearchResults(data.products ?? []);
        } catch {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <header
      className={`z-50 transition-all duration-500 ${
        isTransparent
          ? "absolute top-0 left-0 right-0 bg-transparent text-white border-transparent"
          : "sticky top-0 bg-white/80 backdrop-blur-xl shadow-sm text-gray-900 border-b border-cream-200/40"
      }`}
      style={{
        borderBottom: isTransparent ? "1px solid transparent" : "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 transition-colors ${
              isTransparent ? "text-white hover:text-gold-300" : "text-maroon-700 hover:text-gold-500"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" id="header-logo">
            <Image 
              src="/logo-icon.jpg" 
              alt="Priya Jewellery Logo" 
              width={48} 
              height={48} 
              className="object-contain h-12 w-12 rounded-xl shadow-sm border border-cream-200/20" 
            />
            <div className="text-left flex flex-col justify-center">
              <div
                className="font-serif text-xl md:text-2xl font-bold leading-tight transition-colors duration-500"
                style={{ color: isTransparent ? "#fff" : "#6b1a2a" }}
              >
                {storeName}
              </div>
              <div
                className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 font-light"
                style={{ color: isTransparent ? "#e6c97a" : "#c9a84c" }}
              >
                Fine Jewellery
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopMenuOpen(true)}
              onMouseLeave={() => setShopMenuOpen(false)}
            >
              <button
                className={`nav-link flex items-center gap-1 text-sm font-medium transition-colors ${
                  isTransparent ? "text-white/90 hover:text-gold-300" : "text-gray-700 hover:text-maroon-600"
                }`}
                id="shop-menu-trigger"
              >
                Shop <ChevronDown size={14} />
              </button>

              {/* Mega Menu */}
              {shopMenuOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-xl border border-cream-200 p-6 grid grid-cols-2 gap-6 min-w-[480px] animate-dropdown origin-top"
                  style={{ borderColor: "rgba(201,168,76,0.2)" }}
                >
                  {/* Shop by Category */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-3">
                      Shop by Category
                    </p>
                    <ul className="space-y-2">
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/shop?group=${encodeURIComponent(cat.name)}`}
                            className="text-sm text-gray-700 hover:text-maroon-600 hover:pl-1 transition-all block"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/shop"
                          className="text-sm font-medium text-gold-600 hover:text-gold-700"
                        >
                          View All →
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Shop by Budget */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-3">
                      Shop by Budget
                    </p>
                    <ul className="space-y-2">
                      {BUDGET_RANGES.map((range) => (
                        <li key={range.href}>
                          <Link
                            href={range.href}
                            className="text-sm text-gray-700 hover:text-maroon-600 hover:pl-1 transition-all block"
                          >
                            {range.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Links */}
                  <div className="col-span-2 pt-3 mt-1 border-t border-cream-200 flex gap-4">
                    <Link
                      href="/shop?sort=newest"
                      className="text-sm font-medium text-maroon-600 hover:text-maroon-800"
                    >
                      ✨ New Arrivals
                    </Link>
                    <Link
                      href="/shop?bestseller=true"
                      className="text-sm font-medium text-maroon-600 hover:text-maroon-800"
                    >
                      🏆 Bestsellers
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop?sort=newest"
              className={`nav-link text-sm font-medium transition-colors ${
                isTransparent ? "text-white/90 hover:text-gold-300" : "text-gray-700 hover:text-maroon-600"
              }`}
            >
              New Arrivals
            </Link>
            <Link
              href="/shop?bestseller=true"
              className={`nav-link text-sm font-medium transition-colors ${
                isTransparent ? "text-white/90 hover:text-gold-300" : "text-gray-700 hover:text-maroon-600"
              }`}
            >
              Bestsellers
            </Link>
            <Link
              href="/about-us"
              className={`nav-link text-sm font-medium transition-colors ${
                isTransparent ? "text-white/90 hover:text-gold-300" : "text-gray-700 hover:text-maroon-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className={`nav-link text-sm font-medium transition-colors ${
                isTransparent ? "text-white/90 hover:text-gold-300" : "text-gray-700 hover:text-maroon-600"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 transition-colors ${
                  isTransparent ? "text-white/95 hover:text-gold-300" : "text-gray-600 hover:text-maroon-600"
                }`}
                aria-label="Search"
                id="header-search-toggle"
              >
                <Search size={20} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 md:w-96 bg-white rounded-xl shadow-xl border p-3 z-50 text-gray-900"
                  style={{ borderColor: "rgba(201,168,76,0.2)" }}
                >
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jewellery..."
                      className="input-field text-sm"
                      id="header-search-input"
                    />
                    <button type="submit" className="btn-gold text-xs px-3 py-2">
                      Go
                    </button>
                  </form>

                  {searchResults.length > 0 && (
                    <ul className="mt-2 border-t border-cream-200 pt-2 space-y-1">
                      {searchResults.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/product/${p.slug}`}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cream-100 text-sm"
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            <span className="text-gray-700">{p.name}</span>
                            <span className="text-gold-600 font-medium">
                              ₹{p.price}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`relative p-2 transition-colors ${
                isTransparent ? "text-white/95 hover:text-gold-300" : "text-gray-600 hover:text-maroon-600"
              }`}
              aria-label={`Wishlist (${wishlistCount} items)`}
              id="header-wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: "#6b1a2a", fontSize: "10px" }}
                >
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t px-4 py-4 space-y-3"
          style={{ borderColor: "rgba(201,168,76,0.2)" }}
        >
          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 pb-3 border-b"
            style={{ borderColor: "rgba(201,168,76,0.15)" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="input-field text-sm"
            />
            <button type="submit" className="btn-gold text-xs px-3 py-2">
              <Search size={14} />
            </button>
          </form>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-2">
              Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?group=${encodeURIComponent(cat.name)}`}
                className="block py-1.5 text-sm text-gray-700 hover:text-maroon-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Other Links */}
          <div className="pt-3 border-t space-y-2" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
            {[
              { href: "/shop?sort=newest", label: "New Arrivals" },
              { href: "/shop?bestseller=true", label: "Bestsellers" },
              { href: "/wishlist", label: "My Wishlist" },
              { href: "/about-us", label: "About Us" },
              { href: "/contact-us", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-1.5 text-sm font-medium text-gray-700 hover:text-maroon-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
