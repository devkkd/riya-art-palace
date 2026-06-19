import { orderController } from "@/lib/controllers/orderController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function PUT(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) return errorResponse("Unauthorized", 401);
  return orderController.updateOrderStatus(request, context);
}
