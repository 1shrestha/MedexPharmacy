"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ProductType } from "@/types";
import toast from "react-hot-toast";

export function ProductCard({ product }: { product: ProductType }) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stockQuantity <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] ?? "/images/placeholder-product.png",
      price: product.sellingPrice,
      mrp: product.mrp,
      quantity: 1,
      stockQuantity: product.stockQuantity,
      prescriptionRequired: product.prescriptionRequired,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border border-medex-border rounded-2xl p-3 card-shadow hover:shadow-md transition-shadow bg-white flex flex-col"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-medex-pista mb-3">
        <Image
          src={product.images?.[0] ?? "/images/placeholder-product.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        {product.discountPercent ? (
          <Badge variant="pink" className="absolute top-2 left-2">
            {product.discountPercent}% OFF
          </Badge>
        ) : null}
        {product.prescriptionRequired && (
          <Badge variant="warning" className="absolute top-2 right-2">
            Rx Required
          </Badge>
        )}
      </div>

      <p className="text-[11px] text-gray-500 truncate">{product.manufacturer || product.brand}</p>
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{product.name}</h3>

      {product.rating ? (
        <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
          <span className="text-gray-400">({product.reviewCount ?? 0})</span>
        </div>
      ) : null}

      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-medex-primary-dark">{formatINR(product.sellingPrice)}</span>
        {product.mrp > product.sellingPrice && (
          <span className="text-xs text-gray-400 line-through">{formatINR(product.mrp)}</span>
        )}
      </div>

      <Button
        size="sm"
        onClick={handleAdd}
        disabled={outOfStock}
        className="mt-auto w-full"
        variant={outOfStock ? "outline" : "primary"}
      >
        <ShoppingCart className="w-4 h-4" />
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </Link>
  );
}
