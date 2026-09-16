import connectDB from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { isAuthenticated } from "@/lib/utils/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";

// DELETE /api/products/bulk/delete — { ids: ["id1","id2",...] }
export async function POST(request) {
  const auth = await isAuthenticated();
  if (!auth) return errorResponse("Unauthorized", 401);

  try {
    await connectDB();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0)
      return errorResponse("No product IDs provided", 422);

    const result = await Product.deleteMany({ _id: { $in: ids } });

    return successResponse({
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} product(s) deleted`,
    });
  } catch (err) {
    console.error("[products/bulk/delete]", err);
    return errorResponse("Bulk delete failed", 500);
  }
}
