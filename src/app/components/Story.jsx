"use client";

import Image from "next/image";
import storyImg from "../assets/story.jpg";
import heroImg from "../assets/export-hero.jpg";
import riya2 from "../assets/riya2.png";

export default function StoryPage() {
  return (
    <section
      style={{
        backgroundColor: "#F7F5F3",
        minHeight: "80vh",
        paddingTop: "0px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

        /* ══════════════════════════════════════
           STORY + OVERLAP BLOCK
        ══════════════════════════════════════ */

        /* Outer wrapper — gives room for the overlap zone */
        .story-overlap-section {
          position: relative;
          maxWidth: 1280px;
          margin: 0 auto;
        }

        /* Top grid: text left, image right */
        .story-grid {
          display: grid;
          grid-template-columns: 45% 68%;
          gap: 160px;
          align-items: start;
          position: relative;
          z-index: 2;
          padding-left: clamp(16px, 4vw, 40px);
          padding-right: clamp(16px, 4vw, 40px);
          padding-top: clamp(48px, 6vw, 80px);
          max-width: 1280px;
          margin: 0 auto;
        }

        .story-text-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          /* push text down so it aligns with mid-section visually */
          padding-bottom: 180px;
        }

        .story-img-col {
  display: flex;
  position: relative;
  z-index: 3;

  margin-left: -20px;
}

        /* Story image — taller so it overlaps into the banner below */
        .story-img {
  width: 100%;
  height: 620px;

  object-fit: cover;
  object-position: center;

  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.14);

  display: block;
}

        /* ══════════════════════════════════════
           MID BANNER — sits BEHIND the image
           pulled up via negative margin-top
        ══════════════════════════════════════ */
       .mid-banner-wrapper {
  position: relative;
  width: 100%;

  margin-top: -220px;

  z-index: 1;
  overflow: hidden;
}

        .mid-banner-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        /* No dark overlay — text is dark on light banner */
        .mid-banner-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;

  padding-left: 140px; /* text andar jayega */
  padding-right: 40px;

  width: 100%;
}

        .mid-banner-text p {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: #0E0E0E;

  font-size: clamp(14px, 1vw, 18px);
  line-height: 1.6;
  letter-spacing: -0.01em;
max-width: 800px;

  margin: 0 0 6px 0;
  white-space: nowrap;
}

.mid-banner-text p:last-child {
  margin-bottom: 0;
}

        /* ══════════════════════════════════════
           HERO BANNER
        ══════════════════════════════════════ */
        .gp-hero {
          position: relative;
          width: 100%;
          height: 480px;
          overflow: hidden;
          margin-top: 140px;
          margin-bottom: 80px;
        }

        .gp-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .gp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.50) 45%,
            transparent 75%
          );
        }

        .gp-hero-content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: center;
           padding-top: 40px;
        }

        /* ══════════════════════════════════════
           TABLET ≤ 900px
        ══════════════════════════════════════ */
        @media (max-width: 900px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-bottom: 0;
          }

          .story-text-col {
            padding-bottom: 0;
            order: 2;
          }

          .story-img-col {
            order: 1;
          }

          .story-img {
            height: 340px;
            border-radius: 20px;
          }

          .mid-banner-wrapper {
            margin-top: 32px;
          }

          .mid-banner-img {
            height: 200px;
          }

          .mid-banner-content {
           padding-left: 30px;
    padding-right: 20px;

          }

          .gp-hero {
            height: 380px;
            margin-top: 48px;
            margin-bottom: 48px;
          }
        }

        /* ══════════════════════════════════════
           MOBILE ≤ 600px
        ══════════════════════════════════════ */
       @media (max-width: 600px) {

  /* Story Section */
  .story-grid {
    grid-template-columns: 1fr;
    gap: 56px;
    padding-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .story-text-col {
    padding-bottom: 0;
  }

  .story-img-col {
    margin-left: 0;
  }

  .story-img {
    height: 280px;
    border-radius: 16px;
    width: 100%;
    object-fit: cover;
  }

  /* Mid Banner */
  .mid-banner-wrapper {
    margin-top: 40px;
  }

  .mid-banner-img {
    height: 220px;
    object-fit: cover;
  }

  .mid-banner-content {
    padding-left: 24px;
    padding-right: 24px;
    max-width: 100%;
  }

  .mid-banner-text p {
    font-size: 14px;
    line-height: 1.7;
    white-space: normal;
    margin-bottom: 10px;
  }

  /* Women Banner */
  .gp-hero {
    height: 380px;
    margin-top: 80px;
    margin-bottom: 60px;
  }

  .gp-hero-content {
    padding-top: 40px;
  }

  .gp-hero-content > div {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }

  .gp-hero h3 {
    margin-bottom: 12px !important;
  }

  .gp-hero h2 {
    margin-bottom: 14px !important;
  }

  .gp-hero p {
    line-height: 1.8 !important;
  }
}

        /* ══════════════════════════════════════
           SMALL MOBILE ≤ 400px
        ══════════════════════════════════════ */
        @media (max-width: 400px) {
          .story-img {
            height: 220px;
          }

          .mid-banner-img {
            height: 220px;
          }

          .gp-hero {
            height: 280px;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          STORY GRID  (z-index:2, on top of banner)
      ═══════════════════════════════════════════ */}
      <div className="story-grid">

        {/* LEFT: text — with extra bottom padding so banner shows below */}
        <div className="story-text-col">

          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "1px",
                backgroundColor: "#FF6500",
                flexShrink: 0,
              }}
            />
            <span
  style={{
    color: "#F85700",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "160%",
    letterSpacing: "-0.02em",
    textTransform: "uppercase",
    fontFamily: "'Manrope', sans-serif",
  }}
