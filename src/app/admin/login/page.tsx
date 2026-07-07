"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #1a0a0e 0%, #3d0b15 50%, #6b1a2a 100%)",
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="font-serif text-2xl font-bold mb-1"
            style={{ color: "#6b1a2a" }}
          >
            Priya Jewellery
          </div>
          <div
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "#c9a84c" }}
          >
            Admin Dashboard
          </div>
          <div
            className="w-12 h-0.5 mx-auto mt-3"
            style={{ background: "#c9a84c" }}
          />
        </div>

        <h1 className="text-xl font-semibold text-center mb-6" style={{ color: "#1a0a0e" }}>
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#3d0b15" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@priyajewellery.com"
                required
                autoComplete="email"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "#3d0b15" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="input-field pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all mt-2"
            style={{
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #6b1a2a, #3d0b15)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            id="admin-login-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Forgot password? Reset it via the database seed script.
          <br />
          See README for instructions.
        </p>
      </div>
    </div>
  );
}
