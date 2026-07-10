import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^"|"$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not found in env');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JEWELLERY_IMAGES = {
  necklace1: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  necklace2: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  earring1: "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=600&q=80",
  earring2: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80",
  bangle1: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
  ring1: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  ring2: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
  choker1: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
  bridal1: "https://images.unsplash.com/photo-1610047803562-7260ebe516c5?w=600&q=80",
  pendant1: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80",
  cat_necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
  cat_earring: "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400&q=80",
  cat_bangle: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
  cat_ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
  cat_choker: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80",
  cat_bridal: "https://images.unsplash.com/photo-1610047803562-7260ebe516c5?w=400&q=80",
  hero1: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80",
  hero2: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
  hero3: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=80",
};

async function main() {
  console.log("🌱 Starting seed database contents (categories, settings, products, hero banners, trust badges)...");

  // Clean old contents
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.instagramPost.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.trustBadge.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.budgetRange.deleteMany();

  // Create Categories
  const catNecklace = await prisma.category.create({
    data: { name: "Necklaces", slug: "necklaces", imageUrl: JEWELLERY_IMAGES.cat_necklace, displayOrder: 1 }
  });
  const catEarrings = await prisma.category.create({
    data: { name: "Earrings", slug: "earrings", imageUrl: JEWELLERY_IMAGES.cat_earring, displayOrder: 2 }
  });
  const catBangles = await prisma.category.create({
    data: { name: "Bangles", slug: "bangles", imageUrl: JEWELLERY_IMAGES.cat_bangle, displayOrder: 3 }
  });
  const catRings = await prisma.category.create({
    data: { name: "Rings", slug: "rings", imageUrl: JEWELLERY_IMAGES.cat_ring, displayOrder: 4 }
  });
  const catChokers = await prisma.category.create({
    data: { name: "Chokers", slug: "chokers", imageUrl: JEWELLERY_IMAGES.cat_choker, displayOrder: 5 }
  });
  const catBridal = await prisma.category.create({
    data: { name: "Bridal Sets", slug: "bridal-sets", imageUrl: JEWELLERY_IMAGES.cat_bridal, displayOrder: 6 }
  });

  console.log("✅ Categories created");

  // Products
  const products = [
    {
      name: "Royal Kundan Necklace",
      slug: "royal-kundan-necklace",
      categoryId: catNecklace.id,
      price: 2499,
      mrp: 3199,
      shortDesc: "Exquisite Kundan necklace with meenakari work.",
      stockQty: 8,
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      imageUrl: JEWELLERY_IMAGES.necklace1,
    },
    {
      name: "Delicate Pearl Chain",
      slug: "delicate-pearl-chain",
      categoryId: catNecklace.id,
      price: 899,
      mrp: 1199,
      shortDesc: "Dainty freshwater pearl chain.",
      stockQty: 15,
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      imageUrl: JEWELLERY_IMAGES.necklace2,
    },
    {
      name: "Oxidised Silver Jhumkas",
      slug: "oxidised-silver-jhumkas",
      categoryId: catEarrings.id,
      price: 649,
      mrp: 849,
      shortDesc: "Classic oxidised silver jhumkas with intricate floral detailing.",
      stockQty: 25,
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      imageUrl: JEWELLERY_IMAGES.earring1,
    },
    {
      name: "Meenakari Drop Earrings",
      slug: "meenakari-drop-earrings",
      categoryId: catEarrings.id,
      price: 799,
      mrp: 999,
      shortDesc: "Vibrant hand-painted enamel drop earrings.",
      stockQty: 12,
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      imageUrl: JEWELLERY_IMAGES.earring2,
    },
    {
      name: "Gold-Plated Kada Bangles",
      slug: "gold-plated-kada-bangles",
      categoryId: catBangles.id,
      price: 1299,
      mrp: 1699,
      shortDesc: "Set of 2 classic gold-plated kada style bangles.",
      stockQty: 10,
      isPublished: true,
      isBestseller: true,
      isNewArrival: true,
      imageUrl: JEWELLERY_IMAGES.bangle1,
    },
    {
      name: "Classic Solitaire Ring",
      slug: "classic-solitaire-ring",
      categoryId: catRings.id,
      price: 1499,
      mrp: 1999,
      shortDesc: "Sparkling cubic zirconia solitaire set in 92.5 sterling silver.",
      stockQty: 5,
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      imageUrl: JEWELLERY_IMAGES.ring1,
    },
    {
      name: "Floral Adjustable Ring",
      slug: "floral-adjustable-ring",
      categoryId: catRings.id,
      price: 499,
      mrp: 699,
      shortDesc: "Charming silver ring with floral CZ design.",
      stockQty: 20,
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      imageUrl: JEWELLERY_IMAGES.ring2,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        price: p.price,
        mrp: p.mrp,
        shortDesc: p.shortDesc,
        stockQty: p.stockQty,
        isPublished: p.isPublished,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        images: {
          create: { url: p.imageUrl, isPrimary: true }
        }
      }
    });
  }
  console.log(`✅ ${products.length} Products created`);

  // Hero Banners
  await prisma.heroBanner.createMany({
    data: [
      { imageUrl: JEWELLERY_IMAGES.hero1, title: "The Royal Collection", subtitle: "Exquisite Handcrafted Kundan & Polki Sets", ctaText: "Explore Now", ctaLink: "/shop?category=necklaces", displayOrder: 1 },
      { imageUrl: JEWELLERY_IMAGES.hero2, title: "Timeless Elegance", subtitle: "Freshwater Pearls & Fine Silver Trinkets", ctaText: "Shop Collection", ctaLink: "/shop", displayOrder: 2 },
      { imageUrl: JEWELLERY_IMAGES.hero3, title: "Everyday Statements", subtitle: "Modern Rings & Minimalist Earrings", ctaText: "Shop Rings", ctaLink: "/shop?category=rings", displayOrder: 3 },
    ]
  });
  console.log("✅ Hero Banners created");

  // Trust Badges
  await prisma.trustBadge.createMany({
    data: [
      { icon: "Sparkles", text: "Premium Craftsmanship", displayOrder: 1 },
      { icon: "Truck", text: "Free Shipping Above ₹1499", displayOrder: 2 },
      { icon: "MessageSquare", text: "Instant Support on WhatsApp", displayOrder: 3 },
      { icon: "Shield", text: "Secure Payment Verification", displayOrder: 4 },
    ]
  });
  console.log("✅ Trust Badges created");

  // Budget Ranges
  await prisma.budgetRange.createMany({
    data: [
      { label: "Under ₹999", minPrice: 0, maxPrice: 999, displayOrder: 1 },
      { label: "₹1,000 to ₹1,999", minPrice: 1000, maxPrice: 1999, displayOrder: 2 },
      { label: "₹2,000 & Above", minPrice: 2000, maxPrice: null, displayOrder: 3 },
    ]
  });
  console.log("✅ Budget Ranges created");

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      { name: "Ananya Sharma", rating: 5, text: "Absolutely loved the Kundan set I bought for my brother's wedding! High quality and looks very premium.", displayOrder: 1 },
      { name: "Priya Patel", rating: 5, text: "Wonderful service. Confirming the order on WhatsApp was quick and simple, delivery took only 2 days in the city.", displayOrder: 2 },
      { name: "Meera Nair", rating: 4, text: "Excellent collection. The Solitaire Ring is beautiful and fits perfectly. Will definitely purchase again.", displayOrder: 3 },
    ]
  });
  console.log("✅ Testimonials created");

  await prisma.$disconnect();
  await pool.end();
  console.log("🎉 Seed finished successfully!");
}

main().catch((e) => {
  console.error("Error seeding:", e);
  process.exit(1);
});
