import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/settings — Get site settings (public — needed by layout)
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "main" } });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[GET /api/settings]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT /api/settings — Update site settings (admin only)
export async function PUT(req: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: body,
      create: { id: "main", ...body },
    });

    // Revalidate all pages that use settings (layout, homepage)
    revalidatePath("/", "layout");

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[PUT /api/settings]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
