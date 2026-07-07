import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/analytics/event — Track a view, WA click, or wishlist add
export async function POST(req: NextRequest) {
  try {
    const { type, productId, sessionId } = await req.json();

    // Validate event type
    const validTypes = ["VIEW", "WHATSAPP_CLICK", "WISHLIST_ADD", "WISHLIST_REMOVE"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        type,
        productId: productId ?? null,
        sessionId: sessionId ?? null,
      },
    });

    // Also increment product counters for fast reads
    if (productId) {
      if (type === "VIEW") {
        await prisma.product.update({
          where: { id: productId },
          data: { viewCount: { increment: 1 } },
        });
      } else if (type === "WHATSAPP_CLICK") {
        await prisma.product.update({
          where: { id: productId },
          data: { whatsappClicks: { increment: 1 } },
        });
      } else if (type === "WISHLIST_ADD") {
        await prisma.product.update({
          where: { id: productId },
          data: { wishlistCount: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/analytics/event]", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}

// GET /api/analytics/event — Fetch summary stats (admin)
export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") ?? "7");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [totalViews, totalWaClicks, totalWishlists] = await Promise.all([
      prisma.analyticsEvent.count({ where: { type: "VIEW", createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: "WHATSAPP_CLICK", createdAt: { gte: since } } }),
      prisma.analyticsEvent.count({ where: { type: "WISHLIST_ADD", createdAt: { gte: since } } }),
    ]);

    return NextResponse.json({ totalViews, totalWaClicks, totalWishlists, days });
  } catch (error) {
    console.error("[GET /api/analytics/event]", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
