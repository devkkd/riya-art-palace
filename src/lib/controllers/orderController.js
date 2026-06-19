import connectDB from "@/lib/db/connect";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";
import { createShiprocketOrder, trackOrder } from "@/lib/services/shiprocketService";
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
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RAP-${ts}-${rand}`;
}

export const orderController = {
  async createOrder(request) {
    try {
      await connectDB();
      const auth = await getAuthenticatedUser();
      if (!auth) return errorResponse("Please login to place an order", 401);

      const body = await request.json();
      const { items, shippingAddress, paymentMethod = "COD", notes = "" } = body;

      if (!items || items.length === 0)   return errorResponse("Cart is empty", 422);
      if (!shippingAddress?.line1)        return errorResponse("Shipping address is required", 422);
      if (!shippingAddress?.pincode)      return errorResponse("Pincode is required", 422);
      if (!["COD", "PREPAID"].includes(paymentMethod)) return errorResponse("Invalid payment method", 422);

      // Validate + price products from DB
      const orderItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = await Product.findById(item.productId).lean();
        if (!product) return errorResponse(`Product not found: ${item.productId}`, 404);

        const qty      = Math.max(1, parseInt(item.quantity) || 1);
        const price    = product.price;
        const sub      = price * qty;
        subtotal      += sub;

        orderItems.push({
          productId:   product._id,
          productName: product.name,
          productSlug: product.slug,
          image:       product.images?.[0] || "",
          price,
          priceUnit:   product.priceUnit || "Piece",
          quantity:    qty,
          subtotal:    sub,
        });
      }

      const shippingCharge = subtotal >= 999 ? 0 : 60; // free shipping above ₹999
      const totalAmount    = subtotal + shippingCharge;

      const orderId = generateOrderId();

      const order = await Order.create({
        orderId,
        user:            auth.userId,
        items:           orderItems,
        shippingAddress,
        subtotal,
        shippingCharge,
        discount:        0,
        totalAmount,
        paymentMethod,
        paymentStatus:   paymentMethod === "COD" ? "pending" : "pending",
        orderStatus:     "confirmed",
        pickupPincode:   process.env.SHIPROCKET_PICKUP_PINCODE || "302016",
        deliveryPincode: shippingAddress.pincode,
        confirmedAt:     new Date(),
        notes,
      });

      // Push orderId to user
      await User.findByIdAndUpdate(auth.userId, { $push: { /* virtual */ } }).catch(() => {});

      // Create Shiprocket shipment
      try {
        const sr = await createShiprocketOrder({
          orderId,
          createdAt:       order.createdAt,
          shippingAddress,
          items:           orderItems,
          totalAmount,
          paymentMethod,
          notes,
        });

        order.shiprocketOrderId    = sr.shiprocketOrderId;
        order.shiprocketShipmentId = sr.shiprocketShipmentId;
        order.awbNumber            = sr.awbNumber;
        order.courierName          = sr.courierName;
        order.trackingUrl          = sr.trackingUrl;
        order.orderStatus          = "processing";
        await order.save();
      } catch (srErr) {
        console.error("[order/shiprocket]", srErr.message);
        // Don't fail the order if Shiprocket fails — admin can retry manually
      }

      return successResponse(
        {
          order: {
            id:          order._id.toString(),
            orderId:     order.orderId,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            awbNumber:   order.awbNumber,
            trackingUrl: order.trackingUrl,
          },
          message: "Order placed successfully",
        },
        201
      );
    } catch (err) {
      console.error("[order/create]", err);
      return errorResponse("Failed to place order. Please try again.", 500);
    }
  },

  async getUserOrders(request) {
    try {
      await connectDB();
      const auth = await getAuthenticatedUser();
      if (!auth) return errorResponse("Not authenticated", 401);

      const orders = await Order.find({ user: auth.userId })
        .sort({ createdAt: -1 })
        .lean();

      const formatted = orders.map((o) => ({
        id:                   o._id.toString(),
        orderId:              o.orderId,
        items:                o.items,
        subtotal:             o.subtotal,
        shippingCharge:       o.shippingCharge,
        totalAmount:          o.totalAmount,
        paymentMethod:        o.paymentMethod,
        paymentStatus:        o.paymentStatus,
        orderStatus:          o.orderStatus,
        awbNumber:            o.awbNumber,
        courierName:          o.courierName,
        trackingUrl:          o.trackingUrl,
        shiprocketOrderId:    o.shiprocketOrderId,
        shippingAddress:      o.shippingAddress,
        createdAt:            o.createdAt,
        shippedAt:            o.shippedAt,
        deliveredAt:          o.deliveredAt,
      }));

      return successResponse(formatted);
    } catch (err) {
      console.error("[order/getUserOrders]", err);
      return errorResponse("Failed to fetch orders", 500);
    }
  },

  async trackOrderByAwb(request, context) {
    try {
      const params = await context.params;
      const { awb } = params;

      const tracking = await trackOrder(awb);
      return successResponse(tracking);
    } catch (err) {
      console.error("[order/track]", err);
      return errorResponse("Failed to fetch tracking info", 500);
    }
  },

  // ── ADMIN: get all orders ────────────────────────────────────────────────
  async getAllOrders(request) {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const page   = parseInt(searchParams.get("page") || "1");
      const limit  = parseInt(searchParams.get("limit") || "20");

      const filter = {};
      if (status) filter.orderStatus = status;

      const [orders, total] = await Promise.all([
        Order.find(filter)
          .populate("user", "name phone email")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Order.countDocuments(filter),
      ]);

      const formatted = orders.map((o) => ({
        id:                   o._id.toString(),
        orderId:              o.orderId,
        user: o.user ? {
          id:    o.user._id.toString(),
          name:  o.user.name  || "—",
          phone: o.user.phone || "—",
          email: o.user.email || "—",
        } : null,
        items:                o.items,
        subtotal:             o.subtotal,
        shippingCharge:       o.shippingCharge,
        totalAmount:          o.totalAmount,
        paymentMethod:        o.paymentMethod,
        paymentStatus:        o.paymentStatus,
        orderStatus:          o.orderStatus,
        awbNumber:            o.awbNumber,
        courierName:          o.courierName,
        trackingUrl:          o.trackingUrl,
        shiprocketOrderId:    o.shiprocketOrderId,
        shiprocketShipmentId: o.shiprocketShipmentId,
        shippingAddress:      o.shippingAddress,
        confirmedAt:          o.confirmedAt,
        shippedAt:            o.shippedAt,
        deliveredAt:          o.deliveredAt,
        createdAt:            o.createdAt,
      }));

      return successResponse({ orders: formatted, total, page, limit });
    } catch (err) {
      console.error("[order/getAll]", err);
      return errorResponse("Failed to fetch orders", 500);
    }
  },

  async updateOrderStatus(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const { id } = params;
      const body   = await request.json();

      const order = await Order.findById(id);
      if (!order) return errorResponse("Order not found", 404);

      if (body.orderStatus)  order.orderStatus  = body.orderStatus;
      if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
      if (body.awbNumber)    order.awbNumber    = body.awbNumber;
      if (body.courierName)  order.courierName  = body.courierName;
      if (body.trackingUrl)  order.trackingUrl  = body.trackingUrl;

      // Set timestamps
      if (body.orderStatus === "shipped"    && !order.shippedAt)    order.shippedAt    = new Date();
      if (body.orderStatus === "delivered"  && !order.deliveredAt)  order.deliveredAt  = new Date();
      if (body.orderStatus === "cancelled"  && !order.cancelledAt)  order.cancelledAt  = new Date();

      await order.save();

      return successResponse({ order: { id: order._id.toString(), orderStatus: order.orderStatus }, message: "Order updated" });
    } catch (err) {
      console.error("[order/updateStatus]", err);
      return errorResponse("Failed to update order", 500);
    }
  },
};
