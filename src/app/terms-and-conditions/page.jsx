"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Riya Art Palace website (www.riyaartpalace.com), placing an order, or creating an account, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.",
      "We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Products & Pricing",
    content: [
      "All products listed on Riya Art Palace are handcrafted items. Due to the handmade nature of our products, slight variations in colour, texture, and design may occur — these are not defects but a mark of authenticity.",
      "Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice.",
      "Product images are for illustrative purposes. The actual product may differ slightly due to screen calibration and handcrafted variations.",
    ],
  },
  {
    title: "3. Orders & Payments",
    content: [
      "Placing an order constitutes an offer to purchase the product(s) at the listed price. We reserve the right to accept or decline any order.",
      "Payment must be completed at the time of placing the order. We accept payments via UPI, credit/debit cards, net banking, and other methods available through Razorpay.",
      "An order confirmation email will be sent once your order is successfully placed. This confirmation does not guarantee availability — in case a product is out of stock, we will notify you promptly.",
    ],
  },
  {
    title: "4. Shipping & Delivery",
    content: [
      "We ship across India through our logistics partners. Delivery timelines are estimates and may vary depending on your location and courier availability.",
      "Riya Art Palace is not responsible for delays caused by courier partners, natural events, or circumstances beyond our control.",
      "Please refer to our Shipping Policy for complete details on delivery charges, timelines, and coverage areas.",
    ],
  },
  {
    title: "5. Cancellations & Returns",
    content: [
      "Orders may be cancelled before they are dispatched. Once shipped, cancellations will not be accepted.",
      "We accept returns within 7 days of delivery for damaged or defective products only. Items must be returned in their original packaging with all tags intact.",
      "Please refer to our Refund Policy for complete details on the return and refund process.",
    ],
  },
  {
    title: "6. User Accounts",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "All content on this website — including product images, logos, text, designs, and graphics — is the property of Riya Art Palace and is protected by copyright law.",
      "You may not reproduce, distribute, or use any content from this website without our prior written permission.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Riya Art Palace shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website.",
      "Our total liability in any matter arising out of or relating to these terms shall not exceed the amount paid by you for the specific product(s) in question.",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.",
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      "If you have any questions about these Terms and Conditions, please contact us at riyaartpalace08@gmail.com or write to us at: Riya Art Palace, Jaipur, Rajasthan, India.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        .pol-hero{background:linear-gradient(135deg,#fce8dc 0%,#F7F5F3 100%);padding:72px clamp(16px,5vw,64px) 56px;text-align:center;border-bottom:1px solid #e8d0c0}
        .pol-tag{display:inline-block;background:#FF6500;color:#fff;font-family:'Manrope',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 16px;border-radius:999px;margin-bottom:20px}
        .pol-title{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,52px);font-weight:800;color:#1a1a1a;line-height:1.2;margin-bottom:16px}
        .pol-date{font-family:'Manrope',sans-serif;font-size:13px;color:#888;margin-bottom:0}
        .pol-body{max-width:800px;margin:0 auto;padding:64px clamp(16px,5vw,40px) 80px}
        .pol-intro{font-family:'Manrope',sans-serif;font-size:16px;color:#555;line-height:1.8;background:#fff;border:1.5px solid #e8d0c0;border-radius:14px;padding:24px 28px;margin-bottom:48px}
        .pol-intro strong{color:#FF6500}
        .pol-section{margin-bottom:40px}
        .pol-section-title{font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #fce8dc;display:flex;align-items:center;gap:10px}
        .pol-section-title::before{content:"";width:4px;height:20px;background:#FF6500;border-radius:2px;display:inline-block;flex-shrink:0}
        .pol-section p{font-family:'Manrope',sans-serif;font-size:15px;color:#555;line-height:1.8;margin-bottom:10px}
        .pol-section p:last-child{margin-bottom:0}
        .pol-contact{background:#fce8dc;border-radius:16px;padding:28px 32px;margin-top:56px;text-align:center}
        .pol-contact h3{font-family:'Manrope',sans-serif;font-size:18px;font-weight:800;color:#1a1a1a;margin-bottom:8px}
        .pol-contact p{font-family:'Manrope',sans-serif;font-size:14px;color:#555;line-height:1.7;margin-bottom:16px}
        .pol-contact a{color:#FF6500;text-decoration:none;font-weight:700}
        .pol-contact a:hover{text-decoration:underline}
        .pol-breadcrumb{display:flex;align-items:center;gap:8px;font-family:'Manrope',sans-serif;font-size:13px;color:#888;max-width:800px;margin:0 auto;padding:24px clamp(16px,5vw,40px) 0}
        .pol-breadcrumb a{color:#555;text-decoration:none}
        .pol-breadcrumb a:hover{color:#FF6500}
        .pol-breadcrumb span{color:#FF6500;font-weight:700}
        .pol-links{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:24px}
        .pol-links a{font-family:'Manrope',sans-serif;font-size:13px;font-weight:600;color:#FF6500;text-decoration:none;border:1.5px solid #FF6500;border-radius:999px;padding:6px 18px;transition:all .15s}
        .pol-links a:hover{background:#FF6500;color:#fff}
      `}</style>

      <div className="pol-hero">
        <div className="pol-tag">Legal</div>
        <h1 className="pol-title">Terms & Conditions</h1>
        <p className="pol-date">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: September 2, 2026</p>
      </div>

      <div className="pol-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Terms & Conditions</span>
      </div>

      <div className="pol-body">
        <div className="pol-intro">
          Please read these Terms and Conditions carefully before using <strong>Riya Art Palace</strong>. These terms govern your use of our website and services. By using our website, you agree to these terms in full.
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.title} className="pol-section">
            <div className="pol-section-title">{sec.title}</div>
            {sec.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ))}

        <div className="pol-contact">
          <h3>Related Policies</h3>
          <p>Learn more about how we handle orders, payments, and data.</p>
          <div className="pol-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
