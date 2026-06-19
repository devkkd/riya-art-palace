import { uploadToR2 } from "@/lib/services/cloudflareService";
import { isAuthenticated } from "@/lib/utils/auth";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return errorResponse("Unauthorized", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    if (!(file instanceof File)) {
      return errorResponse("Invalid file upload", 400);
    }

    // Check size limit (e.g. 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return errorResponse("File size exceeds 5MB limit", 400);
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call R2 upload service
    const imageUrl = await uploadToR2(buffer, file.name, file.type);

    return successResponse({ url: imageUrl, message: "File uploaded successfully" });
  } catch (error) {
    console.error("[upload]", error);
    return errorResponse(error.message || "Failed to upload file", 500);
  }
}
