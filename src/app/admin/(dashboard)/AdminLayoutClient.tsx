"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayoutClient({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar automatically on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen text-gray-800" style={{ background: "#f8f4f0" }}>
      <Toaster position="top-right" />

      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a0a0e] flex items-center justify-between px-4 z-40 border-b border-[#c9a84c]/20">
        <div className="flex flex-col">
          <span className="font-serif font-bold text-white text-base leading-none">Priya Jewellery</span>
          <span className="text-[10px] text-[#c9a84c] tracking-wider mt-0.5 uppercase">Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl text-[#e6c97a] bg-[#3d0b15]/40 hover:bg-[#3d0b15]/80 border border-[#c9a84c]/20 focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* SIDEBAR CONTAINER */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:relative lg:block transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar wrapper */}
        <AdminSidebar adminName={adminName} />
      </div>

      {/* MOBILE SIDEBAR OVERLAY BACKGROUND */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity"
        />
      )}

      {/* MAIN CONTENT BLOCK */}
      <main className="flex-1 w-full overflow-x-hidden pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
