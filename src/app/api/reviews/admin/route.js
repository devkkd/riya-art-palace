import connectDB from "@/lib/db/connect";
import Review from "@/lib/models/Review";
import Product from "@/lib/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";
import mongoose from "mongoose";

async function adminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try { const p = await verifyToken(token); return p.adminId ? p : null; }
  catch { return null; }
}

// POST /api/reviews/admin — admin creates a review (no order/user required)
export async function POST(request) {
  try {
    const auth = await adminAuth();
    if (!auth) return errorResponse("Unauthorized", 401);
    await connectDB();

    const body = await request.json();
    const { productId, rating, title, reviewBody, reviewerName, status = "approved" } = body;

    if (!productId)                      return errorResponse("Product is required", 422);
    if (!rating || rating < 1 || rating > 5) return errorResponse("Rating must be 1-5", 422);
    if (!reviewerName?.trim())           return errorResponse("Reviewer name is required", 422);

    const product = await Product.findById(productId).lean();
    if (!product) return errorResponse("Product not found", 404);

    // Admin reviews use a sentinel ObjectId for user/order
    const sentinelId = new mongoose.Types.ObjectId("000000000000000000000001");

    const review = await Review.create({
      product:  productId,
      order:    sentinelId,
      user:     sentinelId,
      rating:   Number(rating),
      title:    (title       || "").trim(),
      body:     (reviewBody  || "").trim(),
      status,
      adminReply: "",
      reviewerName: reviewerName.trim(), // extra display field
    });

    return successResponse({ id: review._id.toString(), message: "Review created" }, 201);
  } catch (err) {
    console.error("[reviews/admin/create]", err);
    return errorResponse("Failed to create review", 500);
  }
}
