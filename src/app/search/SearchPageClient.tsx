"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
  categoryName?: string;
}

export default function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || initialQuery;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=48`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-cream-100/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-2 font-semibold">
            Search Inquiry
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-maroon-950">
            Search Results
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mt-3 mb-4" />
          <p className="text-gray-600 text-sm">
            Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gold-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  category: { name: p.categoryName || "Jewellery", slug: "" },
                  subcategory: { name: "", slug: "" },
                  stockQty: p.stockStatus === "OUT_OF_STOCK" ? 0 : 5,
                } as any}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-cream-200/60 p-8 shadow-sm">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="font-serif text-xl font-bold text-maroon-950 mb-2">No Jewellery Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any products matching "{query}". Try checking your spelling or searching for another term like "necklace", "ring", or "pendant".
            </p>
            <a href="/shop" className="btn-gold px-6 py-2.5 text-xs font-semibold uppercase">
              View All Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
