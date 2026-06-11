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
      @keyframes pendulumSwing {
  0% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(6deg);
  }
  100% {
    transform: rotate(-6deg);
  }
}
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

        
        .hero-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 40px 56px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 0.65fr 0.9fr;
          align-items: center;
          gap: 24px;
        }

        .hero-img-col {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-top: -148px;
           transform-origin: top center;
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

        
        .hero-mobile { display: none; }

      
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 28px;
          padding-bottom: 28px;
        }

        
        @media (max-width: 700px) {

          
          .hero-outer { display: none; }

          
          .hero-mobile { display: block; }

          .hero-mobile-img-wrap {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            margin-top: -60px;
            padding: 0 40px;
          }
          .hero-mobile-img {
            width: 55%;
            max-width: 260px;
            min-width: 160px;
            object-fit: contain;
            display: block;
            filter: drop-shadow(0 12px 32px rgba(0,0,0,0.08));
          }

          
          .hero-mobile-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px 20px;
            padding: 32px 20px 40px;
          }

        
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-item {
            padding-left: 16px !important;
            padding-right: 16px !important;
            border-right: none !important;
            border-bottom: 1px solid #D9D3CC;
            padding-top: 18px;
            padding-bottom: 18px;
          }
          .stat-item:nth-child(odd) {
            padding-left: 20px !important;
            border-right: 1px solid #D9D3CC !important;
          }
          .stat-item:nth-child(even) {
            padding-left: 20px !important;
          }
          .stat-item:nth-last-child(-n+2) {
            border-bottom: none;
          }
          .stats-wrap-mobile {
            padding-left: 0;
            padding-right: 0;
          }
        }
      `}</style>

      
      <div className="hero-outer">
        <div className="hero-grid">

          <div className="hero-left">
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F86300",
                fontWeight: "400",
                fontSize: "clamp(48px, 6vw, 82px)",
                lineHeight: "0.92",
                letterSpacing: "-0.03em",
                margin: "0 0 40px 0",
              }}
            >
              Riya Art Palace
            </h1>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "#111",
                fontWeight: "500",
                fontSize: "clamp(24px, 3.2vw, 44px)",
                lineHeight: "1.18",
                margin: "0",
              }}
            >
              The Art of Rajasthan,
              <br />
              Refined for the Modern Home
            </h2>
          </div>

          <div className="hero-img-col">
            <Image src={elephant} alt="Elephant" className="hero-img" />
          </div>

          <div style={{ paddingTop: "8px" }}>
            <h3
              style={{
                color: "#111",
                fontWeight: "700",
                fontSize: "clamp(18px, 1.9vw, 26px)",
                lineHeight: "1.35",
                maxWidth: "430px",
                margin: "0 0 24px 0",
                fontFamily: "sans-serif",
              }}
            >
              Authentic Handmade Décor Crafted In Jaipur Since 1995
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "2",
                color: "#4A4A4A",
                maxWidth: "440px",
                margin: "0 0 40px 0",
                fontFamily: "sans-serif",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "56px",
                minWidth: "220px",
                padding: "0 32px",
                borderRadius: "999px",
                backgroundColor: "#FF6500",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                fontFamily: "sans-serif",
                transition: "background-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f55f00";
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

      
      <div className="hero-mobile">

        <div className="hero-mobile-img-wrap">
          <Image src={elephant} alt="Elephant" className="hero-mobile-img" />
        </div>

        <div className="hero-mobile-body">

          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F86300",
                fontWeight: "400",
                fontSize: "clamp(36px, 9vw, 52px)",
                lineHeight: "0.92",
                letterSpacing: "-0.03em",
                margin: "0 0 20px 0",
              }}
            >
              Riya Art Palace
            </h1>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "#111",
                fontWeight: "500",
                fontSize: "clamp(16px, 4.5vw, 22px)",
                lineHeight: "1.25",
                margin: "0",
              }}
            >
              The Art of Rajasthan,
              <br />
              Refined for the Modern Home
            </h2>
          </div>

          <div>
            <h3
              style={{
                color: "#111",
                fontWeight: "700",
                fontSize: "clamp(14px, 3.8vw, 18px)",
                lineHeight: "1.35",
                margin: "0 0 14px 0",
                fontFamily: "sans-serif",
              }}
            >
              Authentic Handmade Décor Crafted In Jaipur Since 1995
            </h3>
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.8",
                color: "#4A4A4A",
                margin: "0 0 24px 0",
                fontFamily: "sans-serif",
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
                fontFamily: "sans-serif",
              }}
            >
              <span>Explore Collections</span>
              <span style={{ marginLeft: "6px", fontSize: "12px" }}>→</span>
            </button>
          </div>

        </div>
      </div>

      
      <div style={{  backgroundColor: "#F7F5F3" }}>
        <div
          className="stats-wrap-mobile"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
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
                <span
                  style={{
                    fontSize: "clamp(18px, 2vw, 28px)",
                    fontWeight: "700",
                    color: "#111",
                    fontFamily: "sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "clamp(11px, 1.1vw, 14px)",
                    color: "#777",
                    fontFamily: "sans-serif",
                    lineHeight: "1.3",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}