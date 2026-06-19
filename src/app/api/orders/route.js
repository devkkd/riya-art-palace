import { orderController } from "@/lib/controllers/orderController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function POST(request) { return orderController.createOrder(request); }
export async function GET(request)  {
  const authenticated = await isAuthenticated();
  if (!authenticated) return errorResponse("Unauthorized", 401);
  return orderController.getAllOrders(request);
}
