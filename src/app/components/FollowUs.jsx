"use client";
import instagramLogo from "../assets/instagram.png";
import Image from "next/image";
import facebookLogo from "../assets/facebook.png";
import youtubeLogo from "../assets/youtube.png";
export default function FollowUs() {
  return (
    <section
    className="home-section"
      style={{
        background: "#F7F5F3",
       
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
       <h2
  style={{
    fontFamily: "'Playfair Display', serif",
    color: "#F85700",
    fontSize: "clamp(26px, 2.5vw, 38px)",
    fontWeight: 800,
    lineHeight: "1.6",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
    margin: 0,
    textTransform: "uppercase",
  }}
>
  FOLLOW US
</h2>

        <div
          style={{
            flex: 1,
            height: "1px",
            backgroundColor: "#CFC8C2",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          {/* Instagram */}
          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "24px",
  }}
>
  <a href="https://www.instagram.com/riya_art_palace/" target="_blank" rel="noreferrer">
    <Image
      src={instagramLogo}
      alt="Instagram"
      width={58}
      height={58}
      style={{
        borderRadius: "50%",
        border: "1px solid #CFC8C2",
        padding: "14px",
        background: "#fff",
      }}
    />
  </a>

  <a href="https://facebook.com" target="_blank" rel="noreferrer">
    <Image
      src={facebookLogo}
      alt="Facebook"
      width={58}
      height={58}
      style={{
        borderRadius: "50%",
        border: "1px solid #CFC8C2",
        padding: "14px",
        background: "#fff",
      }}
    />
  </a>

  <a href="https://youtube.com" target="_blank" rel="noreferrer">
    <Image
      src={youtubeLogo}
      alt="YouTube"
      width={58}
      height={58}
      style={{
        borderRadius: "50%",
        border: "1px solid #CFC8C2",
        padding: "14px",
        background: "#fff",
      }}
    />
  </a>
</div>

        </div>
      </div>
    </section>
  );
}