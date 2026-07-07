"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { buildWishlistUrl } from "@/lib/whatsapp";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917367997766";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();

  const waUrl = buildWishlistUrl(items, WA_NUMBER, SITE_URL);

  if (items.length === 0) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20"
        style={{ background: "#fbf6f0" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: "#fadadd" }}
        >
          <Heart size={36} style={{ color: "#6b1a2a" }} />
        </div>
        <h1
          className="font-serif text-3xl font-bold mb-3"
          style={{ color: "#3d0b15" }}
        >
          Your Wishlist is Empty
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Save your favourite pieces and come back to order them — or share your
          entire wishlist with us on WhatsApp!
        </p>
        <Link href="/shop" className="btn-maroon px-8 py-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#fbf6f0" }} className="min-h-screen">
      {/* Header */}
      <div
        className="py-10 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #3d0b15, #6b1a2a)" }}
      >
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#c9a84c" }}>
          Saved Items
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
          My Wishlist
        </h1>
        <p className="text-gray-300 mt-2 text-sm">
          {items.length} item{items.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Order All on WhatsApp CTA */}
        <div
          className="mb-8 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "white", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div>
            <h2 className="font-semibold text-base" style={{ color: "#3d0b15" }}>
              Ready to order your wishlist?
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              We'll send you one message with all your items — confirm availability and delivery over chat!
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp whitespace-nowrap"
              id="order-all-wishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order All ({items.length})
            </a>
            <button
              onClick={() => clearWishlist()}
              className="btn-outline-gold text-sm flex items-center gap-1.5"
              id="clear-wishlist"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.slug}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            >
              {/* Image */}
              <Link href={`/product/${item.slug}`}>
                <div className="relative h-52 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ background: "#fadadd" }}
                    >
                      💍
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <p className="text-xs mb-1" style={{ color: "#c9a84c" }}>
                  {item.categoryName}
                </p>
                <Link href={`/product/${item.slug}`}>
                  <h3
                    className="font-semibold text-sm line-clamp-2 mb-2 hover:text-maroon-600"
                    style={{ color: "#1a0a0e" }}
                  >
                    {item.name}
                  </h3>
                </Link>
                <p className="font-bold mb-3" style={{ color: "#3d0b15" }}>
                  ₹{item.price.toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <a
                    href={buildWishlistUrl([item], WA_NUMBER, SITE_URL)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex-1 justify-center text-xs py-2"
                    id={`wishlist-order-${item.slug}`}
                  >
                    Order
                  </a>
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="p-2 rounded-lg border text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                    style={{ borderColor: "#e0ccb0" }}
                    aria-label="Remove from wishlist"
                    id={`remove-wishlist-${item.slug}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
