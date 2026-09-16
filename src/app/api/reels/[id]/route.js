import connectDB from "@/lib/db/connect";
import Reel from "@/lib/models/Reel";
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

// PUT /api/reels/[id] — admin update
export async function PUT(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id }   = await context.params;
  const body     = await request.json();
  const reel     = await Reel.findById(id);
  if (!reel) return errorResponse("Reel not found", 404);

  if (body.title    !== undefined) reel.title    = body.title;
  if (body.videoUrl !== undefined) reel.videoUrl = body.videoUrl;
  if (body.thumbUrl !== undefined) reel.thumbUrl = body.thumbUrl;
  if (body.order    !== undefined) reel.order    = body.order;
  if (body.isActive !== undefined) reel.isActive = body.isActive;
  await reel.save();

  return successResponse({ id: reel._id.toString(), message: "Updated" });
}

// DELETE /api/reels/[id] — admin delete
export async function DELETE(request, context) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  await connectDB();
  const { id } = await context.params;
  await Reel.findByIdAndDelete(id);
  return successResponse({ message: "Deleted" });
}
