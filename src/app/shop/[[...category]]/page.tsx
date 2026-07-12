import { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ShopPageClient from "./ShopPageClient";

interface PageProps {
  params: Promise<{ category?: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    bestseller?: string;
    group?: string;
    page?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = Array.isArray(category) ? category[0] : category;

  if (categorySlug) {
    const cat = await prisma.subcategory.findUnique({ where: { slug: categorySlug } });
    if (cat) {
      return {
        title: `${cat.name} Jewellery`,
        description: cat.description ?? `Shop ${cat.name} at Priya Jewellery.`,
      };
    }
  }

  return {
    title: "Shop All Jewellery",
    description: "Browse our complete collection of handcrafted jewellery — necklaces, earrings, bangles, rings, and more.",
  };
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const sp = await searchParams;

  // Handle Next.js catch-all params which evaluate to arrays (e.g., ['earrings'])
  const categorySlug = Array.isArray(category) ? category[0] : category;

  // Fetch category info if browsing by category
  const categoryInfo = categorySlug
    ? await prisma.subcategory.findUnique({
        where: { slug: categorySlug },
        select: { id: true, name: true, slug: true, description: true, imageUrl: true },
      })
    : null;

  // Fetch all subcategories for the filter sidebar
  const allCategories = await prisma.subcategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="min-h-screen" style={{ background: "#fbf6f0" }}>
      <Suspense>
        <ShopPageClient
          key={`${categorySlug ?? ""}-${sp.group ?? ""}-${sp.sort ?? ""}-${sp.bestseller ?? ""}-${sp.minPrice ?? ""}-${sp.maxPrice ?? ""}-${sp.page ?? ""}-${sp.q ?? ""}`}
          categorySlug={categorySlug}
          categoryInfo={categoryInfo}
          allCategories={allCategories}
          initialSearchParams={sp}
        />
      </Suspense>
    </div>
  );
}
