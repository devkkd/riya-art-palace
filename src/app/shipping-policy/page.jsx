"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

const ZONES = [
  { zone: "Jaipur & Rajasthan", days: "2–4 business days", charge: "Free above ₹999" },
  { zone: "Metro Cities (Delhi, Mumbai, Bangalore, etc.)", days: "3–5 business days", charge: "Free above ₹999" },
  { zone: "Other Cities & Towns", days: "4–7 business days", charge: "Free above ₹999" },
  { zone: "Remote / Rural Areas", days: "6–10 business days", charge: "₹60 flat" },
];

const FAQS = [
  {
    q: "What if my order is delayed?",
    a: "Delivery timelines are estimates. Delays may occur due to weather conditions, public holidays, or high-volume periods. If your order is significantly delayed, please contact us and we will investigate with the courier.",
  },
  {
    q: "Can I change my delivery address after placing an order?",
    a: "Address changes can only be made before the order is dispatched. Contact us immediately at riyaartpalace08@gmail.com with your Order ID.",
  },
  {
    q: "What if I'm not available at the time of delivery?",
    a: "The courier will attempt delivery up to 3 times. After that, the package may be returned to us. Re-delivery charges may apply.",
  },
  {
    q: "Do you ship outside India?",
    a: "Currently, we ship only within India. International shipping will be available soon. For bulk/wholesale international orders, please contact us directly.",
  },
  {
    q: "How are fragile products packaged?",
    a: "All fragile and delicate handcrafted items are carefully bubble-wrapped and packed with protective materials to ensure safe delivery.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .pol-hero{background:linear-gradient(135deg,#fce8dc 0%,#F7F5F3 100%);padding:72px clamp(16px,5vw,64px) 56px;text-align:center;border-bottom:1px solid #e8d0c0}
        .pol-tag{display:inline-block;background:#FF6500;color:#fff;font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 16px;border-radius:999px;margin-bottom:20px}
        .pol-title{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,52px);font-weight:800;color:#1a1a1a;line-height:1.2;margin-bottom:16px}
        .pol-date{font-family:'Manrope',sans-serif;font-size:13px;color:#888}
        .pol-body{max-width:800px;margin:0 auto;padding:64px clamp(16px,5vw,40px) 80px}
        .pol-intro{font-family:'Manrope',sans-serif;font-size:16px;color:#555;line-height:1.8;background:#fff;border:1.5px solid #e8d0c0;border-radius:14px;padding:24px 28px;margin-bottom:48px}
        .pol-intro strong{color:#FF6500}
        .pol-section{margin-bottom:40px}
        .pol-section-title{font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fce8dc;display:flex;align-items:center;gap:10px}
        .pol-section-title::before{content:"";width:4px;height:20px;background:#FF6500;border-radius:2px;display:inline-block;flex-shrink:0}
        .pol-section p{font-family:'Manrope',sans-serif;font-size:15px;color:#555;line-height:1.8;margin-bottom:10px}
        .pol-section p:last-child{margin-bottom:0}
        .pol-highlight{background:#FFF3EB;border:1.5px solid #FF6500;border-radius:14px;padding:20px 24px;margin-bottom:24px}
        .pol-highlight p{font-family:'Manrope',sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0}
        .pol-highlight strong{color:#FF6500}
        /* Shipping zones table */
        .pol-table{width:100%;border-collapse:collapse;border-radius:14px;overflow:hidden;border:1.5px solid #e8d0c0}
        .pol-table th{background:#fce8dc;font-family:'Manrope',sans-serif;font-size:13px;font-weight:700;color:#1a1a1a;text-align:left;padding:12px 16px;text-transform:uppercase;letter-spacing:0.04em}
        .pol-table td{font-family:'Manrope',sans-serif;font-size:14px;color:#555;padding:14px 16px;border-top:1px solid #f0ede9;line-height:1.5}
        .pol-table tr:hover td{background:#fffaf7}
        /* Couriers */
        .pol-couriers{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
        .pol-courier{background:#fff;border:1.5px solid #e8d0c0;border-radius:12px;padding:12px 20px;font-family:'Manrope',sans-serif;font-size:14px;font-weight:600;color:#1a1a1a;display:flex;align-items:center;gap:8px}
        /* FAQ */
        .pol-faq{display:flex;flex-direction:column;gap:12px}
        .pol-faq-item{background:#fff;border:1.5px solid #e8d0c0;border-radius:12px;padding:18px 20px}
        .pol-faq-q{font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px}
        .pol-faq-a{font-family:'Manrope',sans-serif;font-size:14px;color:#666;line-height:1.7;margin:0}
        .pol-contact{background:#fce8dc;border-radius:16px;padding:28px 32px;margin-top:56px;text-align:center}
        .pol-contact h3{font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:8px}
        .pol-contact p{font-family:'Manrope',sans-serif;font-size:14px;color:#555;line-height:1.7;margin-bottom:12px}
        .pol-contact a{color:#FF6500;text-decoration:none;font-weight:700}
        .pol-contact a:hover{text-decoration:underline}
        .pol-breadcrumb{display:flex;align-items:center;gap:8px;font-family:'Manrope',sans-serif;font-size:13px;color:#888;max-width:800px;margin:0 auto;padding:24px clamp(16px,5vw,40px) 0}
        .pol-breadcrumb a{color:#555;text-decoration:none}
        .pol-breadcrumb a:hover{color:#FF6500}
        .pol-breadcrumb span{color:#FF6500;font-weight:700}
      `}</style>

      <div className="pol-hero">
        <div className="pol-tag">Shipping</div>
        <h1 className="pol-title">Shipping Policy</h1>
        <p className="pol-date">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: September 2, 2026</p>
      </div>

      <div className="pol-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Shipping Policy</span>
      </div>

      <div className="pol-body">
        <div className="pol-intro">
          At <strong>Riya Art Palace</strong>, we carefully pack every handcrafted item and ship it with trusted courier partners across India. Here's everything you need to know about our shipping process.
        </div>

        {/* Free Shipping */}
        <div className="pol-section">
          <div className="pol-section-title">Free Shipping</div>
          <div className="pol-highlight">
            <p><strong>Free shipping on all orders above ₹999.</strong> For orders below ₹999, a flat shipping charge of <strong>₹60</strong> is applicable.</p>
          </div>
        </div>

        {/* Processing Time */}
        <div className="pol-section">
          <div className="pol-section-title">Order Processing Time</div>
          <p>Orders are processed within <strong>1–2 business days</strong> after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
          <p>You will receive an email confirmation with your tracking details once the order is dispatched.</p>
        </div>

        {/* Delivery Zones */}
        <div className="pol-section">
          <div className="pol-section-title">Delivery Timelines by Zone</div>
          <table className="pol-table">
            <thead>
              <tr>
                <th>Delivery Zone</th>
                <th>Estimated Delivery</th>
                <th>Shipping Charge</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map((z, i) => (
                <tr key={i}>
                  <td>{z.zone}</td>
                  <td>{z.days}</td>
                  <td>{z.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 13, color: "#999" }}>* Delivery timelines are estimates and may vary during festive seasons or due to unforeseen circumstances.</p>
        </div>

        {/* Courier Partners */}
        <div className="pol-section">
          <div className="pol-section-title">Our Courier Partners</div>
          <p>We ship through reliable logistics partners for timely and safe delivery:</p>
          <div className="pol-couriers">
            <div className="pol-courier">🚚 Delhivery</div>
            <div className="pol-courier">📦 DTDC</div>
            <div className="pol-courier">⚡ BlueDart</div>
            <div className="pol-courier">🔵 Ekart</div>
            <div className="pol-courier">📫 India Post</div>
          </div>
        </div>

        {/* Tracking */}
        <div className="pol-section">
          <div className="pol-section-title">Order Tracking</div>
          <p>Once your order is dispatched, you will receive a tracking link via email. You can also track your order from your account page under <strong>My Orders</strong>.</p>
          <p>For real-time updates, use the AWB number provided in your shipping confirmation email on the courier's website.</p>
        </div>

        {/* Damaged in Transit */}
        <div className="pol-section">
          <div className="pol-section-title">Damaged in Transit</div>
          <p>If your order arrives damaged, please photograph the damaged packaging and product immediately and contact us at <a href="mailto:riyaartpalace08@gmail.com" style={{ color: "#FF6500", fontWeight: 700 }}>riyaartpalace08@gmail.com</a> within <strong>48 hours of delivery</strong>.</p>
          <p>Please refer to our <Link href="/refund-policy" style={{ color: "#FF6500", fontWeight: 700, textDecoration: "none" }}>Refund Policy</Link> for the complete return process.</p>
        </div>

        {/* FAQs */}
        <div className="pol-section">
          <div className="pol-section-title">Frequently Asked Questions</div>
          <div className="pol-faq">
            {FAQS.map((faq, i) => (
              <div key={i} className="pol-faq-item">
                <div className="pol-faq-q">Q: {faq.q}</div>
                <p className="pol-faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pol-contact">
          <h3>Shipping Queries?</h3>
          <p>For any questions about your shipment, contact us and we'll respond within 24 hours.</p>
          <a href="mailto:riyaartpalace08@gmail.com">riyaartpalace08@gmail.com</a>
          <p style={{ marginTop: 16, marginBottom: 0 }}>
            <Link href="/refund-policy" style={{ color: "#FF6500", fontWeight: 700, textDecoration: "none" }}>View Refund Policy →</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
