import connectDB from "@/lib/db/connect";
import Coupon from "@/lib/models/Coupon";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

async function adminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.adminId ? payload : null;
  } catch { return null; }
}

function formatCoupon(c) {
  return {
    id: c._id.toString(),
    code: c.code,
    description: c.description,
    couponType: c.couponType,
    discountValue: c.discountValue,
    firstOrderDiscountKind: c.firstOrderDiscountKind,
    minOrderAmount: c.minOrderAmount,
    maxDiscount: c.maxDiscount,
    validFrom: c.validFrom,
    validUntil: c.validUntil,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    onePerUser: c.onePerUser,
    isActive: c.isActive,
    createdAt: c.createdAt,
  };
}

// GET /api/coupons — admin list
export async function GET() {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return successResponse(coupons.map(formatCoupon));
}

// POST /api/coupons — admin create
export async function POST(request) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();

  const body = await request.json();
  const code = (body.code || "").trim().toUpperCase();

  if (!code)             return errorResponse("Code is required", 422);
  if (!body.couponType)  return errorResponse("Coupon type is required", 422);

  // free_shipping doesn't need discountValue
  if (body.couponType !== "free_shipping" && !body.discountValue)
    return errorResponse("Discount value is required", 422);

  const existing = await Coupon.findOne({ code });
  if (existing) return errorResponse("Coupon code already exists", 409);

  const coupon = await Coupon.create({
    code,
    description:            body.description            || "",
    couponType:             body.couponType,
    discountValue:          Number(body.discountValue)  || 0,
    firstOrderDiscountKind: body.firstOrderDiscountKind || "percentage",
    minOrderAmount:         Number(body.minOrderAmount) || 0,
    maxDiscount:            body.maxDiscount ? Number(body.maxDiscount) : null,
    validFrom:              body.validFrom  ? new Date(body.validFrom)  : new Date(),
    validUntil:             body.validUntil ? new Date(body.validUntil) : null,
    usageLimit:             body.usageLimit ? Number(body.usageLimit)   : null,
    onePerUser:             body.onePerUser !== false,
    isActive:               body.isActive   !== false,
  });

  return successResponse({ id: coupon._id.toString(), code: coupon.code, message: "Coupon created" }, 201);
}
