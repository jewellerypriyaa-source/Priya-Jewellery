"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import { Clock, BookOpen, ChevronRight } from "lucide-react";

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Jewellery Care", "Style Guide", "Buying Guide"];

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-cream-100/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-3 font-semibold">
            Priya Editorial
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-maroon-950 mb-4 leading-tight">
            Jewellery Journal & Guides
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-5" />
          <p className="text-gray-600 text-sm md:text-base">
            Discover expert care tips, sizing guides, and the latest styling trends to keep your Priya Jewellery collections shining forever.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-maroon-900 border-maroon-900 text-white shadow-md scale-105"
                  : "bg-white border-cream-200 text-gray-600 hover:border-gold-500 hover:text-gold-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-2xl border border-cream-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 flex flex-col h-full group"
            >
              {/* Category tag */}
              <div className="p-6 pb-0">
                <span className="text-[10px] tracking-widest font-bold uppercase text-gold-600 bg-gold-50 px-2.5 py-1 rounded-md">
                  {post.category}
                </span>
              </div>

              {/* Text Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-serif text-xl font-bold text-maroon-950 mb-3 group-hover:text-gold-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  {/* Meta items */}
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-5 border-t border-cream-100 pt-4">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-maroon-900 group-hover:text-gold-600 transition-colors gap-1 uppercase tracking-wider"
                  >
                    Read Article
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
