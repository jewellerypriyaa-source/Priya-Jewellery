"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, ToggleLeft, ToggleRight, X } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  group: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [group, setGroup] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data.categories);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setGroup("");
    setDisplayOrder("0");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description ?? "");
    setImageUrl(cat.imageUrl ?? "");
    setGroup(cat.group ?? "");
    setDisplayOrder(cat.displayOrder.toString());
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "categories");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Cover image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      return toast.error("Name and slug are required");
    }

    setSaving(true);
    const payload = {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      group: group || null,
      displayOrder: parseInt(displayOrder) || 0,
      isActive,
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save category");
      }

      toast.success(editingCategory ? "Category updated!" : "Category created!");
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (cat: Category) => {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`${cat.name} status updated`);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to update category status");
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to delete ${cat.name}? This will affect product categories.`)) return;

    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
            Categories
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage product collections and navigation structure
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-maroon flex items-center gap-2 text-sm px-5 py-2.5"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gold-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-xl p-8">
          <p className="text-gray-500 text-sm">No categories defined yet.</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-semibold"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Group</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-10 h-10 object-cover rounded-lg border bg-gray-50"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">{cat.name}</td>
                  <td className="px-6 py-3">
                    {cat.group ? (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background:
                            cat.group === "Gold Plated" ? "#fef3c7" :
                            cat.group === "Anti Tarnish" ? "#e0f2fe" :
                            cat.group === "American Diamond" ? "#ede9fe" : "#f3f4f6",
                          color:
                            cat.group === "Gold Plated" ? "#92400e" :
                            cat.group === "Anti Tarnish" ? "#0369a1" :
                            cat.group === "American Diamond" ? "#5b21b6" : "#6b7280",
                        }}
                      >
                        {cat.group}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs font-mono">{cat.slug}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{cat.displayOrder}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(cat)}
                      className="inline-flex items-center justify-center focus:outline-none transition-colors"
                      title={cat.isActive ? "Deactivate" : "Activate"}
                    >
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gold-600 hover:bg-gold-50/50 transition-colors"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold" style={{ color: "#3d0b15" }}>
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Define the collection name, description, and visibility parameters.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="E.g. Earrings"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Slug (URL Path) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm bg-gray-50 font-mono"
                    placeholder="earrings"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Jewellery Group
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                >
                  <option value="">— No Group —</option>
                  <option value="Gold Plated">Gold Plated (1.5g Gold)</option>
                  <option value="Anti Tarnish">Anti Tarnish</option>
                  <option value="American Diamond">American Diamond</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder="Brief description showing on catalog headers..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cover Image
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden relative group bg-gray-50 flex-shrink-0">
                      <img src={imageUrl} alt="preview" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gold-50/10 hover:border-gold-300 transition-colors flex-shrink-0">
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin text-gold-600" />
                      ) : (
                        <>
                          <Upload size={16} className="text-gray-400" />
                          <span className="text-[8px] font-semibold text-gray-500 mt-1">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-xs text-gray-400 leading-normal">
                    {imageUrl ? (
                      <span className="font-mono text-[10px] break-all">{imageUrl}</span>
                    ) : (
                      "Recommended size 300x300px. Upload in WebP, PNG, or JPEG format."
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Active (Show in shop listings & headers)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-maroon flex items-center gap-1.5 text-xs px-4 py-2"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
