import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";
import { auth } from "@/lib/auth";

// GET /api/products/[id] — Get a single product (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
        video: true,
        comboItems: true,
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — Update a product (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      categoryId,
      subcategoryId,
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
      images,   // full replacement array or undefined (quick-toggle skips this)
      variants, // full replacement array or undefined
    } = body;

    // Build scalar update data (only include fields that were sent)
    const updateData: any = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (sku !== undefined) updateData.sku = sku || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (mrp !== undefined) updateData.mrp = mrp ? parseFloat(mrp) : null;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc || null;
    if (description !== undefined) updateData.description = description || null;
    if (stockQty !== undefined) updateData.stockQty = parseInt(stockQty);
    if (stockStatus !== undefined) updateData.stockStatus = stockStatus;
    if (isPublished !== undefined) updateData.isPublished = !!isPublished;
    if (isBestseller !== undefined) updateData.isBestseller = !!isBestseller;
    if (isNewArrival !== undefined) updateData.isNewArrival = !!isNewArrival;
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc || null;

    // ── Images: full replacement (delete old, insert new) ─────────────────
    if (images !== undefined) {
      // Fetch existing image URLs so we can delete orphaned files from Storage
      const existing = await prisma.productImage.findMany({
        where: { productId: id },
        select: { url: true },
      });

      // Delete all existing DB rows (cascade is fine; we manage Storage separately)
      await prisma.productImage.deleteMany({ where: { productId: id } });

      // Delete orphaned files from Supabase Storage
      const newUrls = new Set((images as any[]).map((img) => img.url));
      for (const img of existing) {
        if (!newUrls.has(img.url)) {
          await deleteFile(img.url);
        }
      }

      // Insert new image rows
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: (images as any[]).map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText ?? null,
            isPrimary: !!img.isPrimary,
            displayOrder: img.displayOrder ?? idx,
          })),
        });
      }
    }

    // ── Variants: full replacement ─────────────────────────────────────────
    if (variants !== undefined) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: (variants as any[]).map((v: any) => ({
            productId: id,
            name: v.name,
            value: v.value,
            priceDelta: parseFloat(v.priceDelta ?? "0"),
            stockQty: parseInt(v.stockQty ?? "0"),
            isActive: true,
          })),
        });
      }
    }

    // ── Update core product row ────────────────────────────────────────────
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
      },
    });

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${product.slug}`);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[PUT /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete a product and its Storage files (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    // Fetch image URLs before deleting the product
    const images = await prisma.productImage.findMany({
      where: { productId: id },
      select: { url: true },
    });

    // Get slug for revalidation before delete
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    // Delete the product (cascades to ProductImage, ProductVariant, etc.)
    await prisma.product.delete({ where: { id } });

    // Delete all associated files from Supabase Storage
    for (const img of images) {
      await deleteFile(img.url);
    }

    // Revalidate public pages
    revalidatePath("/");
    revalidatePath("/shop");
    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
