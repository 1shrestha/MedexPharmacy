"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { IndianRupee, ShoppingCart, Clock, CheckCircle2, XCircle, Users, AlertTriangle, FileText } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface Stats {
  totalSales: number;
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  lowStockProducts: { _id: string; name: string; stockQuantity: number }[];
  pendingPrescriptions: number;
  dailySales: { _id: string; total: number; orders: number }[];
  topProducts: { _id: string; qty: number; revenue: number }[];
}

const CARD_ICONS = [
  { key: "totalSales", label: "Total Sales", icon: IndianRupee, format: formatINR },
  { key: "todaySales", label: "Today's Sales", icon: IndianRupee, format: formatINR },
  { key: "totalOrders", label: "Total Orders", icon: ShoppingCart, format: (n: number) => n },
  { key: "pendingOrders", label: "Pending Orders", icon: Clock, format: (n: number) => n },
  { key: "deliveredOrders", label: "Delivered", icon: CheckCircle2, format: (n: number) => n },
  { key: "cancelledOrders", label: "Cancelled", icon: XCircle, format: (n: number) => n },
  { key: "totalCustomers", label: "Customers", icon: Users, format: (n: number) => n },
  { key: "pendingPrescriptions", label: "Pending Prescriptions", icon: FileText, format: (n: number) => n },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => (data.error ? setError(data.error) : setStats(data)))
      .catch(() => setError("Failed to load dashboard. Make sure MongoDB is connected."));
  }, []);

  if (error) return <p className="text-sm text-red-500 bg-red-50 rounded-xl p-4">{error}</p>;
  if (!stats) return <p className="text-sm text-gray-400">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARD_ICONS.map((c) => (
          <div key={c.key} className="border border-medex-border rounded-xl p-4">
            <c.icon className="w-5 h-5 text-medex-primary mb-2" />
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-lg font-bold text-gray-800">{c.format(stats[c.key] as number)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-medex-border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Daily Sales (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.dailySales}>
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatINR(Number(v))} />
              <Line type="monotone" dataKey="total" stroke="#0f7a5c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-medex-border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Top-Selling Products</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.topProducts}>
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="qty" fill="#ec6f95" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Low Stock Warning
          </h2>
          <ul className="space-y-1 text-sm text-amber-700">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id}>{p.name} — Only {p.stockQuantity} units remaining</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
