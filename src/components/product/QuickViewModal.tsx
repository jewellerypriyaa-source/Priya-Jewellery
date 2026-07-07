"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildOrderUrl } from "@/lib/whatsapp";

interface QuickViewModalProps {
  productSlug: string;
  onClose: () => void;
}

export default function QuickViewModal({
  productSlug,
  onClose,
}: QuickViewModalProps) {
  const [product, setProduct] = useState<{
    name: string;
    slug: string;
    price: number;
    mrp?: number | null;
    shortDesc?: string | null;
    stockStatus: string;
    images: { url: string; altText?: string | null }[];
    category: { name: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/slug/${productSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productSlug]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const waUrl = product
    ? buildOrderUrl({
        productName: product.name,
        price: product.price,
        productUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/product/${product.slug}`,
      })
    : "#";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,10,14,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(201,168,76,0.2)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#6b1a2a" }}>
            Quick View
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close quick view"
            id="quickview-close"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#c9a84c", borderTopColor: "transparent" }}
            />
          </div>
        ) : product ? (
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText ?? product.name}
                  fill
                  className="object-cover"
                  sizes="192px"
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

            {/* Info */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <p
                  className="text-xs mb-1"
                  style={{ color: "#c9a84c" }}
                >
                  {product.category.name}
                </p>
                <h3
                  className="font-serif text-xl font-semibold mb-2"
                  style={{ color: "#3d0b15" }}
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold" style={{ color: "#3d0b15" }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm line-through text-gray-400">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                  )}
                </div>

                {product.shortDesc && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.shortDesc}
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {product.stockStatus === "SOLD_OUT" ? (
                  <div className="text-center text-sm text-gray-500 py-2 border border-gray-200 rounded-lg">
                    Sold Out
                  </div>
                ) : (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center text-sm"
                    id={`quickview-wa-${productSlug}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order on WhatsApp
                  </a>
                )}

                <Link
                  href={`/product/${product.slug}`}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium py-2 text-maroon-600 hover:text-maroon-800 transition-colors"
                  onClick={onClose}
                >
                  <ExternalLink size={13} />
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Product not found
          </div>
        )}
      </div>
    </div>
  );
}
