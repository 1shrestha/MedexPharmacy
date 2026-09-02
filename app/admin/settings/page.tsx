"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface SettingsForm {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  upiId: string;
  servicablePincodes: string;
  deliveryRadiusKm: number;
  freeDeliveryThreshold: number;
  standardDeliveryCharge: number;
  codAvailable: string;
  storePickupAvailable: boolean;
  openingHours: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((s) => setForm({ ...s, servicablePincodes: (s.servicablePincodes ?? []).join(", ") }));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        servicablePincodes: form.servicablePincodes.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save settings");
  }

  if (!form) return <p className="text-sm text-gray-400">Loading...</p>;

  const inputClass = "w-full border border-medex-border rounded-lg px-3 py-2 text-sm";
  const labelClass = "text-xs font-medium text-gray-600 mb-1 block";

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Admin Settings</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div><label className={labelClass}>Store Name</label><input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>WhatsApp Number</label><input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Support Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>UPI ID (for QR payments)</label><input value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>Opening Hours</label><input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className={inputClass} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>Delivery Radius (km)</label><input type="number" value={form.deliveryRadiusKm} onChange={(e) => setForm({ ...form, deliveryRadiusKm: Number(e.target.value) })} className={inputClass} /></div>
          <div><label className={labelClass}>Standard Delivery Charge (₹)</label><input type="number" value={form.standardDeliveryCharge} onChange={(e) => setForm({ ...form, standardDeliveryCharge: Number(e.target.value) })} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Free Delivery Threshold (₹)</label><input type="number" value={form.freeDeliveryThreshold} onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })} className={inputClass} /></div>

        <div>
          <label className={labelClass}>Serviceable PIN Codes (comma-separated)</label>
          <input value={form.servicablePincodes} onChange={(e) => setForm({ ...form, servicablePincodes: e.target.value })} placeholder="208020, 208017, ..." className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Leave blank to accept any PIN starting with 208 (Kanpur Nagar) by default.</p>
        </div>

        <div>
          <label className={labelClass}>Cash on Delivery</label>
          <select value={form.codAvailable} onChange={(e) => setForm({ ...form, codAvailable: e.target.value })} className={inputClass}>
            <option value="yes">Always Available</option>
            <option value="no">Not Available</option>
            <option value="conditional">Conditional (staff confirms per order)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.storePickupAvailable} onChange={(e) => setForm({ ...form, storePickupAvailable: e.target.checked })} />
          Store Pickup Available
        </label>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </form>
    </div>
  );
}
