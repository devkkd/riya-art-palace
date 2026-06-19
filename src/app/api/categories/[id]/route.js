import { categoryController } from "@/lib/controllers/categoryController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function PUT(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return categoryController.updateCategory(request, context);
}

export async function DELETE(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return categoryController.deleteCategory(request, context);
}
