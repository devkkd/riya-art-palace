"use client";
import { useState, useRef } from "react";
import { Search, ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
const [showDropdown, setShowDropdown] = useState(false);
const dropdownRef = useRef(null);


useEffect(() => {
  function handleClickOutside(event) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  }

  document.addEventListener("click", handleClickOutside);

  return () =>
    document.removeEventListener(
      "click",
      handleClickOutside
    );
}, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

        .nb-wrap {
          background: #F7F5F3;
          border-bottom: 1px solid #DDD7D2;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nb-inner {
          max-width: 1760px;
          margin: 0 auto;
          padding: 0 60px;
        }

        /* ── Desktop ── */
        .nb-desktop {
          display: flex;
          align-items: center;
          height: 80px;
        }

        /* LEFT: logo + currency — fixed, no flex-grow */
        .nb-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .nb-logo-img {
          width: auto;
          height: 52px;
          object-fit: contain;
          display: block;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nb-currency {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background .15s;
          flex-shrink: 0;
        }
        .nb-currency:hover { background: #EDE8E3; }
        .nb-currency-text {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1A1A1A;
          letter-spacing: 0.01em;
        }

        /* SEARCH — grows to fill space between left and nav */
        .nb-search-area {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 36px;
        }
        .nb-search-wrap {
          position: relative;
          width: 100%;
          max-width: 340px;
        }
        .nb-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #AEAEAE;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .nb-search-input {
          width: 100%;
          height: 44px;
          border-radius: 999px;
          border: 1px solid #D7CEC5;
          background: #FFFBF6;
          padding: 0 18px 0 44px;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #1A1A1A;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .nb-search-input:focus {
          border-color: #FF870F;
          box-shadow: 0 0 0 3px rgba(255,135,15,0.08);
        }
        .nb-search-input::placeholder { color: #C0B9B2; }

        /* NAV LINKS */
        .nb-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-shrink: 0;
        }
        .nb-nav-home {
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0E0E0E;
          text-decoration: none;
          white-space: nowrap;
          transition: color .15s;
          line-height: 1;
        }
        .nb-nav-home:hover { color: #FF870F; }

        .nb-nav-link {
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #0E0E0E;
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: color .15s;
          line-height: 1;
        }
        .nb-nav-link:hover { color: #FF870F; }
.nb-dropdown-wrap{
  position: relative;
}

.nb-dropdown-card{
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);

  width: 380px;          /* pehle 580px tha */
  background: #F7F5F3;
  border: 1px solid #D7CEC5;
  border-radius: 22px;

  padding: 16px 20px;    /* pehle 28px 36px tha */

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 8px 16px;        /* pehle 24px 50px tha */

  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.nb-dropdown-item{
  text-decoration: none;
  color: #0E0E0E;
  font-family: "Manrope", sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all .25s ease;
}

.nb-dropdown-item:hover{
  background: #FF870F;
  color: #fff;
}


        /* DIVIDER */
        .nb-divider {
          width: 1px;
          height: 28px;
          background: #D7D1CB;
          flex-shrink: 0;
          margin: 0 24px;
        }

        /* RIGHT ICONS */
        .nb-right {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .nb-icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1A1A1A;
          transition: color .15s, background .15s;
          white-space: nowrap;
          line-height: 1;
        }
        .nb-icon-btn:hover {
          color: #FF870F;
          background: #FFF3EB;
        }
        .nb-icon-btn + .nb-icon-btn {
          margin-left: 4px;
        }

        /* EXPORT BUTTON */
        .nb-enquiry-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 22px;
          border-radius: 999px;
          background: #FF870F;
          color: #fff;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          margin-left: 14px;
          transition: background .2s, transform .15s;
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }
        .nb-enquiry-btn:hover {
          background: #e87500;
          transform: scale(1.02);
        }

        /* ── MOBILE ── */
        .nb-mobile {
          display: none;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .nb-mobile-logo {
          height: 38px;
          width: auto;
          cursor: pointer;
          display: block;
        }
        .nb-mobile-icons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nb-mobile-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: #1A1A1A;
          display: flex;
          align-items: center;
          border-radius: 8px;
          transition: color .15s, background .15s;
        }
        .nb-mobile-icon:hover { color: #FF870F; background: #FFF3EB; }

        /* Mobile drawer */
        .nb-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
        }
        .nb-drawer-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.42);
        }
        .nb-drawer-panel {
          position: relative;
          width: 280px;
          max-width: 82vw;
          height: 100%;
          background: #F7F5F3;
          display: flex;
          flex-direction: column;
          padding: 24px 22px 32px;
          overflow-y: auto;
          animation: nbSlideIn .26s ease;
          box-shadow: 4px 0 24px rgba(0,0,0,0.1);
        }
        @keyframes nbSlideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .nb-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .nb-drawer-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: #555;
          border-radius: 8px;
          display: flex;
          align-items: center;
          transition: color .15s;
        }
        .nb-drawer-close:hover { color: #FF870F; }
        .nb-drawer-link {
          display: flex;
          align-items: center;
          font-size: 15px;
          font-weight: 600;
          font-family: "Manrope", sans-serif;
          color: #0E0E0E;
          text-decoration: none;
          padding: 13px 0;
          border-bottom: 1px solid #E5E0DA;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: color .15s;
        }
        .nb-drawer-link:hover { color: #FF870F; }
        .nb-drawer-enquiry {
          margin-top: 24px;
          width: 100%;
          height: 48px;
          border-radius: 999px;
          background: #FF870F;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: "Manrope", sans-serif;
          border: none;
          cursor: pointer;
          transition: background .2s;
        }
        .nb-drawer-enquiry:hover { background: #e87500; }

        /* Breakpoints */
        @media (max-width: 1280px) {
          .nb-inner { padding: 0 40px; }
          .nb-nav { gap: 22px; }
          .nb-search-area { padding: 0 24px; }
        }
        @media (max-width: 1100px) {
          .nb-inner { padding: 0 28px; }
          .nb-nav { gap: 18px; }
          .nb-search-area { padding: 0 18px; }
          .nb-divider { margin: 0 16px; }
        }
        @media (max-width: 960px) {
          .nb-desktop { display: none !important; }
          .nb-mobile  { display: flex !important; }
          .nb-dropdown-card{
    display:none;
  }
        }
      `}</style>

      <header className="nb-wrap">
        <div className="nb-inner">

          {/* ══ DESKTOP ══ */}
          <div className="nb-desktop">

            {/* LEFT */}
            <div className="nb-left">
              <Image
                src={logo}
                alt="Riya Art Palace"
                width={166}
                height={52}
                className="nb-logo-img"
                onClick={() => router.push("/")}
                priority
              />
              <div className="nb-currency">
                <span style={{ fontSize: "16px", lineHeight: 1 }}>🇮🇳</span>
                <span className="nb-currency-text">INR</span>
<ChevronDown
  size={12}
  strokeWidth={2.5}
  onClick={(e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  }}
  style={{ cursor: "pointer" }}
/>
              </div>
            </div>

            {/* SEARCH */}
            <div className="nb-search-area">
              <div className="nb-search-wrap">
                <span className="nb-search-icon">
                  <Search size={16} strokeWidth={1.8} />
                </span>
                <input
                  type="text"
                  className="nb-search-input"
                  placeholder="Search products you want"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>
            </div>

            {/* NAV */}
            <nav className="nb-nav">
              <Link href="/" className="nb-nav-home">Home</Link>
              <Link href="/about" className="nb-nav-link">About Us</Link>
          <div
  className="nb-dropdown-wrap"
  ref={dropdownRef}
>
  <div className="nb-nav-link">
  <Link
    href="/products"
    style={{
      textDecoration: "none",
      color: "inherit",
    }}
  >
    Product Collections
  </Link>

  <ChevronDown
    size={14}
    strokeWidth={2.5}
    style={{
      cursor: "pointer",
      transition: "0.3s",
      transform: showDropdown
        ? "rotate(180deg)"
        : "rotate(0deg)",
    }}
    onClick={(e) => {
      e.stopPropagation();
      setShowDropdown(!showDropdown);
    }}
  />
</div>

  {showDropdown && (
    <div className="nb-dropdown-card">

      <Link href="/products?category=wall-decor" className="nb-dropdown-item">
        Wall Décor
      </Link>

      <Link href="/products?category=handmade-accessories" className="nb-dropdown-item">
        Handmade Accessories
      </Link>

      <Link href="/products?category=table-decor" className="nb-dropdown-item">
        Table Décor
      </Link>

      <Link href="/products?category=spiritual-items" className="nb-dropdown-item">
        Spiritual Items
      </Link>

      <Link href="/products?category=lac-collection" className="nb-dropdown-item">
        Lac Collection
      </Link>

      <Link href="/products?category=handpainted-articles" className="nb-dropdown-item">
        Handpainted Articles
      </Link>

      <Link href="/products?category=event-decor" className="nb-dropdown-item">
        Event Décor
      </Link>

      <Link href="/products?category=diary-collection" className="nb-dropdown-item">
        Diary Collection
      </Link>

      <Link href="/products?category=festive-collection" className="nb-dropdown-item">
        Festive Collection
      </Link>

      <Link href="/products?category=christmas-items" className="nb-dropdown-item">
        Christmas Items
      </Link>

      <Link href="/products?category=rajasthani-traditional" className="nb-dropdown-item">
        Rajasthani Traditional
      </Link>

      <Link href="/products?category=ottomans-puffs" className="nb-dropdown-item">
        Ottomans & Puffs
      </Link>

    </div>
  )}
</div>
              <Link href="/contact" className="nb-nav-link">Contact Us</Link>
            </nav>

            {/* DIVIDER + ICONS + BUTTON */}
            <div className="nb-right">
              <div className="nb-divider" />

              <button className="nb-icon-btn" onClick={() => router.push("/cart")}>
                <ShoppingBag size={17} strokeWidth={1.8} />
                <span>Cart</span>
              </button>

              <button className="nb-icon-btn" onClick={() => router.push("/account")}>
                <User size={17} strokeWidth={1.8} />
                <span>Account</span>
              </button>

              <button
                className="nb-enquiry-btn"
                onClick={() => router.push("/enquiry?type=export")}
              >
                Export Enquiry
              </button>
            </div>

          </div>

          {/* ══ MOBILE ══ */}
          <div className="nb-mobile">
            <Image
              src={logo}
              alt="Riya Art Palace"
              width={120}
              height={38}
              className="nb-mobile-logo"
              onClick={() => router.push("/")}
            />
            <div className="nb-mobile-icons">
              <button className="nb-mobile-icon" onClick={() => router.push("/account")}>
                <User size={20} strokeWidth={1.8} />
              </button>
              <button className="nb-mobile-icon" onClick={() => router.push("/cart")}>
                <ShoppingBag size={20} strokeWidth={1.8} />
              </button>
              <button className="nb-mobile-icon" onClick={() => setMobileOpen(true)}>
                <Menu size={24} strokeWidth={1.8} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ══ MOBILE DRAWER ══ */}
      {mobileOpen && (
        <div className="nb-drawer-overlay">
          <div className="nb-drawer-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="nb-drawer-panel">
            <div className="nb-drawer-top">
              <Image src={logo} alt="Riya Art Palace" width={110} height={36} style={{ height: 36, width: "auto" }} />
              <button className="nb-drawer-close" onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <Link href="/"        className="nb-drawer-link" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/about"   className="nb-drawer-link" onClick={() => setMobileOpen(false)}>About Us</Link>
            <Link href="/products" className="nb-drawer-link" onClick={() => setMobileOpen(false)}>Product Collections</Link>
            <Link href="/contact" className="nb-drawer-link" onClick={() => setMobileOpen(false)}>Contact Us</Link>
            <button className="nb-drawer-link" onClick={() => { setMobileOpen(false); router.push("/account"); }}>Account</button>
            <button className="nb-drawer-link" onClick={() => { setMobileOpen(false); router.push("/cart"); }}>Cart</button>
            <button className="nb-drawer-enquiry" onClick={() => { setMobileOpen(false); router.push("/enquiry?type=export"); }}>
              Export Enquiry
            </button>
          </div>
        </div>
      )}
    </>
  );
}