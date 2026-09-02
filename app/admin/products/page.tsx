"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { ProductType } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/products?limit=100${q ? `&q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDeactivate(id: string, name: string) {
    if (!confirm(`Deactivate "${name}"? It will be hidden from the storefront.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deactivated");
      load();
    } else {
      toast.error("Failed to deactivate product");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm"><Plus className="w-4 h-4" /> Add Product</Button>
        </Link>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); load(); }}
        className="flex items-center gap-2 bg-medex-pista rounded-full px-4 py-2 max-w-sm"
      >
        <Search className="w-4 h-4 text-medex-primary" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="bg-transparent outline-none text-sm flex-1" />
      </form>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500 bg-medex-pista rounded-xl p-6 text-center">
          No products yet. Add your first product, or run the seed script for demo data.
        </p>
      ) : (
        <div className="overflow-x-auto border border-medex-border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-medex-pista text-left text-xs text-gray-600">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Rx</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-medex-border">
                  <td className="p-3 flex items-center gap-2 min-w-[200px]">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-medex-pista shrink-0">
                      <Image src={p.images?.[0] ?? "/images/placeholder-product.png"} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="line-clamp-2">{p.name}</span>
                  </td>
                  <td className="p-3 text-gray-500">{p.sku}</td>
                  <td className="p-3">{formatINR(p.sellingPrice)}</td>
                  <td className="p-3">
                    <span className={p.stockQuantity <= 10 ? "text-red-500 font-medium" : ""}>{p.stockQuantity}</span>
                  </td>
                  <td className="p-3">{p.prescriptionRequired ? <Badge variant="warning">Rx</Badge> : "—"}</td>
                  <td className="p-3"><Badge variant={p.status === "active" ? "success" : "outline"}>{p.status}</Badge></td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p._id}/edit`} className="text-medex-primary hover:opacity-70"><Pencil className="w-4 h-4" /></Link>
                      <button onClick={() => handleDeactivate(p._id, p.name)} className="text-red-500 hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
