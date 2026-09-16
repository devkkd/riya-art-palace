"use client";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "./Navbar";
import FollowUs from "./FollowUs";
import Footer from "./Footer";
import ValuesSection from "./ValuesSection.jsx";

/* ── Hover accordion help item ── */
function HelpItem({ icon, title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        border: `1.5px solid ${open ? "#F85700" : "#E8E2DC"}`,
        borderRadius: 12,
        marginBottom: 12,
        padding: "16px 18px",
        background: open ? "#FFFAF7" : "#fff",
        boxShadow: open ? "0 4px 18px rgba(248,87,0,.08)" : "none",
        transition: "border-color .2s, box-shadow .2s, background .2s",
        cursor: "default",
      }}
    >
      {/* Title row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 700,
        lineHeight: 1.4, color: open ? "#F85700" : "#1a1a1a",
        transition: "color .2s",
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: 9,
          background: open ? "#FFF0E6" : "#F7F5F3",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0, transition: "background .2s",
        }}>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{
          fontSize: 11, color: open ? "#F85700" : "#ccc",
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform .25s, color .2s", flexShrink: 0,
        }}>▾</span>
      </div>

      {/* Body */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "160px" : 0,
        opacity: open ? 1 : 0,
        transition: "max-height .35s ease, opacity .3s ease",
      }}>
        <div style={{
          fontFamily: "Manrope, sans-serif", fontSize: 12, fontWeight: 400,
          lineHeight: 1.65, color: "#888",
          paddingLeft: 42, paddingTop: 8,
        }}>{body}</div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
