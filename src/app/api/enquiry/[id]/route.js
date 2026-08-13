import connectDB from "@/lib/db/connect";
import Enquiry from "@/lib/models/Enquiry";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";

async function adminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    return payload.adminId ? payload : null;
  } catch {
    return null;
  }
}

// ── PUT /api/enquiry/[id]  (admin — update status / notes) ──────────────────
export async function PUT(request, context) {
  try {
    const auth = await adminAuth();
    if (!auth) return errorResponse("Unauthorized", 401);

    await connectDB();
    const { id } = await context.params;
    const body   = await request.json();

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) return errorResponse("Enquiry not found", 404);

    if (body.status     !== undefined) enquiry.status     = body.status;
    if (body.adminNotes !== undefined) enquiry.adminNotes = body.adminNotes;
    await enquiry.save();

    return successResponse({ id: enquiry._id.toString(), status: enquiry.status, message: "Updated" });
  } catch (err) {
    console.error("[enquiry/put]", err);
    return errorResponse("Failed to update enquiry", 500);
  }
}

// ── DELETE /api/enquiry/[id]  (admin — delete) ──────────────────────────────
export async function DELETE(request, context) {
  try {
    const auth = await adminAuth();
    if (!auth) return errorResponse("Unauthorized", 401);

    await connectDB();
    const { id } = await context.params;
    await Enquiry.findByIdAndDelete(id);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("[enquiry/delete]", err);
    return errorResponse("Failed to delete enquiry", 500);
  }
}
