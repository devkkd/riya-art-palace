import connectDB from "@/lib/db/connect";
import Review from "@/lib/models/Review";
import Order from "@/lib/models/Order";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

async function getUserAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.type === "user" ? payload : null;
  } catch { return null; }
}

// GET /api/reviews?productId=xxx  — public, approved reviews for a product
// GET /api/reviews?admin=1        — admin, all reviews
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const isAdmin   = searchParams.get("admin") === "1";

  if (isAdmin) {
    // Check admin auth
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    try {
      const p = await verifyToken(token);
      if (!p.adminId) return errorResponse("Unauthorized", 401);
    } catch { return errorResponse("Unauthorized", 401); }

    const page  = parseInt(searchParams.get("page")  || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";

    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.product = productId;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "name email")
        .populate("product", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return successResponse({
      reviews: reviews.map(r => ({
        id: r._id.toString(),
        product: r.product ? { id: r.product._id.toString(), name: r.product.name, slug: r.product.slug } : null,
        user: r.user ? { id: r.user._id.toString(), name: r.user.name, email: r.user.email } : null,
        rating: r.rating, title: r.title, body: r.body,
        status: r.status, adminReply: r.adminReply, createdAt: r.createdAt,
      })),
      total, page, limit,
    });
  }

  // Public: reviews for a product
  if (!productId) return errorResponse("productId required", 422);

  const reviews = await Review.find({ product: productId, status: "approved" })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return successResponse({
    reviews: reviews.map(r => ({
      id: r._id.toString(),
      userName: r.user?.name || "Anonymous",
      rating: r.rating, title: r.title, body: r.body,
      adminReply: r.adminReply, createdAt: r.createdAt,
    })),
    avgRating: Number(avgRating),
    total: reviews.length,
  });
}

// POST /api/reviews — authenticated user
export async function POST(request) {
  try {
    await connectDB();
    const auth = await getUserAuth();
    if (!auth) return errorResponse("Please login to write a review", 401);

    const body = await request.json();
    const { productId, orderId, rating, title, body: reviewBody } = body;

    if (!productId)        return errorResponse("Product is required", 422);
    if (!orderId)          return errorResponse("Order is required", 422);
    if (!rating || rating < 1 || rating > 5) return errorResponse("Rating must be 1-5", 422);

    // Verify order belongs to user and contains product
    const order = await Order.findOne({ _id: orderId, user: auth.userId });
    if (!order) return errorResponse("Order not found", 404);
    const notAllowed = ["pending", "cancelled", "returned"];
    if (notAllowed.includes(order.orderStatus))
      return errorResponse("You can only review confirmed or delivered orders", 400);
    const hasProduct = order.items.some(i => i.productId.toString() === productId);
    if (!hasProduct) return errorResponse("Product not in this order", 400);

    // Check duplicate
    const existing = await Review.findOne({ product: productId, user: auth.userId, order: orderId });
    if (existing) return errorResponse("You have already reviewed this product", 409);

    const review = await Review.create({
      product: productId,
      order:   orderId,
      user:    auth.userId,
      rating:  Number(rating),
      title:   (title  || "").trim(),
      body:    (reviewBody || "").trim(),
      status:  "approved",
    });

    return successResponse({ id: review._id.toString(), message: "Review submitted successfully" }, 201);
  } catch (err) {
    if (err.code === 11000) return errorResponse("You have already reviewed this product", 409);
    console.error("[review/post]", err);
    return errorResponse("Failed to submit review", 500);
  }
}
