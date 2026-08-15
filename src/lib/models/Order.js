import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productSlug: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceUnit: {
      type: String,
      default: "Piece",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    line1: {
      type: String,
      required: true,
      trim: true,
    },

    line2: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    altPhone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new mongoose.Schema(
  {
    // ---------------------------------------------------------
    // ORDER
    // ---------------------------------------------------------

    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    // ---------------------------------------------------------
    // AMOUNTS
    // ---------------------------------------------------------

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ---------------------------------------------------------
    // COUPON
    // ---------------------------------------------------------

    couponCode: {
      type: String,
      default: "",
      trim: true,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ---------------------------------------------------------
    // PAYMENT
    // ---------------------------------------------------------

   paymentMethod: {
  type: String,
  enum: ["COD", "PREPAID"],
  default: "PREPAID",
  required: true,
},

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // ---------------------------------------------------------
    // ORDER STATUS
    // ---------------------------------------------------------

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
      index: true,
    },

    // ---------------------------------------------------------
    // SHIPROCKET
    // ---------------------------------------------------------

    shiprocketOrderId: {
      type: String,
      default: "",
      index: true,
    },

    shiprocketShipmentId: {
      type: String,
      default: "",
    },

    awbNumber: {
      type: String,
      default: "",
      index: true,
    },

    courierName: {
      type: String,
      default: "",
    },

    trackingUrl: {
      type: String,
      default: "",
    },

    // ---------------------------------------------------------
    // PINCODES
    // ---------------------------------------------------------

    pickupPincode: {
      type: String,
      default: "",
    },

    deliveryPincode: {
      type: String,
      default: "",
    },

    // ---------------------------------------------------------
    // TIMELINE
    // ---------------------------------------------------------

    confirmedAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    // ---------------------------------------------------------
    // NOTES
    // ---------------------------------------------------------

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);