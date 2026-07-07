import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products/slug/[slug] — Get product by URL slug (used in Quick View)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" }, take: 3 },
        variants: { where: { isActive: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[GET /api/products/slug/[slug]]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
