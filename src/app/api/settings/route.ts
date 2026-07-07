import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/settings — Get site settings
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
  try {
    const body = await req.json();

    const settings = await prisma.settings.upsert({
      where: { id: "main" },
      update: body,
      create: { id: "main", ...body },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[PUT /api/settings]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
