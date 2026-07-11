import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/subcategories/[id] — Update a subcategory (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, displayOrder, isActive, categoryId } = body;

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        categoryId,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error("[PUT /api/subcategories/[id]]", error);
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
  }
}

// DELETE /api/subcategories/[id] — Delete a subcategory (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.subcategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/subcategories/[id]]", error);
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
  }
}
