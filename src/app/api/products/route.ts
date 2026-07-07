import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products — List with filters
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bestseller = searchParams.get("bestseller");
  const sort = searchParams.get("sort") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const skip = (page - 1) * limit;

  try {
    const where = {
      isPublished: true,
      ...(category && { category: { slug: category } }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(bestseller === "true" && { isBestseller: true }),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "popular"
        ? { viewCount: "desc" as const }
        : { createdAt: "desc" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
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
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        categoryName: p.category.name,
        images: p.images,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products — Create a new product (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      categoryId,
      price,
      mrp,
      shortDesc,
      description,
      stockQty,
      stockStatus,
      isPublished,
      isBestseller,
      isNewArrival,
      isFeatured,
      metaTitle,
      metaDesc,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        categoryId,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        shortDesc,
        description,
        stockQty: parseInt(stockQty ?? "0"),
        stockStatus: stockStatus ?? "IN_STOCK",
        isPublished: !!isPublished,
        isBestseller: !!isBestseller,
        isNewArrival: isNewArrival !== false,
        isFeatured: !!isFeatured,
        metaTitle,
        metaDesc,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
