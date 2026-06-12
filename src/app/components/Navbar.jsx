"use client";
import { Search, ShoppingBag, User, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";


export default function Navbar() {
  return (
    <header
      style={{
        backgroundColor: "#F7F5F3",
        borderBottom: "1px solid #DDD7D2",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >


        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "88px",
          }}
          className="desktop-nav"
        >


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
          >

            <Image
              src={logo}
              alt="Riya Art Palace"
              width={180}
              height={58}
              style={{
                height: "58px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "18px" }}>🇮🇳</span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#222",
                  fontFamily: "sans-serif",
                }}
              >
                INR
              </span>
              <ChevronDown size={14} color="#222" />
            </div>

            <div style={{ position: "relative", width: "280px" }}>
              <Search
                size={18}
                strokeWidth={1.8}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  pointerEvents: "none",
                  zIndex: "1",
                }}
              />
              <input
                type="text"
                placeholder="Search products you want"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "999px",
                  border: "1px solid #D8D2CC",
                  backgroundColor: "transparent",
                  paddingLeft: "50px",
                  paddingRight: "20px",
                  fontSize: "13px",
                  color: "#222",
                  outline: "none",
                  fontFamily: "sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>

          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              fontSize: "14px",
              color: "#222",
              fontFamily: "sans-serif",
            }}
          >
            <a
              href="#"
              style={{
                fontWeight: "600",
                color: "#111",
                textDecoration: "none",
              }}
            >
              Home
            </a>

            <Link
              href="/about"
              style={{
                fontWeight: "400",
                color: "#222",
                textDecoration: "none",
              }}
            >
              About Us
            </Link>

            <Link
  href="/products"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: "400",
    color: "#222",
    textDecoration: "none",
  }}
>
  Product Collections
  <ChevronDown size={14} />
</Link>

           <Link
  href="/contact"
  style={{
    fontWeight: "400",
    color: "#222",
    textDecoration: "none",
  }}
>
  Contact Us
</Link>
          </nav>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >

            <div
              style={{
                height: "36px",
                width: "1px",
                backgroundColor: "#D7D1CB",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <ShoppingBag size={18} color="#222" />
              <span
                style={{
                  fontSize: "13px",
                  color: "#222",
                  fontFamily: "sans-serif",
                }}
              >
                Cart
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <User size={18} color="#222" />
              <span
                style={{
                  fontSize: "13px",
                  color: "#222",
                  fontFamily: "sans-serif",
                }}
              >
                Account
              </span>
            </div>

            <button
              style={{
                height: "48px",
                padding: "0 24px",
                borderRadius: "999px",
                backgroundColor: "#FF6900",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                fontFamily: "sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f06000")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6900")}
            >
              Export Enquiry
            </button>

          </div>

        </div>

        <div
          className="mobile-nav"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          <Image
            src={logo}
            alt="logo"
            width={130}
            height={42}
            style={{
              height: "42px",
              width: "auto",
              display: "block",
            }}
          />
          <Menu size={28} color="#222" />
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        input::placeholder { color: #B7B0AA; }
        input:focus { border-color: #B7B0AA; }
      `}</style>

    </header>
  );
}