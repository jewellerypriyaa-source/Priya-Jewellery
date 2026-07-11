import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/subcategories — List all subcategories (public)
export async function GET(req: NextRequest) {
  try {
    const subcategories = await prisma.subcategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        category: {
          select: { name: true }
        }
      }
    });
    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error("[GET /api/subcategories]", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

// POST /api/subcategories — Create a subcategory (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, displayOrder, isActive, categoryId } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: "Name, Slug, and Category ID are required" }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        imageUrl,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ subcategory }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/subcategories]", error);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
