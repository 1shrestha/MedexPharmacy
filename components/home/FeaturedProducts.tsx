import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/lib/data";
import { ProductType } from "@/types";

export async function FeaturedProducts() {
  let products: ProductType[] = [];
  try {
    products = await getFeaturedProducts(8);
  } catch {
    products = [];
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Featured Products</h2>
        <Link href="/products" className="text-sm font-medium text-medex-primary hover:underline">
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-sm bg-medex-pista rounded-xl p-6 text-center">
          No products found. Run the seed script to load demo products — see README.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
