"use client";
import elephant from "../assets/elephant.png";
import Image from "next/image";

const stats = [
  { value: "30+", label: "Years Legacy" },
  { value: "500+", label: "Products" },
  { value: "40+", label: "Countries Served" },
  { value: "IEC", label: "Export Licensed" },
  { value: "5,000+", label: "Women Artisans" },
];

export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#F7F5F3",
        borderTop: "1px solid #E5DFD9",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&display=swap');

        @keyframes pendulumSwing {
          0%   { transform: rotate(-6deg); }
          50%  { transform: rotate(6deg); }
          100% { transform: rotate(-6deg); }
        }

        /* ── DESKTOP HERO ── */
        .hero-outer {
          max-width: 1564px;
          margin: 0 auto;
          padding: 40px 80px 30px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.7fr 1fr;
          align-items: start;
          gap: 40px;
        }
        .hero-img-col {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-top: -90px;
        }
        .hero-img {
          width: 100%;
          max-width: 520px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 12px 32px rgba(0,0,0,0.08));
          transform-origin: top center;
          animation: pendulumSwing 5s ease-in-out infinite;
        }

        /* ── STATS ── */
        .stats-outer {
          background-color: #F7F5F3;
        }
        .stats-inner {
          max-width: 1564px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .stat-value {
          font-size: clamp(20px, 2vw, 30px);
          font-weight: 700;
          color: #111;
          font-family: 'Manrope', sans-serif;
          white-space: nowrap;
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: clamp(11px, 0.9vw, 14px);
          color: #888;
          font-family: 'Manrope', sans-serif;
          line-height: 1.3;
          font-weight: 400;
        }

        /* ── MOBILE HERO ── */
        .hero-mobile { display: none; }
        .hero-mobile-img-wrap { display: none; }

        @media (max-width: 768px) {
          /* Hide desktop, show mobile */
          .hero-outer { display: none; }
          .hero-mobile { display: block; }

          /* NO elephant on mobile */
          .hero-mobile-img-wrap { display: none; }

          .hero-mobile-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 16px;
            padding: 28px 20px 36px;
          }

          /* Stats — 2 column on mobile */
          .stats-inner {
            padding: 0;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-item {
            padding-left: 16px !important;
            padding-right: 16px !important;
            border-right: none !important;
            border-bottom: 1px solid #D9D3CC;
            padding-top: 16px;
            padding-bottom: 16px;
          }
          .stat-item:nth-child(odd) {
            border-right: 1px solid #D9D3CC !important;
          }
          .stat-item:nth-last-child(-n+2) {
            border-bottom: none;
          }
          /* 5th stat (IEC) — lone item at bottom, full width */
          .stat-item:last-child {
            grid-column: 1 / -1;
            border-right: none !important;
            border-bottom: none;
          }
        }
      `}</style>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hero-outer">
        <div className="hero-grid">

          {/* Left: Brand + Tagline */}
          <div className="hero-left">
            <h1
              style={{
                fontFamily: "'Monotype Corsiva', 'URW Chancery L', cursive",
                color: "#F85700",
                fontWeight: "700",
                fontSize: "72px",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
                margin: "0 0 10px 0",
              }}
            >
              Riya Art Palace
            </h1>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "#0E0E0E",
                fontWeight: "700",
                fontSize: "50px",
                lineHeight: "1.55",
                letterSpacing: "-0.02em",
                margin: "0",
                maxWidth: "645px",
              }}
            >
              The Art of Rajasthan,
              <br />
              Refined for the Modern Home
            </h2>
          </div>

          {/* Center: Elephant */}
          <div className="hero-img-col">
            <Image src={elephant} alt="Handmade elephant décor" className="hero-img" />
          </div>

          {/* Right: Copy + CTA */}
          <div style={{ paddingTop: "20px", maxWidth: "550px" }}>
            <h3
              style={{
                color: "#0E0E0E",
                fontWeight: "700",
                fontSize: "30px",
                lineHeight: "1.5",
                letterSpacing: "-0.03em",
                maxWidth: "550px",
                margin: "0 0 20px 0",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Authentic Handmade Décor Crafted In Jaipur Since 1995
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#0E0E0E",
                maxWidth: "550px",
                margin: "0 0 32px 0",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: "400",
              }}
            >
              From The Workshops Of Jaipur To Homes And Collections
              Across The Globe We Craft More Than Décor. We Preserve
              A Living Heritage. Every Puppet, Every Hanging, Every
              Handmade Piece Carries Thirty Years Of Artisan Dedication
              And The Timeless Beauty Of Indian Craftsmanship.
            </p>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "70px",
                minWidth: "230px",
                padding: "0 40px",
                borderRadius: "99px",
                backgroundColor: "#FF6500",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "background-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e55a00";
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6500";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>Explore Collections</span>
              <span style={{ marginLeft: "8px", fontSize: "14px" }}>→</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="hero-mobile">
        {/* No elephant on mobile */}
        <div className="hero-mobile-body">

          {/* Left col: Brand + Tagline */}
          <div>
            <h1
              style={{
                fontFamily: "'Monotype Corsiva', 'URW Chancery L', cursive",
                color: "#F85700",
                fontWeight: "700",
                fontSize: "clamp(34px, 9vw, 52px)",
                lineHeight: "1.05",
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
              }}
            >
              Riya Art Palace
            </h1>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "#0E0E0E",
                fontWeight: "700",
                fontSize: "clamp(16px, 4.5vw, 22px)",
                lineHeight: "1.35",
                margin: "0",
              }}
            >
              The Art of Rajasthan,
              <br />
              Refined for the Modern Home
            </h2>
          </div>

          {/* Right col: Copy + CTA */}
          <div>
            <h3
              style={{
                color: "#0E0E0E",
                fontWeight: "700",
                fontSize: "clamp(13px, 3.5vw, 18px)",
                lineHeight: "1.4",
                margin: "0 0 12px 0",
                fontFamily: "'Manrope', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Authentic Handmade Décor Crafted In Jaipur Since 1995
            </h3>
            <p
              style={{
                fontSize: "clamp(11px, 2.8vw, 13px)",
                lineHeight: "1.75",
                color: "#4A4A4A",
                margin: "0 0 20px 0",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: "400",
              }}
            >
              From The Workshops Of Jaipur To Homes And Collections
              Across The Globe We Craft More Than Décor. We Preserve
              A Living Heritage. Every Piece Carries Thirty Years Of
              Artisan Dedication And The Timeless Beauty Of Indian
              Craftsmanship.
            </p>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "46px",
                padding: "0 22px",
                borderRadius: "999px",
                backgroundColor: "#FF6500",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              <span>Explore Collections</span>
              <span style={{ marginLeft: "6px", fontSize: "12px" }}>→</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="stats-outer">
        <div className="stats-inner">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item"
                style={{
                  paddingLeft: index === 0 ? "0" : "32px",
                  paddingRight: index === stats.length - 1 ? "0" : "32px",
                  borderRight: index < stats.length - 1 ? "1px solid #D9D3CC" : "none",
                }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}