"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Image,
  Star,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/categories", label: "Categories", icon: <Tags size={18} /> },
  { href: "/admin/homepage", label: "Homepage", icon: <Image size={18} /> },
  { href: "/admin/reviews", label: "Reviews", icon: <Star size={18} /> },
  { href: "/admin/leads", label: "Leads", icon: <Users size={18} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

interface AdminSidebarProps {
  adminName: string;
}

export default function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar sticky top-0 h-screen flex-shrink-0">
      {/* Brand */}
      <div
        className="p-5 border-b"
        style={{ borderColor: "rgba(201,168,76,0.15)" }}
      >
        <div
          className="font-serif text-lg font-bold"
          style={{ color: "#e6c97a" }}
        >
          Priya Jewellery
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#c9a84c" }}>
          Admin Panel
        </div>
      </div>

      {/* Admin Badge */}
      <div
        className="px-5 py-3 border-b"
        style={{ borderColor: "rgba(201,168,76,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(201,168,76,0.2)", color: "#e6c97a" }}
          >
            {adminName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium text-white">{adminName}</p>
            <p className="text-xs" style={{ color: "#666" }}>
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive ? "#e6c97a" : "#9ca3af",
                    background: isActive
                      ? "rgba(201,168,76,0.12)"
                      : "transparent",
                    borderLeft: isActive
                      ? "2px solid #c9a84c"
                      : "2px solid transparent",
                  }}
                  id={`admin-nav-${item.href.replace("/admin/", "").replace("/admin", "home")}`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} style={{ color: "#c9a84c" }} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "rgba(201,168,76,0.1)" }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all"
          id="admin-sign-out"
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1"
          target="_blank"
        >
          ↗ View Store
        </Link>
      </div>
    </aside>
  );
}
