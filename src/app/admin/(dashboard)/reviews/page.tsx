"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  status: string;
  createdAt: string;
  product: {
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?status=${statusFilter}`);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Review ${newStatus.toLowerCase()}`);
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      toast.success("Review deleted");
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
          Product Reviews
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Moderate review submissions from customers before they are published
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        {[
          { id: "PENDING", label: "Pending Approval" },
          { id: "APPROVED", label: "Approved" },
          { id: "REJECTED", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className="px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all"
            style={{
              color: statusFilter === tab.id ? "#3d0b15" : "#9ca3af",
              borderColor: statusFilter === tab.id ? "#c9a84c" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-gold-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-xl p-8">
          <p className="text-gray-500 text-sm">No reviews found in this folder.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold-100 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800 text-sm">{rev.customerName}</span>
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? "currentColor" : "transparent"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed italic">"{rev.text}"</p>

                <div className="text-xs text-gray-500">
                  Reviewing:{" "}
                  <a
                    href={`/product/${rev.product.slug}`}
                    target="_blank"
                    className="font-semibold hover:underline"
                    style={{ color: "#a07830" }}
                  >
                    {rev.product.name}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 self-end md:self-center">
                {statusFilter === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleModerate(rev.id, "APPROVED")}
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-200"
                      title="Approve review"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleModerate(rev.id, "REJECTED")}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-200"
                      title="Reject review"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}

                {statusFilter === "APPROVED" && (
                  <button
                    onClick={() => handleModerate(rev.id, "REJECTED")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    Move to Rejected
                  </button>
                )}

                {statusFilter === "REJECTED" && (
                  <button
                    onClick={() => handleModerate(rev.id, "APPROVED")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                  >
                    Approve Review
                  </button>
                )}

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
