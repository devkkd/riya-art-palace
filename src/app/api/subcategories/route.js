import { subcategoryController } from "@/lib/controllers/subcategoryController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  return subcategoryController.getAllSubcategories(request);
}

export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return subcategoryController.createSubcategory(request);
}
