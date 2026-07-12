"use client";

import { useState, useRef } from "react";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Testimonial {
  id: string;
  name: string;
  photo?: string | null;
  rating: number;
  text: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-gold-500 text-gold-500" : "text-gray-300"}
          style={
            star <= rating
              ? { fill: "#c9a84c", color: "#c9a84c" }
              : { color: "#d1d5db" }
          }
        />
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  // Section Scroll reveal
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: containerRef });

  // Testimonial card content swap fade
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0.25, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
    );
  }, { dependencies: [current], scope: cardRef });

  return (
    <section
      ref={containerRef}
      className="py-16 px-4"
      style={{ background: "linear-gradient(135deg, #1a0a0e, #3d0b15)" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#c9a84c" }}>
          What our customers say
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-10">
          Customer Love ♥
        </h2>

        {/* Testimonial Card */}
        <div
          ref={cardRef}
          className="rounded-2xl p-8 md:p-10 mb-8"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          {/* Quote mark */}
          <div
            className="font-serif text-6xl font-bold mb-4 leading-none"
            style={{ color: "rgba(201,168,76,0.3)" }}
          >
            "
          </div>

          <p className="text-gray-200 text-lg leading-relaxed mb-6 italic">
            {testimonials[current].text}
          </p>

          <div className="flex items-center justify-center gap-3">
            {testimonials[current].photo ? (
              <img
                src={testimonials[current].photo!}
                alt={testimonials[current].name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gold-400"
                style={{ borderColor: "#c9a84c" }}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: "rgba(201,168,76,0.2)", color: "#e6c97a" }}
              >
                {testimonials[current].name[0]}
              </div>
            )}
            <div className="text-left">
              <p className="font-semibold text-white text-sm">
                {testimonials[current].name}
              </p>
              <StarRating rating={testimonials[current].rating} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: "rgba(201,168,76,0.3)" }}
              aria-label="Previous testimonial"
            >
              ←
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? "20px" : "8px",
                    height: "8px",
                    background: i === current ? "#c9a84c" : "rgba(255,255,255,0.3)",
                  }}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: "rgba(201,168,76,0.3)" }}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
