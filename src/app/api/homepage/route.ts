import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/homepage — Fetch all homepage items
export async function GET(req: NextRequest) {
  try {
    const [heroBanners, budgetRanges, instagramPosts, trustBadges, testimonials] =
      await Promise.all([
        prisma.heroBanner.findMany({ orderBy: { displayOrder: "asc" } }),
        prisma.budgetRange.findMany({ orderBy: { displayOrder: "asc" } }),
        prisma.instagramPost.findMany({ orderBy: { displayOrder: "asc" } }),
        prisma.trustBadge.findMany({ orderBy: { displayOrder: "asc" } }),
        prisma.testimonial.findMany({ orderBy: { displayOrder: "asc" } }),
      ]);

    return NextResponse.json({
      heroBanners,
      budgetRanges,
      instagramPosts,
      trustBadges,
      testimonials,
    });
  } catch (error) {
    console.error("[GET /api/homepage]", error);
    return NextResponse.json({ error: "Failed to fetch homepage data" }, { status: 500 });
  }
}

// POST /api/homepage — Modify homepage items
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!action || !payload) {
      return NextResponse.json({ error: "Action and payload are required" }, { status: 400 });
    }

    switch (action) {
      // ─────────────────────────────────────────
      // HERO BANNERS
      // ─────────────────────────────────────────
      case "add_hero": {
        const item = await prisma.heroBanner.create({
          data: {
            imageUrl: payload.imageUrl,
            title: payload.title || null,
            subtitle: payload.subtitle || null,
            ctaText: payload.ctaText || null,
            ctaLink: payload.ctaLink || null,
            displayOrder: parseInt(payload.displayOrder || "0"),
            isActive: payload.isActive !== false,
          },
        });
        return NextResponse.json({ item });
      }
      case "delete_hero": {
        await prisma.heroBanner.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true });
      }

      // ─────────────────────────────────────────
      // BUDGET RANGES
      // ─────────────────────────────────────────
      case "add_budget": {
        const item = await prisma.budgetRange.create({
          data: {
            label: payload.label,
            minPrice: parseFloat(payload.minPrice || "0"),
            maxPrice: payload.maxPrice ? parseFloat(payload.maxPrice) : null,
            displayOrder: parseInt(payload.displayOrder || "0"),
            isActive: payload.isActive !== false,
          },
        });
        return NextResponse.json({ item });
      }
      case "delete_budget": {
        await prisma.budgetRange.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true });
      }

      // ─────────────────────────────────────────
      // INSTAGRAM LIFESTYLE
      // ─────────────────────────────────────────
      case "add_instagram": {
        const item = await prisma.instagramPost.create({
          data: {
            imageUrl: payload.imageUrl,
            caption: payload.caption || null,
            productId: payload.productId || null,
            displayOrder: parseInt(payload.displayOrder || "0"),
            isActive: payload.isActive !== false,
          },
        });
        return NextResponse.json({ item });
      }
      case "delete_instagram": {
        await prisma.instagramPost.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true });
      }

      // ─────────────────────────────────────────
      // TRUST BADGES
      // ─────────────────────────────────────────
      case "add_badge": {
        const item = await prisma.trustBadge.create({
          data: {
            icon: payload.icon,
            text: payload.text,
            displayOrder: parseInt(payload.displayOrder || "0"),
            isActive: payload.isActive !== false,
          },
        });
        return NextResponse.json({ item });
      }
      case "delete_badge": {
        await prisma.trustBadge.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true });
      }

      // ─────────────────────────────────────────
      // TESTIMONIALS
      // ─────────────────────────────────────────
      case "add_testimonial": {
        const item = await prisma.testimonial.create({
          data: {
            name: payload.name,
            photo: payload.photo || null,
            rating: parseInt(payload.rating || "5"),
            text: payload.text,
            displayOrder: parseInt(payload.displayOrder || "0"),
            isActive: payload.isActive !== false,
          },
        });
        return NextResponse.json({ item });
      }
      case "delete_testimonial": {
        await prisma.testimonial.delete({ where: { id: payload.id } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("[POST /api/homepage]", error);
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
