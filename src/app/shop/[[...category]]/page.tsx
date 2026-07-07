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
    page?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) {
      return {
        title: cat.metaTitle ?? `${cat.name} Jewellery`,
        description: cat.metaDesc ?? cat.description ?? `Shop ${cat.name} at Priya Jewellery.`,
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

  // Fetch category info if browsing by category
  const categoryInfo = category
    ? await prisma.category.findUnique({
        where: { slug: category },
        select: { id: true, name: true, slug: true, description: true, imageUrl: true },
      })
    : null;

  // Fetch all categories for the filter sidebar
  const allCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="min-h-screen" style={{ background: "#fbf6f0" }}>
      <Suspense>
        <ShopPageClient
          categorySlug={category}
          categoryInfo={categoryInfo}
          allCategories={allCategories}
          initialSearchParams={sp}
        />
      </Suspense>
    </div>
  );
}
