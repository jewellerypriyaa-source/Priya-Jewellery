"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Upload, Calendar, X, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface HeroBanner {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  displayOrder: number;
}

interface BudgetRange {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number | null;
  displayOrder: number;
}

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string | null;
  productId: string | null;
}

interface TrustBadge {
  id: string;
  icon: string;
  text: string;
  displayOrder: number;
}

interface Testimonial {
  id: string;
  name: string;
  photo: string | null;
  rating: number;
  text: string;
  displayOrder: number;
}

interface Product {
  id: string;
  name: string;
}

export default function AdminHomepageManager() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);

  // Lists
  const [heroes, setHeroes] = useState<HeroBanner[]>([]);
  const [budgets, setBudgets] = useState<BudgetRange[]>([]);
  const [instaPosts, setInstaPosts] = useState<InstagramPost[]>([]);
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Banners Form State
  const [heroImg, setHeroImg] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("Shop Collection");
  const [heroCtaLink, setHeroCtaLink] = useState("/shop");

  // Budget Form State
  const [budgetLabel, setBudgetLabel] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Instagram Form State
  const [instaImg, setInstaImg] = useState("");
  const [instaCaption, setInstaCaption] = useState("");
  const [instaProductId, setInstaProductId] = useState("");

  // Trust Badges Form State
  const [badgeIcon, setBadgeIcon] = useState("ShieldCheck");
  const [badgeText, setBadgeText] = useState("");

  // Testimonials Form State
  const [testName, setTestName] = useState("");
  const [testText, setTestText] = useState("");
  const [testRating, setTestRating] = useState("5");
  const [testPhoto, setTestPhoto] = useState("");

  // Countdown Sale State
  const [saleMessage, setSaleMessage] = useState("");
  const [saleCountdownEnd, setSaleCountdownEnd] = useState("");

  const [savingCountdown, setSavingCountdown] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHomepageData();
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/homepage");
      if (!res.ok) throw new Error("Failed to load page data");
      const data = await res.json();
      setHeroes(data.heroBanners || []);
      setBudgets(data.budgetRanges || []);
      setInstaPosts(data.instagramPosts || []);
      setBadges(data.trustBadges || []);
      setTestimonials(data.testimonials || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load homepage contents");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {}
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSaleMessage(data.settings?.saleMessage ?? "");
        setSaleCountdownEnd(data.settings?.saleCountdownEnd ?? "");
      }
    } catch {}
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "homepage");

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
      callback(data.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAddHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroImg) return toast.error("Hero banner image is required");

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_hero",
          payload: {
            imageUrl: heroImg,
            title: heroTitle,
            subtitle: heroSubtitle,
            ctaText: heroCtaText,
            ctaLink: heroCtaLink,
            displayOrder: heroes.length.toString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add hero banner");
      toast.success("Banner added");
      setHeroImg("");
      setHeroTitle("");
      setHeroSubtitle("");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetLabel || !budgetMin) return toast.error("Label and Min Price are required");

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_budget",
          payload: {
            label: budgetLabel,
            minPrice: budgetMin,
            maxPrice: budgetMax || null,
            displayOrder: budgets.length.toString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add budget range");
      toast.success("Budget range added");
      setBudgetLabel("");
      setBudgetMin("");
      setBudgetMax("");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaImg) return toast.error("Instagram post image is required");

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_instagram",
          payload: {
            imageUrl: instaImg,
            caption: instaCaption,
            productId: instaProductId || null,
            displayOrder: instaPosts.length.toString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add Instagram post");
      toast.success("Instagram post added");
      setInstaImg("");
      setInstaCaption("");
      setInstaProductId("");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeText) return toast.error("Badge text is required");

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_badge",
          payload: {
            icon: badgeIcon,
            text: badgeText,
            displayOrder: badges.length.toString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add badge");
      toast.success("Badge added");
      setBadgeText("");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testText) return toast.error("Name and feedback text are required");

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_testimonial",
          payload: {
            name: testName,
            text: testText,
            rating: testRating,
            photo: testPhoto || null,
            displayOrder: testimonials.length.toString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add testimonial");
      toast.success("Testimonial added");
      setTestName("");
      setTestText("");
      setTestPhoto("");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSaveCountdown = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCountdown(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleMessage,
          saleCountdownEnd: saleCountdownEnd || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update countdown settings");
      toast.success("Countdown settings updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingCountdown(false);
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: `delete_${type}`,
          payload: { id },
        }),
      });

      if (!res.ok) throw new Error("Deletion failed");
      toast.success("Item deleted");
      fetchHomepageData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
          Homepage Content
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Edit sliding banners, promotional layouts, testimonials, and countdown configurations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        {[
          { id: "hero", label: "Hero Banners" },
          { id: "budget", label: "Budget Ranges" },
          { id: "instagram", label: "Instagram Grid" },
          { id: "badges", label: "Trust Badges" },
          { id: "testimonials", label: "Testimonials" },
          { id: "countdown", label: "Sale Countdown" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all"
            style={{
              color: activeTab === tab.id ? "#3d0b15" : "#9ca3af",
              borderColor: activeTab === tab.id ? "#c9a84c" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gold-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tab Content Form Editor */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border shadow-sm self-start">
            {activeTab === "hero" && (
              <form onSubmit={handleAddHero} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Add Hero Slide
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Banner Image *
                  </label>
                  <div className="flex items-center gap-3">
                    {heroImg ? (
                      <div className="w-16 h-16 border rounded-lg overflow-hidden relative group bg-gray-50">
                        <img src={heroImg} alt="slide" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => setHeroImg("")}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gold-50/10 hover:border-gold-300 transition-colors">
                        {uploading ? (
                          <Loader2 size={16} className="animate-spin text-gold-600" />
                        ) : (
                          <Upload size={16} className="text-gray-400" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setHeroImg)}
                          className="hidden"
                        />
                      </label>
                    )}
                    <span className="text-xs text-gray-400">1400x600px recommended</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. Festive Collection"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. Up to 20% off on Bridal Sets"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={heroCtaText}
                      onChange={(e) => setHeroCtaText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={heroCtaLink}
                      onChange={(e) => setHeroCtaLink(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-maroon w-full text-xs py-2">
                  Add Hero Slide
                </button>
              </form>
            )}

            {activeTab === "budget" && (
              <form onSubmit={handleAddBudget} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Add Budget Shortcut
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Short Description Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={budgetLabel}
                    onChange={(e) => setBudgetLabel(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. Under Rs. 999"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Min Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Max Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Leave blank if no limit"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-maroon w-full text-xs py-2">
                  Add Budget Shortcut
                </button>
              </form>
            )}

            {activeTab === "instagram" && (
              <form onSubmit={handleAddInstagram} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Add Instagram Post
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Post Image *
                  </label>
                  <div className="flex items-center gap-3">
                    {instaImg ? (
                      <div className="w-16 h-16 border rounded-lg overflow-hidden relative group bg-gray-50">
                        <img src={instaImg} alt="slide" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => setInstaImg("")}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gold-50/10 hover:border-gold-300 transition-colors">
                        {uploading ? (
                          <Loader2 size={16} className="animate-spin text-gold-600" />
                        ) : (
                          <Upload size={16} className="text-gray-400" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setInstaImg)}
                          className="hidden"
                        />
                      </label>
                    )}
                    <span className="text-xs text-gray-400">Square crop looks best</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={instaCaption}
                    onChange={(e) => setInstaCaption(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Short description..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Tag Product Shortcut
                  </label>
                  <select
                    value={instaProductId}
                    onChange={(e) => setInstaProductId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="">Do not tag a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-maroon w-full text-xs py-2">
                  Add Instagram Post
                </button>
              </form>
            )}

            {activeTab === "badges" && (
              <form onSubmit={handleAddBadge} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Add Trust Badge
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Badge Icon
                  </label>
                  <select
                    value={badgeIcon}
                    onChange={(e) => setBadgeIcon(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="ShieldCheck">Shield Check (Certified)</option>
                    <option value="Truck">Truck (Free Shipping)</option>
                    <option value="MessageCircle">Message Circle (WhatsApp Support)</option>
                    <option value="Sparkles">Sparkles (Handcrafted)</option>
                    <option value="CornerUpLeft">Corner Up Left (Easy Returns)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. 100% Certified Hallmark Gold"
                  />
                </div>

                <button type="submit" className="btn-maroon w-full text-xs py-2">
                  Add Trust Badge
                </button>
              </form>
            )}

            {activeTab === "testimonials" && (
              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Add Customer Feedback
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    User Avatar Photo
                  </label>
                  <div className="flex items-center gap-3">
                    {testPhoto ? (
                      <div className="w-12 h-12 border rounded-full overflow-hidden relative group bg-gray-50">
                        <img src={testPhoto} alt="avatar" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => setTestPhoto("")}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-12 h-12 border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-gold-50/10 hover:border-gold-300 transition-colors">
                        {uploading ? (
                          <Loader2 size={12} className="animate-spin text-gold-600" />
                        ) : (
                          <Upload size={12} className="text-gray-400" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setTestPhoto)}
                          className="hidden"
                        />
                      </label>
                    )}
                    <span className="text-xs text-gray-400">Optional profile picture</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Star Rating
                  </label>
                  <select
                    value={testRating}
                    onChange={(e) => setTestRating(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Review Text *
                  </label>
                  <textarea
                    required
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Feedback comments..."
                  />
                </div>

                <button type="submit" className="btn-maroon w-full text-xs py-2">
                  Add Testimonial
                </button>
              </form>
            )}

            {activeTab === "countdown" && (
              <form onSubmit={handleSaveCountdown} className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
                  Countdown Banner Configuration
                </h3>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Sale Message *
                  </label>
                  <input
                    type="text"
                    required
                    value={saleMessage}
                    onChange={(e) => setSaleMessage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="E.g. Grand Festive Sale — 15% off!"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    End Datetime (UTC/ISO or DateString)
                  </label>
                  <input
                    type="datetime-local"
                    value={saleCountdownEnd}
                    onChange={(e) => setSaleCountdownEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                    Leave datetime blank to disable the live countdown clock (the sale message text will still render as a banner).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={savingCountdown}
                  className="btn-maroon w-full text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  {savingCountdown && <Loader2 size={12} className="animate-spin" />}
                  Save Countdown
                </button>
              </form>
            )}
          </div>

          {/* Right column list display */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-lg font-bold" style={{ color: "#3d0b15" }}>
              Active Homepage Elements
            </h3>

            {activeTab === "hero" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No sliding banners created yet.</p>
                ) : (
                  heroes.map((hero) => (
                    <div key={hero.id} className="bg-white border rounded-xl overflow-hidden shadow-sm relative group">
                      <img src={hero.imageUrl} alt="banner" className="w-full h-36 object-cover bg-gray-50" />
                      <div className="p-3 space-y-1">
                        <h4 className="font-serif font-bold text-sm text-gray-800">{hero.title || "No Title"}</h4>
                        <p className="text-gray-500 text-xs">{hero.subtitle}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-gold-50 text-gold-800 text-[10px] font-bold rounded">
                          {hero.ctaText} → {hero.ctaLink}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteItem("hero", hero.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-red-500 hover:text-white hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "budget" && (
              <div className="bg-white border rounded-xl divide-y overflow-hidden shadow-sm">
                {budgets.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No budget ranges configured.</p>
                ) : (
                  budgets.map((b) => (
                    <div key={b.id} className="p-3 flex items-center justify-between hover:bg-gray-50/50">
                      <div>
                        <strong className="text-gray-800 text-sm">{b.label}</strong>
                        <p className="text-xs text-gray-500">
                          Range: Rs. {b.minPrice} {b.maxPrice ? `to Rs. ${b.maxPrice}` : "and above"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem("budget", b.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "instagram" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {instaPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No Instagram grid posts added.</p>
                ) : (
                  instaPosts.map((post) => (
                    <div key={post.id} className="bg-white border rounded-xl overflow-hidden shadow-sm relative group aspect-square">
                      <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                        <p className="line-clamp-3">{post.caption || "No caption"}</p>
                        {post.productId && (
                          <div className="flex items-center gap-1 text-[10px] text-gold-300 font-semibold bg-black/20 p-1 rounded">
                            <Tag size={10} />
                            Tagged Product ID
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteItem("instagram", post.id)}
                          className="self-end p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "badges" && (
              <div className="bg-white border rounded-xl divide-y overflow-hidden shadow-sm">
                {badges.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No trust badges configured.</p>
                ) : (
                  badges.map((b) => (
                    <div key={b.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-1 rounded bg-gold-50 text-gold-600 font-mono text-xs">{b.icon}</span>
                        <span className="text-sm font-semibold text-gray-800">{b.text}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteItem("badge", b.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.length === 0 ? (
                  <p className="text-gray-500 text-sm">No testimonials added yet.</p>
                ) : (
                  testimonials.map((test) => (
                    <div key={test.id} className="bg-white border rounded-xl p-4 shadow-sm relative group flex gap-3">
                      {test.photo ? (
                        <img src={test.photo} alt={test.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold flex-shrink-0">
                          {test.name[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-gray-800">{test.name}</h4>
                        <div className="text-gold-500 text-xs">{"★".repeat(test.rating)}</div>
                        <p className="text-gray-500 text-xs leading-normal">{test.text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem("testimonial", test.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "countdown" && (
              <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-gray-800">Countdown Preview</h4>
                {saleMessage ? (
                  <div className="p-4 rounded-xl text-center space-y-2 border border-gold-200" style={{ background: "linear-gradient(135deg, #fdf2f4, #fbf6f0)" }}>
                    <p className="text-xs uppercase tracking-wider text-gold-600 font-bold">Limited Time Promo</p>
                    <p className="text-lg font-bold font-serif text-maroon-900" style={{ color: "#3d0b15" }}>{saleMessage}</p>
                    {saleCountdownEnd && (
                      <span className="inline-block px-3 py-1 bg-maroon-950 text-white rounded text-xs font-mono">
                        Ends: {new Date(saleCountdownEnd).toLocaleString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">Sale countdown banner is currently disabled.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
