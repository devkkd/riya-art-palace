import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, default: "" },
    image:       { type: String, default: "" },
    price:       { type: Number, required: true },
    priceUnit:   { type: String, default: "Piece" },
    quantity:    { type: Number, required: true, min: 1 },
    subtotal:    { type: Number, required: true },
  },
  { _id: true }
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName:  String,
    line1:     String,
    line2:     { type: String, default: "" },
    city:      String,
    state:     String,
    pincode:   String,
    country:   { type: String, default: "India" },
    phone:     String,
    altPhone:  { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
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
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },

    // Amounts
    subtotal:       { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount:       { type: Number, default: 0 },
    totalAmount:    { type: Number, required: true },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "PREPAID"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId:  { type: String, default: "" },
    razorpayPaymentId:{ type: String, default: "" },

    // Order status
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
      default: "pending",
      index: true,
    },

    // Shiprocket fields
    shiprocketOrderId:    { type: String, default: "" },
    shiprocketShipmentId: { type: String, default: "" },
    awbNumber:            { type: String, default: "" },
    courierName:          { type: String, default: "" },
    trackingUrl:          { type: String, default: "" },

    // Pickup details
    pickupPincode:   { type: String, default: "" },
    deliveryPincode: { type: String, default: "" },

    // Timeline
    confirmedAt:  { type: Date, default: null },
    shippedAt:    { type: Date, default: null },
    deliveredAt:  { type: Date, default: null },
    cancelledAt:  { type: Date, default: null },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
