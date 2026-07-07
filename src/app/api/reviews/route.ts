import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reviews — List reviews for a product
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const status = req.nextUrl.searchParams.get("status");

  try {
    const reviews = await prisma.review.findMany({
      where: {
        ...(productId && { productId }),
        ...(status ? { status } : { status: "APPROVED" }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[GET /api/reviews]", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews — Submit a review (goes to PENDING status)
export async function POST(req: NextRequest) {
  try {
    const { productId, customerName, rating, text } = await req.json();

    if (!productId || !customerName || !rating || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerName,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        text,
        status: "PENDING",
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reviews]", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
