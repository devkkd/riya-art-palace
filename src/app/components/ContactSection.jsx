
"use client";
import { useState, useRef, useEffect } from "react";

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
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "13px 16px",
          border: "1.5px solid #e8d5c8",
          borderRadius: "10px",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            color: value ? "#1a1a1a" : "#b0a098",
          }}
        >
          {value || placeholder}
        </span>

        <span>▼</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "6px",
            background: "#FFFFFF",
            border: "1px solid #e8d5c8",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {options.map((item) => (
            <div
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                background: value === item ? "#f7f7f7" : "#fff",
                color: "#1a1a1a",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  value === item ? "#f7f7f7" : "#fff")
              }
            >
              {item}
            </div>
          ))}
        </div>
      )}
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
fontSize: "15px",
fontFamily: "Manrope, sans-serif",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: "Manrope, sans-serif",
  fontSize: "14px",
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

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setInput = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setSubmitError("");

    // Basic validation
    if (!form.companyName.trim()) { setSubmitError("Company name is required"); return; }
    if (!form.contactName.trim()) { setSubmitError("Contact person name is required"); return; }
    if (!form.email.trim())       { setSubmitError("Business email is required"); return; }
    if (!form.country)            { setSubmitError("Please select your country"); return; }
    if (!form.phone.trim())       { setSubmitError("Phone number is required"); return; }

    setSubmitting(true);
    try {
      const res  = await fetch("/api/enquiry", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:            form.country === "India" ? "india" : "export",
          companyName:     form.companyName,
          contactName:     form.contactName,
          businessEmail:   form.email,
          country:         form.country,
          phone:           form.phone,
          enquiryType:     form.enquiryType,
          orderQty:        form.quantity,
          productCategory: form.category,
          customisation:   form.customisation,
          packaging:       form.packaging,
          message:         form.message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitSuccess(true);
        setForm({
          companyName: "", contactName: "", email: "", country: "",
          phone: "", enquiryType: "", quantity: "", category: "",
          customisation: "Yes", packaging: "Yes", message: "",
        });
      } else {
        setSubmitError(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
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
          grid-template-columns: 40% 67%;

          gap: 68px;
          align-items: stretch;
          margin-bottom: 80px;
        }

        .rap-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 20px;
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
          font-size: 16px;
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
               fontSize: "12px",
fontWeight: 700,
letterSpacing: "0.08em",
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
                fontFamily: "'Playfair Display', serif",
fontSize: "clamp(34px, 4vw, 42px)",
fontWeight: 800,
letterSpacing: "-0.02em",
                color: "#1a1a1a",
                lineHeight: 1.2,
                marginBottom: "32px",
              }}
            >
              Let's Start a Conversation
            </h1>

            <h2
              style={{
               fontFamily: "Manrope, sans-serif",
fontSize: "clamp(22px, 2.2vw, 28px)",
fontWeight: 700,
letterSpacing: "-0.03em",
lineHeight: 1.3,
                color: "#1a1a1a",
                marginBottom: "10px",
              }}
            >
              Crafting Rajasthan's Heritage for Global Buyers
            </h2>

            <p
              style={{
               fontFamily: "Manrope, sans-serif",
fontSize: "16px",
fontWeight: 400,
lineHeight: 1.8,
color: "#555",
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
                    <div style={{ fontFamily: "Manrope, sans-serif",
fontSize: "17px",
fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: "Manrope, sans-serif",
fontSize: "15px",
fontWeight: 400,
lineHeight: 1.7,
color: "#555",}}>{value}</div>
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
              padding: "clamp(28px, 4vw, 52px)",
              boxSizing: "border-box",
              
            }}
          >
            <h2
              style={{
   fontFamily: "Manrope, sans-serif",
   fontSize: "30px",
   fontWeight: 700,
   letterSpacing: "-0.04em",
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

            {submitSuccess ? (
              <div style={{
                marginTop: 28, background: "#D1FAE5", border: "1.5px solid #6EE7B7",
                borderRadius: 14, padding: "24px 28px", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 17, fontWeight: 800, color: "#065F46", marginBottom: 6 }}>
                  Enquiry Submitted!
                </div>
                <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#047857", marginBottom: 16 }}>
                  Thank you! Our team will get back to you within 24 hours.
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  style={{ background: "none", border: "1.5px solid #065F46", borderRadius: 999, padding: "8px 24px", fontFamily: "Manrope, sans-serif", fontWeight: 700, color: "#065F46", cursor: "pointer", fontSize: 13 }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <>
                {submitError && (
                  <div style={{
                    marginTop: 16, background: "#FEE2E2", border: "1px solid #FCA5A5",
                    borderRadius: 10, padding: "10px 18px",
                    fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#991B1B",
                  }}>
                    {submitError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rap-submit-btn"
                  style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Submitting…" : "Submit Enquiry"}
                  {!submitting && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </>
            )}

          </div>
        </div>

       

        {/* Follow Us */}
        

      </div>
    </div>
  );
}