"use client";
import { useState } from "react";
import logo from "../assets/logo.png";
import indiamartLogo from "../assets/indiamart.png";
import Image from "next/image";
const wallDecor = [
  "Wall Decor", "Rajasthani Wall Hanging", "Wall Hangings",
  "Torans", "Fancy Hangings", "Marigold Toran",
  "Marigold Flower Hangings", "Wind Chimes",
  "Dream Catcher", "Prosperity Hangings",
];

const rajasthaniHandicrafts = [
  "Rajasthani Traditional Handicraft", "Rajasthani Puppet",
  "Animal Stuffs", "Handpainted Articles", "Handpainted Kettles",
];

const tableDecor = [
  "Table Décor", "Metal Meenakari Work Animal Figure",
  "Metal Stone Work Animal Figure",
];

const lacCollection = [
  "Lac Work", "Lac Diary", "Lac Diary with Pen",
  "Lac Jewellery Box", "Lac Incense Holder",
  "Lac Pen", "Lac Box Pen Set",
];

const handmadeAccessories = [
  "Handmade Accessories", "Handmade Keychains",
  "Fridge Magnets", "Stone Work Purses", "Decorative Mirrors",
];

const spiritualCollection = [
  "Pooja Articles", "Marble Items", "Ganesh Statue",
];

const christmasItems = [
  "Christmas Décor", "Christmas Ornaments",
];

const diaryCollection = [
  "Leather Diaries", "Lac Diary", "Lac Diary with Pen",
];

const eventDecor = [
  "Event Décor Items", "Garden Umbrella", "Embroidery Umbrella",
];

const festivalCollection = [
  "Diwali Gifting", "Karwa Chauth Collection", "T-Light Candle Holders",
];

const furnitureLiving = ["Ottomans", "Poufs"];

const company = [
  "About Us", "Our History", "Contact Us",
  "Privacy Policy", "Terms & Conditions",
];


