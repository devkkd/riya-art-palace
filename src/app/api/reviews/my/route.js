import connectDB from "@/lib/db/connect";
import Review from "@/lib/models/Review";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { successResponse, errorResponse } from "@/lib/utils/response";

async function getUserAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;
  if (!token) return null;
  try {
    const p = await verifyToken(token);
    return p.type === "user" ? p : null;
  } catch { return null; }
}

// GET /api/reviews/my — logged-in user's own reviews
export async function GET() {
  try {
    const auth = await getUserAuth();
    if (!auth) return errorResponse("Please login", 401);

    await connectDB();

    const reviews = await Review.find({ user: auth.userId })
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({
      reviews: reviews.map(r => ({
        id:         r._id.toString(),
        product:    r.product ? { id: r.product._id.toString(), name: r.product.name, slug: r.product.slug, image: r.product.images?.[0] || "" } : null,
        rating:     r.rating,
        title:      r.title || "",
        body:       r.body  || "",
        status:     r.status,
        adminReply: r.adminReply || "",
        createdAt:  r.createdAt,
      })),
    });
  } catch (err) {
    console.error("[reviews/my]", err);
    return errorResponse("Failed to fetch reviews", 500);
  }
}
