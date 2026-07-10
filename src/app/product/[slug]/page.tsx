import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDesc ??
      product.shortDesc ??
      `Buy ${product.name} at Priyaa Jewellery. Order on WhatsApp.`,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDesc ?? product.shortDesc ?? undefined,
      images: product.images[0]
        ? [{ url: product.images[0].url }]
        : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isPublished: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
        video: true,
        comboItems: true,
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
    prisma.settings.findUnique({ where: { id: "main" } }),
  ]);

  if (!product) notFound();

  // Fetch related products (same category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isPublished: true,
      id: { not: product.id },
    },
    take: 4,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true } },
    },
  });

  return (
    <ProductDetailClient
      product={{
        ...product,
        mrp: product.mrp ?? null,
        shortDesc: product.shortDesc ?? null,
        description: product.description ?? null,
        sku: product.sku ?? null,
        video: product.video ?? null,
      }}
      relatedProducts={relatedProducts.map((p) => ({
        ...p,
        mrp: p.mrp ?? null,
        categoryName: p.category.name,
        images: p.images,
      }))}
      whatsappNumber={settings?.whatsappNumber ?? "917367997766"}
      whatsappTemplate={settings?.whatsappTemplate ?? ""}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}
    />
  );
}
