import connectDB from "@/lib/db/connect";
import Review from "@/lib/models/Review";
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

// PUT — admin update status / reply
export async function PUT(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id } = await context.params;
  const body   = await request.json();

  const review = await Review.findById(id);
  if (!review) return errorResponse("Review not found", 404);

  if (body.status     !== undefined) review.status     = body.status;
  if (body.adminReply !== undefined) review.adminReply = body.adminReply;
  await review.save();

  return successResponse({ id: review._id.toString(), message: "Updated" });
}

// DELETE — admin
export async function DELETE(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id } = await context.params;
  await Review.findByIdAndDelete(id);
  return successResponse({ message: "Deleted" });
}
