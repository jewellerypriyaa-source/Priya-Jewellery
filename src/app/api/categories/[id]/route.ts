import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/categories/[id] — Update a category (admin only)
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
    const { name, slug, description, imageUrl, displayOrder, isActive, group } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        group: group !== undefined ? (group || null) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[PUT /api/categories/[id]]", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// DELETE /api/categories/[id] — Delete a category (admin only)
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/categories/[id]]", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
