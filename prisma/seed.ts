/**
 * Prisma Seed Script — Priya Jewellery
 * Run: npx ts-node --esm prisma/seed.ts
 * Or:  npx prisma db seed
 *
 * Seeds the database with:
 * - 1 admin user
 * - 6 categories
 * - 12 sample products
 * - Site settings
 * - Hero banners
 * - Trust badges
 * - Testimonials
 * - Budget ranges
 * - Policy pages
 */

import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = `file:${path.join(process.cwd(), "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

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
  cat_necklace:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
  cat_earring:
    "https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400&q=80",
  cat_bangle:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
  cat_ring:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
  cat_choker:
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80",
  cat_bridal:
    "https://images.unsplash.com/photo-1610047803562-7260ebe516c5?w=400&q=80",
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
  await prisma.category.deleteMany();
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

  // ── Categories ──────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Necklaces",
        slug: "necklaces",
        description:
          "Elegant gold and silver necklaces for every occasion. From delicate chains to statement pieces.",
        imageUrl: JEWELLERY_IMAGES.cat_necklace,
        displayOrder: 1,
        metaTitle: "Gold & Silver Necklaces | Priya Jewellery",
        metaDesc:
          "Shop beautiful necklaces at Priya Jewellery. Free shipping on orders above Rs.1499.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Earrings",
        slug: "earrings",
        description:
          "Stunning earrings from simple studs to elaborate jhumkas and chandbalis.",
        imageUrl: JEWELLERY_IMAGES.cat_earring,
        displayOrder: 2,
        metaTitle: "Earrings — Jhumkas, Studs & More | Priya Jewellery",
        metaDesc:
          "Explore our earring collection — traditional and modern designs for every style.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Bangles",
        slug: "bangles",
        description:
          "Traditional and modern bangles in gold-plated brass, silver, and more.",
        imageUrl: JEWELLERY_IMAGES.cat_bangle,
        displayOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "Rings",
        slug: "rings",
        description:
          "Statement rings and everyday bands — gold, silver, and gemstone options.",
        imageUrl: JEWELLERY_IMAGES.cat_ring,
        displayOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "Chokers",
        slug: "chokers",
        description:
          "Trendy choker necklaces — velvet, gold-plated, and beaded styles.",
        imageUrl: JEWELLERY_IMAGES.cat_choker,
        displayOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "Bridal Sets",
        slug: "bridal-sets",
        description:
          "Complete bridal jewellery sets — necklace, earrings, bangles, and maang tikka.",
        imageUrl: JEWELLERY_IMAGES.cat_bridal,
        displayOrder: 6,
        metaTitle: "Bridal Jewellery Sets | Priya Jewellery",
        metaDesc:
          "Stunning bridal jewellery sets for your special day. Shop full sets with matching pieces.",
      },
    }),
  ]);

  const [catNecklace, catEarrings, catBangles, catRings, catChokers, catBridal] =
    categories;
  console.log(`✅ ${categories.length} categories created`);

  // ── Products ────────────────────────────────────────────────────────
  const productsData = [
    {
      name: "Royal Kundan Necklace",
      slug: "royal-kundan-necklace",
      categoryId: catNecklace.id,
      price: 2499,
      mrp: 3199,
      shortDesc:
        "Exquisite Kundan necklace with meenakari work, perfect for weddings and festive occasions.",
      description:
        "<p>This stunning Kundan necklace features hand-set Kundan stones with intricate meenakari enamel work on the reverse. Gold-plated brass base, lightweight and comfortable to wear. Pairs beautifully with traditional attire.</p><p><strong>Materials:</strong> Gold-plated brass, Kundan stones, meenakari enamel</p>",
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
      categoryId: catNecklace.id,
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
      categoryId: catEarrings.id,
      price: 649,
      mrp: 849,
      shortDesc:
        "Classic oxidised silver jhumkas with intricate floral detailing — a wardrobe staple.",
      description:
        "<p>These beautiful oxidised silver jhumkas feature detailed floral motifs and a traditional bell drop. Lightweight and comfortable for all-day wear.</p><p><strong>Size:</strong> 5cm drop | <strong>Metal:</strong> Oxidised brass</p>",
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
      categoryId: catEarrings.id,
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
      categoryId: catBangles.id,
      price: 799,
      mrp: 999,
      shortDesc:
        "Set of 6 thin gold-plated bangles — elegant, stackable, and always in style.",
      description:
        "<p>A set of 6 thin gold-plated bangles with a smooth finish. Perfect for stacking or wearing as a set. Comes in standard sizes.</p>",
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
      categoryId: catRings.id,
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
      categoryId: catRings.id,
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
      name: "Velvet Choker Necklace",
      slug: "velvet-choker-necklace",
      categoryId: catChokers.id,
      price: 449,
      mrp: 599,
      shortDesc:
        "Trendy black velvet choker with gold charm pendant — minimal, modern, gorgeous.",
      description:
        "<p>A classic black velvet choker necklace with a delicate gold charm pendant. Adjustable tie at the back for a perfect fit.</p>",
      stockQty: 25,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.choker1,
    },
    {
      name: "Complete Bridal Jewellery Set",
      slug: "complete-bridal-jewellery-set",
      categoryId: catBridal.id,
      price: 8999,
      mrp: 12000,
      shortDesc:
        "Full bridal set — necklace, earrings, maang tikka, and bracelet in gold-polished antique finish.",
      description:
        "<p>A complete bridal jewellery set that includes:</p><ul><li>Heavy kundan necklace with 2-layer design</li><li>Matching jhumka earrings</li><li>Maang tikka with pearl drop</li><li>Gold-plated bracelet</li></ul><p>Available in gold, silver, and antique gold finish.</p>",
      stockQty: 3,
      stockStatus: "LOW_STOCK",
      isPublished: true,
      isBestseller: true,
      isNewArrival: false,
      isFeatured: true,
      imageUrl: JEWELLERY_IMAGES.bridal1,
    },
    {
      name: "Gold Pendant Necklace",
      slug: "gold-pendant-necklace",
      categoryId: catNecklace.id,
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
      categoryId: catEarrings.id,
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
      name: "Rose Gold Hoop Set",
      slug: "rose-gold-hoop-set",
      categoryId: catEarrings.id,
      price: 499,
      mrp: null,
      shortDesc:
        "Classic rose gold hoops in 3 sizes — minimalist, versatile, essential.",
      description:
        "<p>A set of 3 rose gold-plated hoop earrings in small, medium, and large sizes. Perfect for everyday wear or stacking multiple piercings.</p>",
      stockQty: 40,
      stockStatus: "IN_STOCK",
      isPublished: true,
      isBestseller: false,
      isNewArrival: true,
      isFeatured: false,
      imageUrl: JEWELLERY_IMAGES.earring2,
    },
  ];

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

    // Add size variants for rings and bangles
    if (product.categoryId === catRings.id) {
      await prisma.productVariant.createMany({
        data: [
          { productId: product.id, name: "Ring Size", value: "5", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "6", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "7", priceDelta: 0 },
          { productId: product.id, name: "Ring Size", value: "8", priceDelta: 0 },
        ],
      });
    }

    if (product.categoryId === catBangles.id) {
      await prisma.productVariant.createMany({
        data: [
          { productId: product.id, name: "Bangle Size", value: "2/2", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/4", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/6", priceDelta: 0 },
          { productId: product.id, name: "Bangle Size", value: "2/8", priceDelta: 0 },
        ],
      });
    }

    // Add finish variants for the bridal set
    if (product.categoryId === catBridal.id) {
      await prisma.productVariant.createMany({
        data: [
          { productId: product.id, name: "Finish", value: "Gold Polish", priceDelta: 0 },
          { productId: product.id, name: "Finish", value: "Antique Gold", priceDelta: 0 },
          { productId: product.id, name: "Finish", value: "Silver Polish", priceDelta: -500 },
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
        title: "Bridal Collection 2024",
        subtitle: "Complete bridal sets crafted for your perfect day",
        ctaText: "View Bridal Sets",
        ctaLink: "/shop/bridal-sets",
        displayOrder: 2,
        isActive: true,
      },
      {
        imageUrl: JEWELLERY_IMAGES.hero3,
        title: "Rings That Shine",
        subtitle: "From everyday elegance to statement sparkle",
        ctaText: "Shop Rings",
        ctaLink: "/shop/rings",
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
        text: "I ordered the Bridal Set for my wedding and got SO many compliments! The quality is amazing for the price and Priya responded super fast on WhatsApp. Will definitely order again!",
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
