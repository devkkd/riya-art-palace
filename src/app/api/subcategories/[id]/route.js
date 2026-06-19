import { subcategoryController } from "@/lib/controllers/subcategoryController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function PUT(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return subcategoryController.updateSubcategory(request, context);
}

export async function DELETE(request, context) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return subcategoryController.deleteSubcategory(request, context);
}
