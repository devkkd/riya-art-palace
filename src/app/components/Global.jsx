"use client";

import worldMap from "../assets/world-map.png";
import epchLogo from "../assets/epch.png";
import msmeLogo from "../assets/msme.png";
import iecLogo from "../assets/iec.png";
import { Globe, Star } from "lucide-react";
import Image from "next/image";
export default function GlobalPresenceSection() {
  return (
  <section
  style={{
    backgroundColor: "#F7F5F3",
    paddingTop: "70px",
    paddingBottom: "70px",
  }}
>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

        .gp-hero {
          position: relative;
          height: 380px;
          overflow: hidden;
        }

        .gp-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 80px;
          align-items: center;
          margin-bottom: 64px;
        }

        .gp-features-grid {
          border-top: 1px solid #DDD;
          padding-top: 48px;
          padding-bottom: 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .gp-export-cols {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-bottom: 56px;
        }

        .gp-export-col {
          text-align: center;
          padding: 0 32px;
        }

        .gp-export-col-divider {
          border-right: 1px solid #D9D3CD;
        }

        @media (max-width: 900px) {
          .gp-hero {
            height: 320px;
          }

          .gp-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .gp-export-cols {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 0;
          }

          .gp-export-col {
            padding: 0 20px;
          }

          .gp-export-col-divider {
            border-right: none;
          }

          .gp-export-col:nth-child(1),
          .gp-export-col:nth-child(3) {
            border-right: 1px solid #D9D3CD;
          }

          .gp-export-col:nth-child(1),
          .gp-export-col:nth-child(2) {
            border-bottom: 1px solid #D9D3CD;
            padding-bottom: 32px;
          }
        }

        @media (max-width: 600px) {
          .gp-hero {
            height: 260px;
          }

          .gp-features-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-bottom: 48px;
          }

          .gp-export-cols {
            grid-template-columns: 1fr;
            gap: 28px 0;
            margin-bottom: 40px;
          }

          .gp-export-col {
            padding: 0;
            border-right: none !important;
            border-bottom: 1px solid #D9D3CD;
            padding-bottom: 24px;
          }

          .gp-export-col:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>

      

      {/* Main Content */}
      <div
      className="home-section"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
          
        }}
      >
        {/* Text + Map Grid */}
        <div className="gp-main-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ width: "70px", height: "1px", backgroundColor: "#FF6500" }} />
              <span
                style={{
                  color: "#FF6500",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  fontFamily: "sans-serif",
                }}
              >
                GLOBAL PRESENCE
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(24px, 3vw, 48px)",
                lineHeight: "1.1",
                fontWeight: "700",
                color: "#111",
                margin: "0 0 20px 0",
              }}
            >
              Handcrafted in Jaipur Loved Worldwide
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                lineHeight: "2",
                marginBottom: "40px",
                fontFamily: "sans-serif",
              }}
            >
              Rooted In Rajasthan's Rich Artistic Heritage, Riya Art Palace
              Proudly Exports Authentic Handmade Handicrafts To International
              Buyers Across Four Continents Worlds. From Retailers And
              Importers To Collectors Worldwide Every Piece Ships With The Same
              Authenticity, Artistry, And Traditional Craftsmanship That Has
              Defined Us Since 1995.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px" }}>
              <Image src={epchLogo} alt="EPCH" style={{ height: "55px", objectFit: "contain" }} />
              <Image src={msmeLogo} alt="MSME" style={{ height: "55px", objectFit: "contain" }} />
              <Image src={iecLogo} alt="IEC" style={{ height: "55px", objectFit: "contain" }} />
            </div>
          </div>

          <div>
            <Image
              src={worldMap}
              alt="World Map"
              style={{ width: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="gp-features-grid">
          {[
            {
              Icon: Globe,
              title: "International Shipping",
              desc: "Export-ready logistics to 40+ countries. Multi-currency checkout with INR, USD, EUR, GBP, AED & AUD.",
            },
            {
              Icon: Star,
              title: "Bulk & Custom Orders",
              desc: "MOQ-friendly wholesale pricing. Custom designs, sizes, and private-label partnerships welcome.",
            },
          ].map(({ Icon, title, desc }) => (
            <div key={title} style={{ display: "flex", gap: "20px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "1px solid #FF6500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: "0",
                }}
              >
                <Icon size={28} color="#FF6500" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#111",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.8",
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                    margin: "0",
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export CTA Section */}
      <div
        style={{
          borderTop: "1px solid #D9D3CD",
          paddingTop: "80px",
          paddingBottom: "80px",
          backgroundColor: "#F7F5F3",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingLeft: "clamp(16px, 4vw, 40px)",
            paddingRight: "clamp(16px, 4vw, 40px)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              maxWidth: "1000px",
              margin: "0 auto 24px auto",
              textAlign: "center",
              fontSize: "clamp(22px, 4vw, 56px)",
              lineHeight: "1.1",
              fontWeight: "600",
              color: "#FF6500",
            }}
          >
            Looking to Import Authentic Rajasthani Handicrafts?
          </h2>

          <p
            style={{
              maxWidth: "860px",
              margin: "0 auto 56px auto",
              textAlign: "center",
              fontSize: "clamp(13px, 1.2vw, 16px)",
              lineHeight: "1.9",
              color: "#222",
              fontFamily: "sans-serif",
            }}
          >
            We Work With International Buyers, Importers, And Retailers.
            Our Team Ensures Quality, Packaging, And Timely Delivery
            For Every Export Order.
          </p>

          {/* Export Categories */}
          <div className="gp-export-cols">
            {[
              "Handmade Décor &\nFestive Decorations",
              "Lac Handicrafts &\nSpiritual Décor",
              "Wall Hangings and\nGift Items",
              "Table Décor & Handmade\nAccessories",
            ].map((text, index) => (
              <div
                key={index}
                className={`gp-export-col${index < 3 ? " gp-export-col-divider" : ""}`}
              >
                <h3
                  style={{
                    fontSize: "clamp(14px, 1.4vw, 18px)",
                    fontWeight: "600",
                    lineHeight: "1.6",
                    color: "#111",
                    margin: "0",
                    fontFamily: "sans-serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {text}
                </h3>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
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
              Send Export Enquiry
              <span style={{ marginLeft: "8px", fontSize: "14px" }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}