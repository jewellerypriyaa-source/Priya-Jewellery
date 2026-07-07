"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryName: string;
  images: { url: string; altText?: string | null; isPrimary: boolean }[];
}

interface ShopPageClientProps {
  categorySlug?: string;
  categoryInfo?: CategoryInfo | null;
  allCategories: Category[];
  initialSearchParams: {
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    bestseller?: string;
    page?: string;
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function ShopPageClient({
  categorySlug,
  categoryInfo,
  allCategories,
  initialSearchParams,
}: ShopPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sort, setSort] = useState(initialSearchParams.sort ?? "newest");
  const [minPrice, setMinPrice] = useState(initialSearchParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialSearchParams.maxPrice ?? "");
  const [bestseller, setBestseller] = useState(initialSearchParams.bestseller === "true");
  const [page, setPage] = useState(parseInt(initialSearchParams.page ?? "1"));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) params.set("category", categorySlug);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (bestseller) params.set("bestseller", "true");
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, minPrice, maxPrice, bestseller, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function applyFilters() {
    setPage(1);
    fetchProducts();
    setSidebarOpen(false);
  }

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setBestseller(false);
    setSort("newest");
    setPage(1);
  }

  const pageTitle = categoryInfo?.name ?? "All Jewellery";

  return (
    <div>
      {/* Category Hero */}
      {categoryInfo && (
        <div
          className="relative h-40 md:h-56 flex items-end pb-8 px-6 overflow-hidden"
          style={{
            background: categoryInfo.imageUrl
              ? undefined
              : "linear-gradient(135deg, #3d0b15, #6b1a2a)",
          }}
        >
          {categoryInfo.imageUrl && (
            <Image
              src={categoryInfo.imageUrl}
              alt={categoryInfo.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(26,10,14,0.8), rgba(26,10,14,0.3))" }}
          />
          <div className="relative z-10 max-w-7xl w-full mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#c9a84c" }}>
              Collection
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
              {categoryInfo.name}
            </h1>
          </div>
        </div>
      )}

      {!categoryInfo && (
        <div
          className="py-10 px-6 text-center"
          style={{ background: "linear-gradient(135deg, #3d0b15, #6b1a2a)" }}
        >
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#c9a84c" }}>
            Explore
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            All Jewellery
          </h1>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-maroon-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-maroon-600">Shop</Link>
          {categoryInfo && (
            <>
              <span>/</span>
              <span style={{ color: "#6b1a2a" }}>{categoryInfo.name}</span>
            </>
          )}
        </nav>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "fixed inset-0 z-40 flex md:relative md:inset-auto md:z-auto" : "hidden md:block"
            } w-full md:w-64 flex-shrink-0`}
          >
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div
              className="fixed right-0 top-0 h-full md:relative md:h-auto bg-white rounded-xl p-5 shadow-lg w-72 md:w-full overflow-y-auto"
              style={{ border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-semibold" style={{ color: "#3d0b15" }}>
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-maroon-600"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden text-gray-500"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Category filter */}
              {!categorySlug && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Category
                  </h4>
                  <ul className="space-y-1.5">
                    {allCategories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          href={`/shop/${cat.slug}`}
                          className="text-sm text-gray-700 hover:text-maroon-600 transition-colors block"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Price Range
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="input-field text-sm"
                    id="filter-min-price"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="input-field text-sm"
                    id="filter-max-price"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Availability
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="rounded"
                    id="filter-bestseller"
                  />
                  <span className="text-sm text-gray-700">Bestsellers Only</span>
                </label>
              </div>

              <button
                onClick={applyFilters}
                className="btn-maroon w-full justify-center text-sm py-2.5"
                id="apply-filters"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""}`}
              </p>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="input-field text-sm w-auto py-2 pr-8"
                  id="shop-sort"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden btn-outline-gold text-sm px-3 py-2 flex items-center gap-1.5"
                  id="mobile-filter-toggle"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-64 rounded-xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="btn-outline-gold px-4 py-2 text-sm disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="btn-outline-gold px-4 py-2 text-sm disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">💍</p>
                <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: "#3d0b15" }}>
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or browse all products.</p>
                <button onClick={clearFilters} className="btn-maroon">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
