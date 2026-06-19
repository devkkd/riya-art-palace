import { orderController } from "@/lib/controllers/orderController";
export async function GET(request) { return orderController.getUserOrders(request); }
