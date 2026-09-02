import mongoose, { Schema, models, model } from "mongoose";

const AddressSchema = new Schema(
  {
    label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
    name: String,
    mobile: String,
    house: String,
    street: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // absent for Google-only accounts
    phone: { type: String },
    image: { type: String },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export default models.User || model("User", UserSchema);
