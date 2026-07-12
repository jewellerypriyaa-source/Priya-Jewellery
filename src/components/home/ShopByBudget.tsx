"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface BudgetRange {
  id: string;
  label: string;
  minPrice: number;
  maxPrice?: number | null;
}

interface ShopByBudgetProps {
  ranges: BudgetRange[];
}

// Gradient pairs for each price range card
const GRADIENTS = [
  "linear-gradient(135deg, #f5ede0, #fdf8ec)",
  "linear-gradient(135deg, #fadadd, #fdf2f4)",
  "linear-gradient(135deg, #f5c8cc, #fadadd)",
  "linear-gradient(135deg, #eec5c9, #f5c8cc)",
  "linear-gradient(135deg, #3d0b15, #6b1a2a)",
];

const TEXT_COLORS = ["#3d0b15", "#3d0b15", "#3d0b15", "#3d0b15", "#e6c97a"];

export default function ShopByBudget({ ranges }: ShopByBudgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll(".budget-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 px-4" style={{ background: "#f5ede0" }}>
      <div className="max-w-7xl mx-auto">
        <div className="section-header">
          <h2>Shop by Budget</h2>
          <div className="section-divider">
            <span>✦</span>
          </div>
          <p>Beautiful jewellery for every budget</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ranges.map((range, i) => {
            const params = new URLSearchParams();
            if (range.minPrice > 0) params.set("minPrice", range.minPrice.toString());
            if (range.maxPrice) params.set("maxPrice", range.maxPrice.toString());
            const href = `/shop?${params.toString()}`;

            return (
              <Link
                key={range.id}
                href={href}
                className="group budget-card rounded-xl p-5 flex flex-col justify-between h-28 sm:h-32 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: GRADIENTS[i % GRADIENTS.length],
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
                id={`budget-range-${range.id}`}
              >
                <span
                  className="font-serif text-base sm:text-lg font-bold leading-tight"
                  style={{ color: TEXT_COLORS[i % TEXT_COLORS.length] }}
                >
                  {range.label}
                </span>
                <span
                  className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: TEXT_COLORS[i % TEXT_COLORS.length] }}
                >
                  Shop Now →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
