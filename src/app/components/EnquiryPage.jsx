"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import FollowUs from "./FollowUs";
import Footer from "./Footer";
import ValuesSection from "./ValuesSection.jsx";

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

@import url('https://fonts.cdnfonts.com/css/mona-sans');

  *, *::before, *::after { box-sizing: border-box; }

  .eq-page {
  font-family: "Manrope", sans-serif;
  background: #FBF8F4;
}

  /* ── Header ── */
  .eq-header {
    text-align: center;
    padding: 40px 20px 24px;
  }
  .eq-title {
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.04em;
  text-align: center;
  color: #0E0E0E;
  margin-bottom: 12px;
}
  .eq-subtitle {
    font-size: 14px;
    color: #666;
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto;
  }

  /* ── Tabs ── */
  .eq-tab-row {
    display: flex;
    justify-content: center;
    gap: 40px;
    border-bottom: 1px solid #E5DED7;
    margin-top: 24px;
    padding-bottom: 0;
  }
  .eq-tab {
    background: none;
    border: none;
    font-size: 15px;
    font-weight: 600;
    color: #888;
    padding: 14px 4px;
    cursor: pointer;
    position: relative;
    font-family: "Poppins", sans-serif;
    transition: color .2s;
  }
  .eq-tab.active {
    color: #F85700;
  }
  .eq-tab.active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: #F85700;
  }

  /* ── Form Section ── */
  .eq-form-section {
    background: #FBE2D2;
    padding: 48px 20px 64px;
  }
 .eq-form-title {
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.04em;
  text-align: center;
  color: #0E0E0E;
  margin-bottom: 32px;
}
  .eq-form-wrap {
    max-width: 880px;
    margin: 0 auto;
    background: transparent;
  }
  .eq-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 24px;
    margin-bottom: 18px;
  }
  .eq-field { display: flex; flex-direction: column; }
  .eq-field label {
  font-family: "Mona Sans", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0;
  color: #0E0E0E;
  margin-bottom: 10px;
}
  .eq-field label .req { color: #F85700; }

  .eq-input,
.eq-select,
.eq-textarea {
  width: 100%;
  height: 48px;

  border: 1px solid #E8DCD2;
  border-radius: 10px;

  padding: 0 16px;

  background: #FFFDFB;
  color: #0E0E0E;

  font-family: "Mona Sans", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0;

  outline: none;
  transition: border-color 0.2s ease;
}
  .eq-input::placeholder, .eq-textarea::placeholder { color: #BFB6AD; }
  .eq-input:focus, .eq-select:focus, .eq-textarea:focus { border-color: #F85700; }

  .eq-input[disabled] {
    background: #F4EDE6;
    color: #777;
    cursor: not-allowed;
  }

  .eq-select-wrap { position: relative; }
  .eq-select {
    appearance: none;
    cursor: pointer;
    padding-right: 40px;
  }
  .eq-select-wrap::after {
    content: "▾";
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 13px;
    pointer-events: none;
  }

  .eq-textarea {
    height: 100px;
    padding: 14px 16px;
    resize: vertical;
    line-height: 1.5;
  }

  /* ── Yes/No/Not Sure pills ── */
  .eq-pill-row {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }
  .eq-pill {
  height: 48px;
  min-width: 90px;

  padding: 0 24px;

  border: 1px solid #D9CFC5;
  border-radius: 999px;

  background: #FFFDFB;
  color: #0E0E0E;

  font-family: "Mona Sans", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.2s ease;
}
  .eq-pill.active {
  background: #0E0E0E;
  color: #FFFFFF;
  border-color: #0E0E0E;
}
.eq-pill:hover {
  border-color: #F85700;
}

  /* ── Submit ── */
  .eq-submit-row {
    display: flex;
    justify-content: center;
    margin-top: 28px;
  }
  .eq-submit-btn {
    height: 52px;
    padding: 0 36px;
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
  .eq-submit-btn:hover { background: #e84f00; transform: translateY(-1px); }
  .custom-select {
  position: relative;
}

.custom-select-btn {
  width: 100%;
  height: 48px;
  background: #FFFDFB;
  border: 1px solid #E8DCD2;
  border-radius: 10px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  font-family: "Mona Sans", sans-serif;
  font-size: 16px;
}

.custom-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #E8DCD2;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,.08);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
}

.custom-option {
  padding: 12px 16px;
  cursor: pointer;
  background: #fff;
}

.custom-option:hover {
  background: #FBE2D2;
}

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .eq-grid-2 { grid-template-columns: 1fr; }
    .eq-tab-row { gap: 24px; }
.eq-title { font-size: 24px; }
.eq-form-title { font-size: 24px; }
    .eq-form-section { padding: 32px 16px 48px; }
  }
`;

/* ============================================================
   DATA
   ============================================================ */
const countries = [
  "India", "United States", "United Kingdom", "United Arab Emirates", "Australia",
  "Canada", "Germany", "France", "Italy", "Spain", "Saudi Arabia", "Qatar", "Kuwait",
  "Singapore", "Japan", "South Africa", "Nepal", "Bangladesh", "Sri Lanka", "Other",
];

const enquiryTypes = [
  "Resale / Retail",
  "Corporate Gifting",
  "Festival / Event Gifting",
  "Interior / Home Décor",
  "Export / International",
  "Personal / Other",
];

const orderQuantities = [
  "500 - 1,000 pcs",
  "1,000 - 2,000 pcs",
  "2,000 - 5,000 pcs",
  "5,000+ pcs",
  "To Be Discussed",
];

const productCategories = [
  "Wall Décor", "Table Décor", "Lac Collection", "Event Décor", "Festive Collection",
  "Rajasthani Traditional", "Handmade Accessories", "Spiritual Items",
  "Handpainted Articles", "Diary Collection", "Christmas Items", "Ottomans & Puffs",
];

const initialFormState = {
  companyName: "",
  contactName: "",
  businessEmail: "",
  country: "",
  phone: "",
  enquiryType: "",
  orderQty: "",
  productCategory: "",
  customisation: "",
  packaging: "",
  message: "",
};

/* ============================================================
   PAGE CONTENT
   ============================================================ */
function EnquiryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
const enquiryRef = useRef(null);
const [quantityOpen, setQuantityOpen] = useState(false);
const [categoryOpen, setCategoryOpen] = useState(false);

const quantityRef = useRef(null);
const categoryRef = useRef(null);
  const initialTab = searchParams.get("type") === "india" ? "india" : "export";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [form, setForm] = useState({
    ...initialFormState,
    country: initialTab === "india" ? "India" : "",
  });

  const switchTab = (tab) => {
  setCountryOpen(false);
  setEnquiryOpen(false);
  setQuantityOpen(false);
  setCategoryOpen(false);

  setActiveTab(tab);

  setForm((prev) => ({
    ...prev,
    country:
      tab === "india"
        ? "India"
        : (prev.country === "India" ? "" : prev.country),
  }));

  router.replace(`?type=${tab}`, {
    scroll: false,
  });
};

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry submitted:", { type: activeTab, ...form });
    alert("Thank you! Your enquiry has been submitted.");
  };
  useEffect(() => {
  function handleClickOutside(e) {
    if (
      countryRef.current &&
      !countryRef.current.contains(e.target)
    ) {
      setCountryOpen(false);
    }

    if (
      enquiryRef.current &&
      !enquiryRef.current.contains(e.target)
    ) {
      setEnquiryOpen(false);
    }

    if (
      quantityRef.current &&
      !quantityRef.current.contains(e.target)
    ) {
      setQuantityOpen(false);
    }

    if (
      categoryRef.current &&
      !categoryRef.current.contains(e.target)
    ) {
      setCategoryOpen(false);
    }
  }

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  return (
    <>
      <Navbar />
      <style jsx>{styles}</style>

      <div className="eq-page">
        {/* Header */}
        <div className="eq-header">
          <div className="eq-title">Export Enquiry - Riya Art Palace</div>
          <div className="eq-subtitle">
            Interested In Placing A Bulk Or Wholesale Order?
            <br />
            Fill In The Details Below And Our Team Will Get Back To You Within 24 Hours.
          </div>
        </div>

        {/* Tabs */}
        <div className="eq-tab-row">
          <button
            className={`eq-tab${activeTab === "export" ? " active" : ""}`}
            onClick={() => switchTab("export")}
          >
            Export Enquiry
          </button>
          <button
            className={`eq-tab${activeTab === "india" ? " active" : ""}`}
            onClick={() => switchTab("india")}
          >
            India Enquiry
          </button>
        </div>

        {/* Form Section */}
        <div className="eq-form-section">
          <div className="eq-form-wrap">
            <div className="eq-form-title">Product Enquiry - Riya Art Palace</div>

            <form onSubmit={handleSubmit}>
              <div className="eq-grid-2">
                {/* Company Name */}
                <div className="eq-field">
                  <label>Company Name<span className="req">*</span></label>
                  <input
                    className="eq-input"
                    type="text"
                    placeholder="Enter your registered business name"
                    value={form.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    required
                  />
                </div>

                {/* Contact Person Name */}
                <div className="eq-field">
                  <label>Contact Person Name<span className="req">*</span></label>
                  <input
                    className="eq-input"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    required
                  />
                </div>

                {/* Business Email */}
                <div className="eq-field">
                  <label>Business Email<span className="req">*</span></label>
                  <input
                    className="eq-input"
                    type="email"
                    placeholder="Enter your business email"
                    value={form.businessEmail}
                    onChange={(e) => handleChange("businessEmail", e.target.value)}
                    required
                  />
                </div>

                {/* Country */}
                <div className="eq-field">
  <label>
    Country<span className="req">*</span>
  </label>

  {activeTab === "india" ? (
    <input
      className="eq-input"
      type="text"
      value="India"
      disabled
    />
  ) : (
    <div
      className="custom-select"
      ref={countryRef}
    >
      <div
        className="custom-select-btn"
       onClick={() => {
  setCountryOpen(!countryOpen);

  setEnquiryOpen(false);
  setQuantityOpen(false);
  setCategoryOpen(false);
}}
      >
        <span>
          {form.country || "Select your country"}
        </span>

        <span>▼</span>
      </div>

      {countryOpen && (
        <div className="custom-dropdown">
          {countries.map((country) => (
            <div
              key={country}
              className="custom-option"
              onClick={() => {
                handleChange("country", country);
                setCountryOpen(false);
              }}
            >
              {country}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>

          {/* Phone / WhatsApp */}
          <div className="eq-field">
            <label>Phone / WhatsApp<span className="req">*</span></label>
            <input
              className="eq-input"
              type="tel"
              placeholder="Enter your Phone / WhatsApp"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          {/* Type of Enquiry */}
         <div className="eq-field">
  <label>
    Type of Enquiry
    <span className="req">*</span>
  </label>

  <div
    className="custom-select"
    ref={enquiryRef}
  >
    <div
      className="custom-select-btn"
      onClick={() => {
  setEnquiryOpen(!enquiryOpen);

  setCountryOpen(false);
  setQuantityOpen(false);
  setCategoryOpen(false);
}}
    >
      <span>
        {form.enquiryType ||
          "Select Type of Enquiry"}
      </span>

      <span>▼</span>
    </div>

    {enquiryOpen && (
      <div className="custom-dropdown">
        {enquiryTypes.map((type) => (
          <div
            key={type}
            className="custom-option"
            onClick={() => {
              handleChange(
                "enquiryType",
                type
              );
              setEnquiryOpen(false);
            }}
          >
            {type}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

          {/* Estimated Order Quantity */}
          <div className="eq-field">
  <label>
    Estimated Order Quantity
    <span className="req">*</span>
  </label>

  <div
    className="custom-select"
    ref={quantityRef}
  >
    <div
      className="custom-select-btn"
      onClick={() => {
  setQuantityOpen(!quantityOpen);

  setCountryOpen(false);
  setEnquiryOpen(false);
  setCategoryOpen(false);
}}
    >
      <span>
        {form.orderQty  ||
          "Select Estimated Quantity"}
      </span>

      <span>▼</span>
    </div>

    {quantityOpen && (
  <div className="custom-dropdown">
    {orderQuantities.map((qty) => (
      <div
        key={qty}
        className="custom-option"
        onClick={() => {
          handleChange("orderQty", qty);
          setQuantityOpen(false);
        }}
      >
        {qty}

          </div>
        ))}
      </div>
    )}
  </div>
</div>

          {/* Product Category Interested In */}
          <div className="eq-field">
  <label>
    Product Category
    <span className="req">*</span>
  </label>

  <div
    className="custom-select"
    ref={categoryRef}
  >
    <div
      className="custom-select-btn"
      onClick={() => {
  setCategoryOpen(!categoryOpen);

  setCountryOpen(false);
  setEnquiryOpen(false);
  setQuantityOpen(false);
}}
    >
      <span>
        {form.productCategory ||
          "Select Product Category"}
      </span>

      <span>▼</span>
    </div>

    {categoryOpen && (
      <div className="custom-dropdown">
        {productCategories.map(
          (category) => (
            <div
              key={category}
              className="custom-option"
              onClick={() => {
                handleChange(
                  "productCategory",
                  category
                );
                setCategoryOpen(false);
              }}
            >
              {category}
            </div>
          )
        )}
      </div>
    )}
  </div>
</div>

          {/* Customisation */}
          <div className="eq-field">
            <label>Do you require customisation?<span className="req">*</span></label>
            <div className="eq-pill-row">
              {["Yes", "No", "Not Sure"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={`eq-pill${form.customisation === opt ? " active" : ""}`}
                  onClick={() => handleChange("customisation", opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Packaging / Branding */}
          <div className="eq-field">
            <label>Do you require custom packaging or branding?<span className="req">*</span></label>
            <div className="eq-pill-row">
              {["Yes", "No", "Not Sure"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  className={`eq-pill${form.packaging === opt ? " active" : ""}`}
                  onClick={() => handleChange("packaging", opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="eq-field" style={{ marginBottom: "0" }}>
          <label>Message<span className="req">*</span></label>
          <textarea
            className="eq-textarea"
            placeholder="Share design references, market preferences, timelines, or any special requirements"
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <div className="eq-submit-row">
          <button type="submit" className="eq-submit-btn">
            Submit Enquiry →
          </button>
        </div>
      </form>
    </div >
        </div >
      </div >
<ValuesSection />
      <FollowUs />
      <Footer />
    </>
  );
}

/* ============================================================
   PAGE EXPORT (wrapped in Suspense for useSearchParams)
   ============================================================ */
export default function EnquiryPage() {
  return (
    <Suspense fallback={null}>
      <EnquiryPageContent />
    </Suspense>
  );
}