function FooterCol({ title, items }) {
  return (
    <div>
      <p style={{
        fontSize: "13px", fontWeight: 700,
        color: "#1a1a1a", marginBottom: "10px",
      }}>
        {title}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: "6px" }}>
            <a
              href="#"
              style={{
                fontSize: "13px", color: "#555",
                textDecoration: "none", lineHeight: 1.5,
                transition: "color 0.15s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#e55a1c")}
              onMouseOut={(e) => (e.target.style.color = "#555")}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ fontFamily: "'Manrope', sans-serif", background: "#fce8dc" }}>
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

        .footer-newsletter {
          background: #fce8dc;
          border-bottom: 1px solid #e8d0c0;
          padding: 40px clamp(16px, 5vw, 64px);
        }

        .footer-newsletter-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-newsletter-right {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-email-input {
          width: 360px;
          padding: 14px 18px;
          border: 1.5px solid #ddd;
          border-radius: 10px;
          background: #fff;
          font-size: 15px;
font-family: 'Manrope', sans-serif;
font-weight: 400;
line-height: 1.5;
          color: #1a1a1a;
          outline: none;
          box-sizing: border-box;
        }

        .footer-brand {
          background: #fce8dc;
          border-bottom: 1px solid #e8d0c0;
          padding: 36px clamp(16px, 5vw, 64px);
          text-align: center;
        }

        .footer-links {
          background: #fce8dc;
          border-bottom: 1px solid #e8d0c0;
          padding: 48px clamp(16px, 5vw, 64px);
        }

        .footer-links-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 220px 1fr 1fr 1fr 1fr 1fr;
          gap: 32px;
        }

        .footer-cats-grid {
          display: contents;
        }

        .footer-bottom {
          background: #f7dfd0;
          padding: 18px clamp(16px, 5vw, 64px);
          text-align: center;
        }

        @media (max-width: 1024px) {
          .footer-links-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .footer-contact-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .footer-links-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-contact-col {
            grid-column: 1 / -1;
          }
          .footer-email-input {
            width: 100%;
          }
          .footer-newsletter-right {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .footer-subscribe-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
          }
          .footer-contact-col {
            grid-column: 1 / -1;
          }
        }
      `}</style>
     

      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="footer-newsletter-inner">
          <div>
            <h3 style={{
           fontFamily: "'Manrope', sans-serif",
fontSize: "32px",
fontWeight: 700,
lineHeight: "1.3",
letterSpacing: "-0.02em",
              color: "#1a1a1a", marginBottom: "8px",
            }}>
              Join the Riya Art Palace Circle
            </h3>
            <p style={{ fontFamily: "'Manrope', sans-serif",
fontSize: "16px",
fontWeight: 400,
lineHeight: "1.7",
color: "#555",}}>
              New arrivals, exclusive B2B offers, and handicraft stories in your inbox.
            </p>
          </div>

          <div className="footer-newsletter-right">
            <div style={{ flex: 1, minWidth: "220px" }}>
              <label style={{
                display: "block",fontFamily: "'Manrope', sans-serif",
fontSize: "14px",
fontWeight: 500,
lineHeight: "1.5",color: "#1a1a1a", marginBottom: "8px",
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-email-input"
              />
            </div>
            <button
              type="button"
              className="footer-subscribe-btn"
              style={{
                padding: "14px 28px",
                background: "#1a1a1a",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                fontSize: "15px",
fontWeight: 700,
fontFamily: "'Manrope', sans-serif",
letterSpacing: "0.02em",
                cursor: "pointer",
                
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="footer-brand">
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Image
            src={logo}
            alt="Riya Art Palace Logo"
            style={{
              height: "70px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 16px",
            }}
          />
          <p style={{
            fontSize: "18px",
fontWeight: 700,
fontFamily: "'Manrope', sans-serif",
lineHeight: "1.5",
            color: "#1a1a1a", marginBottom: "8px",
          }}>
            "Crafting Tradition for You"
          </p>
          <p style={{ fontSize: "18px",
fontWeight: 400, color: "#555", maxWidth: "680px", margin: "0 auto", lineHeight: 1.7 }}>
            Where Tradition Becomes Timeless Art. Family-owned handicraft brand from Jaipur, Rajasthan
            bringing authentic handmade creations into homes worldwide since 1995.
          </p>
        </div>
      </div>

      {/* Links Grid */}
      <div className="footer-links">
        <div className="footer-links-grid">

          {/* Contact Column */}
          <div className="footer-contact-col">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#fff", borderRadius: "8px",
              padding: "6px 12px", marginBottom: "12px",
              border: "1px solid #e0d0c0",
            }}>
             <Image
  src={indiamartLogo}
  alt="IndiaMart"
  width={150}
  height={45}
  style={{
    objectFit: "contain",
    width: "150px",
    height: "auto",
  }}
/>
            </div>

            <p style={{ fontSize: "13px", color: "#e55a1c", marginBottom: "20px", cursor: "pointer" }}>
              Visit Our Indiamart Store →
            </p>

            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>
              Let's Connect
            </p>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, marginBottom: "16px" }}>
              Whether you're a retailer, importer, or interior brand we're ready to discuss pricing, samples, and custom requirements.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0 32px",
            }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>Address</p>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, marginBottom: "14px" }}>
                  A-97, Subhash Nagar Shopping Centre,<br />
                  Shastri Nagar, Jaipur – 302016, Rajasthan
                </p>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>Phone / WhatsApp</p>
                <p style={{ fontSize: "13px", color: "#555", marginBottom: "14px" }}>+91 80476 35730</p>

                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>Business Info</p>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}>
                  GST: 08AIBPM9441J1ZZ · IEC: AIBPM9441J<br />
                  IndiaMART Verified · Est. 1995
                </p>
              </div>
            </div>
          </div>

          {/* Category Columns */}
          <div>
            <FooterCol title="Wall Décor" items={wallDecor} />
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Company" items={company} />
            </div>
          </div>

          <div>
            <FooterCol title="Rajasthani Traditional Handicrafts" items={rajasthaniHandicrafts} />
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Table Décor" items={tableDecor} />
            </div>
          </div>

          <div>
            <FooterCol title="Lac Collection" items={lacCollection} />
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Diary Collection" items={diaryCollection} />
            </div>
          </div>

          <div>
            <FooterCol title="Handmade Accessories" items={handmadeAccessories} />
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Spiritual Collection" items={spiritualCollection} />
            </div>
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Christmas Items" items={christmasItems} />
            </div>
          </div>

          <div>
            <FooterCol title="Event Décor" items={eventDecor} />
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Festival Collection" items={festivalCollection} />
            </div>
            <div style={{ marginTop: "24px" }}>
              <FooterCol title="Furniture & Living" items={furnitureLiving} />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p style={{ fontSize: "13px", color: "#666" }}>
          © 2025 Riya Art Palace. All rights reserved. GST: 08AIBPM9441J1ZZ · IEC: AIBPM9441J
        </p>
      </div>

    </footer>
  );
}