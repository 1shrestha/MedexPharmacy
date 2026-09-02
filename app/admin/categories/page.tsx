"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Category {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      toast.success("Category added");
      setName("");
      load();
    } else {
      toast.error("Failed to add category");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-2 max-w-sm">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 border border-medex-border rounded-lg px-3 py-2 text-sm" />
        <Button type="submit"><Plus className="w-4 h-4" /> Add</Button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge key={c._id} variant={c.status === "active" ? "default" : "outline"}>{c.name}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
