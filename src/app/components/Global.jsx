"use client";

import worldMap from "../assets/world-map.png";
import epchLogo from "../assets/epch.png";
import msmeLogo from "../assets/msme.png";
import iecLogo from "../assets/iec.png";
import { Globe, Star } from "lucide-react";
import intIcon from "../assets/int.png";
import bulkIcon from "../assets/bulk.png";
import Image from "next/image";
export default function GlobalPresenceSection() {
  return (
  <section
  style={{
    backgroundColor: "#F7F5F3",
    paddingTop: "50px",
    paddingBottom: "60px",
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

          padding-top: 48px;
          padding-bottom: 40px;
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
    color: "#F85700",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "160%",
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    fontFamily: "'Manrope', sans-serif",
  }}
>
                GLOBAL PRESENCE
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(34px, 3vw, 42px)",
lineHeight: "160%",
fontWeight: "800",
letterSpacing: "-0.02em",
                color: "#111",
                margin: "0 0 20px 0",
              }}
            >
              Handcrafted in Jaipur Loved Worldwide
            </h2>

            <p
              style={{
                color: "#555",
                fontSize: "16px",
lineHeight: "160%",
fontWeight: "400",
fontFamily: "'Manrope', sans-serif",
maxWidth: "700px",
                marginBottom: "40px",
              
              }}
            >
              Rooted In Rajasthan's Rich Artistic Heritage, Riya Art Palace
              Proudly Exports Authentic Handmade Handicrafts To International
              Buyers Across Four Continents Worlds. From Retailers And
              Importers To Collectors Worldwide Every Piece Ships With The Same
              Authenticity, Artistry, And Traditional Craftsmanship That Has
              Defined Us Since 1995.
            </p>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "40px",
    marginTop: "10px",
  }}
>
  <Image
    src={epchLogo}
    alt="EPCH"
    style={{
      width: "120px",
      height: "auto",
      objectFit: "contain",
    }}
  />

  <Image
    src={msmeLogo}
    alt="MSME"
    style={{
      width: "140px",
      height: "auto",
      objectFit: "contain",
    }}
  />

  <Image
    src={iecLogo}
    alt="IEC"
    style={{
      width: "80px",
      height: "auto",
      objectFit: "contain",
    }}
  />
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
  image: intIcon,
  title: "International Shipping",
  desc: "Export-ready logistics to 40+ countries. Multi-currency checkout with INR, USD, EUR, GBP, AED & AUD.",
},
{
  image: bulkIcon,
  title: "Bulk & Custom Orders",
  desc: "MOQ-friendly wholesale pricing. Custom designs, sizes, and private-label partnerships welcome.",
},
          ].map(({ image, title, desc }) => (
        <div
  key={title}
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
  }}
>
              <div
  style={{
    flexShrink: 0,
    display: "flex",
    alignItems: "flex-start",
  }}
>
  <Image
  src={image}
  alt={title}
  width={title === "International Shipping" ? 92 : 72}
  height={title === "International Shipping" ? 92 : 72}
  style={{
    width: title === "International Shipping" ? "102px" : "72px",
    height: title === "International Shipping" ? "102px" : "72px",
    objectFit: "contain",
    display: "block",
  }}
/>
</div>
              <div>
            <h3
  style={{
    fontFamily: "'Manrope', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "160%",
    letterSpacing: "0",
    color: "#0E0E0E",
    margin: "0 0 8px 0",
  }}
>
  {title}
</h3>
<p
  style={{
    fontFamily: "'Manrope', sans-serif",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "160%",
    letterSpacing: "0",
    color: "#555555",
    margin: "0",
    maxWidth: "420px",
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
  fontFamily: "'Playfair Display', serif",
  fontSize: "clamp(28px, 3vw, 42px)",
  fontWeight: "800",
  lineHeight: "160%",
  letterSpacing: "-0.02em",
  color: "#F85700",
  textAlign: "center",
  margin: "0 auto 18px",
}}
>
            Looking to Import Authentic Rajasthani Handicrafts?
          </h2>

          <p
style={{
  fontFamily: "'Manrope', sans-serif",
  fontSize: "15px",
  fontWeight: "700",
  lineHeight: "160%",
  letterSpacing: "-0.02em",
  color: "#0E0E0E",
  textAlign: "center",
  maxWidth: "1180px",
  margin: "0 auto 56px",
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
  fontFamily: "'Manrope', sans-serif",
  fontSize: "clamp(18px, 1.4vw, 22px)",
  fontWeight: "700",
  lineHeight: "160%",
  letterSpacing: "0",
  color: "#0E0E0E",
  margin: "0",
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
                fontSize: "16px",
fontWeight: "700",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",

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