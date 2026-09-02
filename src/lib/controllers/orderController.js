import connectDB from "@/lib/db/connect";
import Order from "@/lib/models/Order";
import Coupon from "@/lib/models/Coupon";
import Product from "@/lib/models/Product";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils/jwt";

import {
  createShiprocketOrder,
  trackOrder,
} from "@/lib/services/shiprocketService";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/services/razorpayService";

import {
  successResponse,
  errorResponse,
} from "@/lib/utils/response";

const USER_COOKIE = "user_token";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(USER_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    if (payload.type !== "user") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function generateOrderId() {
  const ts = Date.now()
    .toString(36)
    .toUpperCase();

  const rand = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase();

  return `RAP-${ts}-${rand}`;
}

export const orderController = {

  // =========================================================
  // CREATE ORDER
  // =========================================================

  async createOrder(request) {
    try {
      await connectDB();

      const auth = await getAuthenticatedUser();

      if (!auth) {
        return errorResponse(
          "Please login to place an order",
          401
        );
      }

      const body = await request.json();

      const {
        items,
        shippingAddress,
        paymentMethod = "PREPAID",
        notes = "",
        couponCode = "",
      } = body;

      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (!Array.isArray(items) || items.length === 0) {
        return errorResponse(
          "Cart is empty",
          422
        );
      }

      if (!shippingAddress?.line1) {
        return errorResponse(
          "Shipping address is required",
          422
        );
      }

      if (!shippingAddress?.pincode) {
        return errorResponse(
          "Pincode is required",
          422
        );
      }

      if (!["PREPAID", "COD"].includes(paymentMethod)) {
        return errorResponse(
          "Invalid payment method",
          422
        );
      }

      // -----------------------------------------------------
      // PRODUCT VALIDATION
      // -----------------------------------------------------

      const orderItems = [];

      let subtotal = 0;

      for (const item of items) {

        if (!item?.productId) {
          return errorResponse(
            "Product ID is required",
            422
          );
        }

        const product = await Product
          .findById(item.productId)
          .lean();

        if (!product) {
          return errorResponse(
            `Product not found: ${item.productId}`,
            404
          );
        }

        const quantity = Math.max(
          1,
          parseInt(item.quantity, 10) || 1
        );

        const price = Number(product.price);

        if (!Number.isFinite(price) || price < 0) {
          return errorResponse(
            `Invalid price for product: ${product.name}`,
            422
          );
        }

        const itemSubtotal = price * quantity;

        subtotal += itemSubtotal;

        orderItems.push({
          productId: product._id,

          productName:
            product.name || "",

          productSlug:
            product.slug || "",

          image:
            product.images?.[0] || "",

          price,

          priceUnit:
            product.priceUnit || "Piece",

          quantity,

          subtotal: itemSubtotal,
        });
      }

      // -----------------------------------------------------
      // SHIPPING
      // -----------------------------------------------------

      const shippingCharge =
        subtotal >= 999 ? 0 : 60;

      // -----------------------------------------------------
      // COUPON
      // -----------------------------------------------------

      let couponDiscount = 0;

      let appliedCouponCode = "";

      let validCoupon = null;

      if (couponCode?.trim()) {

        const coupon = await Coupon.findOne({
          code: couponCode
            .trim()
            .toUpperCase(),

          isActive: true,
        });

        if (coupon) {

          const now = new Date();

          const alreadyUsed =
            Array.isArray(coupon.usedBy) &&
            coupon.usedBy.some(
              (id) =>
                id.toString() ===
                auth.userId.toString()
            );

          const valid =
            (!coupon.validFrom ||
              coupon.validFrom <= now) &&

            (!coupon.validUntil ||
              coupon.validUntil >= now) &&

            (!coupon.usageLimit ||
              coupon.usedCount <
                coupon.usageLimit) &&

            subtotal >=
              Number(coupon.minOrderAmount || 0) &&

            (!coupon.onePerUser ||
              !alreadyUsed);

          if (valid) {

            if (
              coupon.discountType ===
              "percentage"
            ) {

              couponDiscount = Math.round(
                (subtotal *
                  Number(coupon.discountValue)) /
                  100
              );

              if (coupon.maxDiscount) {
                couponDiscount = Math.min(
                  couponDiscount,
                  Number(coupon.maxDiscount)
                );
              }

            } else {

              couponDiscount = Math.min(
                Number(coupon.discountValue),
                subtotal
              );
            }

            appliedCouponCode =
              coupon.code;

            validCoupon = coupon;
          }
        }
      }

      // -----------------------------------------------------
      // TOTAL
      // -----------------------------------------------------

      const totalAmount = Math.max(
        0,
        subtotal +
          shippingCharge -
          couponDiscount
      );

      if (totalAmount <= 0) {
        return errorResponse(
          "Invalid order amount",
          422
        );
      }

      // -----------------------------------------------------
      // OUR INTERNAL ORDER ID
      // -----------------------------------------------------

      const orderId = generateOrderId();

      // -----------------------------------------------------
      // CREATE RAZORPAY ORDER
      // -----------------------------------------------------

      let razorpayOrder = null;

      if (paymentMethod === "PREPAID") {

        razorpayOrder =
          await createRazorpayOrder({
            amount: totalAmount,

            receipt: orderId,

            notes: {
              userId:
                auth.userId.toString(),

              orderId,
            },
          });
      }

      // -----------------------------------------------------
      // CREATE DATABASE ORDER
      // -----------------------------------------------------

      const order = await Order.create({

        orderId,

        user: auth.userId,

        items: orderItems,

        shippingAddress,

        subtotal,

        shippingCharge,

        discount: couponDiscount,

        couponCode:
          appliedCouponCode,

        couponDiscount,

        totalAmount,

        paymentMethod,

        paymentStatus: "pending",

        razorpayOrderId:
          razorpayOrder?.id || "",

        orderStatus: "pending",

        pickupPincode:
          process.env
            .SHIPROCKET_PICKUP_PINCODE ||
          "302016",

        deliveryPincode:
          shippingAddress.pincode,

        notes,
      });

      // -----------------------------------------------------
      // COD — Create Shiprocket order immediately
      // PREPAID — Shiprocket will be created after Razorpay
      //           payment is successfully verified.
      // -----------------------------------------------------

      if (paymentMethod === "COD") {
        try {
          const shiprocket = await createShiprocketOrder({
            orderId:   order.orderId,
            createdAt: order.createdAt,
            shippingAddress,
            items:     orderItems,
            totalAmount,
            paymentMethod: "COD",
            notes,
          });
          order.shiprocketOrderId    = shiprocket.shiprocketOrderId;
          order.shiprocketShipmentId = shiprocket.shiprocketShipmentId;
          order.awbNumber            = shiprocket.awbNumber;
          order.courierName          = shiprocket.courierName;
          order.trackingUrl          = shiprocket.trackingUrl;
          order.orderStatus          = "processing";
          await order.save();
        } catch (srErr) {
          // Don't fail the order if Shiprocket is down — admin can re-trigger
          console.error("[order/create/COD/shiprocket]", srErr);
        }
      }

      // -----------------------------------------------------
      // RESPONSE
      // -----------------------------------------------------

      return successResponse(
        {
          order: {
            id: order._id.toString(),

            orderId:
              order.orderId,

            totalAmount:
              order.totalAmount,

            orderStatus:
              order.orderStatus,

            paymentStatus:
              order.paymentStatus,

            razorpayOrderId:
              order.razorpayOrderId,
          },

         razorpay:
  paymentMethod === "PREPAID"
    ? {
        orderId:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        keyId:
          process.env.RAZORPAY_KEY_ID,
      }
    : null,

          message:
            paymentMethod === "PREPAID"
              ? "Razorpay order created"
              : "Order created successfully",
        },

        201
      );

    } catch (err) {

      console.error(
        "[order/create]",
        err
      );

      return errorResponse(
        err?.message ||
          "Failed to place order. Please try again.",
        500
      );
    }
  },

  // =========================================================
  // VERIFY RAZORPAY PAYMENT
  // =========================================================

  async verifyPayment(request) {

    try {

      await connectDB();

      const auth =
        await getAuthenticatedUser();

      if (!auth) {
        return errorResponse(
          "Please login",
          401
        );
      }

      const body =
        await request.json();

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {

        return errorResponse(
          "Payment details are missing",
          422
        );
      }

      // -----------------------------------------------------
      // FIND OUR ORDER USING RAZORPAY ORDER ID
      // -----------------------------------------------------

      const order =
        await Order.findOne({
          razorpayOrderId:
            razorpay_order_id,

          user: auth.userId,
        });

      if (!order) {

        return errorResponse(
          "Order not found",
          404
        );
      }

      // -----------------------------------------------------
      // PREVENT DUPLICATE VERIFICATION
      // -----------------------------------------------------

      if (
        order.paymentStatus === "paid"
      ) {

        return successResponse({
          order: {
            id:
              order._id.toString(),

            orderId:
              order.orderId,

            paymentStatus:
              order.paymentStatus,

            orderStatus:
              order.orderStatus,

            awbNumber:
              order.awbNumber,

            trackingUrl:
              order.trackingUrl,
          },

          message:
            "Payment already verified",
        });
      }

      // -----------------------------------------------------
      // VERIFY SIGNATURE
      // -----------------------------------------------------

      const verified =
        verifyRazorpayPayment({
          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,

          razorpaySignature:
            razorpay_signature,
        });

      if (!verified) {

        order.paymentStatus =
          "failed";

        await order.save();

        return errorResponse(
          "Invalid payment signature",
          400
        );
      }

      // -----------------------------------------------------
      // PAYMENT VERIFIED
      // -----------------------------------------------------

      order.paymentStatus =
        "paid";

      order.razorpayPaymentId =
        razorpay_payment_id;

      order.razorpaySignature =
        razorpay_signature;

      order.paidAt = new Date();

      order.orderStatus =
        "confirmed";

      order.confirmedAt =
        new Date();

      // -----------------------------------------------------
      // COUPON USAGE
      // -----------------------------------------------------

      if (order.couponCode) {

        try {

          await Coupon.findOneAndUpdate(
            {
              code:
                order.couponCode,

              isActive: true,
            },
            {
              $inc: {
                usedCount: 1,
              },

              $addToSet: {
                usedBy:
                  auth.userId,
              },
            }
          );

        } catch (couponError) {

          console.error(
            "[coupon/update]",
            couponError
          );
        }
      }

      await order.save();

      // -----------------------------------------------------
      // SHIPROCKET
      // -----------------------------------------------------
      //
      // PAYMENT IS NOW VERIFIED.
      // NOW CREATE SHIPROCKET ORDER.
      // -----------------------------------------------------

      try {

        const shiprocket =
          await createShiprocketOrder({
            orderId:
              order.orderId,

            createdAt:
              order.createdAt,

            shippingAddress:
              order.shippingAddress,

            items:
              order.items,

            totalAmount:
              order.totalAmount,

            paymentMethod:
              "PREPAID",

            notes:
              order.notes,
          });

        order.shiprocketOrderId =
          shiprocket.shiprocketOrderId ||
          "";

        order.shiprocketShipmentId =
          shiprocket.shiprocketShipmentId ||
          "";

        order.awbNumber =
          shiprocket.awbNumber ||
          "";

        order.courierName =
          shiprocket.courierName ||
          "";

        order.trackingUrl =
          shiprocket.trackingUrl ||
          "";

        order.orderStatus =
          "processing";

        await order.save();

      } catch (shiprocketError) {

        // IMPORTANT:
        // Payment is already successful.
        // Do NOT change paymentStatus to failed.

        console.error(
          "[order/shiprocket]",
          shiprocketError
        );

        // Keep:
        // paymentStatus = paid
        // orderStatus = confirmed
      }

      // -----------------------------------------------------
      // RESPONSE
      // -----------------------------------------------------

      return successResponse(
        {
          order: {
            id:
              order._id.toString(),

            orderId:
              order.orderId,

            totalAmount:
              order.totalAmount,

            paymentStatus:
              order.paymentStatus,

            orderStatus:
              order.orderStatus,

            razorpayOrderId:
              order.razorpayOrderId,

            razorpayPaymentId:
              order.razorpayPaymentId,

            shiprocketOrderId:
              order.shiprocketOrderId,

            shiprocketShipmentId:
              order.shiprocketShipmentId,

            awbNumber:
              order.awbNumber,

            courierName:
              order.courierName,

            trackingUrl:
              order.trackingUrl,
          },

          message:
            "Payment verified and order confirmed",
        },

        200
      );

    } catch (err) {

      console.error(
        "[order/verifyPayment]",
        err
      );

      return errorResponse(
        "Payment verification failed",
        500
      );
    }
  },

  // =========================================================
  // GET USER ORDERS
  // =========================================================

  async getUserOrders(request) {

    try {

      await connectDB();

      const auth =
        await getAuthenticatedUser();

      if (!auth) {
        return errorResponse(
          "Not authenticated",
          401
        );
      }

      const orders =
        await Order.find({
          user: auth.userId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      const formatted =
        orders.map((o) => ({
          id:
            o._id.toString(),

          orderId:
            o.orderId,

          items:
            o.items,

          subtotal:
            o.subtotal,

          shippingCharge:
            o.shippingCharge,

          discount:
            o.discount,

          couponCode:
            o.couponCode,

          couponDiscount:
            o.couponDiscount,

          totalAmount:
            o.totalAmount,

          paymentMethod:
            o.paymentMethod,

          paymentStatus:
            o.paymentStatus,

          razorpayOrderId:
            o.razorpayOrderId,

          razorpayPaymentId:
            o.razorpayPaymentId,

          orderStatus:
            o.orderStatus,

          awbNumber:
            o.awbNumber,

          courierName:
            o.courierName,

          trackingUrl:
            o.trackingUrl,

          shiprocketOrderId:
            o.shiprocketOrderId,

          shiprocketShipmentId:
            o.shiprocketShipmentId,

          shippingAddress:
            o.shippingAddress,

          confirmedAt:
            o.confirmedAt,

          shippedAt:
            o.shippedAt,

          deliveredAt:
            o.deliveredAt,

          cancelledAt:
            o.cancelledAt,

          createdAt:
            o.createdAt,
        }));

      return successResponse(
        formatted
      );

    } catch (err) {

      console.error(
        "[order/getUserOrders]",
        err
      );

      return errorResponse(
        "Failed to fetch orders",
        500
      );
    }
  },

  // =========================================================
  // TRACK ORDER
  // =========================================================

  async trackOrderByAwb(
    request,
    context
  ) {

    try {

      const params =
        await context.params;

      const { awb } =
        params;

      if (!awb) {
        return errorResponse(
          "AWB number is required",
          422
        );
      }

      const tracking =
        await trackOrder(awb);

      return successResponse(
        tracking
      );

    } catch (err) {

      console.error(
        "[order/track]",
        err
      );

      return errorResponse(
        "Failed to fetch tracking info",
        500
      );
    }
  },

  // =========================================================
  // ADMIN - GET ALL ORDERS
  // =========================================================

  async getAllOrders(request) {

    try {

      await connectDB();

      const {
        searchParams,
      } = new URL(
        request.url
      );

      const status =
        searchParams.get(
          "status"
        );

      const page = Math.max(
        1,
        parseInt(
          searchParams.get(
            "page"
          ) || "1",
          10
        )
      );

      const limit = Math.min(
        100,
        Math.max(
          1,
          parseInt(
            searchParams.get(
              "limit"
            ) || "20",
            10
          )
        )
      );

      const filter = {};

      if (status) {
        filter.orderStatus =
          status;
      }

      const [
        orders,
        total,
      ] = await Promise.all([

        Order.find(filter)
          .populate(
            "user",
            "name phone email"
          )
          .sort({
            createdAt: -1,
          })
          .skip(
            (page - 1) *
              limit
          )
          .limit(limit)
          .lean(),

        Order.countDocuments(
          filter
        ),
      ]);

      const formatted =
        orders.map((o) => ({
          id:
            o._id.toString(),

          orderId:
            o.orderId,

          user:
            o.user
              ? {
                  id:
                    o.user._id.toString(),

                  name:
                    o.user.name ||
                    "—",

                  phone:
                    o.user.phone ||
                    "—",

                  email:
                    o.user.email ||
                    "—",
                }
              : null,

          items:
            o.items,

          subtotal:
            o.subtotal,

          shippingCharge:
            o.shippingCharge,

          discount:
            o.discount,

          couponCode:
            o.couponCode,

          couponDiscount:
            o.couponDiscount,

          totalAmount:
            o.totalAmount,

          paymentMethod:
            o.paymentMethod,

          paymentStatus:
            o.paymentStatus,

          razorpayOrderId:
            o.razorpayOrderId,

          razorpayPaymentId:
            o.razorpayPaymentId,

          orderStatus:
            o.orderStatus,

          awbNumber:
            o.awbNumber,

          courierName:
            o.courierName,

          trackingUrl:
            o.trackingUrl,

          shiprocketOrderId:
            o.shiprocketOrderId,

          shiprocketShipmentId:
            o.shiprocketShipmentId,

          shippingAddress:
            o.shippingAddress,

          confirmedAt:
            o.confirmedAt,

          shippedAt:
            o.shippedAt,

          deliveredAt:
            o.deliveredAt,

          cancelledAt:
            o.cancelledAt,

          createdAt:
            o.createdAt,
        }));

      return successResponse({
        orders:
          formatted,

        total,

        page,

        limit,

        totalPages:
          Math.ceil(
            total / limit
          ),
      });

    } catch (err) {

      console.error(
        "[order/getAll]",
        err
      );

      return errorResponse(
        "Failed to fetch orders",
        500
      );
    }
  },

  // =========================================================
  // ADMIN - UPDATE ORDER
  // =========================================================

  async updateOrderStatus(
    request,
    context
  ) {

    try {

      await connectDB();

      const params =
        await context.params;

      const { id } =
        params;

      const body =
        await request.json();

      const order =
        await Order.findById(id);

      if (!order) {
        return errorResponse(
          "Order not found",
          404
        );
      }

      if (body.orderStatus) {

        order.orderStatus =
          body.orderStatus;
      }

      if (body.paymentStatus) {

        order.paymentStatus =
          body.paymentStatus;
      }

      if (body.awbNumber !== undefined) {

        order.awbNumber =
          body.awbNumber;
      }

      if (
        body.courierName !==
        undefined
      ) {

        order.courierName =
          body.courierName;
      }

      if (
        body.trackingUrl !==
        undefined
      ) {

        order.trackingUrl =
          body.trackingUrl;
      }

      // -----------------------------------------------------
      // TIMESTAMPS
      // -----------------------------------------------------

      if (
        body.orderStatus ===
          "confirmed" &&
        !order.confirmedAt
      ) {

        order.confirmedAt =
          new Date();
      }

      if (
        body.orderStatus ===
          "shipped" &&
        !order.shippedAt
      ) {

        order.shippedAt =
          new Date();
      }

      if (
        body.orderStatus ===
          "delivered" &&
        !order.deliveredAt
      ) {

        order.deliveredAt =
          new Date();
      }

      if (
        body.orderStatus ===
          "cancelled" &&
        !order.cancelledAt
      ) {

        order.cancelledAt =
          new Date();
      }

      await order.save();

      return successResponse({
        order: {
          id:
            order._id.toString(),

          orderId:
            order.orderId,

          paymentStatus:
            order.paymentStatus,

          orderStatus:
            order.orderStatus,

          awbNumber:
            order.awbNumber,

          trackingUrl:
            order.trackingUrl,
        },

        message:
          "Order updated",
      });

    } catch (err) {

      console.error(
        "[order/updateStatus]",
        err
      );

      return errorResponse(
        "Failed to update order",
        500
      );
    }
  },

  // =========================================================
  // RETRIGGER SHIPROCKET (Admin only)
  // =========================================================

  async retriggerShiprocket(request, context) {
    try {
      await connectDB();

      const { id } = await context.params;

      const order = await Order.findById(id).lean();

      if (!order) {
        return errorResponse("Order not found", 404);
      }

      // Only allow for confirmed/processing/paid orders
      const allowedStatuses = ["confirmed", "processing", "pending"];
      if (!allowedStatuses.includes(order.orderStatus) && order.paymentStatus !== "paid" && order.paymentMethod !== "COD") {
        return errorResponse("Order is not eligible for Shiprocket creation", 422);
      }

      const shiprocket = await createShiprocketOrder({
        orderId:        order.orderId,
        createdAt:      order.createdAt,
        shippingAddress: order.shippingAddress,
        items:          order.items,
        totalAmount:    order.totalAmount,
        paymentMethod:  order.paymentMethod,
        notes:          order.notes || "",
      });

      await Order.findByIdAndUpdate(id, {
        shiprocketOrderId:    shiprocket.shiprocketOrderId,
        shiprocketShipmentId: shiprocket.shiprocketShipmentId,
        awbNumber:            shiprocket.awbNumber,
        courierName:          shiprocket.courierName,
        trackingUrl:          shiprocket.trackingUrl,
        orderStatus:          "processing",
      });

      return successResponse({
        shiprocketOrderId:    shiprocket.shiprocketOrderId,
        shiprocketShipmentId: shiprocket.shiprocketShipmentId,
        awbNumber:            shiprocket.awbNumber,
        courierName:          shiprocket.courierName,
        trackingUrl:          shiprocket.trackingUrl,
        message:              "Shiprocket order created successfully",
      });

    } catch (err) {
      console.error("[order/retriggerShiprocket]", err);
      return errorResponse(err?.message || "Failed to create Shiprocket order", 500);
    }
  },
};