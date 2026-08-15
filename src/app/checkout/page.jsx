"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/components/CartContext";
import Script from "next/script";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh"];

function AddressForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || { firstName:"",lastName:"",line1:"",line2:"",city:"",state:"",pincode:"",country:"India",phone:"" });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const inp = { height:44, border:"1.5px solid #C3BCB4", borderRadius:10, padding:"0 14px", fontSize:14, background:"#FAF8F6", outline:"none", width:"100%", fontFamily:"Poppins,sans-serif" };
  const lbl = { fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:"0.4px", fontFamily:"Manrope,sans-serif", display:"block", marginBottom:6 };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        {[["firstName","First Name *"],["lastName","Last Name *"],["line1","Address Line 1 *"],["line2","Address Line 2"],["city","City *"],["pincode","Pincode *"],["phone","Phone *"]].map(([k,l]) => (
          <div key={k} style={{ gridColumn: k==="line1"||k==="line2" ? "span 2":"auto" }}>
            <label style={lbl}>{l}</label>
            <input style={inp} value={f[k]} onChange={s(k)} placeholder={l.replace(" *","")} />
          </div>
        ))}
        <div>
          <label style={lbl}>State *</label>
          <select style={{ ...inp, cursor:"pointer" }} value={f.state} onChange={s("state")}>
            <option value="">Select State</option>
            {STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Country</label>
          <input style={{ ...inp, background:"#f0ede9", color:"#888" }} value="India" disabled />
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={() => onSave(f)} style={{ height:42, padding:"0 28px", border:"none", borderRadius:999, background:"#F85700", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Poppins,sans-serif" }}>
          Use This Address
        </button>
        {onCancel && <button onClick={onCancel} style={{ height:42, padding:"0 20px", border:"1.5px solid #C3BCB4", borderRadius:999, background:"transparent", fontSize:13, fontWeight:600, color:"#555", cursor:"pointer" }}>Cancel</button>}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();

  const [user,       setUser]       = useState(null);
  const [authLoading,setAuthLoading]= useState(true);
  const [step,       setStep]       = useState("address"); // address | payment | confirm
  const [selAddress, setSelAddress] = useState(null);
  const [showNewAddr,setShowNewAddr]= useState(false);
const [payMethod,  setPayMethod]  = useState("PREPAID"); // PREPAID | COD
  const [couponCode, setCouponCode] = useState("");
  const [coupon,     setCoupon]     = useState(null);
  const [couponErr,  setCouponErr]  = useState("");
  const [couponLoad, setCouponLoad] = useState(false);
  const [placing,    setPlacing]    = useState(false);
  const [orderErr,   setOrderErr]   = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user/me").then(r => r.json()).then(j => {
      if (j.success) {
        setUser(j.data.user);
        const def = j.data.user.addresses?.find(a => a.isDefault) || j.data.user.addresses?.[0];
        if (def) setSelAddress(def);
      } else {
        router.replace("/account");
      }
    }).catch(() => router.replace("/account"))
    .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!authLoading && items.length === 0) router.replace("/cart");
  }, [authLoading, items]);

  const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping       = subtotal >= 999 ? 0 : 60;
  const discount       = coupon?.discount || 0;
  const shippingWaived = coupon?.shippingWaived || false;
  const effectiveShip  = shippingWaived ? 0 : shipping;
  const total          = subtotal + effectiveShip - discount;

  const applyCouple = async () => {
    if (!couponCode.trim()) return;
    setCouponErr(""); setCouponLoad(true);
    try {
      const res  = await fetch("/api/coupons/validate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal, shippingCharge: shipping }),
      });
      const json = await res.json();
      if (json.success) setCoupon(json.data);
      else { setCouponErr(json.message); setCoupon(null); }
    } catch { setCouponErr("Failed to apply coupon"); }
    finally { setCouponLoad(false); }
  };

  const removeCoupon = () => { setCoupon(null); setCouponCode(""); setCouponErr(""); };

  const placeOrder = async () => {
  if (!selAddress) {
    setOrderErr("Please select a delivery address");
    return;
  }

  setOrderErr("");
  setPlacing(true);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),

        shippingAddress: {
          firstName: selAddress.firstName,
          lastName: selAddress.lastName,
          line1: selAddress.line1,
          line2: selAddress.line2 || "",
          city: selAddress.city,
          state: selAddress.state,
          pincode: selAddress.pincode,
          country: selAddress.country || "India",
          phone: selAddress.phone,
        },

        paymentMethod: payMethod,

        couponCode: coupon?.code || "",
      }),
    });

    const json = await res.json();

    if (!json.success) {
      setOrderErr(json.message || "Failed to place order");
      setPlacing(false);
      return;
    }

    // =========================================================
    // COD
    // =========================================================

    if (payMethod === "COD") {
      clearCart();

      router.push(
        `/order-success?orderId=${encodeURIComponent(
          json.data.order.orderId
        )}`
      );

      return;
    }

    // =========================================================
    // PREPAID / RAZORPAY
    // =========================================================

    if (payMethod === "PREPAID") {
      const razorpayData = json.data?.razorpay;
      console.log("RAZORPAY DATA:", razorpayData);
console.log("RAZORPAY KEY:", razorpayData?.keyId);

      if (!razorpayData?.orderId) {
        throw new Error(
          "Razorpay order was not created by the server."
        );
      }

      // Razorpay SDK loaded?
      if (!razorpayLoaded || typeof window === "undefined" || !window.Razorpay) {
  setOrderErr(
    "Razorpay checkout is still loading. Please try again in a moment."
  );
  setPlacing(false);
  return;
}

      const options = {
        key: razorpayData.keyId,

        amount: razorpayData.amount,

        currency: razorpayData.currency || "INR",

        name: "Riya Art Palace",

        description: `Payment for Order ${json.data.order.orderId}`,

        order_id: razorpayData.orderId,

        prefill: {
          name: `${selAddress.firstName || ""} ${
            selAddress.lastName || ""
          }`.trim(),

          contact: selAddress.phone || "",
        },

        notes: {
          orderId: json.data.order.orderId,
        },

        theme: {
          color: "#F85700",
        },

        handler: async function (response) {
          try {
            setPlacing(true);

            // =====================================================
            // VERIFY PAYMENT ON BACKEND
            // =====================================================

            const verifyRes = await fetch(
              "/api/orders/verify-payment",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

          body: JSON.stringify({
  orderId: json.data.order.orderId,

  razorpay_order_id:
    response.razorpay_order_id,

  razorpay_payment_id:
    response.razorpay_payment_id,

  razorpay_signature:
    response.razorpay_signature,
}),
              }
            );

            const verifyJson = await verifyRes.json();

            if (!verifyJson.success) {
              setOrderErr(
                verifyJson.message ||
                  "Payment verification failed."
              );

              setPlacing(false);
              return;
            }

            // Payment verified successfully
            clearCart();

            router.push(
              `/order-success?orderId=${encodeURIComponent(
                json.data.order.orderId
              )}`
            );
          } catch (error) {
            console.error(
              "[frontend/razorpay/verify]",
              error
            );

            setOrderErr(
              "Payment was received, but verification failed. Please contact support."
            );

            setPlacing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPlacing(false);

            setOrderErr(
              "Payment was cancelled. Your order is still pending."
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "[frontend/razorpay/payment-failed]",
            response
          );

          setOrderErr(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setPlacing(false);
        }
      );

      razorpay.open();

      return;
    }

    setOrderErr("Invalid payment method");
  } catch (error) {
    console.error("[frontend/order]", error);

    setOrderErr(
      error.message ||
        "Network error. Please try again."
    );

    setPlacing(false);
  }
};

  const inp = { height:44, border:"1.5px solid #C3BCB4", borderRadius:10, padding:"0 14px", fontSize:14, background:"#FAF8F6", outline:"none", fontFamily:"Poppins,sans-serif" };

  if (authLoading) return (
    <><Navbar/><div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:32, height:32, border:"3px solid #E5DDD5", borderTopColor:"#F85700", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
    </div><Footer/></>
  );

  return (
    
    <>
   <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
  onLoad={() => {
    console.log("[Razorpay] SDK loaded");
    setRazorpayLoaded(true);
  }}
  onError={() => {
    console.error("[Razorpay] SDK failed to load");
    setRazorpayLoaded(false);
    setOrderErr(
      "Razorpay failed to load. Please refresh the page."
    );
  }}
/>
      <Navbar/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        .co-page{background:#F7F5F3;min-height:100vh;padding:40px 0 80px}
        .co-inner{max-width:1100px;margin:0 auto;padding:0 40px}
        .co-title{font-family:"Manrope",sans-serif;font-size:26px;font-weight:800;color:#0E0E0E;letter-spacing:-0.02em;margin-bottom:32px}
        .co-layout{display:grid;grid-template-columns:1fr 360px;gap:32px;align-items:start}
        .co-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:14px;padding:28px 24px;margin-bottom:20px}
        .co-card-title{font-family:"Manrope",sans-serif;font-size:16px;font-weight:800;color:#0E0E0E;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .co-addr-card{border:1.5px solid #E0D9D1;border-radius:12px;padding:16px 18px;cursor:pointer;transition:border-color .15s;margin-bottom:12px}
        .co-addr-card.selected{border-color:#F85700;background:#FFF9F6}
        .co-addr-card:hover{border-color:#F85700}
        .co-pay-opt{display:flex;align-items:center;gap:12px;border:1.5px solid #E0D9D1;border-radius:12px;padding:16px 18px;cursor:pointer;margin-bottom:12px;transition:border-color .15s}
        .co-pay-opt.selected{border-color:#F85700;background:#FFF9F6}
        .co-pay-opt:hover{border-color:#F85700}
        .co-place-btn{width:100%;height:54px;border:none;border-radius:999px;background:#F85700;color:#fff;font-family:"Manrope",sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s}
        .co-place-btn:hover{background:#e84f00}
        .co-place-btn:disabled{background:#ccc;cursor:not-allowed}
        .co-sum-row{display:flex;justify-content:space-between;font-family:"Manrope",sans-serif;font-size:14px;color:#555;padding:8px 0;border-bottom:1px solid #F0EDE9}
        .co-sum-total{display:flex;justify-content:space-between;font-family:"Manrope",sans-serif;font-size:17px;font-weight:800;color:#0E0E0E;padding:16px 0 0;border-top:2px solid #E0D9D1;margin-top:4px}
        @media(max-width:900px){.co-layout{grid-template-columns:1fr}.co-inner{padding:0 16px}}
      `}</style>

      <div className="co-page">
        <div className="co-inner">
          <div className="co-title">Checkout</div>

          <div className="co-layout">
            {/* LEFT */}
            <div>
              {/* DELIVERY ADDRESS */}
              <div className="co-card">
                <div className="co-card-title">📍 Delivery Address</div>

                {user?.addresses?.length > 0 && !showNewAddr && (
                  <div style={{ marginBottom:16 }}>
                    {user.addresses.map((addr, i) => (
                      <div key={addr._id || i}
                        className={`co-addr-card${selAddress?._id === addr._id || (selAddress === addr) ? " selected" : ""}`}
                        onClick={() => setSelAddress(addr)}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div>
                            <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, marginBottom:4 }}>
                              {addr.firstName} {addr.lastName}
                              {addr.isDefault && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, background:"#F85700", color:"#fff", padding:"2px 8px", borderRadius:999 }}>Default</span>}
                            </div>
                            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#666", lineHeight:1.7 }}>
                              {addr.line1}{addr.line2 ? ", "+addr.line2 : ""}<br/>
                              {addr.city}, {addr.state} — {addr.pincode}<br/>
                              📞 {addr.phone}
                            </div>
                          </div>
                          <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${selAddress?._id===addr._id||selAddress===addr?"#F85700":"#C3BCB4"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {(selAddress?._id===addr._id||selAddress===addr) && <div style={{ width:10, height:10, borderRadius:"50%", background:"#F85700" }}/>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setShowNewAddr(true)} style={{ background:"none", border:"1.5px dashed #C3BCB4", borderRadius:12, padding:"12px 20px", fontSize:13, fontWeight:600, color:"#555", cursor:"pointer", width:"100%", fontFamily:"Manrope,sans-serif" }}>
                      + Add New Address
                    </button>
                  </div>
                )}

                {(user?.addresses?.length === 0 || showNewAddr) && (
                  <AddressForm
                    onCancel={user?.addresses?.length > 0 ? () => setShowNewAddr(false) : null}
                    onSave={async (addr) => {
                      // Save to account
                      const res = await fetch("/api/auth/user/addresses", {
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body: JSON.stringify(addr),
                      });
                      const j = await res.json();
                      if (j.success) {
                        setUser(prev => ({ ...prev, addresses: j.data.addresses }));
                        const last = j.data.addresses[j.data.addresses.length - 1];
                        setSelAddress(last);
                      }
                      setShowNewAddr(false);
                    }}
                  />
                )}
              </div>

              {/* PAYMENT METHOD */}
             <div className="co-card">
  <div className="co-card-title">💳 Payment Method</div>

  {[
    [
      "PREPAID",
      "Online Payment",
      "UPI, Cards, Net Banking",
    ],
    // [
    //   "COD",
    //   "Cash on Delivery",
    //   "Pay when your order arrives at your door",
    // ],
    
  ].map(([val, label, desc]) => (
    <div
      key={val}
      className={`co-pay-opt ${
        payMethod === val ? "selected" : ""
      }`}
      onClick={() => setPayMethod(val)}
      style={{
        opacity: 1,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${
            payMethod === val ? "#F85700" : "#C3BCB4"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {payMethod === val && (
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#F85700",
            }}
          />
        )}
      </div>

      <div>
        <div
          style={{
            fontFamily: "Manrope,sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#0E0E0E",
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontFamily: "Manrope,sans-serif",
            fontSize: 12,
            color: "#888",
            marginTop: 2,
          }}
        >
          {desc}
        </div>
      </div>

      {val === "PREPAID" && (
        <div
          style={{
            marginLeft: "auto",
            fontFamily: "Manrope,sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#065F46",
            background: "#D1FAE5",
            padding: "5px 9px",
            borderRadius: 999,
          }}
        >
          Secure
        </div>
      )}
    </div>
  ))}
</div>

              {/* COUPON */}
              <div className="co-card">
                <div className="co-card-title">🏷️ Coupon Code</div>
                {coupon ? (
                  <div style={{ background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, color:"#065F46" }}>✓ {coupon.code} applied</div>
                      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#047857", marginTop:2 }}>{coupon.message}</div>
                    </div>
                    <button onClick={removeCoupon} style={{ background:"none", border:"none", color:"#e53e3e", fontWeight:700, cursor:"pointer", fontSize:13 }}>Remove</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:"flex", gap:10 }}>
                      <input
                        style={{ ...inp, flex:1 }}
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponErr(""); }}
                        onKeyDown={e => e.key==="Enter" && applyCouple()}
                      />
                      <button onClick={applyCouple} disabled={couponLoad || !couponCode.trim()}
                        style={{ height:44, padding:"0 20px", border:"none", borderRadius:10, background: couponLoad||!couponCode.trim()?"#ccc":"#0E0E0E", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"Poppins,sans-serif", whiteSpace:"nowrap" }}>
                        {couponLoad ? "Checking…" : "Apply"}
                      </button>
                    </div>
                    {couponErr && <div style={{ fontFamily:"Manrope,sans-serif", fontSize:12, color:"#e53e3e", marginTop:8 }}>{couponErr}</div>}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div>
              <div className="co-card" style={{ position:"sticky", top:100 }}>
                <div className="co-card-title">🧾 Order Summary</div>

                {/* Items */}
                <div style={{ maxHeight:200, overflowY:"auto", marginBottom:16 }}>
                  {items.map(item => (
                    <div key={item.productId} style={{ display:"flex", gap:12, marginBottom:12, alignItems:"center" }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width:48, height:48, borderRadius:8, objectFit:"cover", flexShrink:0 }}/>
                      ) : (
                        <div style={{ width:48, height:48, borderRadius:8, background:"#f0ede9", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#ccc" }}>🖼</div>
                      )}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:600, color:"#0E0E0E", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        <div style={{ fontFamily:"Manrope,sans-serif", fontSize:12, color:"#888" }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, flexShrink:0 }}>₹{(item.price*item.quantity).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="co-sum-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="co-sum-row">
                  <span>Shipping</span>
                  <span style={{ color: effectiveShip===0?"#065F46":"inherit" }}>
                    {effectiveShip===0 ? (shippingWaived ? "FREE 🎉" : "FREE") : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="co-sum-row" style={{ color:"#065F46" }}>
                    <span>Coupon ({coupon?.code})</span>
                    <span>−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="co-sum-total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>

                {orderErr && (
                  <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:10, padding:"10px 14px", fontFamily:"Manrope,sans-serif", fontSize:13, color:"#991B1B", margin:"16px 0" }}>
                    {orderErr}
                  </div>
                )}

                <button
  className="co-place-btn"
  style={{ marginTop: 20 }}
  onClick={placeOrder}
  disabled={
    placing ||
    !selAddress ||
    (payMethod === "PREPAID" && !razorpayLoaded)
  }
>
                {placing
  ? "Placing Order…"
  : payMethod === "PREPAID" && !razorpayLoaded
    ? "Loading Payment…"
    : `Place Order — ₹${total.toLocaleString("en-IN")}`}
                </button>

                <div style={{ textAlign:"center", fontFamily:"Manrope,sans-serif", fontSize:11, color:"#aaa", marginTop:12 }}>
                  🔒 Secure checkout · Free returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
