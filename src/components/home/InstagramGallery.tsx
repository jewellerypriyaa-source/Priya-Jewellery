"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Post {
  id: string;
  imageUrl: string;
  caption?: string | null;
  product?: { slug: string; name: string } | null;
}

interface InstagramGalleryProps {
  posts: Post[];
}

export default function InstagramGallery({ posts }: InstagramGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-16 px-4" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <h2>Style Inspiration</h2>
          <div className="section-divider">
            <span>✦</span>
          </div>
          <p>Real looks, shoppable pieces — tap to explore</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {/* First item — double size */}
          {posts.slice(0, 1).map((post) => (
            <div
              key={post.id}
              className="col-span-1 sm:col-span-2 row-span-2 relative overflow-hidden rounded-xl cursor-pointer"
              style={{ aspectRatio: "1/1" }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption ?? "Shop this look"}
                fill
                className="object-cover transition-transform duration-500"
                style={{ transform: hoveredId === post.id ? "scale(1.05)" : "scale(1)" }}
                sizes="(max-width: 640px) 66vw, 40vw"
              />
              {hoveredId === post.id && (
                <div className="absolute inset-0 flex flex-col justify-end p-4"
                  style={{ background: "linear-gradient(to top, rgba(26,10,14,0.85), transparent)" }}
                >
                  {post.caption && (
                    <p className="text-white text-sm mb-2 line-clamp-2">{post.caption}</p>
                  )}
                  {post.product && (
                    <Link
                      href={`/product/${post.product.slug}`}
                      className="text-xs font-semibold py-1.5 px-3 rounded-lg w-fit"
                      style={{ background: "#c9a84c", color: "#1a0a0e" }}
                    >
                      Shop this look →
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Remaining items */}
          {posts.slice(1).map((post) => (
            <div
              key={post.id}
              className="relative overflow-hidden rounded-xl cursor-pointer"
              style={{ aspectRatio: "1/1" }}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption ?? "Shop this look"}
                fill
                className="object-cover transition-transform duration-500"
                style={{ transform: hoveredId === post.id ? "scale(1.07)" : "scale(1)" }}
                sizes="(max-width: 640px) 33vw, 20vw"
              />
              {hoveredId === post.id && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(26,10,14,0.55)" }}
                >
                  {post.product ? (
                    <Link
                      href={`/product/${post.product.slug}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: "#c9a84c", color: "#1a0a0e" }}
                    >
                      Shop →
                    </Link>
                  ) : (
                    <span className="text-white text-xs font-medium">
                      ✦
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
