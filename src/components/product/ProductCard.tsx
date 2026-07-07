"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState } from "react";
import QuickViewModal from "@/components/product/QuickViewModal";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryName?: string;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
}

interface ProductCardProps {
  product: Product;
  onAnalyticsClick?: (type: "WHATSAPP_CLICK" | "WISHLIST_ADD") => void;
}

function StockBadge({ status }: { status: string }) {
  if (status === "SOLD_OUT") return <span className="badge-sold-out">Sold Out</span>;
  if (status === "LOW_STOCK") return <span className="badge-low-stock">Only Few Left</span>;
  if (status === "MADE_TO_ORDER") return <span className="badge-low-stock">Made to Order</span>;
  return null;
}

export default function ProductCard({ product, onAnalyticsClick }: ProductCardProps) {
  const { isWishlisted, toggleItem, addItem } = useWishlistStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discountPct =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;
  const wishlisted = isWishlisted(product.slug);
  const soldOut = product.stockStatus === "SOLD_OUT";

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: primaryImage?.url ?? "",
      categoryName: product.categoryName ?? "",
    });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
    if (!wishlisted) onAnalyticsClick?.("WISHLIST_ADD");
  }

  return (
    <>
      <div className="product-card group relative">
        {/* Image Container */}
        <Link href={`/product/${product.slug}`} id={`product-card-${product.slug}`}>
          <div className="relative h-56 sm:h-64 overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.name}
                fill
                className="product-image object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl"
                style={{ background: "linear-gradient(135deg, #f5ede0, #fadadd)" }}
              >
                💍
              </div>
            )}

            {/* Sold Out Overlay */}
            {soldOut && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold text-sm px-4 py-1.5 rounded-full">
                  Sold Out
                </span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPct && !soldOut && (
              <div
                className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-md"
                style={{ background: "#6b1a2a" }}
              >
                -{discountPct}%
              </div>
            )}

            {/* Badges Row */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
              {product.isNewArrival && !soldOut && (
                <span className="badge-new">New</span>
              )}
              {product.isBestseller && !soldOut && (
                <span className="badge-bestseller">Best</span>
              )}
            </div>

            {/* Hover Actions */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
              {/* Quick View */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-white text-gray-700 hover:text-maroon-600 flex items-center justify-center shadow-md transition-colors"
                aria-label="Quick view"
                id={`quickview-${product.slug}`}
              >
                <Eye size={15} />
              </button>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md transition-colors"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                id={`wishlist-${product.slug}`}
              >
                <Heart
                  size={15}
                  className={wishlisted ? "fill-maroon-600 text-maroon-600" : "text-gray-500"}
                  style={wishlisted ? { fill: "#6b1a2a", color: "#6b1a2a" } : {}}
                />
              </button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p
            className="text-xs mb-1"
            style={{ color: "#c9a84c" }}
          >
            {product.categoryName}
          </p>
          <Link href={`/product/${product.slug}`}>
            <h3
              className="font-medium text-sm sm:text-base line-clamp-2 mb-2 hover:text-maroon-600 transition-colors"
              style={{ color: "#1a0a0e" }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-base" style={{ color: "#3d0b15" }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs line-through text-gray-400">
                ₹{product.mrp.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA */}
          {soldOut ? (
            <div
              className="text-center text-xs text-gray-500 py-2 border border-gray-200 rounded-lg"
            >
              Currently Out of Stock
            </div>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="block text-center text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e6c97a)",
                color: "#3a2808",
              }}
              id={`order-wa-card-${product.slug}`}
            >
              Order on WhatsApp
            </Link>
          )}
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          productSlug={product.slug}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
