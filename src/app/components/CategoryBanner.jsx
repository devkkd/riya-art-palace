"use client";
import hero from "../assets/hero.png";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
export default function CategoryBanner() {
  return (
    <section
  className="home-section"
  style={{
    backgroundColor: "#F7F5F3",
  }}
>
      <style>{`
        .category-banner-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }

        .category-whatsapp-btn {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 40px;
          min-width: 115px;
          padding: 0 16px;
          background-color: #25D366;
          color: #fff;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          font-family: sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        @media (max-width: 600px) {
          .category-banner-img {
            height: 300px;
          }

          .category-whatsapp-btn {
            right: 14px;
            height: 34px;
            min-width: unset;
            padding: 0 12px;
            font-size: 12px;
            gap: 6px;
          }
        }
      `}</style>

      <div style={{ position: "relative", overflow: "hidden" }}>

       <Image
  src={hero}
  alt="Rajasthani Puppets"
  width={1920}
  height={520}
  className="category-banner-img"
/>

        {/* Play Button */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.25)",
            border: "2px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(2px)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>

        {/* WhatsApp Button */}
        <button className="category-whatsapp-btn">
          <FaWhatsapp style={{ fontSize: "16px", flexShrink: "0" }} />
          <span>For Bulk</span>
        </button>

      </div>
    </section>
  );
}