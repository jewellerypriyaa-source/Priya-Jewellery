"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductImage {
  id?: string;
  url: string;
  isPrimary: boolean;
}

interface ProductVariant {
  id?: string;
  name: string;
  value: string;
  priceDelta: number;
  stockQty: number;
}

interface ProductFormProps {
  categories: Category[];
  subcategories: Subcategory[];
  initialData?: any;
}

export default function ProductForm({ categories, subcategories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? (categories.length > 0 ? categories[0].id : ""));
  
  // Set initial subcategory based on initialData or first available subcategory for the selected category
  const defaultSubcategory = initialData?.subcategoryId ?? (subcategories.find(s => s.categoryId === (initialData?.categoryId ?? categories[0]?.id))?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(defaultSubcategory);
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [mrp, setMrp] = useState(initialData?.mrp?.toString() ?? "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [stockQty, setStockQty] = useState(initialData?.stockQty?.toString() ?? "10");
  const [stockStatus, setStockStatus] = useState(initialData?.stockStatus ?? "IN_STOCK");

  // Flags
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isBestseller, setIsBestseller] = useState(initialData?.isBestseller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialData?.isNewArrival ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc ?? "");

  // Images & Variants
  const [images, setImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants ?? []);

  // Variant Inputs
  const [variantName, setVariantName] = useState("Size");
  const [variantValue, setVariantValue] = useState("");
  const [variantPriceDelta, setVariantPriceDelta] = useState("");
  const [variantStock, setVariantStock] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to upload image");
        }

        const data = await res.json();
        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            isPrimary: prev.length === 0, // Set first image as primary
          },
        ]);
        toast.success(`Uploaded ${file.name}`);
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const deletedImage = images[index];
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If deleted image was primary, make the first remaining image primary
      if (deletedImage.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const addVariant = () => {
    if (!variantValue.trim()) {
      toast.error("Please specify a variant value (e.g. 16 inches)");
      return;
    }
    setVariants((prev) => [
      ...prev,
      {
        name: variantName,
        value: variantValue,
        priceDelta: variantPriceDelta ? parseFloat(variantPriceDelta) : 0,
        stockQty: variantStock ? parseInt(variantStock) : 10,
      },
    ]);
    setVariantValue("");
    setVariantPriceDelta("");
    setVariantStock("");
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Product name is required");
    if (!slug.trim()) return toast.error("Slug is required");
    if (!price) return toast.error("Price is required");

    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        sku: sku || null,
        categoryId,
        subcategoryId,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : null,
        shortDesc: shortDesc || null,
        description: description || null,
        stockQty: parseInt(stockQty),
        stockStatus,
        isPublished,
        isBestseller,
        isNewArrival,
        isFeatured,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        images,
        variants,
      };

      const url = initialData ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save product");
      }

      toast.success(initialData ? "Product updated successfully!" : "Product created successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
              {initialData ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {initialData ? `Modify details for ${initialData.name}` : "Create a new jewellery product catalog listing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-maroon flex items-center gap-2 text-sm px-5 py-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column (Form Fields) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
              General Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                placeholder="E.g. Royal Kundan Necklace"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Slug (URL Path) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm bg-gray-50 text-gray-700"
                  placeholder="royal-kundan-necklace"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  SKU (Item Code)
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="E.g. PK-NK-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category (Group) *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    const newCatId = e.target.value;
                    setCategoryId(newCatId);
                    // Automatically select first subcategory of new category
                    const firstSub = subcategories.find(s => s.categoryId === newCatId);
                    setSubcategoryId(firstSub ? firstSub.id : "");
                  }}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm bg-white"
                >
                  <option value="" disabled>Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Subcategory *
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm bg-white"
                >
                  <option value="" disabled>Select a Subcategory</option>
                  {subcategories
                    .filter(s => s.categoryId === categoryId)
                    .map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                  ))}
                </select>
              </div>
            </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Stock Status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm bg-white"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="1499"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  MRP / Original Price (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="2499"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Short Description
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                placeholder="Brief tag line or bullet points showing details next to add-to-cart button..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Description (HTML or Markdown)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm font-sans"
                placeholder="Detail specifications, metal details, care tips..."
              />
            </div>
          </div>

          {/* Media / Images */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                Product Media
              </h2>
              {uploading && (
                <div className="flex items-center gap-1.5 text-xs text-gold-600 font-semibold">
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </div>
              )}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative border rounded-xl overflow-hidden aspect-square flex flex-col bg-gray-50"
                  style={{ borderColor: img.isPrimary ? "#c9a84c" : "#e5e7eb" }}
                >
                  <img src={img.url} alt="product image" className="object-cover w-full h-full" />

                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="p-1.5 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:text-gold-600 transition-all shadow-md"
                      title="Set as primary thumbnail"
                    >
                      <ImageIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded-full bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all shadow-md"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider bg-gold-600 shadow">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Button */}
              <label className="border-2 border-dashed border-gray-200 hover:border-gold-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gold-50/10 transition-colors aspect-square text-center">
                <Upload size={24} className="text-gray-400 mb-2 group-hover:text-gold-500" />
                <span className="text-xs font-semibold text-gray-500">Upload Image</span>
                <span className="text-[10px] text-gray-400 mt-0.5">JPEG, WebP, PNG</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
              Variants / Sizes
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Add specific options (e.g. Ring Size, Necklace Length) along with price differences (price delta can be positive or negative) and separate inventory limits.
            </p>

            <div className="flex flex-wrap gap-3 items-end p-4 rounded-xl" style={{ background: "#fbf6f0" }}>
              <div className="w-24">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="Size"
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  value={variantValue}
                  onChange={(e) => setVariantValue(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="e.g. 16 inches, Size 14"
                />
              </div>

              <div className="w-24">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Price Delta
                </label>
                <input
                  type="number"
                  value={variantPriceDelta}
                  onChange={(e) => setVariantPriceDelta(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="+200 or -100"
                />
              </div>

              <div className="w-20">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={variantStock}
                  onChange={(e) => setVariantStock(e.target.value)}
                  className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white focus:outline-none"
                  placeholder="10"
                />
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gold-600 hover:bg-gold-700 transition-colors"
              >
                Add Option
              </button>
            </div>

            {/* Variants List */}
            {variants.length > 0 && (
              <div className="border rounded-xl divide-y overflow-hidden">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">{v.name}:</span>{" "}
                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs ml-1">
                        {v.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-gray-600 text-xs">
                        Price Delta:{" "}
                        <strong className={v.priceDelta >= 0 ? "text-green-600" : "text-red-600"}>
                          {v.priceDelta >= 0 ? `+Rs.${v.priceDelta}` : `-Rs.${Math.abs(v.priceDelta)}`}
                        </strong>
                      </span>
                      <span className="text-gray-600 text-xs">
                        Stock: <strong>{v.stockQty}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column (Metadata & Publishing details) */}
        <div className="space-y-6">
          {/* Publishing Flags */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold border-b pb-2" style={{ color: "#3d0b15", borderColor: "rgba(201,168,76,0.1)" }}>
              Publishing Options
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Published</span>
                  <p className="text-[10px] text-gray-400">Make this product visible in the public shop</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Bestseller</span>
                  <p className="text-[10px] text-gray-400">Highlight in homepage Bestseller grid</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                  <p className="text-[10px] text-gray-400">Auto-include in New Arrivals carousel</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Featured set</span>
                  <p className="text-[10px] text-gray-400">Display in top promotions listings</p>
                </div>
              </label>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold border-b pb-2" style={{ color: "#3d0b15", borderColor: "rgba(201,168,76,0.1)" }}>
              SEO Settings
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                placeholder="Product page title for Google"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Meta Description
              </label>
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                placeholder="Search result page snippet summary..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
