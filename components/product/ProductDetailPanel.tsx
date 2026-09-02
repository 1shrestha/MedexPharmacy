"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ProductType } from "@/types";
import toast from "react-hot-toast";

export function ProductDetailPanel({ product }: { product: ProductType }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stockQuantity <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] ?? "/images/placeholder-product.png",
      price: product.sellingPrice,
      mrp: product.mrp,
      quantity: qty,
      stockQuantity: product.stockQuantity,
      prescriptionRequired: product.prescriptionRequired,
    });
    toast.success(`${qty} × ${product.name} added to cart`);
  }

  async function handleWishlist() {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      if (res.status === 401) {
        toast.error("Please log in to save to your wishlist.");
        return;
      }
      toast.success("Added to wishlist");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-500">{product.manufacturer || product.brand}</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-1">{product.name}</h1>
      {product.genericName && <p className="text-sm text-gray-500 mt-0.5">Generic: {product.genericName}</p>}

      <div className="flex items-center gap-2 mt-2">
        {product.prescriptionRequired && <Badge variant="warning">Prescription Required</Badge>}
        {product.discountPercent ? <Badge variant="pink">{product.discountPercent}% OFF</Badge> : null}
        {product.rating ? (
          <span className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)} ({product.reviewCount ?? 0})
          </span>
        ) : null}
      </div>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-3xl font-bold text-medex-primary-dark">{formatINR(product.sellingPrice)}</span>
        {product.mrp > product.sellingPrice && (
          <span className="text-gray-400 line-through">{formatINR(product.mrp)}</span>
        )}
      </div>
      {product.packSize && <p className="text-sm text-gray-500 mt-1">Pack size: {product.packSize}</p>}

      <p className={`text-sm mt-3 font-medium ${outOfStock ? "text-red-500" : "text-green-600"}`}>
        {outOfStock ? "Out of stock" : `In stock (${product.stockQuantity} available)`}
      </p>

      <div className="flex items-center gap-4 mt-5">
        <div className="flex items-center border border-medex-border rounded-full">
          <button className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            className="p-2.5"
            onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <Button onClick={handleAdd} disabled={outOfStock} className="flex-1">
          <ShoppingCart className="w-4 h-4" /> {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button onClick={handleWishlist} variant="outline" className="!rounded-full !p-2.5" aria-label="Add to wishlist">
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {product.prescriptionRequired && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          This is a prescription-only medicine. You&apos;ll need to upload a valid prescription during checkout before
          this order can be confirmed.
        </p>
      )}
    </div>
  );
}
