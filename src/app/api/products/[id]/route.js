import { productController } from "@/lib/controllers/productController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function GET(request, context) {
  return productController.getProductById(request, context);
}

export async function PUT(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return productController.updateProduct(request, context);
}

export async function DELETE(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return productController.deleteProduct(request, context);
}
