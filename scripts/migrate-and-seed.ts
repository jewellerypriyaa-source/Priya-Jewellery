/**
 * One-off migration script:
 * 1. Adds `group` column to Category table (if it doesn't exist)
 * 2. Runs the full seed (deletes old data, inserts new categories & products)
 *
 * Run: npx ts-node --esm scripts/migrate-and-seed.ts
 */

import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

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
  hero1: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80",
  hero2: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
  hero3: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=80",
};

async function main() {
  console.log("🔧 Step 1: Adding 'group' column to Category table...");
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "group" TEXT;`
    );
    console.log('✅ Column "group" added (or already exists)');
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log('✅ Column "group" already exists, skipping');
    } else {
      throw e;
    }
  }

  console.log("\n🌱 Step 2: Seeding the database...");

  // Clean up
  await prisma.analyticsEvent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.comboItem.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.instagramPost.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.trustBadge.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.budgetRange.deleteMany();
  await prisma.policyPage.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.lead.deleteMany();
  console.log("✅ Old data cleared");

  // Admin
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Priya@123", 12);
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL ?? "admin@priyajewellery.com",
      passwordHash,
      name: "Priya Admin",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Settings
  await prisma.settings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      storeName: "Priya Jewellery",
      whatsappNumber: "917367997766",
      whatsappTemplate:
        "Hi Priya Jewellery! I am interested in:\n🛍️ {product_name}\n💰 Rs.{price}\n📏 {variant}\n🔗 {url}\nPlease confirm availability and delivery details.",
      announcementText:
        "✨ Free shipping in-city on orders above Rs.1499 | New Arrivals Every Week | Call: +91 7367997766",
      phone: "+91 7367997766",
      email: "priyajewellery@gmail.com",
      address: "Priya Jewellery Store, Main Market, Your City",
      businessHours: "Mon–Sat: 10am – 7pm",
    },
  });
  console.log("✅ Settings upserted");

  // Categories (Top Level)
  const categoryDefs = [
    { name: "Gold Plated (1.5g Gold)", slug: "gold-plated", displayOrder: 1 },
    { name: "Anti Tarnish", slug: "anti-tarnish", displayOrder: 2 },
    { name: "American Diamond", slug: "american-diamond", displayOrder: 3 },
    { name: "Polki Kundan", slug: "polki-kundan", displayOrder: 4 },
    { name: "Bridal Sets", slug: "bridal-sets", displayOrder: 5 },
    { name: "German Silver", slug: "german-silver", displayOrder: 6 },
    { name: "Oxidised Jewellery", slug: "oxidised", displayOrder: 7 },
  ];

  const categories = await Promise.all(
    categoryDefs.map((cat) =>
      prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          displayOrder: cat.displayOrder,
          isActive: true,
        },
      })
    )
  );
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  console.log(`✅ ${categories.length} categories created`);

  // Subcategories
  const subcategoryDefs = [
    { name: "Mangal Sutra",     slug: "mangal-sutra",     categoryId: catBySlug["gold-plated"].id,      displayOrder: 1  },
    { name: "Sankhan and Pola", slug: "sankhan-and-pola", categoryId: catBySlug["gold-plated"].id,      displayOrder: 2  },
    { name: "Pearl & Shell",    slug: "pearl-and-shell",  categoryId: catBySlug["gold-plated"].id,      displayOrder: 3  },
    { name: "Chains",           slug: "chains",            categoryId: catBySlug["gold-plated"].id,      displayOrder: 4  },
    { name: "Chura",            slug: "chura",             categoryId: catBySlug["gold-plated"].id,      displayOrder: 5  },
    { name: "Earrings",         slug: "earrings",          categoryId: catBySlug["gold-plated"].id,      displayOrder: 6  },
    { name: "Tie Chains",       slug: "tie-chains",        categoryId: catBySlug["gold-plated"].id,      displayOrder: 7  },
    { name: "Pendants",         slug: "pendants",          categoryId: catBySlug["gold-plated"].id,      displayOrder: 8  },
    { name: "Bangles",          slug: "bangles",           categoryId: catBySlug["gold-plated"].id,      displayOrder: 9  },
    { name: "Necklace",         slug: "necklace",          categoryId: catBySlug["gold-plated"].id,      displayOrder: 10 },
    { name: "Chokers",          slug: "chokers",           categoryId: catBySlug["gold-plated"].id,      displayOrder: 11 },
    { name: "Sitahar",          slug: "sitahar",           categoryId: catBySlug["gold-plated"].id,      displayOrder: 12 },
    { name: "Tiara and Tikli",  slug: "tiara-and-tikli",  categoryId: catBySlug["gold-plated"].id,      displayOrder: 13 },
    { name: "Lahari",           slug: "lahari",            categoryId: catBySlug["gold-plated"].id,      displayOrder: 14 },
    { name: "Rings",            slug: "rings",             categoryId: catBySlug["gold-plated"].id,      displayOrder: 15 },
    { name: "Gents Kada",       slug: "gents-kada",        categoryId: catBySlug["gold-plated"].id,      displayOrder: 16 },
    { name: "Anti Tarnish",     slug: "anti-tarnish-sub",  categoryId: catBySlug["anti-tarnish"].id,     displayOrder: 1  },
    { name: "Finger Ring",      slug: "ad-finger-ring",    categoryId: catBySlug["american-diamond"].id, displayOrder: 1  },
    { name: "Necklace Set",     slug: "ad-necklace",       categoryId: catBySlug["american-diamond"].id, displayOrder: 2  },
    { name: "Bangles Set",      slug: "ad-bangles",        categoryId: catBySlug["american-diamond"].id, displayOrder: 3  },
    { name: "Bracelet",         slug: "bracelet",          categoryId: catBySlug["american-diamond"].id, displayOrder: 4  },
    { name: "Mangal Sutra Set", slug: "ad-mangal-sutra",   categoryId: catBySlug["american-diamond"].id, displayOrder: 5  },
    { name: "Earrings Set",     slug: "ad-earrings",       categoryId: catBySlug["american-diamond"].id, displayOrder: 6  },
    { name: "Mang Tika",        slug: "mang-tika",         categoryId: catBySlug["american-diamond"].id, displayOrder: 7  },
    { name: "Polki Kundan",     slug: "polki-kundan-sub",  categoryId: catBySlug["polki-kundan"].id,     displayOrder: 1  },
    { name: "Bridal Sets",      slug: "bridal-sets-sub",   categoryId: catBySlug["bridal-sets"].id,      displayOrder: 1  },
    { name: "German Silver",    slug: "german-silver-sub", categoryId: catBySlug["german-silver"].id,    displayOrder: 1  },
    { name: "Oxidised",         slug: "oxidised-sub",      categoryId: catBySlug["oxidised"].id,         displayOrder: 1  },
  ];

  const subcategories = await Promise.all(
    subcategoryDefs.map((subcat) =>
      prisma.subcategory.create({
        data: {
          name: subcat.name,
          slug: subcat.slug,
          categoryId: subcat.categoryId,
          displayOrder: subcat.displayOrder,
          isActive: true,
        },
      })
    )
  );
  const subcatBySlug = Object.fromEntries(subcategories.map((c) => [c.slug, c]));
  console.log(`✅ ${subcategories.length} subcategories created`);

  // Products
  const productsData = [
    { name: "Royal Kundan Necklace",     slug: "royal-kundan-necklace",    subcategoryId: subcatBySlug["necklace"].id, categoryId: subcatBySlug["necklace"].categoryId, price: 2499, mrp: 3199,  stockQty: 8,  stockStatus: "IN_STOCK",  isPublished: true, isBestseller: true,  isNewArrival: false, isFeatured: true,  imageUrl: JEWELLERY_IMAGES.necklace1, shortDesc: "Exquisite Kundan necklace with meenakari work.", description: "<p>Gold-plated Kundan necklace with meenakari enamel. Perfect for weddings.</p>", metaTitle: "Royal Kundan Necklace | Priya Jewellery", metaDesc: "Shop Kundan necklace at Priya Jewellery." },
    { name: "Delicate Pearl Chain",      slug: "delicate-pearl-chain",     subcategoryId: subcatBySlug["pearl-and-shell"].id, categoryId: subcatBySlug["pearl-and-shell"].categoryId, price: 899,  mrp: 1199,  stockQty: 15, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.necklace2, shortDesc: "Dainty freshwater pearl chain.", description: "<p>Timeless freshwater pearl chain with gold-plated clasp.</p>" },
    { name: "Oxidised Silver Jhumkas",   slug: "oxidised-silver-jhumkas",  subcategoryId: subcatBySlug["earrings"].id, categoryId: subcatBySlug["earrings"].categoryId, price: 649,  mrp: 849,   stockQty: 20, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: true,  isNewArrival: false, isFeatured: true,  imageUrl: JEWELLERY_IMAGES.earring1,  shortDesc: "Classic oxidised silver jhumkas.", description: "<p>Beautiful oxidised silver jhumkas with floral motifs.</p>" },
    { name: "Gold Chandbali Earrings",   slug: "gold-chandbali-earrings",  subcategoryId: subcatBySlug["earrings"].id, categoryId: subcatBySlug["earrings"].categoryId, price: 1299, mrp: 1599,  stockQty: 5,  stockStatus: "LOW_STOCK", isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.earring2,  shortDesc: "Statement gold chandbali earrings with pearl drops.", description: "<p>Gold-plated chandbali earrings with pearl drops.</p>" },
    { name: "Gold Plated Bangle Set",    slug: "gold-plated-bangle-set",   subcategoryId: subcatBySlug["bangles"].id, categoryId: subcatBySlug["bangles"].categoryId, price: 799,  mrp: 999,   stockQty: 30, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: true,  isNewArrival: false, isFeatured: false, imageUrl: JEWELLERY_IMAGES.bangle1,   shortDesc: "Set of 6 thin gold-plated bangles.", description: "<p>Set of 6 thin gold-plated bangles in standard sizes.</p>" },
    { name: "Diamond-Cut Solitaire Ring",slug: "diamond-cut-solitaire-ring",subcategoryId: subcatBySlug["rings"].id, categoryId: subcatBySlug["rings"].categoryId, price: 1499, mrp: 1999,  stockQty: 10, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: true,  imageUrl: JEWELLERY_IMAGES.ring1,     shortDesc: "Sparkling diamond-cut solitaire ring.", description: "<p>Elegant solitaire ring with CZ stone in gold-plated setting.</p>" },
    { name: "Floral Statement Ring",     slug: "floral-statement-ring",    subcategoryId: subcatBySlug["rings"].id, categoryId: subcatBySlug["rings"].categoryId, price: 549,  mrp: null,   stockQty: 12, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.ring2,     shortDesc: "Bold floral cocktail ring.", description: "<p>Bold cocktail ring with multicolour glass stones.</p>" },
    { name: "Gold Plated Choker",        slug: "gold-plated-choker",       subcategoryId: subcatBySlug["chokers"].id, categoryId: subcatBySlug["chokers"].categoryId, price: 449,  mrp: 599,   stockQty: 25, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.choker1,   shortDesc: "Trendy gold-plated choker.", description: "<p>Classic gold-plated choker with adjustable clasp.</p>" },
    { name: "Bridal Mangal Sutra Set",   slug: "bridal-mangal-sutra-set",  subcategoryId: subcatBySlug["mangal-sutra"].id, categoryId: subcatBySlug["mangal-sutra"].categoryId, price: 8999, mrp: 12000, stockQty: 3,  stockStatus: "LOW_STOCK", isPublished: true, isBestseller: true,  isNewArrival: false, isFeatured: true,  imageUrl: JEWELLERY_IMAGES.bridal1,   shortDesc: "Full bridal mangal sutra set.", description: "<p>Gold-plated mangal sutra with black bead chains.</p>" },
    { name: "Gold Pendant Set",          slug: "gold-pendant-set",         subcategoryId: subcatBySlug["pendants"].id, categoryId: subcatBySlug["pendants"].categoryId, price: 1199, mrp: 1499,  stockQty: 18, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.pendant1,  shortDesc: "Delicate gold-plated pendant.", description: "<p>Teardrop pendant with rose quartz stone in gold-plated setting.</p>" },
    { name: "Traditional Temple Earrings",slug: "traditional-temple-earrings",subcategoryId: subcatBySlug["earrings"].id, categoryId: subcatBySlug["earrings"].categoryId, price: 1599, mrp: 2099,  stockQty: 0,  stockStatus: "SOLD_OUT",  isPublished: true, isBestseller: true,  isNewArrival: false, isFeatured: false, imageUrl: JEWELLERY_IMAGES.earring1,  shortDesc: "Gold-plated temple earrings with Lakshmi motif.", description: "<p>Temple jewellery earrings with Lakshmi motif and pearl drops.</p>" },
    { name: "American Diamond Finger Ring",slug: "ad-finger-ring-solitaire",subcategoryId: subcatBySlug["ad-finger-ring"].id, categoryId: subcatBySlug["ad-finger-ring"].categoryId, price: 499, mrp: null,   stockQty: 40, stockStatus: "IN_STOCK",  isPublished: true, isBestseller: false, isNewArrival: true,  isFeatured: false, imageUrl: JEWELLERY_IMAGES.earring2,  shortDesc: "Sparkling American Diamond finger ring.", description: "<p>American Diamond finger ring in rose gold-plated finish.</p>" },
  ];

  const ringsCatId = subcatBySlug["rings"].id;
  const adRingsCatId = subcatBySlug["ad-finger-ring"].id;
  const banglesGPCatId = subcatBySlug["bangles"].id;
  const adBanglesCatId = subcatBySlug["ad-bangles"].id;

  const subcatIdsWithProducts = new Set<string>();

  for (const productData of productsData) {
    const { imageUrl, ...rest } = productData;
    const product = await prisma.product.create({ data: rest });
    await prisma.productImage.create({ data: { productId: product.id, url: imageUrl, altText: product.name, isPrimary: true, displayOrder: 0 } });
    subcatIdsWithProducts.add(product.subcategoryId);

    if (product.subcategoryId === ringsCatId || product.subcategoryId === adRingsCatId) {
      await prisma.productVariant.createMany({ data: [5,6,7,8].map(s => ({ productId: product.id, name: "Ring Size", value: String(s), priceDelta: 0 })) });
    }
    if (product.subcategoryId === banglesGPCatId || product.subcategoryId === adBanglesCatId) {
      await prisma.productVariant.createMany({ data: ["2/2","2/4","2/6","2/8"].map(s => ({ productId: product.id, name: "Bangle Size", value: s, priceDelta: 0 })) });
    }
  }

  // Generate mock products for any subcategory that doesn't have one
  let mockCount = 0;
  for (const subcategory of subcategories) {
    if (!subcatIdsWithProducts.has(subcategory.id)) {
      const mockProduct = await prisma.product.create({
        data: {
          name: `${subcategory.name} Elegance`,
          slug: `mock-${subcategory.slug}-elegance`,
          categoryId: subcategory.categoryId,
          subcategoryId: subcategory.id,
          price: 999 + Math.floor(Math.random() * 1000),
          mrp: 2499,
          stockQty: 10,
          stockStatus: "IN_STOCK",
          isPublished: true,
          isBestseller: Math.random() > 0.5,
          isNewArrival: true,
          isFeatured: false,
          shortDesc: `Beautiful ${subcategory.name} for everyday wear.`,
          description: `<p>High quality mock product for ${subcategory.name}.</p>`
        }
      });

      
      const mockImage = Object.values(JEWELLERY_IMAGES)[Math.floor(Math.random() * 10)];
      
      await prisma.productImage.create({
        data: {
          productId: mockProduct.id,
          url: mockImage,
          altText: mockProduct.name,
          isPrimary: true,
          displayOrder: 0
        }
      });
      mockCount++;
    }
  }

  console.log(`✅ ${productsData.length + mockCount} products created (${mockCount} mocks)`);

  // Hero Banners
  await prisma.heroBanner.createMany({ data: [
    { imageUrl: JEWELLERY_IMAGES.hero1, title: "Adorn Your Story",         subtitle: "Handcrafted jewellery that speaks to your soul",            ctaText: "Shop New Arrivals",    ctaLink: "/shop?sort=newest",   displayOrder: 1, isActive: true },
    { imageUrl: JEWELLERY_IMAGES.hero2, title: "Gold Plated Collection",    subtitle: "1.5 gram gold — exquisite pieces for every occasion",       ctaText: "View Gold Plated",     ctaLink: "/shop/necklace",      displayOrder: 2, isActive: true },
    { imageUrl: JEWELLERY_IMAGES.hero3, title: "American Diamond Sparkle",  subtitle: "Brilliant AD jewellery for women who love to shine",        ctaText: "Shop AD Collection",   ctaLink: "/shop/ad-necklace",   displayOrder: 3, isActive: true },
  ]});
  console.log("✅ Hero banners created");

  // Trust Badges
  await prisma.trustBadge.createMany({ data: [
    { icon: "✨", text: "Handcrafted Quality",  displayOrder: 1, isActive: true },
    { icon: "🔄", text: "Easy Returns",         displayOrder: 2, isActive: true },
    { icon: "💬", text: "Order via WhatsApp",   displayOrder: 3, isActive: true },
    { icon: "🚚", text: "Free In-City Shipping",displayOrder: 4, isActive: true },
    { icon: "🔒", text: "Safe & Secure",        displayOrder: 5, isActive: true },
  ]});
  console.log("✅ Trust badges created");

  // Testimonials
  await prisma.testimonial.createMany({ data: [
    { name: "Ananya Sharma", rating: 5, text: "Ordered the Mangal Sutra for my wedding — got so many compliments! Priya replied instantly on WhatsApp.", displayOrder: 1, isActive: true },
    { name: "Meera Patel",   rating: 5, text: "The Kundan Necklace is absolutely stunning. Looks way more expensive than what I paid!", displayOrder: 2, isActive: true },
    { name: "Preethi Rajan", rating: 5, text: "Ordered Jhumkas for my sister's wedding. Everyone asked where I got them! WhatsApp ordering is so convenient.", displayOrder: 3, isActive: true },
    { name: "Divya Nair",    rating: 4, text: "Great quality bangles. The gold plating looks very premium. Will buy more!", displayOrder: 4, isActive: true },
  ]});
  console.log("✅ Testimonials created");

  // Budget Ranges
  await prisma.budgetRange.createMany({ data: [
    { label: "Under Rs.999",        minPrice: 0,    maxPrice: 999,  displayOrder: 1, isActive: true },
    { label: "Rs.999 – Rs.1999",    minPrice: 999,  maxPrice: 1999, displayOrder: 2, isActive: true },
    { label: "Rs.1999 – Rs.2999",   minPrice: 1999, maxPrice: 2999, displayOrder: 3, isActive: true },
    { label: "Rs.2999 – Rs.4999",   minPrice: 2999, maxPrice: 4999, displayOrder: 4, isActive: true },
    { label: "Above Rs.5000",       minPrice: 5000, maxPrice: null, displayOrder: 5, isActive: true },
  ]});
  console.log("✅ Budget ranges created");

  // Policy Pages
  await prisma.policyPage.createMany({ data: [
    { slug: "about-us",        title: "About Priya Jewellery", content: "<p>Welcome to <strong>Priya Jewellery</strong> — your trusted destination for handcrafted, affordable jewellery that makes every woman feel special.</p>" },
    { slug: "shipping-policy", title: "Shipping Policy",       content: "<p><strong>Free shipping</strong> within the city on orders above Rs.1499. Standard delivery: 3-5 working days.</p>" },
    { slug: "return-policy",   title: "Return & Exchange Policy", content: "<p>Contact us on WhatsApp within 7 days of receiving your order for returns/exchanges on defective items.</p>" },
    { slug: "privacy-policy",  title: "Privacy Policy",        content: "<p>We collect only your name and phone number for order processing and do not share your information with any third parties.</p>" },
    { slug: "terms-of-service",title: "Terms of Service",     content: "<p>By using our website, you agree to our terms. All prices are in Indian Rupees (Rs.).</p>" },
  ]});
  console.log("✅ Policy pages created");

  // Sample Review
  const necklaceProduct = await prisma.product.findUnique({ where: { slug: "royal-kundan-necklace" } });
  if (necklaceProduct) {
    await prisma.review.createMany({ data: [
      { productId: necklaceProduct.id, customerName: "Rekha Verma", rating: 5, text: "Absolutely gorgeous! Got so many compliments at the wedding!", status: "APPROVED" },
      { productId: necklaceProduct.id, customerName: "Sonal Mehta",  rating: 4, text: "Beautiful necklace, great quality for the price.", status: "APPROVED" },
    ]});
  }

  await prisma.lead.create({ data: { name: "Sample Customer", phone: "+91 9876543210" } });

  console.log("\n🎉 Migration & Seed complete!");
  console.log(`📧 Admin login: ${process.env.ADMIN_EMAIL ?? "admin@priyajewellery.com"}`);
  console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD ?? "Priya@123"}`);
}

main()
  .catch((e) => { console.error("❌ Failed:", e); process.exit(1); })
  .finally(() => { prisma.$disconnect(); pool.end(); });
