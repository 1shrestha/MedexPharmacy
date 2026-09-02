import { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true },
    prescriptionRequired: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    address: {
      name: String,
      mobile: String,
      house: String,
      street: String,
      locality: String,
      city: String,
      state: String,
      pincode: String,
      label: String,
    },
    deliveryMethod: { type: String, enum: ["local_delivery", "store_pickup"], default: "local_delivery" },
    subtotal: Number,
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    couponCode: String,
    total: Number,
    paymentMethod: { type: String, enum: ["razorpay", "cod", "upi_qr"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    prescription: { type: Schema.Types.ObjectId, ref: "Prescription" },
    status: {
      type: String,
      enum: [
        "Order Placed",
        "Payment Confirmed",
        "Prescription Verification",
        "Order Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Order Placed",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
    estimatedDelivery: String,
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
