import { productController } from "@/lib/controllers/productController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  return productController.getAllProducts(request);
}

export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return productController.createProduct(request);
}
