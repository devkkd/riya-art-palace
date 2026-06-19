/**
 * Shiprocket Service — handles all Shiprocket API calls.
 * In DUMMY mode (SHIPROCKET_DUMMY=true), returns mocked responses
 * so development works without a real Shiprocket account.
 */

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const DUMMY_MODE = process.env.SHIPROCKET_DUMMY === "true";

let cachedToken = null;
let tokenExpiry = null;

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function getShiprocketToken() {
  if (DUMMY_MODE) return "dummy-sr-token";

  // Return cached token if still valid (expires in 10 days, refresh 1 day early)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  if (!data.token) throw new Error("Shiprocket auth failed: " + JSON.stringify(data));

  cachedToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days
  return cachedToken;
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

/**
 * Send OTP to phone via Shiprocket.
 * Returns { session_token } which must be passed to verifyOtp.
 */
export async function sendOtp(phone) {
  if (DUMMY_MODE) {
    console.log(`[DUMMY] OTP sent to ${phone}: 1234`);
    return { session_token: `dummy-session-${phone}`, success: true };
  }

  const res = await fetch(`${BASE_URL}/auth/otp/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile: phone }),
  });

  const data = await res.json();
  if (!data.session_token) throw new Error(data.message || "Failed to send OTP");
  return { session_token: data.session_token, success: true };
}

/**
 * Verify OTP entered by user.
 * Returns { verified: true } on success.
 */
export async function verifyOtp(phone, otp, sessionToken) {
  if (DUMMY_MODE) {
    const valid = otp === "1234";
    return { verified: valid, message: valid ? "OTP verified" : "Invalid OTP" };
  }

  const res = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mobile: phone,
      otp,
      session_token: sessionToken,
    }),
  });

  const data = await res.json();
  const verified = data.status === 1 || data.verified === true || data.success === true;
  return { verified, message: data.message || "" };
}

// ─── Serviceability ───────────────────────────────────────────────────────────

/**
 * Check if delivery is possible to a pincode.
 */
export async function checkServiceability({ pickupPincode, deliveryPincode, weight = 0.5, cod = 0 }) {
  if (DUMMY_MODE) {
    return {
      available: true,
      couriers: [
        { courier_name: "Delhivery", rate: 45, etd: "3-5 days", courier_id: 1 },
        { courier_name: "DTDC",      rate: 55, etd: "4-6 days", courier_id: 2 },
        { courier_name: "BlueDart",  rate: 80, etd: "2-3 days", courier_id: 3 },
      ],
    };
  }

  const token = await getShiprocketToken();
  const params = new URLSearchParams({
    pickup_postcode:   pickupPincode,
    delivery_postcode: deliveryPincode,
    weight:            String(weight),
    cod:               String(cod),
  });

  const res = await fetch(`${BASE_URL}/courier/serviceability/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!data.data?.available_courier_companies) {
    return { available: false, couriers: [] };
  }

  const couriers = data.data.available_courier_companies.map((c) => ({
    courier_name: c.courier_name,
    rate:         c.rate,
    etd:          c.estimated_delivery_days ? `${c.estimated_delivery_days} days` : "—",
    courier_id:   c.courier_company_id,
  }));

  return { available: couriers.length > 0, couriers };
}

// ─── Create Order ──────────────────────────────────────────────────────────────

/**
 * Create a shipment order on Shiprocket after an order is placed.
 */
export async function createShiprocketOrder(order) {
  if (DUMMY_MODE) {
    const dummyOrderId   = `SR-DUMMY-${Date.now()}`;
    const dummyShipmentId = `SH-DUMMY-${Date.now()}`;
    const dummyAwb        = `AWB${Math.floor(Math.random() * 1e12)}`;
    console.log(`[DUMMY] Shiprocket order created: ${dummyOrderId}, AWB: ${dummyAwb}`);
    return {
      shiprocketOrderId:    dummyOrderId,
      shiprocketShipmentId: dummyShipmentId,
      awbNumber:            dummyAwb,
      courierName:          "Delhivery (DUMMY)",
      trackingUrl:          `https://shiprocket.co/tracking/${dummyAwb}`,
    };
  }

  const token = await getShiprocketToken();
  const addr  = order.shippingAddress;

  const payload = {
    order_id:         order.orderId,
    order_date:       new Date(order.createdAt).toISOString().slice(0, 10),
    pickup_location:  "Primary",
    channel_id:       "",
    comment:          order.notes || "",
    billing_customer_name:    `${addr.firstName} ${addr.lastName}`,
    billing_last_name:        addr.lastName,
    billing_address:          addr.line1,
    billing_address_2:        addr.line2 || "",
    billing_city:             addr.city,
    billing_pincode:          addr.pincode,
    billing_state:            addr.state,
    billing_country:          addr.country || "India",
    billing_email:            "",
    billing_phone:            addr.phone,
    shipping_is_billing:      true,
    order_items: order.items.map((item) => ({
      name:      item.productName,
      sku:       item.productId.toString(),
      units:     item.quantity,
      selling_price: item.price,
    })),
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total:      order.totalAmount,
    length:         10,
    breadth:        10,
    height:         10,
    weight:         0.5,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data.order_id) throw new Error(data.message || "Shiprocket order creation failed");

  // Assign courier (auto)
  const shipRes = await fetch(`${BASE_URL}/shipments/create/forward-shipment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: [data.shipment_id] }),
  });

  const shipData = await shipRes.json();
  const awb     = shipData.response?.data?.awb_assign_status_details?.awb || "";
  const courier = shipData.response?.data?.awb_assign_status_details?.courier_name || "";

  return {
    shiprocketOrderId:    String(data.order_id),
    shiprocketShipmentId: String(data.shipment_id),
    awbNumber:            awb,
    courierName:          courier,
    trackingUrl:          awb ? `https://shiprocket.co/tracking/${awb}` : "",
  };
}

// ─── Track Order ──────────────────────────────────────────────────────────────

export async function trackOrder(awbNumber) {
  if (DUMMY_MODE || !awbNumber || awbNumber.startsWith("AWB")) {
    return {
      current_status: "In Transit",
      delivered_date: null,
      shipment_track_activities: [
        { date: new Date().toISOString(), activity: "Shipment picked up",         location: "Jaipur" },
        { date: new Date().toISOString(), activity: "In transit to Delhi hub",     location: "Delhi Hub" },
        { date: new Date().toISOString(), activity: "Out for delivery",             location: "Local Hub" },
      ],
    };
  }

  const token = await getShiprocketToken();
  const res   = await fetch(`${BASE_URL}/courier/track/awb/${awbNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.tracking_data || {};
}
