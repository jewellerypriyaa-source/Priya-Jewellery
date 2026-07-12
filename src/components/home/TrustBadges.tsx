"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Badge {
  id: string;
  icon: string;
  text: string;
}

interface TrustBadgesProps {
  badges: Badge[];
}

export default function TrustBadges({ badges }: TrustBadgesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current?.querySelectorAll(".badge-item") || null,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="py-6 px-4"
      style={{
        background: "linear-gradient(135deg, #3d0b15, #6b1a2a)",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="badge-item flex items-center justify-center gap-3 text-center sm:text-left py-2 px-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.1)" }}
            >
              <span className="text-gold-400 text-lg">✦</span>
              <span
                className="text-xs sm:text-sm font-medium tracking-wide text-white"
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
