"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: string;
}

const EMPTY: {
  code: string; discountType: "percentage" | "fixed"; discountValue: number;
  minOrderValue: number; maxDiscount: number; expiryDate: string; usageLimit: number;
} = {
  code: "", discountType: "percentage", discountValue: 10, minOrderValue: 0,
  maxDiscount: 0, expiryDate: "", usageLimit: 100,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to create coupon");
      return;
    }
    toast.success("Coupon created");
    setForm(EMPTY);
    setShowForm(false);
    load();
  }

  async function toggleStatus(id: string, current: string) {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: current === "active" ? "inactive" : "active" }),
    });
    if (res.ok) { toast.success("Coupon updated"); load(); }
  }

  const inputClass = "border border-medex-border rounded-lg px-3 py-2 text-sm w-full";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}><Plus className="w-4 h-4" /> New Coupon</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-medex-border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <input required placeholder="CODE (e.g. MEDICINE10)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputClass} />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })} className={inputClass}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input required type="number" placeholder="Discount Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className={inputClass} />
          <input type="number" placeholder="Min Order Value" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} className={inputClass} />
          <input type="number" placeholder="Max Discount (optional)" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} className={inputClass} />
          <input required type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className={inputClass} />
          <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className={inputClass} />
          <Button type="submit" className="col-span-2 sm:col-span-1">Create</Button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-gray-500 bg-medex-pista rounded-xl p-6 text-center">No coupons yet.</p>
      ) : (
        <div className="overflow-x-auto border border-medex-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-medex-pista text-left text-xs text-gray-600">
              <tr>
                <th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Min Order</th>
                <th className="p-3">Expiry</th><th className="p-3">Usage</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-medex-border">
                  <td className="p-3 font-mono font-medium">{c.code}</td>
                  <td className="p-3">{c.discountType === "percentage" ? `${c.discountValue}%` : formatINR(c.discountValue)}</td>
                  <td className="p-3">{formatINR(c.minOrderValue)}</td>
                  <td className="p-3">{new Date(c.expiryDate).toLocaleDateString("en-IN")}</td>
                  <td className="p-3">{c.usedCount} / {c.usageLimit}</td>
                  <td className="p-3">
                    <button onClick={() => toggleStatus(c._id, c.status)}>
                      <Badge variant={c.status === "active" ? "success" : "outline"}>{c.status}</Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
