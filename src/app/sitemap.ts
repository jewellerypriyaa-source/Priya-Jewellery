import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://priyajewellery.com";

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/size-chart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 2. Fetch Active Subcategories
  let subcategoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    subcategoryRoutes = subcategories.map((sub) => ({
      url: `${baseUrl}/shop/${sub.slug}`,
      lastModified: sub.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error fetching subcategories:", error);
  }

  // 3. Fetch Published Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    productRoutes = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation error fetching products:", error);
  }

  // 4. Add Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { blogPosts } = await import("@/data/blogPosts");
    blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap generation error adding blog posts:", error);
  }

  return [...staticRoutes, ...subcategoryRoutes, ...productRoutes, ...blogRoutes];
}
