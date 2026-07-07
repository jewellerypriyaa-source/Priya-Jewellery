"use client";

import { useState, useEffect } from "react";
import { Loader2, Settings, ShieldAlert, Phone, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // General Settings State
  const [storeName, setStoreName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mapEmbed, setMapEmbed] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Password Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      if (data.settings) {
        const s = data.settings;
        setStoreName(s.storeName ?? "");
        setWhatsappNumber(s.whatsappNumber ?? "");
        setWhatsappTemplate(s.whatsappTemplate ?? "");
        setAnnouncementText(s.announcementText ?? "");
        setPhone(s.phone ?? "");
        setEmail(s.email ?? "");
        setAddress(s.address ?? "");
        setMapEmbed(s.mapEmbed ?? "");
        setBusinessHours(s.businessHours ?? "");
        setInstagramUrl(s.instagramUrl ?? "");
        setFacebookUrl(s.facebookUrl ?? "");
        setYoutubeUrl(s.youtubeUrl ?? "");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);

    const payload = {
      storeName,
      whatsappNumber,
      whatsappTemplate,
      announcementText,
      phone,
      email,
      address,
      mapEmbed,
      businessHours,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gold-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
          Site Settings
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Configure business metadata, WhatsApp contact parameters, and admin security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (General Settings Form) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold border-b pb-2 flex items-center gap-2" style={{ color: "#3d0b15", borderColor: "rgba(201,168,76,0.1)" }}>
              <Settings size={18} />
              General Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  WhatsApp Number *
                  <span className="group relative cursor-pointer" title="Must include country code, e.g. 917367997766">
                    <HelpCircle size={10} className="text-gray-400" />
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="917367997766"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Announcement Bar Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>WhatsApp Order Message Template</span>
                <span className="text-[9px] text-gold-600 font-semibold lowercase">
                  Available tags: {"{product_name}"}, {"{price}"}, {"{variant}"}, {"{url}"}
                </span>
              </label>
              <textarea
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg text-sm font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Instagram Link
                </label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Facebook Link
                </label>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  YouTube Link
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Physical Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={savingGeneral}
              className="btn-maroon flex items-center gap-1.5 text-xs px-5 py-2.5 ml-auto"
            >
              {savingGeneral && <Loader2 size={14} className="animate-spin" />}
              Save Configuration
            </button>
          </form>
        </div>

        {/* Right Column (Change Password Form) */}
        <div className="space-y-6">
          <form onSubmit={handleSavePassword} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold border-b pb-2 flex items-center gap-2 text-red-900" style={{ borderColor: "rgba(239,68,68,0.1)" }}>
              <ShieldAlert size={18} />
              Admin Security
            </h2>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-maroon w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              {savingPassword && <Loader2 size={12} className="animate-spin" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
