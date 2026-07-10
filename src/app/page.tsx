import { Metadata } from "next";
import prisma from "@/lib/prisma";

// Always fetch live data from Supabase — never serve a stale build-time snapshot
export const dynamic = "force-dynamic";
import HeroBanner from "@/components/home/HeroBanner";
import ShopByCategory from "@/components/home/ShopByCategory";
import ProductGrid from "@/components/home/ProductGrid";
import ShopByBudget from "@/components/home/ShopByBudget";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";
import SaleCountdown from "@/components/home/SaleCountdown";
import InstagramGallery from "@/components/home/InstagramGallery";

export const metadata: Metadata = {
  title: "Priya Jewellery — Handcrafted Fine Jewellery",
  description:
    "Discover beautiful handcrafted jewellery — necklaces, earrings, bangles, rings, chokers and bridal sets. Order easily on WhatsApp. Free shipping on orders above ₹1499.",
  openGraph: {
    title: "Priya Jewellery — Handcrafted Fine Jewellery",
    description:
      "Beautiful handcrafted jewellery. Order on WhatsApp — we reply within minutes!",
  },
};

async function getHomepageData() {
  try {
    const [
      heroBanners,
      categories,
      newArrivals,
      bestsellers,
      budgetRanges,
      trustBadges,
      testimonials,
      instagramPosts,
      settings,
    ] = await Promise.all([
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true, slug: true, imageUrl: true },
      }),
      prisma.product.findMany({
        where: { isPublished: true, isNewArrival: true },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
        },
      }),
      prisma.product.findMany({
        where: { isPublished: true, isBestseller: true },
        orderBy: { viewCount: "desc" },
        take: 8,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true } },
        },
      }),
      prisma.budgetRange.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.trustBadge.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.instagramPost.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: { product: { select: { slug: true, name: true } } },
        take: 9,
      }),
      prisma.settings.findUnique({ where: { id: "main" } }),
    ]);

    return {
      heroBanners,
      categories,
      newArrivals: newArrivals.map((p) => ({
        ...p,
        categoryName: p.category.name,
        images: p.images,
      })),
      bestsellers: bestsellers.map((p) => ({
        ...p,
        categoryName: p.category.name,
        images: p.images,
      })),
      budgetRanges,
      trustBadges,
      testimonials,
      instagramPosts,
      settings,
    };
  } catch (error) {
    console.error("Homepage data fetch error:", error);
    return {
      heroBanners: [],
      categories: [],
      newArrivals: [],
      bestsellers: [],
      budgetRanges: [],
      trustBadges: [],
      testimonials: [],
      instagramPosts: [],
      settings: null,
    };
  }
}

export default async function HomePage() {
  const {
    heroBanners,
    categories,
    newArrivals,
    bestsellers,
    budgetRanges,
    trustBadges,
    testimonials,
    instagramPosts,
    settings,
  } = await getHomepageData();

  return (
    <>
      {/* Sale Countdown Banner (shown only if configured) */}
      {settings?.saleCountdownEnd && settings?.saleMessage && (
        <SaleCountdown
          endTime={settings.saleCountdownEnd}
          message={settings.saleMessage}
        />
      )}

      {/* Hero Carousel */}
      <HeroBanner slides={heroBanners} />

      {/* Trust Badges */}
      {trustBadges.length > 0 && <TrustBadges badges={trustBadges} />}

      {/* Shop by Category */}
      {categories.length > 0 && <ShopByCategory categories={categories} />}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-14" style={{ background: "#fbf6f0" }}>
          <ProductGrid
            products={newArrivals}
            title="New Arrivals"
            subtitle="Fresh additions to our collection"
            viewAllHref="/shop?sort=newest"
          />
        </section>
      )}

      {/* Shop by Budget */}
      {budgetRanges.length > 0 && (
        <ShopByBudget ranges={budgetRanges} />
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section
          className="py-14"
          style={{ background: "linear-gradient(135deg, #fdf2f4, #fbf6f0)" }}
        >
          <ProductGrid
            products={bestsellers}
            title="Bestsellers"
            subtitle="Our most-loved pieces — adored by customers"
            viewAllHref="/shop?bestseller=true"
          />
        </section>
      )}

      {/* Instagram Shoppable Gallery */}
      {instagramPosts.length > 0 && (
        <InstagramGallery posts={instagramPosts} />
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Testimonials testimonials={testimonials} />
      )}

      {/* WhatsApp CTA Banner */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1a0a0e 0%, #3d0b15 50%, #6b1a2a 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#c9a84c" }}>
            WhatsApp First Shopping
          </p>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Order? Chat with Us!
          </h2>
          <p className="text-gray-300 mb-8">
            Browse our collection, pick your favourite piece, and we'll confirm
            availability, customise your order, and arrange delivery — all
            over WhatsApp.
          </p>
          <a
            href={`https://wa.me/${settings?.whatsappNumber ?? "917367997766"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-base px-8 py-3"
            id="homepage-wa-cta"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Start Chatting on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
