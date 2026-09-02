import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Add Product</h1>
      <ProductForm />
    </div>
  );
}
