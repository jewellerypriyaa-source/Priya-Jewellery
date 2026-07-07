"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  phone?: string;
  whatsappNumber?: string;
}

export default function AnnouncementBar({
  text = "✨ Free shipping in-city on orders above ₹1499 | New Arrivals Every Week",
  phone = "+91 7367997766",
  whatsappNumber = "917367997766",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="relative text-white text-sm font-medium py-2 px-4 overflow-hidden"
      style={{ background: "linear-gradient(90deg, #3d0b15, #6b1a2a, #3d0b15)" }}
      role="banner"
    >
      {/* Shimmer line */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)",
          animation: "shimmer 3s infinite",
        }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Scrolling text on mobile, static on desktop */}
        <div className="flex-1 overflow-hidden">
          <p className="text-center truncate md:text-left">
            <span className="text-yellow-300 mr-1">✦</span>
            {text}
            <span className="text-yellow-300 ml-1">✦</span>
          </p>
        </div>

        {/* Phone link */}
        <a
          href={`tel:${phone}`}
          className="hidden sm:flex items-center gap-1.5 text-yellow-200 hover:text-white transition-colors whitespace-nowrap"
          id="announcement-phone"
        >
          <Phone size={13} />
          <span>{phone}</span>
        </a>

        {/* WhatsApp link */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white rounded-full px-3 py-0.5 text-xs font-semibold transition-colors whitespace-nowrap"
          id="announcement-whatsapp"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat Now
        </a>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white transition-colors ml-2 text-lg leading-none"
          aria-label="Close announcement"
        >
          ×
        </button>
      </div>
    </div>
  );
}
