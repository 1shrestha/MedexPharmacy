"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";

interface CategoryOption { _id: string; name: string }

export interface ProductFormValues {
  name: string;
  genericName: string;
  brand: string;
  manufacturer: string;
  category: string;
  description: string;
  composition: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  stockQuantity: number;
  sku: string;
  images: string;
  prescriptionRequired: boolean;
  ageRestriction: string;
  storageInstructions: string;
  usageInformation: string;
  sideEffects: string;
  batchNumber: string;
  expiryDate: string;
  status: string;
}

const EMPTY: ProductFormValues = {
  name: "", genericName: "", brand: "", manufacturer: "", category: "", description: "",
  composition: "", strength: "", dosageForm: "Tablet", packSize: "", mrp: 0, sellingPrice: 0,
  discountPercent: 0, stockQuantity: 0, sku: "", images: "", prescriptionRequired: false,
  ageRestriction: "", storageInstructions: "", usageInformation: "", sideEffects: "",
  batchNumber: "", expiryDate: "", status: "active",
};

export function ProductForm({
  initialValues,
  productId,
}: {
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({ ...EMPTY, ...initialValues });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      slug: slugify(form.name),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      expiryDate: form.expiryDate || undefined,
    };

    try {
      const res = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to save product");
        setSaving(false);
        return;
      }
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
    } catch {
      toast.error("Something went wrong");
      setSaving(false);
    }
  }

  const inputClass = "w-full border border-medex-border rounded-lg px-3 py-2 text-sm";
  const labelClass = "text-xs font-medium text-gray-600 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={labelClass}>Product Name *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Generic Name</label><input value={form.genericName} onChange={(e) => update("genericName", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Brand</label><input value={form.brand} onChange={(e) => update("brand", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Manufacturer</label><input value={form.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} className={inputClass} /></div>
        <div>
          <label className={labelClass}>Category *</label>
          <select required value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Dosage Form</label>
          <select value={form.dosageForm} onChange={(e) => update("dosageForm", e.target.value)} className={inputClass}>
            {["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Powder", "Device", "Other"].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div><label className={labelClass}>Strength</label><input value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="e.g. 500mg" className={inputClass} /></div>
        <div><label className={labelClass}>Pack Size</label><input value={form.packSize} onChange={(e) => update("packSize", e.target.value)} placeholder="e.g. 10 tablets" className={inputClass} /></div>
        <div><label className={labelClass}>SKU *</label><input required value={form.sku} onChange={(e) => update("sku", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Batch Number</label><input value={form.batchNumber} onChange={(e) => update("batchNumber", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Expiry Date</label><input type="date" value={form.expiryDate?.slice(0, 10) ?? ""} onChange={(e) => update("expiryDate", e.target.value)} className={inputClass} /></div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className={labelClass}>MRP (₹) *</label><input required type="number" min={0} value={form.mrp} onChange={(e) => update("mrp", Number(e.target.value))} className={inputClass} /></div>
        <div><label className={labelClass}>Selling Price (₹) *</label><input required type="number" min={0} value={form.sellingPrice} onChange={(e) => update("sellingPrice", Number(e.target.value))} className={inputClass} /></div>
        <div><label className={labelClass}>Discount %</label><input type="number" min={0} max={100} value={form.discountPercent} onChange={(e) => update("discountPercent", Number(e.target.value))} className={inputClass} /></div>
        <div><label className={labelClass}>Stock Quantity *</label><input required type="number" min={0} value={form.stockQuantity} onChange={(e) => update("stockQuantity", Number(e.target.value))} className={inputClass} /></div>
      </section>

      <section>
        <label className={labelClass}>Image URLs (comma-separated)</label>
        <input value={form.images} onChange={(e) => update("images", e.target.value)} placeholder="https://... , https://..." className={inputClass} />
        <p className="text-xs text-gray-400 mt-1">Upload images to Cloudinary and paste the URLs here, or leave blank to use the placeholder image.</p>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <div><label className={labelClass}>Description</label><textarea rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Composition</label><textarea rows={2} value={form.composition} onChange={(e) => update("composition", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Usage Information</label><textarea rows={2} value={form.usageInformation} onChange={(e) => update("usageInformation", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Side Effects</label><textarea rows={2} value={form.sideEffects} onChange={(e) => update("sideEffects", e.target.value)} className={inputClass} /></div>
        <div><label className={labelClass}>Storage Instructions</label><textarea rows={2} value={form.storageInstructions} onChange={(e) => update("storageInstructions", e.target.value)} className={inputClass} /></div>
      </section>

      <section className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.prescriptionRequired} onChange={(e) => update("prescriptionRequired", e.target.checked)} />
          Prescription Required
        </label>
        <div className="flex items-center gap-2 text-sm">
          <label className={labelClass}>Age Restriction</label>
          <input value={form.ageRestriction} onChange={(e) => update("ageRestriction", e.target.value)} placeholder="e.g. 18+" className="border border-medex-border rounded-lg px-3 py-1.5 text-sm" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label>Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)} className="border border-medex-border rounded-lg px-3 py-1.5 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      <Button type="submit" disabled={saving}>{saving ? "Saving..." : productId ? "Update Product" : "Create Product"}</Button>
    </form>
  );
}
