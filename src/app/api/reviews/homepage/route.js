import connectDB from "@/lib/db/connect";
import Review from "@/lib/models/Review";
import { successResponse, errorResponse } from "@/lib/utils/response";

// GET /api/reviews/homepage — latest approved reviews for homepage display
export async function GET() {
  try {
    await connectDB();

    const reviews = await Review.find({ status: "approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const avgRating = reviews.length
      ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 4.8;

    return successResponse({
      reviews: reviews.map(r => ({
        id:         r._id.toString(),
        userName:   r.reviewerName || r.user?.name || "Verified Buyer",
        rating:     r.rating,
        title:      r.title || "",
        body:       r.body  || "",
        adminReply: r.adminReply || "",
        createdAt:  r.createdAt,
      })),
      avgRating,
      total: reviews.length,
    });
  } catch (err) {
    console.error("[reviews/homepage]", err);
    return errorResponse("Failed to fetch reviews", 500);
  }
}
