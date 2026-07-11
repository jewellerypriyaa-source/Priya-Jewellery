"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
}

interface GroupSection {
  group: string;
  products: ProductItem[];
}

interface CategoryGroupsSectionProps {
  groups: GroupSection[];
}

// Map each group to an accent colour and icon
const GROUP_META: Record<string, { accent: string; bg: string; icon: string; tagline: string }> = {
  "Gold Plated": {
    accent: "#c9a84c",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    icon: "✨",
    tagline: "1.5 gram Gold • Timeless Elegance",
  },
  "Anti Tarnish": {
    accent: "#0ea5e9",
    bg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    icon: "🛡️",
    tagline: "Long-lasting shine • No fading",
  },
  "American Diamond": {
    accent: "#8b5cf6",
    bg: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
    icon: "💎",
    tagline: "Brilliant sparkle • Premium look",
  },
  "Polki Kundan": {
    accent: "#e11d48",
    bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
    icon: "👑",
    tagline: "Royal craftsmanship • Bridal favourite",
  },
  "Bridal": {
    accent: "#be123c",
    bg: "linear-gradient(135deg, #fff0f3 0%, #fecdd3 100%)",
    icon: "💍",
    tagline: "Complete sets • Your perfect day",
  },
  "German Silver": {
    accent: "#475569",
    bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    icon: "🌿",
    tagline: "Pure & durable • Everyday wear",
  },
  "Oxidised": {
    accent: "#78350f",
    bg: "linear-gradient(135deg, #fdf8f4 0%, #fef3c7 100%)",
    icon: "🌙",
    tagline: "Boho chic • Ethnic beauty",
  },
};

function ProductMiniCard({ product }: { product: ProductItem }) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discountPct =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;
  const soldOut = product.stockStatus === "SOLD_OUT";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex-shrink-0 w-44 sm:w-52"
      id={`group-product-${product.slug}`}
    >
      <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="208px"
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80"
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="208px"
          />
        )}

        {/* Sold Out overlay */}
        {soldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isNewArrival && !soldOut && (
            <span className="badge-new text-[9px] px-1.5 py-0.5">New</span>
          )}
          {product.isBestseller && !soldOut && (
            <span className="badge-bestseller text-[9px] px-1.5 py-0.5">Best</span>
          )}
        </div>

        {/* Discount */}
        {discountPct && !soldOut && (
          <div
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "#6b1a2a" }}
          >
            -{discountPct}%
          </div>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-xs font-medium line-clamp-2 leading-snug" style={{ color: "#1a0a0e" }}>
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-bold" style={{ color: "#3d0b15" }}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs line-through text-gray-400">
              ₹{product.mrp.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function GroupRow({ group, products }: { group: string; products: ProductItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const meta = GROUP_META[group] ?? {
    accent: "#c9a84c",
    bg: "#fbf6f0",
    icon: "💫",
    tagline: "Exquisite jewellery",
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  const groupSlug = group.toLowerCase().replace(/\s+/g, "+");

  return (
    <section
      className="py-12 px-0"
      style={{ background: meta.bg }}
      id={`group-section-${group.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={group}>
                {meta.icon}
              </span>
              <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: meta.accent }}
              >
                {meta.tagline}
              </span>
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl font-bold"
              style={{ color: "#1a0a0e" }}
            >
              {group}
            </h2>
            {/* Accent underline */}
            <div
              className="h-0.5 w-16 mt-2 rounded-full"
              style={{ background: `linear-gradient(to right, ${meta.accent}, transparent)` }}
            />
          </div>

          <Link
            href={`/shop?group=${encodeURIComponent(group)}`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold transition-colors"
            style={{ color: meta.accent }}
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Product Scroll Row or Coming Soon */}
        {products.length > 0 ? (
          <div className="relative">
            {/* Scroll Left */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors hidden sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable row */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((p) => (
                <ProductMiniCard key={p.id} product={p} />
              ))}

              {/* "View All" card at the end */}
              <Link
                href={`/shop?group=${encodeURIComponent(group)}`}
                className="flex-shrink-0 w-44 sm:w-52 h-48 sm:h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:bg-white/60"
                style={{ borderColor: meta.accent + "60" }}
              >
                <span className="text-2xl">{meta.icon}</span>
                <span
                  className="text-xs font-semibold text-center px-4"
                  style={{ color: meta.accent }}
                >
                  View All {group}
                </span>
                <ChevronRight size={14} style={{ color: meta.accent }} />
              </Link>
            </div>

            {/* Scroll Right */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors hidden sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* Coming Soon State */
          <div
            className="rounded-2xl border-2 border-dashed py-12 flex flex-col items-center gap-3"
            style={{ borderColor: meta.accent + "40" }}
          >
            <Sparkles size={28} style={{ color: meta.accent, opacity: 0.6 }} />
            <p className="font-semibold text-sm" style={{ color: "#3d0b15" }}>
              Coming Soon
            </p>
            <p className="text-xs text-gray-500 text-center max-w-xs px-4">
              Our {group} collection is being curated. Check back soon or message us on WhatsApp!
            </p>
            <a
              href="https://wa.me/917367997766"
              className="mt-2 text-xs font-bold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-80"
              style={{ background: "#25D366" }}
            >
              Ask on WhatsApp
            </a>
          </div>
        )}

        {/* Mobile "View All" link */}
        {products.length > 0 && (
          <div className="text-center mt-5 sm:hidden">
            <Link
              href={`/shop?group=${encodeURIComponent(group)}`}
              className="inline-flex items-center gap-1 text-sm font-semibold"
              style={{ color: meta.accent }}
            >
              View All {group} <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CategoryGroupsSection({ groups }: CategoryGroupsSectionProps) {
  // Defined order always
  const ORDER = [
    "Gold Plated",
    "Anti Tarnish",
    "American Diamond",
    "Polki Kundan",
    "Bridal",
    "German Silver",
    "Oxidised",
  ];

  const groupMap = Object.fromEntries(groups.map((g) => [g.group, g.products]));

  return (
    <div className="divide-y divide-gray-100">
      {ORDER.map((groupName) => (
        <GroupRow
          key={groupName}
          group={groupName}
          products={groupMap[groupName] ?? []}
        />
      ))}
    </div>
  );
}
