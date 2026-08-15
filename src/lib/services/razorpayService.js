import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

function getRazorpayInstance() {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials are missing. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayInstance;
}

/**
 * Create Razorpay Order
 *
 * amount is in INR.
 * Razorpay internally receives paise.
 *
 * Example:
 * ₹999 => 99900 paise
 */
export async function createRazorpayOrder({
  amount,
  receipt,
  notes = {},
}) {
  const razorpay = getRazorpayInstance();

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid Razorpay amount");
  }

  if (!receipt) {
    throw new Error("Razorpay receipt is required");
  }

  const amountInPaise = Math.round(numericAmount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: String(receipt),
    notes,
  });

  return order;
}

/**
 * Verify Razorpay payment signature.
 */
export function verifyRazorpayPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is missing");
  }

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature);
  const receivedBuffer = Buffer.from(razorpaySignature);

  if (generatedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    generatedBuffer,
    receivedBuffer
  );
}