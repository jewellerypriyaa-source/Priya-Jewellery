import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/leads — Save a newsletter opt-in lead (public — customer facing)
export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json();
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: { name: name.trim(), phone: phone.trim() },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

// GET /api/leads — List all leads (admin only — contains customer phone numbers)
export async function GET() {
  // ── Auth guard ──────────────────────────────────────────────────────────
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
