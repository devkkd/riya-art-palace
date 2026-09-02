import { orderController } from "@/lib/controllers/orderController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

// POST /api/orders/[id]/shiprocket
// Admin-only: manually re-trigger Shiprocket order creation
export async function POST(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return errorResponse("Unauthorized", 401);
  return orderController.retriggerShiprocket(request, context);
}
