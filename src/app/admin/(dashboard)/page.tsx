import prisma from "@/lib/prisma";
import { Package, Tags, Star, Users, MousePointer, Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";


async function getDashboardStats() {
  const [
    totalProducts,
    totalCategories,
    pendingReviews,
    totalLeads,
    waClicks7d,
    views7d,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.lead.count(),
    prisma.analyticsEvent.count({
      where: {
        type: "WHATSAPP_CLICK",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        type: "VIEW",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.product.findMany({
      where: { stockStatus: "LOW_STOCK", isPublished: true },
      select: { id: true, name: true, slug: true, stockQty: true },
      take: 5,
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    pendingReviews,
    totalLeads,
    waClicks7d,
    views7d,
    lowStockProducts,
  };
}

async function getTopProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { whatsappClicks: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      whatsappClicks: true,
      viewCount: true,
      stockStatus: true,
    },
  });
}

export default async function AdminDashboardPage() {
  const [stats, topProducts] = await Promise.all([
    getDashboardStats(),
    getTopProducts(),
  ]);

  const statCards = [
    {
      label: "Published Products",
      value: stats.totalProducts,
      icon: <Package size={20} />,
      color: "#6b1a2a",
      href: "/admin/products",
    },
    {
      label: "Active Categories",
      value: stats.totalCategories,
      icon: <Tags size={20} />,
      color: "#a07830",
      href: "/admin/categories",
    },
    {
      label: "Page Views (7 days)",
      value: stats.views7d,
      icon: <Eye size={20} />,
      color: "#1a6b4a",
      href: "/admin/analytics",
    },
    {
      label: "WhatsApp Clicks (7 days)",
      value: stats.waClicks7d,
      icon: <MousePointer size={20} />,
      color: "#25d366",
      href: "/admin/analytics",
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      icon: <Star size={20} />,
      color: "#d97706",
      href: "/admin/reviews",
    },
    {
      label: "Newsletter Leads",
      value: stats.totalLeads,
      icon: <Users size={20} />,
      color: "#4f46e5",
      href: "/admin/leads",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here's what's happening with Priyaa Jewellery.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow"
            style={{ border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#1a0a0e" }}
            >
              {card.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by WhatsApp Clicks */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#3d0b15" }}>
              Top Products by WhatsApp Clicks
            </h2>
            <Link
              href="/admin/analytics"
              className="text-xs"
              style={{ color: "#c9a84c" }}
            >
              View all →
            </Link>
          </div>

          {topProducts.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b">
                  <th className="pb-2 text-left font-medium">Product</th>
                  <th className="pb-2 text-right font-medium">Views</th>
                  <th className="pb-2 text-right font-medium">WA Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="font-medium hover:text-maroon-600 line-clamp-1"
                        style={{ color: "#1a0a0e" }}
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-2.5 text-right text-gray-500">
                      {p.viewCount}
                    </td>
                    <td className="py-2.5 text-right font-semibold" style={{ color: "#25d366" }}>
                      {p.whatsappClicks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No data yet.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-semibold" style={{ color: "#3d0b15" }}>
              Low Stock Alerts
            </h2>
          </div>

          {stats.lowStockProducts.length > 0 ? (
            <ul className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="font-medium hover:text-maroon-600 flex-1 line-clamp-1"
                    style={{ color: "#1a0a0e" }}
                  >
                    {p.name}
                  </Link>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full ml-2"
                    style={{ background: "#fef3c7", color: "#92400e" }}
                  >
                    {p.stockQty} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">
              ✓ All products are well-stocked
            </p>
          )}

          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
            <Link
              href="/admin/products"
              className="text-xs font-medium"
              style={{ color: "#c9a84c" }}
            >
              Manage inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/products/new", label: "Add Product", icon: "+" },
          { href: "/admin/categories", label: "Add Category", icon: "🏷️" },
          { href: "/admin/reviews", label: "Review Approvals", icon: "⭐" },
          { href: "/admin/leads", label: "Export Leads", icon: "📥" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow"
            style={{ border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <div className="text-xl mb-1">{action.icon}</div>
            <div className="text-xs font-medium" style={{ color: "#3d0b15" }}>
              {action.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
