"use client";
import { useState, useRef, useEffect } from "react";
import { Search, ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import { useCatalog } from "@/app/components/CatalogContext";
import { useCart } from "@/app/components/CartContext";
import { useUser } from "@/app/components/UserContext";

export default function Navbar() {
  const router = useRouter();
  const { categories, loading: catalogLoading } = useCatalog();
  const { totalItems } = useCart();
  const { user, logout, refetchUser } = useUser();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchVal,    setSearchVal]    = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownCloseTimer = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
const searchRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [loginStep,    setLoginStep]    = useState("email");
  const [loginEmail,   setLoginEmail]   = useState("");
  const [loginOtp,     setLoginOtp]     = useState("");
  const [loginSession, setLoginSession] = useState("");
  const [loginSending, setLoginSending] = useState(false);
  const [loginVerify,  setLoginVerify]  = useState(false);
  const [loginError,   setLoginError]   = useState("");
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef(null);

  const openDropdown = () => {
  if (dropdownCloseTimer.current) {
    clearTimeout(dropdownCloseTimer.current);
  }

  setShowDropdown(true);
};

const closeDropdownWithDelay = () => {
  if (dropdownCloseTimer.current) {
    clearTimeout(dropdownCloseTimer.current);
  }

  dropdownCloseTimer.current = setTimeout(() => {
    setShowDropdown(false);
  }, 450);
};
useEffect(() => {
  return () => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
    }
  };
}, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setShowDropdown(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setUserMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Focus the mobile search input as soon as it opens
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setSearchVal("");
    setSearchResults([]);
    setSearchFocused(false);
  };
 const searchProducts = async (query) => {
  const search = query.trim();

  if (!search || search.length < 2) {
    setSearchResults([]);
    return;
  }

  try {
    setSearchLoading(true);

    const res = await fetch(
      `/api/products?q=${encodeURIComponent(search)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (json.success) {
      setSearchResults(json.data || []);
    } else {
      setSearchResults([]);
    }
  } catch (error) {
    console.error("Product search error:", error);
    setSearchResults([]);
  } finally {
    setSearchLoading(false);
  }
};
const handleSearchResultClick = (item) => {
  setSearchVal("");
  setSearchResults([]);
  setSearchFocused(false);

  if (item?.slug) {
    router.push(`/products/${item.slug}`);
    return;
  }

  if (item?.id) {
    router.push(`/products/${item.id}`);
    return;
  }

  if (item?.category?.slug) {
    router.push(`/products?category=${item.category.slug}`);
  }
};
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleAccountClick = () => {
    if (user) {
      router.push("/account");
    } else {
      setLoginOpen(true);
      setLoginStep("email");
      setLoginEmail("");
      setLoginOtp("");
      setLoginError("");
    }
  };


  const handleSendOtp = async () => {
    setLoginError("");
    const cleaned = loginEmail.trim().toLowerCase();
    if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setLoginError("Please enter a valid email address"); return;
    }
    setLoginSending(true);
    try {
      const res  = await fetch("/api/auth/user/send-otp", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email: cleaned }) });
      const json = await res.json();
      if (json.success) { setLoginSession(json.data.session_token); setLoginStep("otp"); }
      else setLoginError(json.message || "Failed to send OTP");
    } catch { setLoginError("Network error. Please try again."); }
    finally { setLoginSending(false); }
  };

  const handleVerifyOtp = async () => {
    setLoginError("");
    if (!loginOtp || loginOtp.length < 6) { setLoginError("Please enter the 6-digit OTP"); return; }
    setLoginVerify(true);
    try {
      const res  = await fetch("/api/auth/user/verify-otp", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), otp: loginOtp, session_token: loginSession }) });
      const json = await res.json();
      if (json.success) {
        await refetchUser();
        setLoginOpen(false);
        router.push("/account");
      } else setLoginError(json.message || "Invalid OTP");
    } catch { setLoginError("Network error. Please try again."); }
    finally { setLoginVerify(false); }
  };

  // Avatar initials
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

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
          /* ================================
   SEARCH RESULT DROPDOWN
   ================================ */

.nb-search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;

  background: #F7F5F3;
  border: 1px solid #D7CEC5;
  border-radius: 16px;

  padding: 8px;

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);

  z-index: 10000;

  max-height: 430px;
  overflow-y: auto;
}

/* Individual result */

.nb-search-result-card {
  width: 100%;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 9px;

  border: none;
  border-radius: 12px;

  background: transparent;

  cursor: pointer;

  text-align: left;

  font-family: "Manrope", sans-serif;

  transition:
    background .15s ease,
    transform .15s ease;
}

.nb-search-result-card:hover,
.nb-search-result-card:focus {
  background: #FFF3EB;
  outline: none;
}

/* Product image */

.nb-search-result-image {
  width: 54px;
  height: 54px;

  flex-shrink: 0;

  border-radius: 10px;

  overflow: hidden;

  background: #EEE9E4;

  display: flex;
  align-items: center;
  justify-content: center;
}

.nb-search-result-image img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}

.nb-search-result-image-empty {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #AAA;
}

/* Content */

.nb-search-result-content {
  min-width: 0;
  flex: 1;
}

.nb-search-result-name {
  font-family: "Manrope", sans-serif;

  font-size: 13px;
  font-weight: 700;

  color: #0E0E0E;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nb-search-result-category {
  margin-top: 3px;

  font-family: "Manrope", sans-serif;

  font-size: 10px;
  font-weight: 500;

  color: #999;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nb-search-result-price {
  margin-top: 4px;

  font-family: "Manrope", sans-serif;

  font-size: 11px;
  font-weight: 700;

  color: #F85700;
}

/* Loading / empty */

.nb-search-status {
  padding: 18px 12px;

  text-align: center;

  font-family: "Manrope", sans-serif;

  font-size: 12px;

  color: #999;
}

/* Scrollbar */

.nb-search-results::-webkit-scrollbar {
  width: 5px;
}

.nb-search-results::-webkit-scrollbar-track {
  background: transparent;
}

.nb-search-results::-webkit-scrollbar-thumb {
  background: #D7CEC5;
  border-radius: 999px;
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
.nb-dropdown-wrap {
  position: relative;
  padding-bottom: 14px;
  margin-bottom: -14px;
}

.nb-dropdown-card {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);

  width: 380px;

  background: #F7F5F3;
  border: 1px solid #D7CEC5;
  border-radius: 22px;

  padding: 16px 20px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 8px 16px;

  z-index: 9999;

  box-shadow: 0 10px 30px rgba(0,0,0,.08);

  animation: nbDropdownIn .18s ease;
}

@keyframes nbDropdownIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
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
        .nb-cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #F85700;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 0 4px;
          margin-left: 2px;
          line-height: 1;
        }
        /* ── User avatar button ── */
        .nb-user-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .nb-avatar-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 10px 4px 4px;
          border-radius: 999px;
          transition: background .15s;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1A1A1A;
        }
        .nb-avatar-btn:hover { background: #FFF3EB; }
        .nb-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F85700;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: "Manrope", sans-serif;
          letter-spacing: 0;
        }
        .nb-user-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #fff;
          border: 1px solid #E0D9D1;
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          min-width: 200px;
          z-index: 9999;
          overflow: hidden;
          animation: nbFadeIn .15s ease;
        }
        @keyframes nbFadeIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .nb-user-menu-head {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #F0EDE9;
        }
        .nb-user-menu-name {
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0E0E0E;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 168px;
        }
        .nb-user-menu-email {
          font-family: "Manrope", sans-serif;
          font-size: 11px;
          color: #aaa;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 168px;
        }
        .nb-user-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          text-decoration: none;
          transition: background .12s;
        }
        .nb-user-menu-item:hover { background: #FFF3EB; color: #F85700; }
        .nb-user-menu-item.danger { color: #e53e3e; }
        .nb-user-menu-item.danger:hover { background: #FEE2E2; color: #e53e3e; }

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
       /* ── MOBILE ── */

.nb-mobile {
  display: none;
  align-items: center;
  height: 64px;
  position: relative;
}

.nb-mobile-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nb-mobile-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nb-mobile-logo {
  height: 38px;
  width: auto;
  cursor: pointer;
  display: block;
}

.nb-mobile-icons {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nb-mobile-icon {
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: color .15s, background .15s;
}

.nb-mobile-icon:hover {
  color: #FF870F;
  background: #FFF3EB;
}

/* MOBILE SEARCH */

.nb-mobile-search {
  display: none;
  padding: 0 16px 14px;
  background: #F7F5F3;
}

.nb-mobile-search.nb-mobile-search-open {
  display: block;
  animation: nbMobileSearchOpen .18s ease;
}

@keyframes nbMobileSearchOpen {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.nb-mobile-search-inner {
  position: relative;
  width: 100%;
}

.nb-mobile-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #AEAEAE;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 2;
}

.nb-mobile-search-input {
  width: 100%;
  height: 44px;
  border-radius: 999px;
  border: 1px solid #D7CEC5;
  background: #FFFBF6;
  padding: 0 48px 0 44px;
  font-family: "Manrope", sans-serif;
  font-size: 13px;
  color: #1A1A1A;
  outline: none;
  box-sizing: border-box;
}

.nb-mobile-search-input:focus {
  border-color: #FF870F;
  box-shadow: 0 0 0 3px rgba(255,135,15,0.08);
}

.nb-mobile-search-input::placeholder {
  color: #C0B9B2;
}

.nb-mobile-search-close {
  position: absolute;
  right: 8px;
  top: 6px;
  width: 32px;
  height: 32px;

  border: none;
  background: transparent;
  color: #777;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  border-radius: 50%;

  padding: 0;
  margin: 0;
  z-index: 10;
  touch-action: manipulation;
}

.nb-mobile-search-close:hover {
  background: #FFF3EB;
  color: #FF870F;
}

.nb-mobile-icon.nb-mobile-icon-active {
  color: #FF870F;
  background: #FFF3EB;
}

/* Mobile search results */
.nb-mobile-search .nb-search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 100%;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 10001;
}

/* Mobile breakpoint */

@media (max-width: 960px) {

  .nb-desktop {
    display: none !important;
  }

  .nb-mobile {
    display: flex !important;
  }

  .nb-dropdown-card {
    display: none;
  }

  .nb-inner {
    padding: 0 16px;
  }

  .nb-wrap {
    position: sticky;
    top: 0;
  }
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
           <div
  className="nb-search-area"
  ref={searchRef}
>
  <div className="nb-search-wrap">

    <span className="nb-search-icon">
      <Search size={16} strokeWidth={1.8} />
    </span>

    <input
      type="text"
      className="nb-search-input"
      placeholder="Search products you want"
      value={searchVal}
      onFocus={() => {
        setSearchFocused(true);
      }}
      onChange={(e) => {
        const value = e.target.value;

        setSearchVal(value);
        setSearchFocused(true);

        searchProducts(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchVal.trim()) {
          setSearchFocused(false);
          setSearchResults([]);

          router.push(
            `/products?q=${encodeURIComponent(searchVal.trim())}`
          );
        }

        if (e.key === "Escape") {
          setSearchFocused(false);
        }
      }}
    />

    {/* SEARCH RESULTS DROPDOWN */}
    {searchFocused && searchVal.trim().length >= 2 && (
      <div className="nb-search-results">

        {searchLoading ? (
          <div className="nb-search-status">
            Searching...
          </div>
        ) : searchResults.length === 0 ? (
          <div className="nb-search-status">
            No products found
          </div>
        ) : (
          searchResults.slice(0, 8).map((item) => (
            <button
              key={item.id || item._id}
              type="button"
              className="nb-search-result-card"
              onClick={() => handleSearchResultClick(item)}
            >

              {/* IMAGE */}
              <div className="nb-search-result-image">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name || "Product"}
                  />
                ) : (
                  <div className="nb-search-result-image-empty">
                    <Search size={16} />
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="nb-search-result-content">

                <div className="nb-search-result-name">
                  {item.name}
                </div>

                {item.category?.name && (
                  <div className="nb-search-result-category">
                    {item.category.name}
                    {item.subcategory?.name
                      ? ` • ${item.subcategory.name}`
                      : ""}
                  </div>
                )}

                {item.price !== undefined && (
                  <div className="nb-search-result-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </div>
                )}

              </div>

            </button>
          ))
        )}

      </div>
    )}

  </div>
</div>

            {/* NAV */}
            <nav className="nb-nav">
              <Link href="/" className="nb-nav-home">Home</Link>
              <Link href="/about" className="nb-nav-link">About Us</Link>
         <div
  className="nb-dropdown-wrap"
  ref={dropdownRef}
  onMouseEnter={openDropdown}
  onMouseLeave={closeDropdownWithDelay}
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
              />
            </div>

{showDropdown && (
  <div
    className="nb-dropdown-card"
    onMouseEnter={openDropdown}
    onMouseLeave={closeDropdownWithDelay}
  >
      {catalogLoading ? (
        <span style={{ gridColumn: "span 2", textAlign: "center", fontSize: "12px", color: "var(--adm-muted)", padding: "10px 0" }}>
          Loading collections...
        </span>
      ) : categories.length === 0 ? (
        <span style={{ gridColumn: "span 2", textAlign: "center", fontSize: "12px", color: "var(--adm-muted)", padding: "10px 0" }}>
          No collections found
        </span>
      ) : (
        categories.map((cat) => (
          <Link
            key={cat.id || cat._id}
            href={`/products?category=${cat.slug}`}
            className="nb-dropdown-item"
            onClick={() => setShowDropdown(false)}
          >
            {cat.name}
          </Link>
        ))
      )}
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
                {totalItems > 0 && <span className="nb-cart-badge">{totalItems}</span>}
              </button>

              {/* ── User: logged in → avatar dropdown, guest → Account button ── */}
              {user ? (
                <div className="nb-user-wrap" ref={userMenuRef}>
                  <button className="nb-avatar-btn" onClick={() => setUserMenuOpen(o => !o)}>
                    <div className="nb-avatar-circle">{initials}</div>
                    <span style={{ maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {user.name || user.email?.split("@")[0]}
                    </span>
                    <ChevronDown size={13} strokeWidth={2.5} style={{ transition:"transform .2s", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)" }}/>
                  </button>

                  {userMenuOpen && (
                    <div className="nb-user-menu">
                      <div className="nb-user-menu-head">
                        <div className="nb-user-menu-name">{user.name || "My Account"}</div>
                        <div className="nb-user-menu-email">{user.email}</div>
                      </div>
                      <button className="nb-user-menu-item" onClick={() => { setUserMenuOpen(false); router.push("/account"); }}>
                        👤 My Account
                      </button>
                      <button className="nb-user-menu-item" onClick={() => { setUserMenuOpen(false); router.push("/account"); }}>
                        📦 My Orders
                      </button>
                      <button className="nb-user-menu-item" onClick={() => { setUserMenuOpen(false); router.push("/cart"); }}>
                        🛍️ My Cart
                      </button>
                      <div style={{ borderTop:"1px solid #F0EDE9" }}/>
                      <button className="nb-user-menu-item danger" onClick={handleLogout}>
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="nb-icon-btn" onClick={handleAccountClick}>
                  <User size={17} strokeWidth={1.8} />
                  <span>Account</span>
                </button>
              )}

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

    <button
      className={`nb-mobile-icon${mobileSearchOpen ? " nb-mobile-icon-active" : ""}`}
      onClick={() => {
        if (mobileSearchOpen) {
          closeMobileSearch();
        } else {
          setMobileSearchOpen(true);
        }
      }}
    >
      <Search size={20} strokeWidth={1.8} />
    </button>

    <button
      className="nb-mobile-icon"
      onClick={handleAccountClick}
    >
      {user ? (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#F85700",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Manrope,sans-serif",
          }}
        >
          {initials}
        </div>
      ) : (
        <User size={20} strokeWidth={1.8} />
      )}
    </button>

    <button
      className="nb-mobile-icon"
      onClick={() => router.push("/cart")}
      style={{ position: "relative" }}
    >
      <ShoppingBag size={20} strokeWidth={1.8} />

      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            minWidth: 16,
            height: 16,
            borderRadius: 999,
            background: "#F85700",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 3px",
          }}
        >
          {totalItems}
        </span>
      )}
    </button>

    <button
      className="nb-mobile-icon"
      onClick={() => setMobileOpen(true)}
    >
      <Menu size={24} strokeWidth={1.8} />
    </button>

  </div>
</div>

{/* ══ MOBILE SEARCH ══ */}
{mobileSearchOpen && (
<div className="nb-mobile-search nb-mobile-search-open">
  <div className="nb-mobile-search-inner">

    <span className="nb-mobile-search-icon">
      <Search size={16} strokeWidth={1.8} />
    </span>

    <input
      ref={mobileSearchInputRef}
      type="text"
      className="nb-mobile-search-input"
      placeholder="Search products you want"
      value={searchVal}
      onFocus={() => setSearchFocused(true)}
      onChange={(e) => {
        const value = e.target.value;

        setSearchVal(value);
        setSearchFocused(true);

        searchProducts(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchVal.trim()) {
          setSearchFocused(false);
          setSearchResults([]);

          router.push(
            `/products?q=${encodeURIComponent(searchVal.trim())}`
          );
        }

        if (e.key === "Escape") {
          closeMobileSearch();
        }
      }}
    />

    <button
      type="button"
      className="nb-mobile-search-close"
      onClick={closeMobileSearch}
      aria-label="Close search"
    >
      <X size={16} />
    </button>

    {/* MOBILE SEARCH RESULTS */}
    {searchFocused && searchVal.trim().length >= 2 && (
      <div className="nb-search-results">

        {searchLoading ? (
          <div className="nb-search-status">
            Searching...
          </div>
        ) : searchResults.length === 0 ? (
          <div className="nb-search-status">
            No products found
          </div>
        ) : (
          searchResults.slice(0, 8).map((item) => (
            <button
              key={item.id || item._id}
              type="button"
              className="nb-search-result-card"
              onClick={() => handleSearchResultClick(item)}
            >

              <div className="nb-search-result-image">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name || "Product"}
                  />
                ) : (
                  <div className="nb-search-result-image-empty">
                    <Search size={16} />
                  </div>
                )}
              </div>

              <div className="nb-search-result-content">

                <div className="nb-search-result-name">
                  {item.name}
                </div>

                {item.category?.name && (
                  <div className="nb-search-result-category">
                    {item.category.name}
                    {item.subcategory?.name
                      ? ` • ${item.subcategory.name}`
                      : ""}
                  </div>
                )}

                {item.price !== undefined && (
                  <div className="nb-search-result-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </div>
                )}

              </div>

            </button>
          ))
        )}

      </div>
    )}

  </div>
</div>
)}

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

      {/* ══ LOGIN MODAL (shown when guest clicks Account) ══ */}
      {loginOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:20000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setLoginOpen(false)}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:420,padding:"36px 32px",boxShadow:"0 24px 60px rgba(0,0,0,0.2)",position:"relative",animation:"nbFadeIn .2s ease"}}>

            {/* Close */}
            <button onClick={()=>setLoginOpen(false)} style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",background:"#F0EDE9",border:"none",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}>✕</button>

            {/* Logo */}
            <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
              <Image src={logo} alt="Riya Art Palace" width={120} height={40} style={{height:40,width:"auto",objectFit:"contain"}} priority/>
            </div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:20,fontWeight:800,color:"#0E0E0E",marginBottom:4}}>Sign In</div>
            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:13,color:"#888",marginBottom:24}}>Enter your email to receive a login OTP</div>

            {loginStep==="email" ? (
              <>
                <label style={{fontFamily:"Manrope,sans-serif",fontSize:12,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.4px",display:"block",marginBottom:8}}>Email Address</label>
                <input type="email" autoFocus
                  style={{width:"100%",height:48,border:`1.5px solid ${loginError?"#e53e3e":"#C3BCB4"}`,borderRadius:10,padding:"0 16px",fontSize:15,color:"#333",outline:"none",background:"#FAF8F6",marginBottom:6,fontFamily:"Poppins,sans-serif"}}
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={e=>{setLoginEmail(e.target.value);setLoginError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleSendOtp()}/>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:8}}>{loginError}</div>}
                <button onClick={handleSendOtp} disabled={loginSending}
                  style={{width:"100%",height:50,border:"none",borderRadius:999,background:loginSending?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:700,cursor:loginSending?"not-allowed":"pointer",fontFamily:"Poppins,sans-serif",marginTop:10}}>
                  {loginSending?"Sending OTP…":"Send OTP →"}
                </button>
              </>
            ) : (
              <>
                <button onClick={()=>{setLoginStep("email");setLoginOtp("");setLoginError("");}}
                  style={{background:"none",border:"none",fontSize:13,color:"#F85700",cursor:"pointer",fontWeight:600,marginBottom:14,padding:0,fontFamily:"Manrope,sans-serif"}}>
                  ← Change email ({loginEmail})
                </button>
                <div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#888",marginBottom:14}}>6-digit OTP sent to {loginEmail}</div>
                <input type="tel" maxLength={6} autoFocus
                  style={{width:"100%",height:56,border:`1.5px solid ${loginError?"#e53e3e":"#C3BCB4"}`,borderRadius:10,padding:"0 16px",fontSize:30,color:"#333",outline:"none",background:"#FAF8F6",textAlign:"center",letterSpacing:14,marginBottom:6,fontFamily:"monospace"}}
                  placeholder="------"
                  value={loginOtp}
                  onChange={e=>{setLoginOtp(e.target.value.replace(/\D/g,""));setLoginError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleVerifyOtp()}/>
                {loginError&&<div style={{fontFamily:"Manrope,sans-serif",fontSize:12,color:"#e53e3e",marginBottom:8}}>{loginError}</div>}
                <button onClick={handleVerifyOtp} disabled={loginVerify}
                  style={{width:"100%",height:50,border:"none",borderRadius:999,background:loginVerify?"#ccc":"#F85700",color:"#fff",fontSize:15,fontWeight:700,cursor:loginVerify?"not-allowed":"pointer",fontFamily:"Poppins,sans-serif",marginTop:10}}>
                  {loginVerify?"Verifying…":"Verify OTP →"}
                </button>
              </>
            )}

            <div style={{textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:11,color:"#BBB",marginTop:16,lineHeight:1.6}}>
              By continuing you agree to our <a href="/privacy-policy" style={{color:"#F85700",textDecoration:"none"}}>Privacy Policy</a> &amp; <a href="/terms" style={{color:"#F85700",textDecoration:"none"}}>Terms</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}