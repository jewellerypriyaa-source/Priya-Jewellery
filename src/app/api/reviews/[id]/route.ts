import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT /api/reviews/[id] — Moderate a review (APPROVED/REJECTED) — admin only
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
    const { status } = await req.json();

    if (!status || !["APPROVED", "PENDING", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("[PUT /api/reviews/[id]]", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] — Delete a review — admin only
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
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/reviews/[id]]", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
