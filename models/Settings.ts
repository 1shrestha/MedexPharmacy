import { Schema, models, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    key: { type: String, default: "store_settings", unique: true },
    storeName: String,
    address: String,
    phone: String,
    email: String,
    whatsapp: String,
    upiId: String,
    servicablePincodes: [{ type: String }],
    deliveryRadiusKm: { type: Number, default: 20 },
    freeDeliveryThreshold: { type: Number, default: 499 },
    standardDeliveryCharge: { type: Number, default: 40 },
    codAvailable: { type: String, enum: ["yes", "no", "conditional"], default: "conditional" },
    storePickupAvailable: { type: Boolean, default: true },
    openingHours: String,
  },
  { timestamps: true }
);

export default models.Settings || model("Settings", SettingsSchema);