export default function ContactPage() {
    const [customisation, setCustomisation] = useState("Yes");
    const [customPacking, setCustomPacking] = useState("Yes");

    const [form, setForm] = useState({
        companyName: "",
        contactPerson: "",
        businessEmail: "",
        country: "",
        phone: "",
        enquiryType: "",
        estimatedQty: "",
        productCategory: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ ...form, customisation, customPacking });
    };

    return (
        <>
            <Navbar />

            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Page ── */
        .cp-page {
          background: #FFFBF6;
          min-height: 100vh;
          font-family: "Poppins", sans-serif;
        }

        /* ── Hero Section ── */
        .cp-hero {
  text-align: center;
  padding-top: 70px;
  padding-bottom: 60px;
  max-width: 1200px;
  margin: 0 auto;
}
        .cp-hero-title {
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.04em;
  color: #0E0E0E;
  text-align: center;
  margin-bottom: 4px;
}
        .cp-hero-sub {
  font-family: "Manrope", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 160%;
  color: #F85700;
  text-align: center;
  margin-bottom: 18px;
}
       .cp-hero-desc {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;

  font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: -0.02em;

  color: #0E0E0E;
  text-align: center;
}

        /* ── Info + Help Section ── */
        .cp-two-col {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 40px 64px;
          display: flex;
          align-items: flex-start;
          gap: 0;
        }

        /* LEFT */
        .cp-left {
          flex: 0 0 360px;
          width: 360px;
          padding-right: 48px;
          border-right: 1px solid #E8E2DC;
          display: flex;
          flex-direction: column;
        }

        .cp-left-heading {
          font-family: "Playfair Display", serif;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: #0E0E0E;
          margin-bottom: 8px;
        }
        .cp-left-subheading {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0E0E0E;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .cp-left-desc {
          font-family: "Manrope", sans-serif;
          font-size: 12.5px;
          font-weight: 400;
          line-height: 1.7;
          color: #777;
          margin-bottom: 20px;
        }

        .cp-info-block {
          padding: 12px 0;
          border-top: 1px solid #EEEBE7;
        }
        .cp-info-block:last-child { border-bottom: 1px solid #EEEBE7; }
        .cp-info-label {
          font-family: "Manrope", sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 3px;
        }
        .cp-info-value {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.55;
          color: #333;
        }

        /* RIGHT */
        .cp-right {
          flex: 1;
          padding-left: 52px;
          min-width: 0;
        }
        .cp-right-heading {
          font-family: "Playfair Display", serif;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.02em;
          color: #0E0E0E;
          margin-bottom: 6px;
        }
        .cp-right-intro {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.6;
          color: #999;
          margin-bottom: 24px;
        }

        /* Help items — accordion cards */
        .cp-help-item {
          border: 1.5px solid #E8E2DC;
          border-radius: 12px;
          margin-bottom: 12px;
          padding: 16px 18px;
          background: #fff;
          transition: border-color .2s, box-shadow .2s, background .2s;
          cursor: default;
        }
        .cp-help-item:hover {
          border-color: #F85700;
          background: #FFFAF7;
          box-shadow: 0 4px 18px rgba(248,87,0,.08);
        }
        .cp-help-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.4;
          color: #1a1a1a;
          transition: color .2s;
        }
        .cp-help-item:hover .cp-help-title { color: #F85700; }
        .cp-help-title .icon {
          width: 32px;
          height: 32px;
          background: #F7F5F3;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
          transition: background .2s;
        }
        .cp-help-item:hover .cp-help-title .icon { background: #FFF0E6; }
        .cp-help-body {
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.65;
          color: #888;
          padding-left: 42px;
          padding-top: 8px;
        }

        /* ── Form Section ── */
        .cp-form-section {
          background: #FFE8D8;
          padding: 60px 20px 80px;
        }
        .cp-form-title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: #1D1D1D;
          margin-bottom: 40px;
        }
        .cp-form-wrap {
          max-width: 760px;
          margin: 0 auto;
        }

        /* Grid rows */
        .cp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }
        .cp-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .cp-form-group.full {
          grid-column: 1 / -1;
        }
        .cp-label {
          font-size: 13px;
          font-weight: 500;
          color: #1D1D1D;
        }
        .cp-input,
        .cp-select,
        .cp-textarea {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid #CCC4BB;
          border-radius: 6px;
          background: #fff;
          font-size: 13px;
          color: #444;
          font-family: "Poppins", sans-serif;
          outline: none;
          transition: border-color .2s;
          appearance: none;
          -webkit-appearance: none;
          color-scheme: light;
        }
          
        .cp-input:focus,
        .cp-select:focus,
        .cp-textarea:focus {
          border-color: #F85700;
        }
        .cp-input::placeholder,
        .cp-textarea::placeholder { color: #aaa; }

        .cp-select-wrap {
          position: relative;
        }
        .cp-select-wrap::after {
          content: "▾";
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 14px;
          color: #666;
        }
        .cp-select { cursor: pointer; padding-right: 36px; }

        .cp-select option {
          background: #ffffff;
          color: #444;
        }

        .cp-textarea {
          resize: vertical;
          min-height: 110px;
          line-height: 1.6;
        }

        /* Toggle buttons */
        .cp-toggle-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cp-toggle-btn {
          padding: 10px 22px;
          border-radius: 999px;
          border: 1.5px solid #CCC4BB;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          font-family: "Poppins", sans-serif;
          transition: all .2s;
        }
        .cp-toggle-btn.active {
          background: #1D1D1D;
          color: #fff;
          border-color: #1D1D1D;
        }
        .cp-toggle-btn:hover:not(.active) {
          border-color: #999;
        }

        /* Submit */
        .cp-submit-wrap {
          display: flex;
          justify-content: center;
          margin-top: 36px;
        }
        .cp-submit-btn {
          height: 54px;
          padding: 0 48px;
          border: none;
          border-radius: 999px;
          background: #F85700;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: "Poppins", sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background .2s, transform .15s;
        }
        .cp-submit-btn:hover {
          background: #e84f00;
          transform: translateY(-1px);
        }
        .cp-submit-btn .arrow { font-size: 18px; }

        /* WhatsApp FAB */
       .cp-wa {
  position: fixed;
  right: 30px;
  bottom: 30px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: #5AC44D;
  color: #FFFFFF;
  text-decoration: none;

  padding: 15px 20px;
  border-radius: 99px;

  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;

  z-index: 9999;

  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.cp-wa:hover {
  transform: translateY(-2px);
  background: #4CAF50;
}

.cp-wa svg {
  width: 22px;
  height: 22px;
  color: #FFFFFF;
  flex-shrink: 0;
}

.cp-wa span {
  color: #FFFFFF;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
}

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .cp-two-col {
            flex-direction: column;
            padding: 0 20px 40px;
          }
          .cp-left {
            width: 100%;
            flex: none;
            padding-right: 0;
            padding-bottom: 28px;
            margin-bottom: 28px;
            border-right: none;
            border-bottom: 1px solid #E8E2DC;
          }
          .cp-right { padding-left: 0; }
        }
        @media (max-width: 600px) {
          .cp-hero-title { font-size: 26px; }
          .cp-form-title { font-size: 22px; }
          .cp-two-col { padding: 0 0 0; }
.cp-wa {
  right: 16px;
  bottom: 16px;
  padding: 12px 18px;
  font-size: 16px;
}

.cp-wa span {
  font-size: 16px;
}

.cp-wa svg {
  width: 20px;
  height: 20px;
}
        }
      `}</style>

            <div className="cp-page">

                {/* ── HERO ── */}
                <div className="cp-hero">
                    <h1 className="cp-hero-title">Contact Us</h1>
                    <div className="cp-hero-sub">We'd Love to Hear From You</div>
                    <p className="cp-hero-desc">
                        Whether You Are A First-time Visitor Curious About Our Handcrafted Collection, A Business Looking To Place A Bulk Order, Or An International Buyer
                        Exploring Export Partnerships We Are Here To Help.<br />
                        Reach Out To Us And Our Team Will Get Back To You Promptly.
                    </p>
                </div>

                {/* ── TWO COLUMN INFO ── */}
                <div className="cp-two-col">

                    {/* LEFT */}
                    <div className="cp-left">
                        <h2 className="cp-left-heading">Let's Start a Conversation</h2>
                        <h3 className="cp-left-subheading">Crafting Rajasthan's Heritage for Global Buyers</h3>
                        <p className="cp-left-desc">
                            We are one of Jaipur's foremost manufacturers and exporters of traditional handicrafts.<br />
                            Since 1995, we've been trusted by import wholesalers, retail chains, and interior brands across 40+ countries.
                        </p>

                        <div className="cp-info-block">
                            <div className="cp-info-label">Address</div>
                            <div className="cp-info-value">C-143, 1st Phase, New Lohamandi, Macheda, Jaipur – 302013,&nbsp;&nbsp;Rajasthan, India</div>
                        </div>

                        <div className="cp-info-block">
                            <div className="cp-info-label">Phone</div>
                            <div className="cp-info-value">+91-8385007350</div>
                        </div>

                        <div className="cp-info-block">
                            <div className="cp-info-label">Email</div>
                            <div className="cp-info-value">riya_art_palace@yahoo.com</div>
                        </div>

                        <div className="cp-info-block">
                            <div className="cp-info-label">Export Enquiries</div>
                            <div className="cp-info-value">We respond to all international enquiries within 24 hours.</div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="cp-right">
                        <h2 className="cp-right-heading">How Can We Help You?</h2>
                        <p className="cp-right-intro">We Handle All Kinds Of Enquiries - Just Let Us Know What You Need:</p>

                        {[
                          { icon:"🧡", title:"Product & Gifting Enquiries",       body:"Looking For A Specific Product, Gift Set, Or Occasion-based Collection? Tell Us What You Have In Mind And We Will Help You Find The Perfect Piece." },
                          { icon:"🧡", title:"Bulk & Wholesale Orders",            body:"Planning A Large Order For Retail, Corporate Gifting, Or An Event? Share Your Requirements And We Will Send You A Detailed Quotation." },
                          { icon:"🌐", title:"Export & International Enquiries",   body:"We Export To Spain, Netherlands, Denmark, And Beyond. If You Are An International Buyer Or Importer, We Would Love To Connect And Discuss Your Requirements." },
                          { icon:"🎁", title:"Custom & Personalised Orders",       body:"Need A Product In A Specific Colour, Size, Design, Or With Your Brand's Logo? We Offer Customisation Across Most Of Our Product Range." },
                          { icon:"📋", title:"Trade & Wholesale Registration",     body:"Want To Become A Verified Trade Partner And Access Our Full Product Catalogue With Complete Specifications? Start Your Registration Here." },
                        ].map((item, idx) => (
                          <HelpItem key={idx} icon={item.icon} title={item.title} body={item.body} />
                        ))}
                    </div>

                </div>

                {/* ── FORM SECTION ── */}
                <div className="cp-form-section">
                    <h2 className="cp-form-title">Contact Us - Riya Art Palace</h2>

                    <div className="cp-form-wrap">
                        <div className="cp-form-row">
                            <div className="cp-form-group">
                                <label className="cp-label">Company Name *</label>
                                <input
                                    className="cp-input"
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter your registered business name"
                                    value={form.companyName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="cp-form-group">
                                <label className="cp-label">Contact Person Name *</label>
                                <input
                                    className="cp-input"
                                    type="text"
                                    name="contactPerson"
                                    placeholder="Enter your full name"
                                    value={form.contactPerson}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="cp-form-row">
                            <div className="cp-form-group">
                                <label className="cp-label">Business Email *</label>
                                <input
                                    className="cp-input"
                                    type="email"
                                    name="businessEmail"
                                    placeholder="Enter your business email"
                                    value={form.businessEmail}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="cp-form-group">
                                <label className="cp-label">Country *</label>
                                <div className="cp-select-wrap">
                                    <select
                                        className="cp-select"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select your country</option>
                                        <option>India</option>
                                        <option>United States</option>
                                        <option>United Kingdom</option>
                                        <option>Germany</option>
                                        <option>Netherlands</option>
                                        <option>Denmark</option>
                                        <option>Spain</option>
                                        <option>Australia</option>
                                        <option>Canada</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="cp-form-row">
                            <div className="cp-form-group">
                                <label className="cp-label">Phone / WhatsApp *</label>
                                <input
                                    className="cp-input"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your Phone / WhatsApp"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="cp-form-group">
                                <label className="cp-label">Type of Enquiry *</label>
                                <div className="cp-select-wrap">
                                    <select
                                        className="cp-select"
                                        name="enquiryType"
                                        value={form.enquiryType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Type of Enquiry</option>
                                        <option>Product &amp; Gifting</option>
                                        <option>Bulk &amp; Wholesale</option>
                                        <option>Export &amp; International</option>
                                        <option>Custom &amp; Personalised</option>
                                        <option>Trade &amp; Wholesale Registration</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="cp-form-row">
                            <div className="cp-form-group">
                                <label className="cp-label">Estimated Order Quantity *</label>
                                <div className="cp-select-wrap">
                                    <select
                                        className="cp-select"
                                        name="estimatedQty"
                                        value={form.estimatedQty}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Estimated Quantity</option>
                                        <option>1 - 100 pcs</option>
                                        <option>100 - 500 pcs</option>
                                        <option>500 - 1000 pcs</option>
                                        <option>1000+ pcs</option>
                                    </select>
                                </div>
                            </div>
                            <div className="cp-form-group">
                                <label className="cp-label">Product Category Interested In *</label>
                                <div className="cp-select-wrap">
                                    <select
                                        className="cp-select"
                                        name="productCategory"
                                        value={form.productCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Product Category</option>
                                        <option>Wall Décor</option>
                                        <option>Table Décor</option>
                                        <option>Lac Collection</option>
                                        <option>Event Décor</option>
                                        <option>Festive Collection</option>
                                        <option>Rajasthani Traditional</option>
                                        <option>Handmade Accessories</option>
                                        <option>Spiritual Items</option>
                                        <option>Handpainted Articles</option>
                                        <option>Diary Collection</option>
                                        <option>Christmas Items</option>
                                        <option>Ottomans &amp; Puffs</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Customisation toggles */}
                        <div className="cp-form-row">
                            <div className="cp-form-group">
                                <label className="cp-label">Do you require customisation? *</label>
                                <div className="cp-toggle-group">
                                    {["Yes", "No", "Not Sure"].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`cp-toggle-btn${customisation === opt ? " active" : ""}`}
                                            onClick={() => setCustomisation(opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="cp-form-group">
                                <label className="cp-label">Do you require custom packaging or branding?</label>
                                <div className="cp-toggle-group">
                                    {["Yes", "No", "Not Sure"].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`cp-toggle-btn${customPacking === opt ? " active" : ""}`}
                                            onClick={() => setCustomPacking(opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="cp-form-row">
                            <div className="cp-form-group full">
                                <label className="cp-label">Message *</label>
                                <textarea
                                    className="cp-textarea"
                                    name="message"
                                    placeholder="Share design references, market preferences, timelines, or any special requirements"
                                    value={form.message}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="cp-submit-wrap">
                            <button className="cp-submit-btn" onClick={handleSubmit}>
                                Submit Enquiry <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* WhatsApp FAB */}
<a
            href="https://wa.me/918385007350"
            target="_blank"
            rel="noopener noreferrer"
            className="cp-wa"
>
            <FaWhatsapp />
            <span>For Bulk</span>
        </a >
            <ValuesSection />
            <FollowUs />
            <Footer />
        </>
    );
}