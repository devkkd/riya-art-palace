import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import connectDB from "@/lib/db/connect";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { verifyRazorpaySignature } from "@/lib/services/razorpayService";
import { createShiprocketOrder } from "@/lib/services/shiprocketService";
import { successResponse, errorResponse } from "@/lib/utils/response";

const USER_COOKIE = "user_token";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    if (payload.type !== "user") return null;
    return payload;
  } catch {
    return null;
  }
}

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RAP-${ts}-${rand}`;
}

export async function POST(request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return errorResponse("Please login to place an order", 401);
    }

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      items,
      shippingAddress,
      notes = "",
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return errorResponse("Payment information is required", 422);
    }

    if (!verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      return errorResponse("Payment verification failed", 400);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse("Cart items are required", 422);
    }

    if (!shippingAddress?.line1 || !shippingAddress?.pincode) {
      return errorResponse("Valid shipping address is required", 422);
    }

    await connectDB();

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await import("@/lib/models/Product").then((mod) => mod.default.findById(item.productId).lean());
      if (!product) return errorResponse(`Product not found: ${item.productId}`, 404);

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = product.price || 0;
      const sub = price * qty;
      subtotal += sub;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        image: product.images?.[0] || "",
        price,
        priceUnit: product.priceUnit || "Piece",
        quantity: qty,
        subtotal: sub,
      });
    }

    const shippingCharge = subtotal >= 999 ? 0 : 60;
    const totalAmount = subtotal + shippingCharge;
    const orderId = generateOrderId();

    const order = await Order.create({
      orderId,
      user: auth.userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCharge,
      discount: 0,
      totalAmount,
      paymentMethod: "PREPAID",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      orderStatus: "processing",
      pickupPincode: process.env.SHIPROCKET_PICKUP_PINCODE || "302016",
      deliveryPincode: shippingAddress.pincode,
      confirmedAt: new Date(),
      notes,
    });

    try {
      const sr = await createShiprocketOrder({
        orderId,
        createdAt: order.createdAt,
        shippingAddress,
        items: orderItems,
        totalAmount,
        paymentMethod: "PREPAID",
        notes,
      });

      order.shiprocketOrderId = sr.shiprocketOrderId;
      order.shiprocketShipmentId = sr.shiprocketShipmentId;
      order.awbNumber = sr.awbNumber;
      order.courierName = sr.courierName;
      order.trackingUrl = sr.trackingUrl;
      order.orderStatus = "processing";
      await order.save();
    } catch (err) {
      console.error("[razorpay/shiprocket]", err?.message || err);
    }

    return successResponse({
      order: {
        id: order._id.toString(),
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        awbNumber: order.awbNumber,
        trackingUrl: order.trackingUrl,
      },
    }, 201);
  } catch (err) {
    console.error("[razorpay/verify]", err);
    return errorResponse(err.message || "Failed to verify payment", 500);
  }
}
