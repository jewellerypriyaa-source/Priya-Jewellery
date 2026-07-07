import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/search?q=term&limit=6
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "12");

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q } },
          { shortDesc: { contains: q } },
          { sku: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        mrp: true,
        stockStatus: true,
        isBestseller: true,
        isNewArrival: true,
        category: { select: { name: true, slug: true } },
        images: {
          where: { isPrimary: true },
          select: { url: true, altText: true, isPrimary: true },
          take: 1,
        },
      },
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        categoryName: p.category.name,
        images: p.images,
      })),
    });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json({ products: [] });
  }
}
