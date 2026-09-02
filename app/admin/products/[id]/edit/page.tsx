"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [values, setValues] = useState<Partial<ProductFormValues> | null>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setValues({
          ...p,
          category: typeof p.category === "object" ? p.category._id : p.category,
          images: (p.images ?? []).join(", "),
          expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().slice(0, 10) : "",
        });
      });
  }, [id]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Product</h1>
      {values ? <ProductForm initialValues={values} productId={id} /> : <p className="text-sm text-gray-400">Loading...</p>}
    </div>
  );
}
