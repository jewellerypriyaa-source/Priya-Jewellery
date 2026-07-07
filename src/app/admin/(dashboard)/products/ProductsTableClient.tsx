"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, Star, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  stockStatus: string;
  stockQty: number;
  isPublished: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryName: string;
  imageUrl: string | null;
}

const STOCK_COLORS: Record<string, string> = {
  IN_STOCK: "#065f46",
  LOW_STOCK: "#92400e",
  SOLD_OUT: "#4b5563",
  MADE_TO_ORDER: "#4338ca",
};

const STOCK_BG: Record<string, string> = {
  IN_STOCK: "#d1fae5",
  LOW_STOCK: "#fef3c7",
  SOLD_OUT: "#f3f4f6",
  MADE_TO_ORDER: "#ede9fe",
};

export default function ProductsTableClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
      }
    } catch {
      toast.error("Failed to delete product");
    }
  }

  async function togglePublish(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isPublished: !current } : p
          )
        );
        toast.success(current ? "Product unpublished" : "Product published");
      }
    } catch {
      toast.error("Failed to update product");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkDelete() {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} products? This cannot be undone.`)) return;
    let deleted = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) deleted++;
      } catch {}
    }
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    toast.success(`${deleted} products deleted`);
  }

  return (
    <div>
      {/* Search & Bulk Actions */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field max-w-xs text-sm"
          id="products-search"
        />
        {selectedIds.size > 0 && (
          <button
            onClick={bulkDelete}
            className="text-sm text-red-600 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            id="bulk-delete-btn"
          >
            Delete {selectedIds.size} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(201,168,76,0.2)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-xs text-gray-400 border-b uppercase tracking-wider"
                style={{ borderColor: "rgba(201,168,76,0.1)" }}
              >
                <th className="p-4 text-left w-8">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(filtered.map((p) => p.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="p-4 text-left font-medium">Product</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-right font-medium">Price</th>
                <th className="p-4 text-center font-medium">Stock</th>
                <th className="p-4 text-center font-medium">Status</th>
                <th className="p-4 text-center font-medium">Flags</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "rgba(201,168,76,0.05)" }}>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream-50 transition-colors"
                  style={{ background: selectedIds.has(product.id) ? "#fdf8ec" : undefined }}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: "#fadadd" }}
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base">
                            💍
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium hover:text-maroon-600 line-clamp-1"
                          style={{ color: "#1a0a0e" }}
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{product.categoryName}</td>
                  <td className="p-4 text-right font-semibold" style={{ color: "#3d0b15" }}>
                    ₹{product.price.toLocaleString()}
                    {product.mrp && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹{product.mrp.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        background: STOCK_BG[product.stockStatus] ?? "#f3f4f6",
                        color: STOCK_COLORS[product.stockStatus] ?? "#4b5563",
                      }}
                    >
                      {product.stockStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => togglePublish(product.id, product.isPublished)}
                      className="flex items-center gap-1 mx-auto text-xs font-medium px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background: product.isPublished ? "#d1fae5" : "#f3f4f6",
                        color: product.isPublished ? "#065f46" : "#6b7280",
                      }}
                      id={`toggle-publish-${product.id}`}
                    >
                      {product.isPublished ? (
                        <><Eye size={11} /> Live</>
                      ) : (
                        <><EyeOff size={11} /> Draft</>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.isBestseller && (
                        <span title="Bestseller">
                          <Star size={13} style={{ fill: "#c9a84c", color: "#c9a84c" }} />
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#6b1a2a" }}
                          title="New Arrival"
                        >
                          N
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded"
                        title="View on site"
                      >
                        <Eye size={14} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-maroon-600 transition-colors rounded"
                        title="Edit"
                        id={`edit-product-${product.id}`}
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                        title="Delete"
                        id={`delete-product-${product.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">No products found</p>
              {search && (
                <p className="text-sm mt-1">
                  Try a different search term or{" "}
                  <button
                    onClick={() => setSearch("")}
                    className="underline hover:text-maroon-600"
                  >
                    clear filter
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
