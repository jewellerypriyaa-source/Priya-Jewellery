/**
 * Prisma Seed Script — Priya Jewellery
 * Run: npx ts-node --esm prisma/seed.ts
 * Or:  npx prisma db seed
 *
 * Seeds the database with:
 * - 1 admin user
 * - 24 categories across 3 jewellery groups
 * - 12 sample products
 * - Site settings
 * - Hero banners
 * - Trust badges
 * - Testimonials
 * - Budget ranges
 * - Policy pages
 */

import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// Unsplash jewellery images (free to use, no key needed for direct URLs)
const JEWELLERY_IMAGES = {
  necklace1:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  necklace2:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  earring1:
    "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=600&q=80",
  earring2:
    "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80",
  bangle1:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
  ring1:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  ring2:
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
  choker1:
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
  bridal1:
    "https://images.unsplash.com/photo-1610047803562-7260ebe516c5?w=600&q=80",
  pendant1:
    "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&q=80",
  hero1:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80",
  hero2:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80",
  hero3:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=80",
};

async function main() {
  console.log("🌱 Starting seed...");

  // ── Clean up existing data ──────────────────────────────────────────
  await prisma.analyticsEvent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.comboItem.deleteMany();
  await prisma.productVideo.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.instagramPost.deleteMany();
  await prisma.product.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.trustBadge.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.budgetRange.deleteMany();
  await prisma.policyPage.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.lead.deleteMany();

  // ── Admin User ──────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Priya@123",
    12
  );
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL ?? "admin@priyajewellery.com",
      passwordHash,
      name: "Priya Admin",
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ── Settings (singleton) ────────────────────────────────────────────
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

  // ── Categories & Subcategories ──────────────────────────────────────
  const categoryDefs = [
    { name: "Gold Plated", slug: "gold-plated", displayOrder: 1 },
    { name: "Anti Tarnish", slug: "anti-tarnish", displayOrder: 2 },
    { name: "American Diamond", slug: "american-diamond", displayOrder: 3 },
    { name: "Polki Kundan", slug: "polki-kundan", displayOrder: 4 },
    { name: "Bridal", slug: "bridal", displayOrder: 5 },
    { name: "German Silver", slug: "german-silver", displayOrder: 6 },
    { name: "Oxidised", slug: "oxidised", displayOrder: 7 },
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

  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  const subcategoryDefs = [
    // ── Gold Plated ──────────────────────────────────────────────────
    { name: "Mangal Sutra",    slug: "mangal-sutra",    group: "Gold Plated",     displayOrder: 1  },
    { name: "Sankhan and Pola",slug: "sankhan-and-pola",group: "Gold Plated",     displayOrder: 2  },
    { name: "Pearl & Shell",   slug: "pearl-and-shell", group: "Gold Plated",     displayOrder: 3  },
    { name: "Chains",          slug: "chains",          group: "Gold Plated",     displayOrder: 4  },
    { name: "Chura",           slug: "chura",           group: "Gold Plated",     displayOrder: 5  },
    { name: "Earrings",        slug: "earrings",        group: "Gold Plated",     displayOrder: 6  },
    { name: "Tie Chains",      slug: "tie-chains",      group: "Gold Plated",     displayOrder: 7  },
    { name: "Pendants",        slug: "pendants",        group: "Gold Plated",     displayOrder: 8  },
    { name: "Bangles",         slug: "bangles",         group: "Gold Plated",     displayOrder: 9  },
    { name: "Necklace",        slug: "necklace",        group: "Gold Plated",     displayOrder: 10 },
    { name: "Chokers",         slug: "chokers",         group: "Gold Plated",     displayOrder: 11 },
    { name: "Sitahar",         slug: "sitahar",         group: "Gold Plated",     displayOrder: 12 },
    { name: "Tiara and Tikli", slug: "tiara-and-tikli", group: "Gold Plated",     displayOrder: 13 },
    { name: "Lahari",          slug: "lahari",          group: "Gold Plated",     displayOrder: 14 },
    { name: "Rings",           slug: "rings",           group: "Gold Plated",     displayOrder: 15 },
    { name: "Gents Kada",      slug: "gents-kada",      group: "Gold Plated",     displayOrder: 16 },

    // ── Anti Tarnish ─────────────────────────────────────────────────
    { name: "Anti Tarnish",    slug: "anti-tarnish",    group: "Anti Tarnish",    displayOrder: 1  },

    // ── American Diamond ─────────────────────────────────────────────
    { name: "Finger Ring",     slug: "ad-finger-ring",  group: "American Diamond",displayOrder: 1  },
    { name: "Necklace Set",    slug: "ad-necklace",     group: "American Diamond",displayOrder: 2  },
    { name: "Bangles Set",     slug: "ad-bangles",      group: "American Diamond",displayOrder: 3  },
    { name: "Bracelet",        slug: "bracelet",        group: "American Diamond",displayOrder: 4  },
    { name: "Mangal Sutra Set",slug: "ad-mangal-sutra", group: "American Diamond",displayOrder: 5  },
    { name: "Earrings Set",    slug: "ad-earrings",     group: "American Diamond",displayOrder: 6  },
    { name: "Mang Tika",       slug: "mang-tika",       group: "American Diamond",displayOrder: 7  },
  ];

  const subcategories = await Promise.all(
    subcategoryDefs.map((subcat) =>
      prisma.subcategory.create({
        data: {
          name: subcat.name,
          slug: subcat.slug,
          categoryId: catByName[subcat.group].id,
          displayOrder: subcat.displayOrder,
          description: `${subcat.group} — ${subcat.name} collection at Priyaa Jewellery.`,
          isActive: true,
        },
      })
    )
  );

  // Lookup helper: subcatBySlug["earrings"] → subcategory object
  const subcatBySlug = Object.fromEntries(subcategories.map((c) => [c.slug, c]));
  console.log(`✅ ${categories.length} categories & ${subcategories.length} subcategories created`);

  // ── Products ────────────────────────────────────────────────────────
  const productsData = [
    {
      name: "Royal Kundan Necklace",
      slug: "royal-kundan-necklace",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["necklace"].id,
      price: 2499,
      mrp: 3199,
      shortDesc:
        "Exquisite Kundan necklace with meenakari work, perfect for weddings and festive occasions.",
      description:
        "<p>This stunning Kundan necklace features hand-set Kundan stones with intricate meenakari enamel work on the reverse. Gold-plated brass base, lightweight and comfortable to wear.</p>",
      stockQty: 8,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: true,
      metaTitle: "Royal Kundan Necklace | Priya Jewellery",
      metaDesc:
        "Shop the Royal Kundan Necklace with meenakari work. Perfect for weddings. Order on WhatsApp.",
      imageUrl: JEWELLERY_IMAGES.necklace1,
    },
    {
      name: "Delicate Pearl Chain",
      slug: "delicate-pearl-chain",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["pearl-and-shell"].id,
      price: 899,
      mrp: 1199,
      shortDesc:
        "Dainty freshwater pearl chain — wear it every day from office to evenings.",
      description:
        "<p>A timeless freshwater pearl chain necklace with a gold-plated lobster clasp. The 18-inch chain features genuine freshwater pearls in a lustrous white finish.</p>",
      stockQty: 15,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.necklace2,
    },
    {
      name: "Oxidised Silver Jhumkas",
      slug: "oxidised-silver-jhumkas",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["earrings"].id,
      price: 649,
      mrp: 849,
      shortDesc:
        "Classic oxidised silver jhumkas with intricate floral detailing — a wardrobe staple.",
      description:
        "<p>These beautiful oxidised silver jhumkas feature detailed floral motifs and a traditional bell drop. Lightweight and comfortable for all-day wear.</p>",
      stockQty: 20,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: true,
      imageUrl: JEWELLERY_IMAGES.earring1,
    },
    {
      name: "Gold Chandbali Earrings",
      slug: "gold-chandbali-earrings",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["earrings"].id,
      price: 1299,
      mrp: 1599,
      shortDesc:
        "Statement gold chandbali earrings with pearl drops — perfect for parties and functions.",
      description:
        "<p>Gorgeous gold-plated chandbali earrings with pearl drops and emerald-green glass stones. A statement piece for festive occasions.</p>",
      stockQty: 5,
      stockStatus: "LOW_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.earring2,
    },
    {
      name: "Gold Plated Bangle Set",
      slug: "gold-plated-bangle-set",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["bangles"].id,
      price: 799,
      mrp: 999,
      shortDesc:
        "Set of 6 thin gold-plated bangles — elegant, stackable, and always in style.",
      description:
        "<p>A set of 6 thin gold-plated bangles with a smooth finish. Perfect for stacking or wearing as a set.</p>",
      stockQty: 30,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.bangle1,
    },
    {
      name: "Diamond-Cut Solitaire Ring",
      slug: "diamond-cut-solitaire-ring",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["rings"].id,
      price: 1499,
      mrp: 1999,
      shortDesc:
        "Sparkling diamond-cut solitaire ring in gold-plated silver — a forever classic.",
      description:
        "<p>An elegant solitaire ring featuring a brilliant round-cut CZ stone in a gold-plated 4-prong setting. Available in multiple sizes.</p>",
      stockQty: 10,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: true,
      imageUrl: JEWELLERY_IMAGES.ring1,
    },
    {
      name: "Floral Statement Ring",
      slug: "floral-statement-ring",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["rings"].id,
      price: 549,
      mrp: null,
      shortDesc:
        "Bold floral cocktail ring with colourful stones — wear it, own the room.",
      description:
        "<p>A bold cocktail ring with a large floral motif set with multicolour glass stones. Gold-plated brass base, adjustable band.</p>",
      stockQty: 12,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.ring2,
    },
    {
      name: "Gold Plated Choker",
      slug: "gold-plated-choker",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["chokers"].id,
      price: 449,
      mrp: 599,
      shortDesc:
        "Trendy gold-plated choker — minimal, modern, gorgeous.",
      description:
        "<p>A classic gold-plated choker necklace with delicate chain detailing. Adjustable clasp for a perfect fit.</p>",
      stockQty: 25,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.choker1,
    },
    {
      name: "Bridal Mangal Sutra Set",
      slug: "bridal-mangal-sutra-set",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["mangal-sutra"].id,
      price: 8999,
      mrp: 12000,
      shortDesc:
        "Full bridal mangal sutra set — gold-plated with black beads in antique finish.",
      description:
        "<p>A complete bridal mangal sutra set featuring intricate gold-plated pendants with black bead chains. Available in gold and antique finish.</p>",
      stockQty: 3,
      stockStatus: "LOW_STOCK",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: true,
      imageUrl: JEWELLERY_IMAGES.bridal1,
    },
    {
      name: "Gold Pendant Set",
      slug: "gold-pendant-set",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["pendants"].id,
      price: 1199,
      mrp: 1499,
      shortDesc:
        "Delicate gold-plated chain with an elegant teardrop pendant.",
      description:
        "<p>A beautiful everyday pendant necklace featuring a teardrop-shaped pendant with a rose quartz stone in a gold-plated bezel setting.</p>",
      stockQty: 18,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.pendant1,
    },
    {
      name: "Traditional Temple Earrings",
      slug: "traditional-temple-earrings",
      categoryId: catByName["Gold Plated"].id,
      subcategoryId: subcatBySlug["earrings"].id,
      price: 1599,
      mrp: 2099,
      shortDesc:
        "Gold-plated temple jewellery earrings with Lakshmi motif — timeless and auspicious.",
      description:
        "<p>Inspired by traditional South Indian temple jewellery, these gold-plated earrings feature a Lakshmi goddess motif with ruby-red glass stones and pearl drops.</p>",
      stockQty: 0,
      stockStatus: "SOLD_OUT",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.earring1,
    },
    {
      name: "American Diamond Finger Ring",
      slug: "ad-finger-ring-solitaire",
      categoryId: catByName["American Diamond"].id,
      subcategoryId: subcatBySlug["ad-finger-ring"].id,
      price: 499,
      mrp: null,
      shortDesc:
        "Sparkling American Diamond finger ring — timeless, elegant, affordable.",
      description:
        "<p>A stunning American Diamond finger ring in rose gold-plated finish. Perfect for daily wear.</p>",
      stockQty: 40,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.earring2,
    },
  ];

  const ringsCatId = subcatBySlug["rings"].id;
  const adRingsCatId = subcatBySlug["ad-finger-ring"].id;
  const banglesGPCatId = subcatBySlug["bangles"].id;
  const adBanglesCatId = subcatBySlug["ad-bangles"].id;

  for (const productData of productsData) {
    const { imageUrl, ...rest } = productData;
    const product = await prisma.product.create({ data: rest });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: imageUrl,
        altText: product.name,
        isPrimary: true,
        displayOrder: 0,
      },
    });

    // Add size variants for rings
    if (product.subcategoryId === ringsCatId || product.subcategoryId === adRingsCatId) {
      await prisma.productVariant.createMany({
        data: [
          { productId: product.id, name: "Ring Size", value: "5", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "6", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "7", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "8", priceDelta: 0 },
        ],
      });
    }

    // Add size variants for bangles
    if (product.subcategoryId === banglesGPCatId || product.subcategoryId === adBanglesCatId) {
      await prisma.productVariant.createMany({
        data: [
          { productId: product.id, name: "Bangle Size", value: "2/2", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/4", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/6", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/8", priceDelta: 0 },
        ],
      });
    }
  }
  console.log(`✅ ${productsData.length} products created with images and variants`);

  // ── Hero Banners ────────────────────────────────────────────────────
  await prisma.heroBanner.createMany({
    data: [
      {
        imageUrl: JEWELLERY_IMAGES.hero1,
        title: "Adorn Your Story",
        subtitle: "Handcrafted jewellery that speaks to your soul",
        ctaText: "Shop New Arrivals",
        ctaLink: "/shop?sort=newest",
        displayOrder: 1,
        isActive: true,
      },
      {
        imageUrl: JEWELLERY_IMAGES.hero2,
        title: "Gold Plated Collection",
        subtitle: "1.5 gram gold — exquisite pieces for every occasion",
        ctaText: "View Gold Plated",
        ctaLink: "/shop/necklace",
        displayOrder: 2,
        isActive: true,
      },
      {
        imageUrl: JEWELLERY_IMAGES.hero3,
        title: "American Diamond Sparkle",
        subtitle: "Brilliant AD jewellery for women who love to shine",
        ctaText: "Shop American Diamond",
        ctaLink: "/shop/ad-necklace",
        displayOrder: 3,
        isActive: true,
      },
    ],
  });
  console.log("✅ Hero banners created");

  // ── Trust Badges ────────────────────────────────────────────────────
  await prisma.trustBadge.createMany({
    data: [
      { icon: "✨", text: "Handcrafted Quality", displayOrder: 1, isActive: true },
      { icon: "🔄", text: "Easy Returns", displayOrder: 2, isActive: true },
      { icon: "💬", text: "Order via WhatsApp", displayOrder: 3, isActive: true },
      { icon: "🚚", text: "Free In-City Shipping", displayOrder: 4, isActive: true },
      { icon: "🔒", text: "Safe & Secure", displayOrder: 5, isActive: true },
    ],
  });
  console.log("✅ Trust badges created");

  // ── Testimonials ─────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Ananya Sharma",
        rating: 5,
        text: "I ordered the Mangal Sutra set for my wedding and got SO many compliments! The quality is amazing for the price and Priya responded super fast on WhatsApp. Will definitely order again!",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Meera Patel",
        rating: 5,
        text: "The Kundan Necklace is absolutely stunning. Looks way more expensive than what I paid. Shipping was quick and packaging was beautiful. 5 stars!",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Preethi Rajan",
        rating: 5,
        text: "Ordered the Jhumkas for my sister's wedding. Everyone asked where I got them from! The WhatsApp ordering is so convenient — replied within minutes.",
        displayOrder: 3,
        isActive: true,
      },
      {
        name: "Divya Nair",
        rating: 4,
        text: "Great quality bangles. The gold plating looks really premium. Delivery was on time. Will buy more!",
        displayOrder: 4,
        isActive: true,
      },
    ],
  });
  console.log("✅ Testimonials created");

  // ── Budget Ranges ────────────────────────────────────────────────────
  await prisma.budgetRange.createMany({
    data: [
      { label: "Under Rs.999", minPrice: 0, maxPrice: 999, displayOrder: 1, isActive: true },
      { label: "Rs.999 – Rs.1999", minPrice: 999, maxPrice: 1999, displayOrder: 2, isActive: true },
      { label: "Rs.1999 – Rs.2999", minPrice: 1999, maxPrice: 2999, displayOrder: 3, isActive: true },
      { label: "Rs.2999 – Rs.4999", minPrice: 2999, maxPrice: 4999, displayOrder: 4, isActive: true },
      { label: "Above Rs.5000", minPrice: 5000, maxPrice: null, displayOrder: 5, isActive: true },
    ],
  });
  console.log("✅ Budget ranges created");

  // ── Policy Pages ─────────────────────────────────────────────────────
  await prisma.policyPage.createMany({
    data: [
      {
        slug: "about-us",
        title: "About Priya Jewellery",
        content:
          "<p>Welcome to <strong>Priya Jewellery</strong> — your trusted destination for handcrafted, affordable jewellery that makes every woman feel special.</p><p>We believe that beautiful jewellery should be accessible to everyone. Our collection features carefully curated pieces ranging from everyday minimalist designs to stunning bridal sets, all crafted with the finest materials.</p><p>Order via WhatsApp for a personal, hassle-free shopping experience. We reply within minutes!</p>",
      },
      {
        slug: "shipping-policy",
        title: "Shipping Policy",
        content:
          "<p><strong>Free shipping</strong> within the city on orders above Rs.1499.</p><p>Standard delivery: 3-5 working days. Express delivery available on request — message us on WhatsApp.</p><p>We carefully package every order to ensure your jewellery arrives safely.</p>",
      },
      {
        slug: "return-policy",
        title: "Return & Exchange Policy",
        content:
          "<p>We want you to love your jewellery! If you have any issues, please contact us on WhatsApp within 7 days of receiving your order.</p><p>We accept returns/exchanges for manufacturing defects or wrong items sent. Items must be unused and in original packaging.</p>",
      },
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        content:
          "<p>Your privacy is important to us. We collect only your name and phone number for order processing and do not share your information with any third parties.</p><p>WhatsApp conversations are kept confidential. We do not store payment information as all transactions are handled manually.</p>",
      },
      {
        slug: "terms-of-service",
        title: "Terms of Service",
        content:
          "<p>By using our website and placing orders via WhatsApp, you agree to our terms. All prices are in Indian Rupees (Rs.). Product colours may vary slightly due to photography lighting. We reserve the right to refuse service in cases of misuse.</p>",
      },
    ],
  });
  console.log("✅ Policy pages created");

  // ── Sample Reviews ─────────────────────────────────────────────────
  const necklaceProduct = await prisma.product.findUnique({
    where: { slug: "royal-kundan-necklace" },
  });
  if (necklaceProduct) {
    await prisma.review.createMany({
      data: [
        {
          productId: necklaceProduct.id,
          customerName: "Rekha Verma",
          rating: 5,
          text: "Absolutely gorgeous! The Kundan work is so intricate and it looks exactly like the photo. Got so many compliments at the wedding!",
          status: "APPROVED",
        },
        {
          productId: necklaceProduct.id,
          customerName: "Sonal Mehta",
          rating: 4,
          text: "Beautiful necklace, great quality for the price. Packaging was very nice too. Only giving 4 stars because delivery took a day longer than expected.",
          status: "APPROVED",
        },
      ],
    });
  }
  console.log("✅ Sample reviews created");

  // ── Sample Lead ──────────────────────────────────────────────────────
  await prisma.lead.create({
    data: { name: "Sample Customer", phone: "+91 9876543210" },
  });
  console.log("✅ Sample lead created");

  console.log("\n🎉 Seed complete! The database is ready.");
  console.log(`📧 Admin login: ${process.env.ADMIN_EMAIL ?? "admin@priyajewellery.com"}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD ?? "Priya@123"}`);
  console.log("\n🚀 Run 'npm run dev' to start the development server");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
