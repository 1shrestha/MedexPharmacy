import { Schema, models, model } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "pdf"], required: true },
    notes: String,
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected", "Expired"],
      default: "Pending",
    },
    adminNotes: String,
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

export default models.Prescription || model("Prescription", PrescriptionSchema);
