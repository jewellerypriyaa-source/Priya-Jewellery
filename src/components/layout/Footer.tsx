"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

// Custom brand icon components since brand icons are removed from core lucide-react
const Instagram = ({ size = 16, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 16, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = ({ size = 16, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

interface FooterProps {
  storeName?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;
}

export default function Footer({
  storeName = "Priya Jewellery",
  phone = "+91 7367997766",
  email = "info@priyajewellery.com",
  address = "Shop no 137 First floor, AC MARKET, Babudanga, Golabari, AC MARKET, Salkia, Howrah, West Bengal 711106",
  businessHours = "Mon–Sat: 10am – 7pm",
  instagramUrl = "#",
  facebookUrl = "#",
  youtubeUrl = "#",
  whatsappNumber = "917367997766",
}: FooterProps) {
  const [name, setName] = useState("");
  const [phone2, setPhone2] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone2.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone2 }),
      });
      if (res.ok) {
        toast.success("You're on the list! We'll message you on WhatsApp.");
        setName("");
        setPhone2("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-maroon-900 text-white mt-16" style={{ background: "#1a0a0e" }}>
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="font-serif text-2xl font-bold mb-1" style={{ color: "#e6c97a" }}>
            {storeName}
          </div>
          <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "#c9a84c" }}>
            Fine Jewellery
          </p>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed">
            Handcrafted jewellery that tells your story. Order easily via WhatsApp — we reply within minutes!
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            {instagramUrl && instagramUrl !== "#" && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(201,168,76,0.15)" }} aria-label="Instagram">
                <Instagram size={16} className="text-gold-300" style={{ color: "#e6c97a" }} />
              </a>
            )}
            {facebookUrl && facebookUrl !== "#" && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(201,168,76,0.15)" }} aria-label="Facebook">
                <Facebook size={16} style={{ color: "#e6c97a" }} />
              </a>
            )}
            {youtubeUrl && youtubeUrl !== "#" && (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(201,168,76,0.15)" }} aria-label="YouTube">
                <Youtube size={16} style={{ color: "#e6c97a" }} />
              </a>
            )}
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25d366" }} aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: "#e6c97a" }}>
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop All" },
              { href: "/shop?sort=newest", label: "New Arrivals" },
              { href: "/shop?bestseller=true", label: "Bestsellers" },
              { href: "/wishlist", label: "My Wishlist" },
              { href: "/about-us", label: "About Us" },
              { href: "/contact-us", label: "Contact Us" },
              { href: "/size-chart", label: "Size Chart" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-gold-300 transition-colors"
                  style={{ "--hover-color": "#e6c97a" } as React.CSSProperties}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Policies */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: "#e6c97a" }}>
            Policies
          </h3>
          <ul className="space-y-2.5 mb-6">
            {[
              { href: "/shipping-policy", label: "Shipping Policy" },
              { href: "/return-policy", label: "Return Policy" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-of-service", label: "Terms of Service" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-300 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: "#e6c97a" }}>
            Contact
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Phone size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }} />
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Mail size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }} />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </li>
            {address && (
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }} />
                <span>{address}</span>
              </li>
            )}
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <Clock size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#c9a84c" }} />
              <span>{businessHours}</span>
            </li>
          </ul>
        </div>

        {/* WhatsApp Opt-in Form */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: "#e6c97a" }}>
            Get WhatsApp Updates
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Join our exclusive list for new arrivals, offers, and festive deals!
          </p>

          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
              id="footer-lead-name"
            />
            <input
              type="tel"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              placeholder="WhatsApp Number"
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
              id="footer-lead-phone"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: loading ? "#555" : "linear-gradient(135deg, #c9a84c, #e6c97a)",
                color: "#3a2808",
              }}
              id="footer-lead-submit"
            >
              <Send size={14} />
              {loading ? "Joining..." : "Join WhatsApp List"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t text-center py-5 px-4"
        style={{ borderColor: "rgba(201,168,76,0.1)" }}
      >
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} {storeName}. All rights reserved. |{" "}
          <span style={{ color: "#c9a84c" }}>Handcrafted with ♥</span>
        </p>
      </div>
    </footer>
  );
}
