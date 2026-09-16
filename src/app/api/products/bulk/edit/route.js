import connectDB from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { isAuthenticated } from "@/lib/utils/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";

// POST /api/products/bulk/edit
// Body: { ids: [...], updates: { category?, subcategory?, price?, minOrderQty?, showInRetail?, bestSelling?, newArrival? } }
export async function POST(request) {
  const auth = await isAuthenticated();
  if (!auth) return errorResponse("Unauthorized", 401);

  try {
    await connectDB();
    const { ids, updates } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0)
      return errorResponse("No product IDs provided", 422);
    if (!updates || Object.keys(updates).length === 0)
      return errorResponse("No updates provided", 422);

    // Whitelist allowed bulk-edit fields
    const allowed = ["category", "subcategory", "price", "priceUnit", "minOrderQty", "showInRetail", "bestSelling", "newArrival"];
    const sanitized = {};
    for (const key of allowed) {
      if (updates[key] !== undefined && updates[key] !== "") {
        sanitized[key] = updates[key];
      }
    }

    if (Object.keys(sanitized).length === 0)
      return errorResponse("No valid fields to update", 422);

    const result = await Product.updateMany({ _id: { $in: ids } }, { $set: sanitized });

    return successResponse({
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} product(s) updated`,
    });
  } catch (err) {
    console.error("[products/bulk/edit]", err);
    return errorResponse("Bulk edit failed", 500);
  }
}
