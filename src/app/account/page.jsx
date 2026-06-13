"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import ValuesSection from "../components/ValuesSection.jsx";
import FollowUs from "../components/FollowUs";
import Footer from "../components/Footer";

/* ============================================================
   HARDCODED LOGIN NUMBER — change this to your number
   ============================================================ */
const VALID_PHONE = "9999999999";

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-page {
    background: #F7F5F3;
    min-height: 100vh;
    font-family: "Poppins", sans-serif;
  }
  .ac-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 40px 80px;
  }

  /* ── Login Popup Overlay ── */
  .login-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .login-modal {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    padding: 36px 32px 32px;
    position: relative;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    animation: modalIn .25s ease;
  }
  @keyframes modalIn {
    from { opacity:0; transform: scale(0.94) translateY(12px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }
  .login-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }
  .login-logo img {
    height: 54px;
    object-fit: contain;
  }
  .login-brand {
    text-align: center;
    font-family: "Manrope", sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #0E0E0E;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  .login-sub {
    text-align: center;
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    color: #888;
    margin-bottom: 28px;
  }
  .login-label {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #444;
    margin-bottom: 8px;
    display: block;
  }
  .login-input-row {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
  }
  .login-flag-box {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 48px;
    border: 1.5px solid #C3BCB4;
    border-radius: 10px;
    padding: 0 12px;
    background: #FAF8F6;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
    min-width: 80px;
  }
  .login-input {
    flex: 1;
    height: 48px;
    border: 1.5px solid #C3BCB4;
    border-radius: 10px;
    padding: 0 16px;
    font-family: "Poppins", sans-serif;
    font-size: 15px;
    color: #333;
    outline: none;
    background: #FAF8F6;
    transition: border-color .2s;
  }
  .login-input:focus { border-color: #F85700; }
  .login-input::placeholder { color: #BCBCBC; }
  .login-input.error { border-color: #e53e3e; }
  .login-error {
    font-family: "Manrope", sans-serif;
    font-size: 12px;
    color: #e53e3e;
    margin-bottom: 16px;
    min-height: 18px;
  }
  .login-btn {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s;
    margin-top: 4px;
  }
  .login-btn:hover { background: #e84f00; }
  .login-privacy {
    text-align: center;
    font-family: "Manrope", sans-serif;
    font-size: 11px;
    color: #AAA;
    margin-top: 16px;
    line-height: 1.6;
  }
  .login-privacy a { color: #F85700; text-decoration: none; }
  .login-privacy a:hover { text-decoration: underline; }
  .login-powered {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
    font-family: "Manrope", sans-serif;
    font-size: 11px;
    color: #BBB;
  }

  /* ── Account Page Header ── */
  .ac-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0 28px;
    border-bottom: 1px solid #E0D9D1;
    margin-bottom: 32px;
  }
  .ac-header-title {
    font-family: "Manrope", sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #0E0E0E;
    letter-spacing: -0.02em;
  }
  .ac-logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1.5px solid #C3BCB4;
    border-radius: 999px;
    padding: 8px 20px;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #555;
    cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .ac-logout-btn:hover { border-color: #F85700; color: #F85700; }

  /* ── Tabs / Nav ── */
  .ac-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 32px;
    border-bottom: 1px solid #E0D9D1;
  }
  .ac-tab {
    padding: 12px 20px;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #888;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: color .2s, border-color .2s;
    margin-bottom: -1px;
  }
  .ac-tab:hover { color: #F85700; }
  .ac-tab.active { color: #F85700; border-bottom-color: #F85700; }

  /* ── Section header row ── */
  .ac-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .ac-section-title {
    font-family: "Manrope", sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #0E0E0E;
  }
  .ac-back-link {
    background: none;
    border: none;
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #F85700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ac-back-link:hover { text-decoration: underline; }

  /* ── Empty state ── */
  .ac-empty {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    color: #888;
    padding: 12px 0;
  }

  /* ── Account Detail row ── */
  .ac-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    border-bottom: 1px solid #EDE8E3;
  }
  .ac-detail-row:last-child { border-bottom: none; }
  .ac-detail-label {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0E0E0E;
    min-width: 160px;
  }
  .ac-detail-value {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    color: #555;
    flex: 1;
  }
  .ac-edit-link {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #F85700;
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 16px;
  }
  .ac-edit-link:hover { text-decoration: underline; }
  .ac-new-member-badge {
    display: inline-flex;
    align-items: center;
    background: #FFF0E8;
    color: #F85700;
    font-family: "Manrope", sans-serif;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 999px;
    gap: 4px;
  }

  /* ── Address cards ── */
  .ac-add-address-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 22px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s;
    margin-bottom: 24px;
  }
  .ac-add-address-btn:hover { background: #e84f00; }

  .ac-address-card {
    background: #fff;
    border: 1.5px solid #E0D9D1;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
    position: relative;
  }
  .ac-address-name {
    font-family: "Manrope", sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: #0E0E0E;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ac-default-badge {
    font-size: 11px;
    font-weight: 700;
    background: #F85700;
    color: #fff;
    padding: 2px 10px;
    border-radius: 999px;
  }
  .ac-address-text {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    color: #666;
    line-height: 1.7;
    margin-bottom: 14px;
  }
  .ac-address-actions {
    display: flex;
    gap: 12px;
  }
  .ac-address-btn {
    height: 36px;
    padding: 0 18px;
    border-radius: 999px;
    font-family: "Poppins", sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
  }
  .ac-address-btn.edit {
    background: #fff;
    border: 1.5px solid #C3BCB4;
    color: #333;
  }
  .ac-address-btn.edit:hover { border-color: #F85700; color: #F85700; }
  .ac-address-btn.remove {
    background: #fff;
    border: 1.5px solid #e53e3e;
    color: #e53e3e;
  }
  .ac-address-btn.remove:hover { background: #e53e3e; color: #fff; }

  /* ── Add Address Form ── */
  .ac-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .ac-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ac-form-group.full { grid-column: 1 / -1; }
  .ac-form-label {
    font-family: "Manrope", sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .ac-form-input, .ac-form-select {
    height: 46px;
    border: 1.5px solid #C3BCB4;
    border-radius: 10px;
    padding: 0 14px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    color: #333;
    background: #FAF8F6;
    outline: none;
    transition: border-color .2s;
    appearance: none;
    width: 100%;
  }
  .ac-form-input:focus, .ac-form-select:focus { border-color: #F85700; }
  .ac-form-input::placeholder { color: #BCBCBC; }
  .ac-default-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    color: #444;
    cursor: pointer;
    margin-bottom: 24px;
  }
  .ac-default-checkbox input { width: 16px; height: 16px; accent-color: #F85700; cursor: pointer; }
  .ac-submit-btn {
    height: 50px;
    padding: 0 36px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s;
  }
  .ac-submit-btn:hover { background: #e84f00; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ac-container { padding: 0 16px 60px; }
    .ac-form-grid { grid-template-columns: 1fr; }
    .ac-header-title { font-size: 20px; }
    .ac-tabs { overflow-x: auto; }
    .ac-tab { white-space: nowrap; }
  }
`;

/* ============================================================
   DUMMY DATA
   ============================================================ */
const DUMMY_USER = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: VALID_PHONE,
};

const DUMMY_ADDRESS = {
  id: 1,
  name: "John Doe",
  line1: "123 Johari Bazaar, Near Clock Tower",
  line2: "Jaipur, Rajasthan 302003",
  country: "India",
  phone: VALID_PHONE,
  isDefault: true,
};

/* ============================================================
   LOGIN POPUP
   ============================================================ */
function LoginPopup({ onSuccess }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (phone.trim() === VALID_PHONE) {
      setError("");
      onSuccess();
    } else {
      setError("Invalid phone number. Please try again.");
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* Logo */}
        <div className="login-logo">
          {/* Replace src with your actual logo path */}
          <img src="/logo.png" alt="Riya Art Palace" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
        <div className="login-brand">Riya Art Palace</div>
        <div className="login-sub">Sign in to your account</div>

        <label className="login-label">Mobile Number</label>
        <div className="login-input-row">
          <div className="login-flag-box">
            🇮🇳 +91
          </div>
          <input
            type="tel"
            maxLength={10}
            className={`login-input${error ? " error" : ""}`}
            placeholder="Enter mobile number"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            onKeyDown={handleKey}
            autoFocus
          />
        </div>
        <div className="login-error">{error}</div>

        <button className="login-btn" onClick={handleLogin}>
          Login →
        </button>

        <div className="login-privacy">
          By continuing, you agree to our{" "}
          <a href="/privacy-policy">Privacy Policy</a> &amp;{" "}
          <a href="/terms">Terms of Service</a>
        </div>

        <div className="login-powered">
          <span>POWERED BY</span>
          <strong style={{ color: "#444" }}>🚀 Shiprocket</strong>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADD ADDRESS FORM
   ============================================================ */
function AddAddressForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    address1: "", address2: "",
    city: "", zip: "",
    country: "Select Your Country", state: "Select Your State/Province",
    phone: "", altPhone: "",
    isDefault: false,
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div>
      <div className="ac-section-header" style={{ marginBottom: 24 }}>
        <div>
          <button className="ac-back-link" onClick={onCancel}>
            ← Return to account details
          </button>
          <div className="ac-section-title" style={{ marginTop: 8 }}>Your Addresses</div>
        </div>
      </div>

      <h3 style={{
        fontFamily: '"Manrope",sans-serif',
        fontSize: 20,
        fontWeight: 800,
        color: "#0E0E0E",
        textAlign: "center",
        marginBottom: 28,
      }}>Add a New Address</h3>

      <div className="ac-form-grid">
        <div className="ac-form-group">
          <label className="ac-form-label">First Name</label>
          <input className="ac-form-input" placeholder="First name" value={form.firstName} onChange={set("firstName")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Last Name</label>
          <input className="ac-form-input" placeholder="Last name" value={form.lastName} onChange={set("lastName")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Address 1</label>
          <input className="ac-form-input" placeholder="Write your address here" value={form.address1} onChange={set("address1")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Address 2</label>
          <input className="ac-form-input" placeholder="Write your address here" value={form.address2} onChange={set("address2")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">City / Town / District</label>
          <input className="ac-form-input" placeholder="Enter your city" value={form.city} onChange={set("city")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Zip</label>
          <input className="ac-form-input" placeholder="Enter zip code" value={form.zip} onChange={set("zip")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Country</label>
          <select className="ac-form-select" value={form.country} onChange={set("country")}>
            <option>Select Your Country</option>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>UAE</option>
            <option>Australia</option>
            <option>Canada</option>
          </select>
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">State/Province</label>
          <select className="ac-form-select" value={form.state} onChange={set("state")}>
            <option>Select Your State/Province</option>
            <option>Rajasthan</option>
            <option>Delhi</option>
            <option>Maharashtra</option>
            <option>Gujarat</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Uttar Pradesh</option>
          </select>
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Mobile Number</label>
          <input className="ac-form-input" placeholder="Enter Mobile Number" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="ac-form-group">
          <label className="ac-form-label">Alternate / Whatsapp Number</label>
          <input className="ac-form-input" placeholder="Enter Alternate Number" value={form.altPhone} onChange={set("altPhone")} />
        </div>
      </div>

      <label className="ac-default-checkbox">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm(f => ({ ...f, isDefault: e.target.checked }))}
        />
        Add as default address
      </label>

      <div>
        <button className="ac-submit-btn" onClick={() => onSave(form)}>
          Submit Enquiry →
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN ACCOUNT PAGE
   ============================================================ */
export default function AccountPage() {
  const router = useRouter();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Active tab: 'orders' | 'details' | 'addresses'
  const [activeTab, setActiveTab] = useState("orders");

  // Address state
  const [addresses, setAddresses] = useState([DUMMY_ADDRESS]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle save new address
  const handleSaveAddress = (form) => {
    const newAddr = {
      id: Date.now(),
      name: `${form.firstName} ${form.lastName}`,
      line1: `${form.address1}${form.address2 ? ", " + form.address2 : ""}`,
      line2: `${form.city}${form.zip ? " " + form.zip : ""}${form.state !== "Select Your State/Province" ? ", " + form.state : ""}`,
      country: form.country !== "Select Your Country" ? form.country : "India",
      phone: form.phone,
      isDefault: form.isDefault,
    };
    if (form.isDefault) {
      setAddresses(prev => [
        newAddr,
        ...prev.map(a => ({ ...a, isDefault: false })),
      ]);
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
    setShowAddForm(false);
  };

  const handleRemoveAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      <Navbar />
      <style jsx>{styles}</style>

      {/* ── LOGIN POPUP (shown until logged in) ── */}
      {!isLoggedIn && (
        <LoginPopup onSuccess={() => setIsLoggedIn(true)} />
      )}

      <div className="ac-page">
        <div className="ac-container">

          {/* Header */}
          <div className="ac-header">
            <div className="ac-header-title">My Account</div>
            <button
              className="ac-logout-btn"
              onClick={() => {
                setIsLoggedIn(false);
                setActiveTab("orders");
              }}
            >
              Log out ↗
            </button>
          </div>

          {/* ── ADD ADDRESS FORM view ── */}
          {showAddForm ? (
            <AddAddressForm
              onCancel={() => setShowAddForm(false)}
              onSave={handleSaveAddress}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="ac-tabs">
                <button
                  className={`ac-tab${activeTab === "orders" ? " active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  Order History
                </button>
                <button
                  className={`ac-tab${activeTab === "details" ? " active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  Account Details
                </button>
                <button
                  className={`ac-tab${activeTab === "addresses" ? " active" : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  Addresses
                </button>
              </div>

              {/* ── ORDER HISTORY ── */}
              {activeTab === "orders" && (
                <div>
                  <div className="ac-section-header">
                    <div className="ac-section-title">Order History</div>
                  </div>
                  <div className="ac-empty">
                    You haven't placed any orders yet.
                  </div>
                </div>
              )}

              {/* ── ACCOUNT DETAILS ── */}
              {activeTab === "details" && (
                <div>
                  <div className="ac-section-header">
                    <div className="ac-section-title">Account Details</div>
                    <span className="ac-new-member-badge">✦ New Member</span>
                  </div>

                  <div className="ac-detail-row">
                    <div className="ac-detail-label">Name</div>
                    <div className="ac-detail-value">{DUMMY_USER.name}</div>
                    <button className="ac-edit-link">Edit</button>
                  </div>
                  <div className="ac-detail-row">
                    <div className="ac-detail-label">Email</div>
                    <div className="ac-detail-value">{DUMMY_USER.email}</div>
                    <button className="ac-edit-link">Edit</button>
                  </div>
                  <div className="ac-detail-row">
                    <div className="ac-detail-label">Phone</div>
                    <div className="ac-detail-value">+91 {DUMMY_USER.phone}</div>
                    <button className="ac-edit-link">Edit</button>
                  </div>
                  <div className="ac-detail-row">
                    <div className="ac-detail-label">Password</div>
                    <div className="ac-detail-value">••••••••</div>
                    <button className="ac-edit-link">Edit</button>
                  </div>
                </div>
              )}

              {/* ── ADDRESSES ── */}
              {activeTab === "addresses" && (
                <div>
                  <div className="ac-section-header">
                    <div className="ac-section-title">Your Addresses</div>
                  </div>

                  <button
                    className="ac-add-address-btn"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add New Address
                  </button>

                  {addresses.length === 0 && (
                    <div className="ac-empty">No addresses saved yet.</div>
                  )}

                  {addresses.map((addr) => (
                    <div className="ac-address-card" key={addr.id}>
                      <div className="ac-address-name">
                        {addr.name}
                        {addr.isDefault && (
                          <span className="ac-default-badge">Default</span>
                        )}
                      </div>
                      <div className="ac-address-text">
                        {addr.line1}<br />
                        {addr.line2}<br />
                        {addr.country}<br />
                        {addr.phone}
                      </div>
                      <div className="ac-address-actions">
                        <button className="ac-address-btn edit">Edit</button>
                        <button
                          className="ac-address-btn remove"
                          onClick={() => handleRemoveAddress(addr.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <ValuesSection />
      <FollowUs />
      <Footer />
    </>
  );
}