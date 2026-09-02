"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort");

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Category</h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => updateParam("category", null)}
              className={`hover:text-medex-primary ${!activeCategory ? "text-medex-primary font-medium" : "text-gray-600"}`}
            >
              All Categories
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => updateParam("category", c.slug)}
                className={`hover:text-medex-primary ${activeCategory === c.slug ? "text-medex-primary font-medium" : "text-gray-600"}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Prescription</h3>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={searchParams.get("prescriptionRequired") === "false"}
            onChange={(e) => updateParam("prescriptionRequired", e.target.checked ? "false" : null)}
          />
          No prescription needed
        </label>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Discount</h3>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={searchParams.get("discount") === "true"}
            onChange={(e) => updateParam("discount", e.target.checked ? "true" : null)}
          />
          On offer
        </label>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-gray-800 mb-3">Sort By</h3>
        <select
          value={activeSort ?? ""}
          onChange={(e) => updateParam("sort", e.target.value || null)}
          className="w-full border border-medex-border rounded-lg px-2 py-1.5 text-sm"
        >
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="discount">Discount</option>
        </select>
      </div>
    </aside>
  );
}
