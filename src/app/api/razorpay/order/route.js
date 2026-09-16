import { createRazorpayOrder, razorpayConfigured } from "@/lib/services/razorpayService";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, notes = {} } = body;

    if (!amount || Number(amount) <= 0) {
      return errorResponse("Invalid order amount", 422);
    }

    if (!razorpayConfigured()) {
      return errorResponse("Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.", 500);
    }

    const order = await createRazorpayOrder(amount, currency, receipt || `RAP-${Date.now()}`, notes);
    return successResponse(order);
  } catch (err) {
    console.error("[razorpay/create-order]", err);
    return errorResponse(err.message || "Unable to create Razorpay order", 500);
  }
}
