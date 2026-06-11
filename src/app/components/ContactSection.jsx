
"use client";
import { useState } from "react";

const countries = [
  "India", "United States", "United Kingdom", "Australia", "Canada",
  "Germany", "France", "UAE", "Singapore", "Other"
];

const enquiryTypes = [
  "Wholesale / Bulk Order", "Retail Order", "Custom Design",
  "OEM / Private Label", "General Enquiry"
];

const quantities = [
  "Less than 100 units", "100 – 500 units", "500 – 1000 units",
  "1000 – 5000 units", "5000+ units"
];

const categories = [
  "Blue Pottery", "Wooden Handicrafts", "Textile & Fabrics",
  "Jewellery", "Marble & Stone", "Leather Goods", "Home Decor", "Other"
];

const toggleOptions = ["Yes", "No", "Not Sure"];

const contactItems = [
  { label: "Address", value: "C-143, 1st Phase, New Lohamandi, Macheda, Jaipur – 302013, Rajasthan, India" },
  { label: "Phone", value: "+91-8385007350" },
  { label: "Email", value: "riya_art_palace@yahoo.com" },
  { label: "Export Enquiries", value: "We respond to all international enquiries within 24 hours." },
];



function ToggleGroup({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {toggleOptions.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          
          style={{
            padding: "10px 22px",
            borderRadius: "50px",
            border: value === opt ? "1.5px solid #1a1a1a" : "1.5px solid #ddd",
            background: value === opt ? "#1a1a1a" : "#fff",
            color: value === opt ? "#fff" : "#333",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SelectWrapper({ value, onChange, placeholder, options }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "13px 40px 13px 16px",
          border: "1.5px solid #e8d5c8",
          borderRadius: "10px",
          background: "#fff",
          fontFamily: "inherit",
          fontSize: "13.5px",
          color: value ? "#1a1a1a" : "#b0a098",
          outline: "none",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{
        position: "absolute", right: "14px", top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
        width: 0, height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "6px solid #888",
      }} />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  border: "1.5px solid #e8d5c8",
  borderRadius: "10px",
  background: "#fff",
  fontFamily: "inherit",
  fontSize: "13.5px",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#1a1a1a",
  marginBottom: "7px",
  display: "block",
};



export default function RiyaArtPalaceForm() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    country: "",
    phone: "",
    enquiryType: "",
    quantity: "",
    category: "",
    customisation: "Yes",
    packaging: "Yes",
    message: "",
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    alert("Enquiry submitted successfully!");
  };

  return (
    <div
    className="home-section"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#F7F5F3",
        minHeight: "100vh",
        
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        input::placeholder, textarea::placeholder { color: #b0a098; }
        input, textarea, select { font-family: 'Inter', sans-serif; }

        .rap-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: clamp(16px, 5vw, 40px);
          padding-right: clamp(16px, 5vw, 40px);
        }

        .rap-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: stretch;
          margin-bottom: 80px;
        }

        .rap-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 24px;
        }

        .rap-values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          text-align: center;
          margin-bottom: 64px;
        }

        .rap-value-item {
          padding: 0 clamp(16px, 3vw, 40px);
          border-left: 1px solid #D8D2CC;
        }
        .rap-value-item:first-child {
          border-left: none;
        }

        .rap-follow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 24px;
          padding-bottom: 40px;
        }

        .rap-submit-btn {
          margin-top: 28px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #e55a1c;
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 16px 32px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          width: auto;
        }

        @media (max-width: 900px) {
          .rap-top-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 48px;
          }
          .rap-values-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 0;
          }
          .rap-value-item {
            border-left: none !important;
          }
          .rap-value-item:nth-child(2n) {
            border-left: 1px solid #D8D2CC !important;
          }
        }

        @media (max-width: 600px) {
          .rap-outer {
            padding-left: 16px;
            padding-right: 16px;
          }
          .rap-top-grid {
            gap: 28px;
            margin-bottom: 40px;
          }
          .rap-form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .rap-values-grid {
            grid-template-columns: 1fr;
            gap: 32px 0;
          }
          .rap-value-item {
            border-left: none !important;
            padding: 0;
          }
          .rap-follow {
            gap: 16px;
          }
          .rap-submit-btn {
            width: 100%;
            justify-content: center;
          }
          .rap-form-box {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>

      <div className="rap-outer">

        <div className="rap-top-grid">

          {/* Left: Contact Info */}
          <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column" }}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#e55a1c",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "40px",
                  height: "2px",
                  background: "#e55a1c",
                  flexShrink: 0,
                }}
              />
              REACH OUT
            </div>

            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.2,
                marginBottom: "32px",
              }}
            >
              Let's Start a Conversation
            </h1>

            <h2
              style={{
                fontSize: "clamp(14px, 2vw, 17px)",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "10px",
              }}
            >
              Crafting Rajasthan's Heritage for Global Buyers
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              We are one of Jaipur's foremost manufacturers and exporters of traditional handicrafts.{" "}
              Since 1995, we've been trusted by import wholesalers, retail chains, and interior brands across 40+ countries.
            </p>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
              {contactItems.map(({ label, value }) => (
                <div key={label}>
                  <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "0 0 20px" }} />
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: "14px", color: "#555" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Form */}
          <div
            className="rap-form-box"
            style={{
              background: "#fce8dc",
              borderRadius: "20px",
              padding: "clamp(20px, 4vw, 44px)",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(18px, 2.5vw, 22px)",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "28px",
              }}
            >
              Product Enquiry - Riya Art Palace
            </h2>

            <div className="rap-form-grid">

              <div>
                <label style={labelStyle}>Company Name <span style={{ color: "#e55a1c" }}>*</span></label>
                <input type="text" placeholder="Enter your registered business name"
                  value={form.companyName} onChange={setInput("companyName")} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Contact Person Name <span style={{ color: "#e55a1c" }}>*</span></label>
                <input type="text" placeholder="Enter your full name"
                  value={form.contactName} onChange={setInput("contactName")} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Business Email <span style={{ color: "#e55a1c" }}>*</span></label>
                <input type="email" placeholder="Enter your business email"
                  value={form.email} onChange={setInput("email")} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Country <span style={{ color: "#e55a1c" }}>*</span></label>
                <SelectWrapper value={form.country} onChange={set("country")}
                  placeholder="Select your country" options={countries} />
              </div>

              <div>
                <label style={labelStyle}>Phone / WhatsApp <span style={{ color: "#e55a1c" }}>*</span></label>
                <input type="tel" placeholder="Enter your Phone / WhatsApp"
                  value={form.phone} onChange={setInput("phone")} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Type of Enquiry <span style={{ color: "#e55a1c" }}>*</span></label>
                <SelectWrapper value={form.enquiryType} onChange={set("enquiryType")}
                  placeholder="Select Type of Enquiry" options={enquiryTypes} />
              </div>

              <div>
                <label style={labelStyle}>Estimated Order Quantity <span style={{ color: "#e55a1c" }}>*</span></label>
                <SelectWrapper value={form.quantity} onChange={set("quantity")}
                  placeholder="Select Estimated Quantity" options={quantities} />
              </div>

              <div>
                <label style={labelStyle}>Product Category Interested In <span style={{ color: "#e55a1c" }}>*</span></label>
                <SelectWrapper value={form.category} onChange={set("category")}
                  placeholder="Select Product Category" options={categories} />
              </div>

              <div>
                <label style={labelStyle}>Do you require customisation? <span style={{ color: "#e55a1c" }}>*</span></label>
                <ToggleGroup value={form.customisation} onChange={set("customisation")} />
              </div>

              <div>
                <label style={labelStyle}>Do you require custom packaging or branding?</label>
                <ToggleGroup value={form.packaging} onChange={set("packaging")} />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Message <span style={{ color: "#e55a1c" }}>*</span></label>
                <textarea
                  placeholder="Share design references, market preferences, timelines, or any special requirements"
                  value={form.message}
                  onChange={setInput("message")}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                />
              </div>

            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="rap-submit-btn"
            >
              Submit Enquiry
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

          </div>
        </div>

       

        {/* Follow Us */}
        

      </div>
    </div>
  );
}