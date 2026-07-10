import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — product images CDN
      {
        protocol: "https",
        hostname: "qrwdwcmfevcgafnhrujd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Unsplash (used in seed data)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Cloudinary (kept for compatibility)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Required for better-sqlite3 native module
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
