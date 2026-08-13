import connectDB from "@/lib/db/connect";
import Coupon from "@/lib/models/Coupon";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

async function adminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try { const p = await verifyToken(token); return p.adminId ? p : null; }
  catch { return null; }
}

export async function PUT(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id } = await context.params;
  const body   = await request.json();

  const coupon = await Coupon.findById(id);
  if (!coupon) return errorResponse("Coupon not found", 404);

  const fields = [
    "description", "couponType", "discountValue", "firstOrderDiscountKind",
    "minOrderAmount", "maxDiscount", "validFrom", "validUntil",
    "usageLimit", "onePerUser", "isActive",
  ];
  fields.forEach(f => { if (body[f] !== undefined) coupon[f] = body[f]; });
  await coupon.save();

  return successResponse({ id: coupon._id.toString(), message: "Updated" });
}

export async function DELETE(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id } = await context.params;
  await Coupon.findByIdAndDelete(id);
  return successResponse({ message: "Deleted" });
}
