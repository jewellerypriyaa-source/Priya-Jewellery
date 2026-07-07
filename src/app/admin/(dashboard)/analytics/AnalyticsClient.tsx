"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Eye, MessageSquare, Heart, TrendingUp, Award } from "lucide-react";

interface AnalyticsClientProps {
  summary: {
    views: number;
    clicks: number;
    wishlists: number;
  };
  timelineData: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
  topProducts: Array<{
    name: string;
    views: number;
    clicks: number;
  }>;
}

export default function AnalyticsClient({ summary, timelineData, topProducts }: AnalyticsClientProps) {
  // Compute basic conversion rate
  const conversionRate = summary.views > 0 ? ((summary.clicks / summary.views) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Page Views</p>
            <p className="text-2xl font-bold text-gray-800">{summary.views}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-50 text-green-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">WhatsApp Clicks</p>
            <p className="text-2xl font-bold text-gray-800">{summary.clicks}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-50 text-red-600">
            <Heart size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Wishlist Adds</p>
            <p className="text-2xl font-bold text-gray-800">{summary.wishlists}</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gold-50 text-gold-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-800">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-white border p-5 rounded-xl shadow-sm space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-800">Traffic Timeline</h3>
            <p className="text-gray-500 text-xs mt-0.5">Daily page views and WhatsApp clicks conversions</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="WA Clicks"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="lg:col-span-1 bg-white border p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="text-gold-600" size={20} />
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Product Performance</h3>
              <p className="text-gray-500 text-xs mt-0.5">Top products by total WhatsApp inquiries</p>
            </div>
          </div>

          {topProducts.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-xs">
              No performance data yet.
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700 truncate max-w-[200px]">{p.name}</span>
                    <span className="text-green-600 font-bold">{p.clicks} clicks</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (p.clicks / Math.max(1, topProducts[0]?.clicks || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block">{p.views} total page views</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
