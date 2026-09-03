"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "When you visit Riya Art Palace, we collect information you voluntarily provide, such as your name, email address, phone number, and delivery address when you place an order or create an account.",
      "We also automatically collect certain technical information including your IP address, browser type, device information, and pages visited to improve our website experience.",
      "We do not collect sensitive personal data such as financial card details — payments are processed securely through Razorpay, a PCI-DSS compliant payment gateway.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To process and fulfill your orders, including sending order confirmations, shipping updates, and delivery notifications.",
      "To communicate with you about your account, respond to enquiries, and provide customer support.",
      "To send you marketing communications such as newsletters and offers — only if you have opted in. You may unsubscribe at any time.",
      "To improve our website, products, and services based on usage patterns and feedback.",
      "To comply with applicable legal obligations and prevent fraud.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    content: [
      "We do not sell, rent, or trade your personal information to third parties.",
      "We share your information only with trusted service providers who assist in operating our business — including Razorpay (payment processing), Shiprocket (order shipping & logistics), and cloud storage providers — all of whom are bound by confidentiality obligations.",
      "We may disclose information when required by law or to protect the rights, property, or safety of Riya Art Palace, our customers, or others.",
    ],
  },
  {
    title: "4. Cookies",
    content: [
      "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyse website traffic.",
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.",
      "All data transmissions are encrypted using SSL/TLS technology. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.",
      "Order data is retained for a minimum of 3 years for accounting and legal compliance purposes.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information held by us.",
      "You may request a copy of your data or ask us to restrict its processing by contacting us at riyaartpalace08@gmail.com.",
      "If you believe your data has been misused, you have the right to lodge a complaint with the relevant data protection authority.",
    ],
  },
  {
    title: "8. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites and encourage you to review their privacy policies.",
    ],
  },
  {
    title: "9. Children's Privacy",
    content: [
      "Our services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated effective date. Your continued use of our website after any changes constitutes acceptance of the updated policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
      `}</style>

      {/* Hero */}
      <div className="pol-hero">
        <div className="pol-tag">Legal</div>
        <h1 className="pol-title">Privacy Policy</h1>
        <p className="pol-date">Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: September 2, 2026</p>
      </div>

      {/* Breadcrumb */}
      <div className="pol-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Privacy Policy</span>
      </div>

      {/* Body */}
      <div className="pol-body">
        <div className="pol-intro">
          Welcome to <strong>Riya Art Palace</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit <strong>www.riyaartpalace.com</strong> and make purchases from us.
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
          <h3>Questions about this policy?</h3>
          <p>If you have any questions or concerns about our Privacy Policy or how we handle your data, please reach out to us.</p>
          <a href="mailto:riyaartpalace08@gmail.com">riyaartpalace08@gmail.com</a>
          <br /><br />
          <p style={{ marginBottom: 0 }}>
            Riya Art Palace &nbsp;·&nbsp; Jaipur, Rajasthan, India
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
