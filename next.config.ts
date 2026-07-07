import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from Unsplash (used in seed data) and local uploads
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
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
