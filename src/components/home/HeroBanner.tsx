"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Slide {
  id: string;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

interface HeroBannerProps {
  slides: Slide[];
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const goPrev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  // GSAP Cinematic Zoom for the active slide's background image
  useGSAP(() => {
    const activeImage = containerRef.current?.querySelector(`.hero-slide-${current} img`);
    if (activeImage) {
      gsap.fromTo(
        activeImage,
        { scale: 1.08 },
        { scale: 1, duration: 5.5, ease: "power2.out" }
      );
    }
  }, { dependencies: [current], scope: containerRef });

  // GSAP Premium Text & CTA Reveal
  useGSAP(() => {
    const title = containerRef.current?.querySelector(".hero-title") || null;
    const subtitle = containerRef.current?.querySelector(".hero-subtitle") || null;
    const actions = containerRef.current?.querySelector(".hero-actions") || null;
    const accentLine = containerRef.current?.querySelector(".hero-accent-line") || null;

    if (!title) return;

    // Reset GSAP tweens
    gsap.killTweensOf([title, subtitle, actions, accentLine]);

    // Split text into words wrapped in mask spans for the reveal
    const titleText = title.textContent || "";
    const words = titleText.split(" ");
    title.innerHTML = words
      .map(
        (word) =>
          `<span class="hero-title-wrapper"><span class="hero-title-word mr-3">${word}</span></span>`
      )
      .join(" ");

    const wordElements = title.querySelectorAll(".hero-title-word");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      accentLine,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.8 }
    )
      .fromTo(
        wordElements,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.2, stagger: 0.06 },
        "-=0.5"
      )
      .fromTo(
        subtitle,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        actions,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

    // Subtle micro-floating to add airiness
    gsap.fromTo(
      containerRef.current?.querySelector(".hero-text-block") || null,
      { y: 0 },
      { y: -6, duration: 3.5, ease: "sine.inOut", repeat: -1, yoyo: true }
    );
  }, { dependencies: [current], scope: containerRef });

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, goNext, slides.length]);

  if (!slides.length) {
    return (
      <div
        className="relative h-[60vh] md:h-[80vh] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1a0a0e 0%, #3d0b15 50%, #6b1a2a 100%)",
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4" style={{ color: "#e6c97a" }}>
            Priyaa Jewellery
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Handcrafted jewellery for every occasion
          </p>
          <Link href="/shop" className="btn-gold text-base px-8 py-3">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div
      ref={containerRef}
      className="relative h-[60vh] md:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 hero-slide-${i}`}
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={s.imageUrl}
            alt={s.title ?? "Priya Jewellery"}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(26,10,14,0.75) 0%, rgba(26,10,14,0.3) 60%, transparent 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div className="max-w-xl hero-text-block">
            {/* Gold accent line */}
            <div
              className="w-16 h-0.5 mb-5 hero-accent-line"
              style={{ background: "#c9a84c" }}
            />

            {slide.title && (
              <h1
                className="font-serif text-4xl md:text-6xl font-bold text-white mb-3 leading-tight hero-title"
              >
                {slide.title}
              </h1>
            )}

            {slide.subtitle && (
              <p className="text-lg md:text-xl text-gray-200 mb-7 hero-subtitle">
                {slide.subtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-3 hero-actions">
              {slide.ctaLink && slide.ctaText && (
                <Link
                  href={slide.ctaLink}
                  className="btn-gold text-base px-7 py-3"
                  id={`hero-cta-${slide.id}`}
                >
                  {slide.ctaText}
                </Link>
              )}
              <Link
                href="/shop"
                className="btn-outline-gold text-base px-7 py-3"
                id="hero-shop-all"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (hidden on mobile) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
            aria-label="Previous slide"
            id="hero-prev"
          >
            <ChevronLeft className="text-white" size={20} />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
            aria-label="Next slide"
            id="hero-next"
          >
            <ChevronRight className="text-white" size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? "#c9a84c" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
