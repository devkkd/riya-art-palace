import { NextResponse } from "next/server";

import {
  orderController,
} from "@/lib/controllers/orderController";

export async function POST(request) {
  try {
    return await orderController.verifyPayment(
      request
    );
  } catch (error) {
    console.error(
      "[api/orders/verify-payment]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Payment verification failed",
      },
      {
        status: 500,
      }
    );
  }
}