import { checkServiceability } from "@/lib/services/shiprocketService";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const deliveryPincode = searchParams.get("pincode") || "";
    const pickupPincode   = process.env.SHIPROCKET_PICKUP_PINCODE || "302016";

    if (!deliveryPincode || deliveryPincode.length !== 6) {
      return errorResponse("Please enter a valid 6-digit pincode", 422);
    }

    const result = await checkServiceability({ pickupPincode, deliveryPincode });
    return successResponse(result);
  } catch (err) {
    console.error("[serviceability]", err);
    return errorResponse("Failed to check serviceability", 500);
  }
}
