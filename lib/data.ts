import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export interface ProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  manufacturer?: string;
  prescriptionRequired?: boolean;
  discount?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "popularity" | "discount";
  page?: number;
  limit?: number;
}

export async function getProducts(filters: ProductFilters = {}) {
  await connectDB();

  const query: Record<string, unknown> = { status: "active" };

  if (filters.q) {
    query.$text = { $search: filters.q };
  }
  if (filters.category) {
    const cat = await Category.findOne({ slug: filters.category });
    if (cat) query.category = cat._id;
  }
  if (filters.brand) query.brand = filters.brand;
  if (filters.manufacturer) query.manufacturer = filters.manufacturer;
  if (filters.prescriptionRequired !== undefined) query.prescriptionRequired = filters.prescriptionRequired;
  if (filters.discount) query.discountPercent = { $gt: 0 };
  if (filters.minPrice || filters.maxPrice) {
    query.sellingPrice = {
      ...(filters.minPrice ? { $gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { $lte: filters.maxPrice } : {}),
    };
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  if (filters.sort === "price_asc") sort = { sellingPrice: 1 };
  if (filters.sort === "price_desc") sort = { sellingPrice: -1 };
  if (filters.sort === "newest") sort = { createdAt: -1 };
  if (filters.sort === "popularity") sort = { reviewCount: -1 };
  if (filters.sort === "discount") sort = { discountPercent: -1 };

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 24;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return { products: JSON.parse(JSON.stringify(products)), total, page, pages: Math.ceil(total / limit) };
}

export async function getFeaturedProducts(limit = 8) {
  await connectDB();
  const products = await Product.find({ status: "active" })
    .populate("category", "name slug")
    .sort({ reviewCount: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, status: "active" }).populate("category", "name slug").lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  await connectDB();
  const products = await Product.find({ category: categoryId, _id: { $ne: excludeId }, status: "active" })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getCategories() {
  await connectDB();
  const categories = await Category.find({ status: "active" }).lean();
  return JSON.parse(JSON.stringify(categories));
}
