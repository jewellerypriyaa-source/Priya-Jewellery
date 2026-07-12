"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });

      if (!res.ok) throw new Error("Submission failed");

      toast.success("Thank you! We will contact you soon.");
      setName("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again or chat on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          className="input-field w-full text-base"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number / WhatsApp
        </label>
        <input
          type="tel"
          id="contact-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +91 9999999999"
          required
          className="input-field w-full text-base"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full text-base py-3 font-semibold"
      >
        {loading ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
