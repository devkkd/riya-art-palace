import { orderController } from "@/lib/controllers/orderController";
export async function GET(request, context) { return orderController.trackOrderByAwb(request, context); }
