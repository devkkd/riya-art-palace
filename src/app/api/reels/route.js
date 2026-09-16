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

// GET /api/reels — public (active only) or admin (all)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "1";

    let filter = {};
    if (!isAdmin) filter.isActive = true;

    // Admin auth check
    if (isAdmin) {
      const cookieStore = await cookies();
      const token = cookieStore.get("admin_token")?.value;
      if (!token) return errorResponse("Unauthorized", 401);
      try {
        const p = await verifyToken(token);
        if (!p.adminId) return errorResponse("Unauthorized", 401);
      } catch { return errorResponse("Unauthorized", 401); }
    }

    const reels = await Reel.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return successResponse(reels.map(r => ({
      id:       r._id.toString(),
      title:    r.title,
      videoUrl: r.videoUrl,
      thumbUrl: r.thumbUrl,
      order:    r.order,
      isActive: r.isActive,
    })));
  } catch (err) {
    console.error("[reels/get]", err);
    return errorResponse("Failed to fetch reels", 500);
  }
}

// POST /api/reels — admin create
export async function POST(request) {
  const auth = await adminAuth();
  if (!auth) return errorResponse("Unauthorized", 401);
  try {
    await connectDB();
    const { title, videoUrl, thumbUrl, order } = await request.json();
    if (!videoUrl?.trim()) return errorResponse("Video URL is required", 422);

    const count = await Reel.countDocuments();
    const reel  = await Reel.create({
      title:    title    || "",
      videoUrl: videoUrl.trim(),
      thumbUrl: thumbUrl || "",
      order:    order ?? count,
    });
    return successResponse({ id: reel._id.toString(), message: "Reel created" }, 201);
  } catch (err) {
    console.error("[reels/post]", err);
    return errorResponse("Failed to create reel", 500);
  }
}
