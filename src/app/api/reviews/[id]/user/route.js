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

// PUT /api/reviews/[id]/user — user edits their own review
export async function PUT(request, context) {
  try {
    const auth = await getUserAuth();
    if (!auth) return errorResponse("Please login", 401);

    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const review = await Review.findOne({ _id: id, user: auth.userId });
    if (!review) return errorResponse("Review not found or not yours", 404);

    if (body.rating !== undefined) {
      const r = Number(body.rating);
      if (r < 1 || r > 5) return errorResponse("Rating must be 1-5", 422);
      review.rating = r;
    }
    if (body.title !== undefined) review.title = body.title.trim();
    if (body.body  !== undefined) review.body  = body.body.trim();

    // Reset to pending for re-moderation after edit
    review.status = "approved";

    await review.save();

    return successResponse({ id: review._id.toString(), message: "Review updated" });
  } catch (err) {
    console.error("[reviews/user/put]", err);
    return errorResponse("Failed to update review", 500);
  }
}
