"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Upload, X, FolderTree, Folder } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: { name: string };
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminCatalogStructurePage() {
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | Subcategory | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, subcatsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/subcategories")
      ]);
      
      if (!catsRes.ok || !subcatsRes.ok) throw new Error("Failed to load catalog structure");
      
      const catsData = await catsRes.json();
      const subcatsData = await subcatsRes.json();
      
      setCategories(catsData.categories);
      setSubcategories(subcatsData.subcategories);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingItem) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setCategoryId(categories.length > 0 ? categories[0].id : "");
    setDisplayOrder("0");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description ?? "");
    setImageUrl(item.imageUrl ?? "");
    if (activeTab === "subcategories") setCategoryId(item.categoryId ?? "");
    setDisplayOrder(item.displayOrder.toString());
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", activeTab);

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

    if (activeTab === "subcategories" && !categoryId) {
      return toast.error("Please select a parent category");
    }

    setSaving(true);
    const payload: any = {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      displayOrder: parseInt(displayOrder) || 0,
      isActive,
    };

    if (activeTab === "subcategories") {
      payload.categoryId = categoryId;
    }

    try {
      const endpoint = activeTab === "categories" ? "/api/categories" : "/api/subcategories";
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      toast.success(editingItem ? "Updated successfully!" : "Created successfully!");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      const endpoint = activeTab === "categories" ? "/api/categories" : "/api/subcategories";
      const res = await fetch(`${endpoint}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`${item.name} status updated`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete ${item.name}? This will affect products linked to it.`)) return;

    try {
      const endpoint = activeTab === "categories" ? "/api/categories" : "/api/subcategories";
      const res = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Deleted successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const listToRender = activeTab === "categories" ? categories : subcategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
            Catalog Structure
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your main categories and their subcategories
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-maroon flex items-center gap-2 text-sm px-5 py-2.5"
        >
          <Plus size={16} />
          {activeTab === "categories" ? "Add Category" : "Add Subcategory"}
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "categories" ? "bg-white text-gold-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Folder size={16} />
          Main Categories (Level 1)
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "subcategories" ? "bg-white text-gold-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FolderTree size={16} />
          Subcategories (Level 2)
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gold-600" />
        </div>
      ) : listToRender.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-xl p-8">
          <p className="text-gray-500 text-sm">No {activeTab} defined yet.</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-lg text-xs font-semibold"
          >
            Create First {activeTab === "categories" ? "Category" : "Subcategory"}
          </button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                {activeTab === "subcategories" && <th className="px-6 py-4">Parent Category</th>}
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-center">Order</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {listToRender.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border bg-gray-50"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">{item.name}</td>
                  {activeTab === "subcategories" && (
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border">
                        {item.category?.name || "Unknown"}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-3 text-gray-500 text-xs font-mono">{item.slug}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{item.displayOrder}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(item)}
                      className="inline-flex items-center justify-center focus:outline-none transition-colors"
                      title={item.isActive ? "Deactivate" : "Activate"}
                    >
                      {item.isActive ? (
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
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gold-600 hover:bg-gold-50/50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                        title="Delete"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold" style={{ color: "#3d0b15" }}>
                {editingItem ? `Edit ${activeTab === 'categories' ? 'Category' : 'Subcategory'}` : `Add ${activeTab === 'categories' ? 'Category' : 'Subcategory'}`}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Define the properties and visibility parameters.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  placeholder={activeTab === 'categories' ? "E.g. Gold Plated" : "E.g. Necklace"}
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
                    placeholder="url-friendly-slug"
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

              {activeTab === "subcategories" && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Parent Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-sm"
                  >
                    <option value="" disabled>Select a Main Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {editingItem ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
