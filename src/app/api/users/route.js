import connectDB from "@/lib/db/connect";
import User from "@/lib/models/User";
import { isAuthenticated } from "@/lib/utils/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return errorResponse("Unauthorized", 401);

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page  = parseInt(searchParams.get("page")  || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const q     = searchParams.get("q") || "";

    const filter = q
      ? { $or: [{ phone: new RegExp(q, "i") }, { name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    const formatted = users.map((u) => ({
      id:        u._id.toString(),
      phone:     u.phone,
      name:      u.name  || "—",
      email:     u.email || "—",
      addresses: u.addresses?.length || 0,
      isActive:  u.isActive,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
    }));

    return successResponse({ users: formatted, total, page, limit });
  } catch (err) {
    console.error("[users/getAll]", err);
    return errorResponse("Failed to fetch users", 500);
  }
}
