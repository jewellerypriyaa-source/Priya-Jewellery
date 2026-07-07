"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

interface Lead {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load leads list");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return toast.error("No leads to export");

    const headers = ["Name", "Phone Number", "Joined Date"];
    const rows = leads.map((l) => [
      l.name,
      l.phone,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `priya_jewellery_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded!");
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: "#3d0b15" }}>
            WhatsApp & Newsletter Leads
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            View customer opt-in leads for WhatsApp broadcasts and newsletters
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="btn-maroon flex items-center gap-2 text-sm px-5 py-2.5 self-start sm:self-auto disabled:opacity-50"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gold-50 text-gold-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Leads</p>
            <p className="text-2xl font-bold text-gray-800">{leads.length}</p>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gold-600" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl p-8">
            <p className="text-gray-500 text-sm">No opt-in leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-gray-800">{lead.name}</td>
                    <td className="px-6 py-3.5 text-gray-600 font-mono">{lead.phone}</td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
