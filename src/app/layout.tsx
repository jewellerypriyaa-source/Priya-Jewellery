import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import prisma from "@/lib/prisma";

// Always read live settings from Supabase — no stale cached announcement bar / WhatsApp number
export const dynamic = "force-dynamic";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";

export const metadata: Metadata = {
  title: {
    default: "Priya Jewellery — Handcrafted Fine Jewellery",
    template: "%s | Priya Jewellery",
  },
  description:
    "Discover handcrafted gold and silver jewellery — necklaces, earrings, bangles, rings, chokers and bridal sets. Order easily on WhatsApp.",
  keywords: [
    "jewellery",
    "gold jewellery",
    "silver jewellery",
    "bridal jewellery",
    "necklace",
    "earrings",
    "bangles",
    "rings",
    "WhatsApp order",
  ],
  openGraph: {
    type: "website",
    siteName: "Priya Jewellery",
    title: "Priya Jewellery — Handcrafted Fine Jewellery",
    description:
      "Beautiful handcrafted jewellery. Order easily on WhatsApp — we reply within minutes!",
  },
};

async function getLayoutData() {
  try {
    const [categories, settings] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true, slug: true, imageUrl: true },
      }),
      prisma.settings.findUnique({ where: { id: "main" } }),
    ]);
    return { categories, settings };
  } catch {
    return { categories: [], settings: null };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings } = await getLayoutData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
              borderRadius: "10px",
              border: "1px solid rgba(201,168,76,0.3)",
            },
          }}
        />

        {/* Announcement Bar */}
        <AnnouncementBar
          text={settings?.announcementText}
          phone={settings?.phone}
          whatsappNumber={settings?.whatsappNumber}
        />

        {/* Sticky Header */}
        <Header
          categories={categories}
          logoUrl={settings?.logoUrl || undefined}
          storeName={settings?.storeName}
        />

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer
          storeName={settings?.storeName}
          phone={settings?.phone}
          email={settings?.email}
          address={settings?.address}
          businessHours={settings?.businessHours}
          instagramUrl={settings?.instagramUrl}
          facebookUrl={settings?.facebookUrl}
          youtubeUrl={settings?.youtubeUrl}
          whatsappNumber={settings?.whatsappNumber}
        />

        {/* Floating WhatsApp Button */}
        <WhatsAppFAB whatsappNumber={settings?.whatsappNumber} />
      </body>
    </html>
  );
}
