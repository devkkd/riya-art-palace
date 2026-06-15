"use client";
import { useRef } from "react";
import Image from "next/image";
import insta1 from "../assets/insta1.jpg";
import insta2 from "../assets/insta2.jpg";
import insta3 from "../assets/insta3.jpg";
import insta4 from "../assets/insta4.jpg";
import insta5 from "../assets/insta5.jpg";
import indiamart from "../assets/indiamart.png";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const reviews = [
  {
    text: "Loved the attention to detail and authentic handmade finish. Highly recommended for handicraft lovers worldwide.",
    author: "Verified International Buyer",
  },
  {
    text: "Beautiful craftsmanship and premium quality products. Delivery was smooth and professional.",
    author: "Verified International Buyer",
  },
  {
    text: "Excellent export packaging and authentic Rajasthani artistry. Will order again.",
    author: "Verified International Buyer",
  },
  {
    text: "Unique handcrafted products with outstanding detailing and finishing.",
    author: "Verified International Buyer",
  },
  {
    text: "Great communication and beautiful handmade collections for our store.",
    author: "Verified International Buyer",
  },
];

const gallery = [insta1, insta2, insta3, insta4, insta5];

export default function SocialProof() {
  const scrollRef = useRef(null);

  return (
    <section
  style={{
    backgroundColor: "#F7F5F3",
    paddingTop: "30px",
    paddingBottom: "50px",
  }}
>
      <style>{`
        div::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

        .sp-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: clamp(16px, 4vw, 40px);
          padding-right: clamp(16px, 4vw, 40px);
        }

        .sp-reviews-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 48px;
        }

        .sp-ratings-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }

        .sp-insta-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 48px;
        }

        .sp-gallery {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          overflow: hidden;
          border-radius: 12px;
        }

        .sp-gallery-img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        @media (max-width: 768px) {
          .sp-reviews-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sp-insta-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sp-gallery {
            grid-template-columns: repeat(3, 1fr);
            border-radius: 10px;
          }

          .sp-gallery-img {
            height: 130px;
          }

          .sp-gallery-item:nth-child(4),
          .sp-gallery-item:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .sp-gallery {
            grid-template-columns: repeat(2, 1fr);
          }

          .sp-gallery-img {
            height: 160px;
          }

          .sp-gallery-item:nth-child(4) {
            display: block;
          }

          .sp-gallery-item:nth-child(5) {
            display: none;
          }
        }
      `}</style>

      <div className="sp-outer">

        {/* ── Reviews ── */}
        <div style={{ marginBottom: "96px" }}>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "72px", height: "1px", backgroundColor: "#FF6500" }} />
            <span
  style={{
    color: "#FF6500",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontFamily: "'Manrope', sans-serif",
  }}
>
  CLIENT LOVE
</span>
          </div>

          {/* Header row */}
          <div className="sp-reviews-header">
           <h2
  style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(34px, 3vw, 44px)",
    fontWeight: "800",
    color: "#0E0E0E",
    margin: "0",
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  }}
>
  What Our Buyers Say
</h2>

            <div className="sp-ratings-row">
              <span
  style={{
    color: "#FF6500",
    fontWeight: "700",
    fontSize: "22px",
    fontFamily: "'Manrope', sans-serif",
    whiteSpace: "nowrap",
  }}
>
  4.8 Reviews ★★★★★
</span>

              {/* Google Logo */}
              <svg height="24" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.41V32h31.86c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.76.36 15.63 16.32.17 35.45.17c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.64.31z" fill="#4285F4"/>
              </svg>

              {/* Indiamart */}
              <Image
  src={indiamart}
  alt="IndiaMart"
  width={120}
  height={32}
  style={{
    width: "120px",
    height: "auto",
    objectFit: "contain",
  }}
/>
            </div>

            <button style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "48px", minWidth: "170px", padding: "0 28px",
              borderRadius: "999px", backgroundColor: "#111", color: "#fff",
              fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap",
              border: "none", cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.2px",
            }}>
              Write a Review &nbsp;→
            </button>
          </div>

          {/* Review Cards - horizontal scroll */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "12px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {reviews.map((item, index) => (
              <div
                key={index}
                style={{
                  flexShrink: "0",
                  width: "260px",
                  backgroundColor: "#fff",
                  border: "1px solid #E0D8D0",
                  borderRadius: "16px",
                  padding: "24px",
                  minHeight: "240px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontSize: "16px", letterSpacing: "3px", color: "#1A1A1A", margin: "0 0 20px 0", fontFamily: "sans-serif" }}>
                  ★★★★★
                </p>
                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#333", flex: "1", margin: "0", fontFamily: "'Manrope', sans-serif", }}>
                  {item.text}
                </p>
                <div style={{ marginTop: "24px" }}>
                  <p style={{ fontSize: "14px", letterSpacing: "3px", color: "#1A1A1A", margin: "0 0 8px 0", fontFamily: "sans-serif" }}>
                    ★★★★★
                  </p>
                  <p style={{ fontSize: "12px", color: "#555", margin: "0", fontFamily: "sans-serif" }}>
                    {item.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Instagram Gallery ── */}
        <div>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "72px", height: "1px", backgroundColor: "#FF6500" }} />
         <span
  style={{
    color: "#FF6500",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontFamily: "'Manrope', sans-serif",
  }}
>
  SOCIAL THAT FEELS HUMAN
</span>
          </div>

          {/* Header row */}
          <div className="sp-insta-header">
           <h2
  style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(34px, 3vw, 44px)",
    fontWeight: "800",
    color: "#0E0E0E",
    margin: "0",
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  }}
>
  Follow Our Craft Journey
</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", flexShrink: "0",
              }}>
                <InstagramIcon />
              </div>
              <span
  style={{
    fontSize: "18px",
    color: "#0E0E0E",
    fontFamily: "'Manrope', sans-serif",
    fontWeight: "500",
    letterSpacing: "-0.01em",
  }}
>
  @riya_art_palace
</span>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="sp-gallery">
            {gallery.map((img, index) => (
              <div
                key={index}
                className="sp-gallery-item"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <Image
                  src={img}
                  alt=""
                  className="sp-gallery-img"
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  width: "28px", height: "28px", borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}