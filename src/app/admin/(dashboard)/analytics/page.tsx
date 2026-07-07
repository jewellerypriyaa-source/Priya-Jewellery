import prisma from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";
import { subDays, format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const days = 7;
  const since = subDays(new Date(), days);

  // 1. Fetch Summary Totals
  const [viewsCount, clicksCount, wishlistsCount] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: "VIEW", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { type: "WHATSAPP_CLICK", createdAt: { gte: since } } }),
    prisma.analyticsEvent.count({ where: { type: "WISHLIST_ADD", createdAt: { gte: since } } }),
  ]);

  // 2. Fetch Timeline Events
  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: since },
      type: { in: ["VIEW", "WHATSAPP_CLICK"] },
    },
    select: {
      type: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Build a timeline map
  const timelineMap: Record<string, { date: string; views: number; clicks: number }> = {};
  for (let i = days - 1; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), "MMM dd");
    timelineMap[dateStr] = { date: dateStr, views: 0, clicks: 0 };
  }

  events.forEach((ev) => {
    const dateStr = format(new Date(ev.createdAt), "MMM dd");
    if (timelineMap[dateStr]) {
      if (ev.type === "VIEW") {
        timelineMap[dateStr].views += 1;
      } else if (ev.type === "WHATSAPP_CLICK") {
        timelineMap[dateStr].clicks += 1;
      }
    }
  });

  const timelineData = Object.values(timelineMap);

  // 3. Fetch Top Products
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { whatsappClicks: "desc" },
    take: 5,
    select: {
      name: true,
      viewCount: true,
      whatsappClicks: true,
    },
  });

  const topProducts = products.map((p) => ({
    name: p.name,
    views: p.viewCount,
    clicks: p.whatsappClicks,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
          Store Performance Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Detailed metrics for visitors, conversions, and product inquiries
        </p>
      </div>

      <AnalyticsClient
        summary={{
          views: viewsCount,
          clicks: clicksCount,
          wishlists: wishlistsCount,
        }}
        timelineData={timelineData}
        topProducts={topProducts}
      />
    </div>
  );
}
