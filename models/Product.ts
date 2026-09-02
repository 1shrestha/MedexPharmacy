import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    genericName: String,
    brand: String,
    manufacturer: String,
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: String,
    composition: String,
    strength: String,
    dosageForm: {
      type: String,
      enum: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Powder", "Device", "Other"],
      default: "Tablet",
    },
    packSize: String,
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String }],
    prescriptionRequired: { type: Boolean, default: false },
    ageRestriction: String,
    storageInstructions: String,
    usageInformation: String,
    sideEffects: String,
    batchNumber: String,
    expiryDate: Date,
    stockInDate: Date,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDemo: { type: Boolean, default: true }, // seed/demo data flag — never implies real stock
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", genericName: "text", brand: "text", manufacturer: "text", sku: "text" });

export default models.Product || model("Product", ProductSchema);
