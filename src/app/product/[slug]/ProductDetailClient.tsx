"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Copy, Star, ChevronRight, ChevronDown } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { buildOrderUrl, buildNotifyUrl } from "@/lib/whatsapp";
import ProductCard from "@/components/product/ProductCard";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceDelta: number;
  stockQty: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: Date;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  shortDesc: string | null;
  description: string | null;
  sku: string | null;
  stockStatus: string;
  stockQty: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  category: { id: string; name: string; slug: string };
  images: ProductImage[];
  variants: ProductVariant[];
  video: { url: string; thumbnail?: string | null } | null;
  reviews: Review[];
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryName: string;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  whatsappNumber: string;
  whatsappTemplate: string;
  siteUrl: string;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          style={
            star <= rating
              ? { fill: "#c9a84c", color: "#c9a84c" }
              : { color: "#d1d5db" }
          }
        />
      ))}
    </div>
  );
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  whatsappNumber,
  whatsappTemplate,
  siteUrl,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null
  );
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    text: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  // Gallery image swap crossfade transition
  useGSAP(() => {
    const mainImg = document.querySelector(".product-detail-main-image");
    if (mainImg) {
      gsap.fromTo(
        mainImg,
        { opacity: 0.15 },
        { opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, { dependencies: [selectedImage] });

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(product.slug);
  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];
  const soldOut = product.stockStatus === "SOLD_OUT";
  const lowStock = product.stockStatus === "LOW_STOCK";

  const finalPrice = product.price + (selectedVariant?.priceDelta ?? 0);
  const discountPct =
    product.mrp && product.mrp > finalPrice
      ? Math.round(((product.mrp - finalPrice) / product.mrp) * 100)
      : null;

  const productUrl = `${siteUrl}/product/${product.slug}`;

  // Track view on mount
  useEffect(() => {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "VIEW", productId: product.id }),
    }).catch(() => {});
  }, [product.id]);

  const waUrl = buildOrderUrl({
    productName: product.name,
    price: finalPrice,
    variant: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
    productUrl,
    waNumber: whatsappNumber,
    template: whatsappTemplate || undefined,
  });

  const notifyUrl = buildNotifyUrl(product.name, productUrl, whatsappNumber);

  function handleWaClick() {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "WHATSAPP_CLICK", productId: product.id }),
    }).catch(() => {});
  }

  function handleWishlistToggle() {
    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      imageUrl: primaryImage?.url ?? "",
      categoryName: product.category.name,
    });
    if (!wishlisted) {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "WISHLIST_ADD", productId: product.id }),
      }).catch(() => {});
      toast.success("Added to wishlist ❤️");
    } else {
      toast.success("Removed from wishlist");
    }
  }

  async function handleShareCopy() {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewForm.name,
          rating: reviewForm.rating,
          text: reviewForm.text,
        }),
      });
      if (res.ok) {
        toast.success("Review submitted! It will appear after approval. Thank you 🙏");
        setReviewForm({ name: "", rating: 5, text: "" });
        setShowReviewForm(false);
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div style={{ background: "#fbf6f0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-maroon-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-maroon-600">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop/${product.category.slug}`} className="hover:text-maroon-600">
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#6b1a2a" }} className="line-clamp-1 max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT — Images */}
          <div>
            {/* Main Image */}
            <div
              className="image-zoom-container relative rounded-2xl overflow-hidden mb-3"
              style={{
                aspectRatio: "1/1",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].altText ?? product.name}
                  fill
                  className="object-cover product-detail-main-image"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-6xl"
                  style={{ background: "#fadadd" }}
                >
                  💍
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNewArrival && !soldOut && (
                  <span className="badge-new">New Arrival</span>
                )}
                {product.isBestseller && !soldOut && (
                  <span className="badge-bestseller">Bestseller</span>
                )}
                {soldOut && <span className="badge-sold-out">Sold Out</span>}
                {lowStock && !soldOut && (
                  <span className="badge-low-stock">
                    {product.stockQty > 0 ? `Only ${product.stockQty} left!` : "Low Stock"}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor:
                        i === selectedImage ? "#c9a84c" : "transparent",
                    }}
                    id={`thumb-${i}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `Image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}

                {/* Video thumbnail if present */}
                {product.video && (
                  <button
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 flex items-center justify-center"
                    style={{ background: "#1a0a0e", borderColor: "rgba(201,168,76,0.3)" }}
                    aria-label="Play video"
                  >
                    <span className="text-white text-xl">▶</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Product Info */}
          <div className="sticky-sidebar-desktop">
            {/* Category & Name */}
            <Link
              href={`/shop/${product.category.slug}`}
              className="text-xs font-semibold uppercase tracking-wider mb-2 block hover:underline"
              style={{ color: "#c9a84c" }}
            >
              {product.category.name}
            </Link>

            <h1
              className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{ color: "#1a0a0e" }}
            >
              {product.name}
            </h1>

            {/* Reviews Summary */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating
                  rating={Math.round(
                    product.reviews.reduce((s, r) => s + r.rating, 0) /
                      product.reviews.length
                  )}
                  size={14}
                />
                <span className="text-sm text-gray-500">
                  ({product.reviews.length} review
                  {product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="font-bold text-3xl"
                style={{ color: "#3d0b15" }}
              >
                ₹{finalPrice.toLocaleString()}
              </span>
              {product.mrp && product.mrp > finalPrice && (
                <>
                  <span className="text-lg line-through text-gray-400">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded-md"
                    style={{ background: "#6b1a2a", color: "white" }}
                  >
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-gray-600 mb-5 leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2" style={{ color: "#3d0b15" }}>
                  {product.variants[0].name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-all"
                      style={{
                        borderColor:
                          selectedVariant?.id === v.id
                            ? "#c9a84c"
                            : "#e0ccb0",
                        background:
                          selectedVariant?.id === v.id
                            ? "#c9a84c"
                            : "white",
                        color:
                          selectedVariant?.id === v.id ? "#3a2808" : "#4a2535",
                      }}
                      id={`variant-${v.id}`}
                    >
                      {v.value}
                      {v.priceDelta !== 0 && (
                        <span className="ml-1 text-xs opacity-70">
                          {v.priceDelta > 0 ? "+" : ""}₹{v.priceDelta}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {soldOut ? (
                <a
                  href={notifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 justify-center py-3.5 text-base"
                  id="notify-wa-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Notify Me When Back in Stock
                </a>
              ) : (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWaClick}
                  className="btn-whatsapp flex-1 justify-center py-3.5 text-base"
                  id="order-wa-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order on WhatsApp
                </a>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border-2 font-semibold text-sm transition-all"
                style={{
                  borderColor: wishlisted ? "#6b1a2a" : "#e0ccb0",
                  background: wishlisted ? "#6b1a2a" : "white",
                  color: wishlisted ? "white" : "#3d0b15",
                }}
                id="wishlist-btn"
              >
                <Heart
                  size={18}
                  style={
                    wishlisted
                      ? { fill: "white", color: "white" }
                      : { color: "#6b1a2a" }
                  }
                />
                {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-500 font-medium">Share:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this beautiful jewellery: ${product.name} — ₹${finalPrice.toLocaleString()}\n${productUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "#25d366", color: "white" }}
                id="share-whatsapp"
              >
                WhatsApp
              </a>
              <button
                onClick={handleShareCopy}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium hover:bg-cream-100 transition-colors"
                style={{ borderColor: "#e0ccb0", color: "#3d0b15" }}
                id="share-copy"
              >
                <Copy size={11} />
                Copy Link
              </button>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-gray-400 mb-4">SKU: {product.sku}</p>
            )}

            {/* Stock Status */}
            <div
              className="text-sm font-medium px-3 py-2 rounded-lg mb-4 w-fit"
              style={{
                background:
                  soldOut
                    ? "#f3f4f6"
                    : lowStock
                    ? "#fef3c7"
                    : "#d1fae5",
                color: soldOut
                  ? "#6b7280"
                  : lowStock
                  ? "#92400e"
                  : "#065f46",
              }}
            >
              {soldOut
                ? "Currently Out of Stock"
                : lowStock
                ? `⚠️ Only ${product.stockQty > 0 ? product.stockQty : "a few"} left — order soon!`
                : "✓ In Stock"}
            </div>
          </div>
        </div>

        {/* Specifications Accordions */}
        <div className="mt-12 space-y-2">
          {/* Accordion 1: Details */}
          {product.description && (
            <div className="accordion-wrapper">
              <button
                className="accordion-trigger"
                onClick={() => toggleAccordion("details")}
                aria-expanded={openAccordion === "details"}
              >
                <span>Product Details</span>
                <ChevronDown
                  size={18}
                  className="accordion-icon"
                  style={{
                    transform: openAccordion === "details" ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <div
                className="accordion-content"
                style={{
                  height: openAccordion === "details" ? "auto" : "0px",
                }}
              >
                <div className="accordion-content-inner">
                  <div
                    className="rich-text text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Accordion 2: Care Instructions */}
          <div className="accordion-wrapper">
            <button
              className="accordion-trigger"
              onClick={() => toggleAccordion("care")}
              aria-expanded={openAccordion === "care"}
            >
              <span>Care Instructions</span>
              <ChevronDown
                size={18}
                className="accordion-icon"
                style={{
                  transform: openAccordion === "care" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            <div
              className="accordion-content"
              style={{
                height: openAccordion === "care" ? "auto" : "0px",
              }}
            >
              <div className="accordion-content-inner text-sm md:text-base">
                <p className="mb-2">To preserve the brilliant lustre of your Priyaa Fine Jewellery:</p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Avoid direct contact with water, sweat, perfumes, and hairsprays.</li>
                  <li>Remove jewellery before washing hands, swimming, or exercising.</li>
                  <li>Clean gently with a soft, clean dry microfibre cloth after wear.</li>
                  <li>Store in an airtight container or original velvet box to prevent oxidation.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 3: Shipping & Returns */}
          <div className="accordion-wrapper">
            <button
              className="accordion-trigger"
              onClick={() => toggleAccordion("shipping")}
              aria-expanded={openAccordion === "shipping"}
            >
              <span>Shipping & Returns</span>
              <ChevronDown
                size={18}
                className="accordion-icon"
                style={{
                  transform: openAccordion === "shipping" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            <div
              className="accordion-content"
              style={{
                height: openAccordion === "shipping" ? "auto" : "0px",
              }}
            >
              <div className="accordion-content-inner text-sm md:text-base">
                <p className="mb-2"><strong>Standard Delivery:</strong> Dispatched within 2–3 business days. Free shipping in-city on orders above ₹1,499.</p>
                <p><strong>Returns Policy:</strong> Defective items are eligible for exchange/return. Please contact our support team on WhatsApp within 7 days of receiving your package.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "#3d0b15" }}>
              Customer Reviews
              {product.reviews.length > 0 && (
                <span className="ml-2 text-base text-gray-500 font-normal">
                  ({product.reviews.length})
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-outline-gold text-sm"
              id="write-review-btn"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-5 rounded-xl border"
              style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "#3d0b15" }}>
                Share Your Experience
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  className="input-field"
                  id="review-name"
                />
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: "#3d0b15" }}>
                    Rating
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          style={
                            star <= reviewForm.rating
                              ? { fill: "#c9a84c", color: "#c9a84c" }
                              : { color: "#d1d5db" }
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  placeholder="Tell us about your experience..."
                  required
                  rows={4}
                  className="input-field resize-none"
                  id="review-text"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="btn-maroon text-sm"
                    id="review-submit"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Reviews are reviewed by our team before publishing.
                </p>
              </div>
            </form>
          )}

          {/* Review List */}
          {product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 rounded-xl"
                  style={{ background: "white", border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#3d0b15" }}>
                        {review.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-10 rounded-xl"
              style={{ background: "white", border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <p className="text-gray-400 mb-3">No reviews yet.</p>
              <p className="text-sm text-gray-500">Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2
              className="font-serif text-2xl font-semibold mb-2 text-center"
              style={{ color: "#3d0b15" }}
            >
              You May Also Like
            </h2>
            <div className="section-divider mb-8">
              <span>✦</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
