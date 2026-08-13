import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    title:   { type: String, trim: true, default: "" },
    body:    { type: String, trim: true, default: "" },

    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
    adminReply: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per user per product per order
ReviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