>
              OUR STORY
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(34px, 3vw, 56px)",
lineHeight: "115%",
fontWeight: "800",
letterSpacing: "-0.02em",
              color: "#111",
              margin: "0 0 28px 0",
            }}
          >
            Where Tradition
            <br />
            Becomes Timeless Art
          </h2>

          {/* Body */}
          <p
            style={{
              fontSize: "16px",
lineHeight: "160%",
fontFamily: "'Manrope', sans-serif",
fontWeight: "500",
              color: "#444",
              marginBottom: "18px",
            }}
          >
            <strong>Since 1995, Riya Art Palace</strong> has been dedicated to
            preserving artistic traditions while bringing timeless handmade
            creations into modern homes.
          </p>

          <p
            style={{
              fontSize: "clamp(14px, 1.1vw, 16px)",
              lineHeight: "1.9",
              color: "#444",
              margin: 0,
              fontFamily: "sans-serif",
            }}
          >
            Founded in Jaipur, Rajasthan, our family-owned handicraft brand
            promotes authentic Rajasthani handmade products while creating
            sustainable employment opportunities for women artisans.
          </p>
        </div>

        {/* RIGHT: story image — overlaps into banner */}
        <div className="story-img-col">
          <Image
            src={storyImg}
            alt="Our Story"
            className="story-img"
            width={700}
            height={580}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MID BANNER — pulled up behind image via
          negative margin-top (z-index:1)
      ═══════════════════════════════════════════ */}
      <div className="mid-banner-wrapper">
        <Image
          src={riya2}
          alt="Riya Art Palace workshop"
          className="mid-banner-img"
          width={1440}
          height={260}
          style={{ width: "100%" }}
          priority
        />
        {/* Text only on left — right portion sits behind story image */}
        <div className="mid-banner-content">
          <div className="mid-banner-text">
            <p>Family Owned Handicraft Brand Founded In Jaipur, Rajasthan.</p>
            <p>
              Today Led By Kedar And Aakash Khandelwal, Combining Traditional
              Mastery With A Modern Vision.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════════ */}
      <div className="gp-hero">
        <Image
          src={heroImg}
          alt="Women artisans at work"
          className="gp-hero-img"
          width={1440}
          height={480}
          priority
        />

        <div className="gp-hero-overlay" />

        <div className="gp-hero-content">
          <div
            style={{
              maxWidth: "1280px",
              width: "100%",
              margin: "0 auto",
              paddingLeft: "clamp(16px, 4vw, 40px)",
              paddingRight: "clamp(16px, 4vw, 40px)",
            }}
          >
            <div style={{ maxWidth: "700px" }}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#FF8A1E",
                 fontSize: "clamp(52px, 5vw, 72px)",
fontWeight: "800",
lineHeight: "100%",
letterSpacing: "-0.02em",
margin: "0 0 10px 0",
                }}
              >
                5,000+
              </h3>

              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#fff",
                  fontSize: "clamp(30px, 3vw, 40px)",
lineHeight: "160%",
fontWeight: "800",
letterSpacing: "-0.02em",

                }}
              >
                Women Artisans Empowered by Craft
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.90)",
               fontSize: "16px",
lineHeight: "160%",
fontFamily: "'Manrope', sans-serif",
fontWeight: "500",
maxWidth: "700px",
                }}
              >
                We Provide Work-from-home Opportunities That Help Women Artisans
                Support Their Families While Preserving Traditional Rajasthani Art
                Forms For Future Generations Creating A Sustainable Ecosystem Of
                Culture And Livelihood.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}