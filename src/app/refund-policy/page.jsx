"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

const STEPS = [
  { icon: "📸", title: "Document the Issue", desc: "Take clear photos/videos of the damaged or defective product within 48 hours of delivery." },
  { icon: "📧", title: "Contact Us", desc: "Email us at riyaartpalace08@gmail.com with your Order ID, photos, and a brief description of the issue." },
  { icon: "✅", title: "Approval", desc: "Our team will review your request within 2 business days and notify you of the approval status." },
  { icon: "📦", title: "Return Shipment", desc: "Once approved, ship the product back in original packaging. We will share the return address." },
  { icon: "💰", title: "Refund / Replacement", desc: "After receiving and inspecting the return, we will process your refund or dispatch a replacement within 5–7 business days." },
];

const ELIGIBLE = [
  "Product received is damaged, broken, or defective",
  "Wrong product delivered (different from what was ordered)",
  "Product is significantly different from the description or images",
  "Product is missing parts or accessories as described",
];

const NOT_ELIGIBLE = [
  "Minor colour variations due to handcrafted nature of products",
  "Damage caused by misuse, improper handling, or negligence after delivery",
  "Items returned without prior approval or after the 7-day window",
  "Products without original packaging, tags, or in used condition",
  "Change of mind or personal preference",
  "Customised or personalised products",
];

export default function RefundPolicyPage() {
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
        .pol-steps{display:flex;flex-direction:column;gap:16px;margin-top:8px}
        .pol-step{display:flex;gap:16px;background:#fff;border:1.5px solid #e8d0c0;border-radius:14px;padding:18px 20px;align-items:flex-start}
        .pol-step-icon{font-size:28px;flex-shrink:0;margin-top:2px}
        .pol-step-title{font-family:'Manrope',sans-serif;font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:4px}
        .pol-step-desc{font-family:'Manrope',sans-serif;font-size:14px;color:#666;line-height:1.6}
        .pol-list{list-style:none;padding:0;margin:0}
        .pol-list li{font-family:'Manrope',sans-serif;font-size:15px;color:#555;line-height:1.7;padding:8px 0 8px 28px;position:relative;border-bottom:1px solid #f0ede9}
        .pol-list li:last-child{border-bottom:none}
        .pol-list.green li::before{content:"✓";position:absolute;left:0;color:#16a34a;font-weight:700}
        .pol-list.red li::before{content:"✗";position:absolute;left:0;color:#dc2626;font-weight:700}
        .pol-highlight{background:#FFF3EB;border:1.5px solid #FF6500;border-radius:14px;padding:20px 24px;margin-bottom:24px}
        .pol-highlight strong{color:#FF6500}
        .pol-highlight p{font-family:'Manrope',sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0}
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
        <div className="pol-tag">Customer Care</div>
        <h1 className="pol-title">Refund & Return Policy</h1>
        <p className="pol-date">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: September 2, 2026</p>
      </div>

      <div className="pol-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Refund Policy</span>
      </div>

      <div className="pol-body">
        <div className="pol-intro">
          At <strong>Riya Art Palace</strong>, we take great pride in our handcrafted products. If you receive a damaged or incorrect item, we are here to make it right. Please read this policy carefully to understand your rights and the return process.
        </div>

        {/* Return Window */}
        <div className="pol-section">
          <div className="pol-section-title">Return Window</div>
          <div className="pol-highlight">
            <p><strong>7-Day Return Policy</strong> — You must initiate a return request within <strong>7 days</strong> of the delivery date. Requests raised after this period will not be accepted.</p>
          </div>
          <p>All returned items must be in their original, unused condition with original packaging, tags, and accessories intact.</p>
        </div>

        {/* Eligible */}
        <div className="pol-section">
          <div className="pol-section-title">Eligible for Return / Refund</div>
          <ul className="pol-list green">
            {ELIGIBLE.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Not Eligible */}
        <div className="pol-section">
          <div className="pol-section-title">Not Eligible for Return</div>
          <ul className="pol-list red">
            {NOT_ELIGIBLE.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Process */}
        <div className="pol-section">
          <div className="pol-section-title">Return Process — Step by Step</div>
          <div className="pol-steps">
            {STEPS.map((step, i) => (
              <div key={i} className="pol-step">
                <div className="pol-step-icon">{step.icon}</div>
                <div>
                  <div className="pol-step-title">Step {i + 1}: {step.title}</div>
                  <div className="pol-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Mode */}
        <div className="pol-section">
          <div className="pol-section-title">Refund Mode & Timeline</div>
          <p>Approved refunds will be credited to the original payment method within <strong>5–7 business days</strong> after the returned product is received and inspected.</p>
          <p>For Cash on Delivery (COD) orders, refunds will be processed via bank transfer or UPI. Please share your bank details when raising the return request.</p>
          <p>Shipping charges are non-refundable unless the return is due to our error (wrong or defective product).</p>
        </div>

        {/* Replacement */}
        <div className="pol-section">
          <div className="pol-section-title">Replacement Option</div>
          <p>Instead of a refund, you may opt for a replacement of the same product (subject to availability). If the item is out of stock, a full refund will be processed.</p>
        </div>

        <div className="pol-contact">
          <h3>Need Help with a Return?</h3>
          <p>Contact our support team and we will guide you through the process.</p>
          <a href="mailto:riyaartpalace08@gmail.com">riyaartpalace08@gmail.com</a>
          <p style={{ marginTop: 16, marginBottom: 0 }}>
            <Link href="/shipping-policy" style={{ color: "#FF6500", fontWeight: 700, textDecoration: "none" }}>View Shipping Policy →</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
