"use client";
import wallDecor from "../assets/wall-decor.jpg";
import tableDecor from "../assets/table-decor.jpg";
import lacCollection from "../assets/lac-collection.jpg";
import eventDecor from "../assets/event-decor.jpg";
import handpainted from "../assets/handpainted.jpg";
import Image from "next/image";
const products = [
  { image: wallDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", desc: "Wall hanging | Gota POM POM" },
  { image: tableDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", desc: "Wall hanging | Gota POM POM" },
  { image: lacCollection, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", desc: "Wall hanging | Gota POM POM" },
  { image: eventDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", desc: "Wall hanging | Gota POM POM" },
  { image: handpainted, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", desc: "Wall hanging | Gota POM POM" },
];

export default function BestSelling() {
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

        .bs-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .bs-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .bs-img {
          width: 100%;
          height: 290px;
          object-fit: cover;
          display: block;
        }

        /* ── TABLET (≤ 900px): 3 columns ── */
        @media (max-width: 900px) {
          .bs-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ── MOBILE (≤ 600px): 2 columns ── */
        @media (max-width: 600px) {
          .bs-outer {
            padding-left: 16px;
            padding-right: 16px;
          }
          .bs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .bs-img {
            height: 180px;
          }
          .bs-header {
            margin-bottom: 28px !important;
          }
        }
      `}</style>

      <div className="bs-outer">

        <div className="bs-header" style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ width: "56px", height: "1px", backgroundColor: "#FF6500" }} />
            <span
              style={{
                color: "#FF6500",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontFamily: "sans-serif",
              }}
            >
              MOST LOVED
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 50px)",
              fontWeight: "700",
              lineHeight: "1.05",
              color: "#111",
              margin: "0",
            }}
          >
            Our Best-Selling Pieces
          </h2>
        </div>

        <div className="bs-grid">
          {products.map((product, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column" }}>

              <div style={{ marginBottom: "16px", overflow: "hidden" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  className="bs-img"
                />
              </div>

              <h3
                style={{
                  fontSize: "clamp(13px, 1.4vw, 17px)",
                  fontWeight: "600",
                  color: "#111",
                  lineHeight: "1.35",
                  marginBottom: "8px",
                  fontFamily: "sans-serif",
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  fontSize: "clamp(13px, 1.3vw, 16px)",
                  fontWeight: "600",
                  color: "#111",
                  marginBottom: "6px",
                  fontFamily: "sans-serif",
                }}
              >
                {product.price}
              </p>

              <p
                style={{
                  fontSize: "clamp(11px, 1vw, 13px)",
                  color: "#555",
                  lineHeight: "1.5",
                  marginBottom: "14px",
                  fontFamily: "sans-serif",
                }}
              >
                {product.desc}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  gap: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    color: "#111",
                    fontFamily: "sans-serif",
                    margin: "0",
                    whiteSpace: "nowrap",
                  }}
                >
                  QUANTITY
                </p>

                <div
                  style={{
                    height: "34px",
                    minWidth: "84px",
                    border: "1px solid #CFC7BF",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 8px",
                    backgroundColor: "transparent",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "300", color: "#111", cursor: "pointer", lineHeight: "1", userSelect: "none" }}>−</span>
                  <span style={{ fontSize: "13px", color: "#111", fontFamily: "sans-serif" }}>500</span>
                  <span style={{ fontSize: "16px", fontWeight: "300", color: "#111", cursor: "pointer", lineHeight: "1", userSelect: "none" }}>+</span>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor: "#FF6500",
                  color: "#fff",
                  borderRadius: "999px",
                  fontSize: "clamp(11px, 1.1vw, 14px)",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "12px",
                  fontFamily: "sans-serif",
                  letterSpacing: "0.2px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f05f00")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6500")}
              >
                + Add to Cart
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  style={{
                    fontSize: "clamp(10px, 1vw, 12px)",
                    fontWeight: "500",
                    color: "#111",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6500")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
                >
                  India Enquiry →
                </button>

                <button
                  style={{
                    fontSize: "clamp(10px, 1vw, 12px)",
                    fontWeight: "500",
                    color: "#111",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    fontFamily: "sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6500")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
                >
                  Export Enquiry →
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}