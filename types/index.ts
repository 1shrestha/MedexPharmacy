export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  genericName?: string;
  brand?: string;
  manufacturer?: string;
  category: { _id: string; name: string; slug: string } | string;
  description?: string;
  composition?: string;
  strength?: string;
  dosageForm?: string;
  packSize?: string;
  mrp: number;
  sellingPrice: number;
  discountPercent?: number;
  stockQuantity: number;
  sku: string;
  images: string[];
  prescriptionRequired: boolean;
  ageRestriction?: string;
  storageInstructions?: string;
  usageInformation?: string;
  sideEffects?: string;
  rating?: number;
  reviewCount?: number;
  status: "active" | "inactive";
  isDemo?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  stockQuantity: number;
  prescriptionRequired: boolean;
}

export interface AddressType {
  _id?: string;
  label: "Home" | "Work" | "Other";
  name: string;
  mobile: string;
  house: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "Order Placed"
  | "Payment Confirmed"
  | "Prescription Verification"
  | "Order Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";
