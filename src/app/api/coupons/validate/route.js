import connectDB from "@/lib/db/connect";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

// POST /api/coupons/validate  { code, orderAmount, shippingCharge? }
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const code          = (body.code || "").trim().toUpperCase();
    const orderAmount   = Number(body.orderAmount)   || 0;
    const shippingCharge = Number(body.shippingCharge) || 60;

    if (!code) return errorResponse("Please enter a coupon code", 422);

    // Resolve authenticated user (optional)
    let userId = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("user_token")?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload.type === "user") userId = payload.userId;
      }
    } catch {}

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return errorResponse("Invalid coupon code", 404);

    // ── Validity checks ─────────────────────────────────────────────────────
    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now)
      return errorResponse("This coupon has expired", 400);
    if (coupon.validFrom && coupon.validFrom > now)
      return errorResponse("This coupon is not active yet", 400);
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return errorResponse("This coupon has reached its usage limit", 400);
    if (orderAmount < coupon.minOrderAmount)
      return errorResponse(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
    if (coupon.onePerUser && userId && coupon.usedBy.map(id => id.toString()).includes(userId))
      return errorResponse("You have already used this coupon", 400);

    // ── first_order: user must have 0 previous orders ────────────────────────
    if (coupon.couponType === "first_order" && userId) {
      const prevOrders = await Order.countDocuments({ user: userId });
      if (prevOrders > 0)
        return errorResponse("This coupon is only for first-time orders", 400);
    }

    // ── Calculate discount by type ───────────────────────────────────────────
    let discount       = 0;
    let shippingWaived = false;
    let label          = "";

    switch (coupon.couponType) {
      case "percentage": {
        discount = Math.round((orderAmount * coupon.discountValue) / 100);
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        label = `${coupon.discountValue}% off`;
        break;
      }
      case "flat": {
        discount = Math.min(coupon.discountValue, orderAmount);
        label = `₹${coupon.discountValue} off`;
        break;
      }
      case "free_shipping": {
        discount       = shippingCharge; // discount equals entire shipping charge
        shippingWaived = true;
        label          = "Free shipping";
        break;
      }
      case "bxgy": {
        // Spend minOrderAmount → get discountValue% off
        discount = Math.round((orderAmount * coupon.discountValue) / 100);
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        label = `${coupon.discountValue}% off on orders above ₹${coupon.minOrderAmount}`;
        break;
      }
      case "first_order": {
        if (coupon.firstOrderDiscountKind === "percentage") {
          discount = Math.round((orderAmount * coupon.discountValue) / 100);
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
          label = `${coupon.discountValue}% off (first order)`;
        } else {
          discount = Math.min(coupon.discountValue, orderAmount);
          label = `₹${coupon.discountValue} off (first order)`;
        }
        break;
      }
    }

    return successResponse({
      code:          coupon.code,
      description:   coupon.description || label,
      couponType:    coupon.couponType,
      discountValue: coupon.discountValue,
      discount,
      shippingWaived,
      message: `Coupon applied! You save ₹${discount}${shippingWaived && discount > 0 ? " (free shipping)" : shippingWaived ? " (free shipping)" : ""}`,
    });
  } catch (err) {
    console.error("[coupon/validate]", err);
    return errorResponse("Failed to validate coupon", 500);
  }
}
