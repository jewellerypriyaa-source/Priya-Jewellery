"use client";

import { useEffect, useState } from "react";

interface SaleCountdownProps {
  endTime: string; // ISO datetime string
  message: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(endTime: string): TimeLeft | null {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function SaleCountdown({ endTime, message }: SaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft(endTime));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft || dismissed) return null;

  return (
    <div
      className="py-3 px-4 text-white text-center"
      style={{
        background: "linear-gradient(90deg, #c9a84c, #a07830, #c9a84c)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s infinite",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center flex-wrap gap-3 text-sm">
        <span className="font-semibold" style={{ color: "#1a0a0e" }}>
          🔥 {message}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="countdown-digit" style={{ color: "#1a0a0e", background: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>
            {String(timeLeft.days).padStart(2, "0")}d
          </div>
          <span style={{ color: "#1a0a0e", fontWeight: "bold" }}>:</span>
          <div className="countdown-digit" style={{ color: "#1a0a0e", background: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>
            {String(timeLeft.hours).padStart(2, "0")}h
          </div>
          <span style={{ color: "#1a0a0e", fontWeight: "bold" }}>:</span>
          <div className="countdown-digit" style={{ color: "#1a0a0e", background: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>
            {String(timeLeft.minutes).padStart(2, "0")}m
          </div>
          <span style={{ color: "#1a0a0e", fontWeight: "bold" }}>:</span>
          <div className="countdown-digit" style={{ color: "#1a0a0e", background: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>
            {String(timeLeft.seconds).padStart(2, "0")}s
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "#1a0a0e" }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
