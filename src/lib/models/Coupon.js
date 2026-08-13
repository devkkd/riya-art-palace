import mongoose from "mongoose";

/**
 * Coupon Types:
 *  - percentage   → discountValue% off subtotal (optional maxDiscount cap)
 *  - flat         → flat ₹discountValue off
 *  - free_shipping → waives shipping charge entirely
 *  - bxgy         → spend minOrderAmount, get discountValue% off   (Buy X Get Y)
 *  - first_order  → only valid for user's first order (percentage or flat via discountType2)
 */

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: "" },

    // Coupon type
    couponType: {
      type: String,
      enum: ["percentage", "flat", "free_shipping", "bxgy", "first_order"],
      required: true,
      default: "percentage",
    },

    // Discount value — interpretation depends on couponType:
    //   percentage / bxgy / first_order(percent) → % value (0-100)
    //   flat / first_order(flat)                 → ₹ value
    //   free_shipping                            → ignored
    discountValue: { type: Number, required: true, min: 0, default: 0 },

    // For first_order: whether the discount is % or flat
    firstOrderDiscountKind: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },

    // Constraints
    minOrderAmount: { type: Number, default: 0 },   // min cart value to unlock
    maxDiscount:    { type: Number, default: null }, // cap for % coupons (null = uncapped)

    // Validity window
    validFrom:  { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },

    // Usage limits
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount:  { type: Number, default: 0 },
    usedBy:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    onePerUser: { type: Boolean, default: true },

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
