import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/categories — List all categories (public)
export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories — Create a category (admin only)
export async function POST(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, displayOrder, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/categories]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
