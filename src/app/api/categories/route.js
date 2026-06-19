import { categoryController } from "@/lib/controllers/categoryController";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  return categoryController.getAllCategories(request);
}

export async function POST(request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return errorResponse("Unauthorized", 401);
  }
  return categoryController.createCategory(request);
}
