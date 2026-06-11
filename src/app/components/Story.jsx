"use client";

import Image from "next/image";
import storyImg from "../assets/story.jpg";
import heroImg from "../assets/export-hero.jpg";
export default function StoryPage() {
  return (
    <section
      style={{
        backgroundColor: "#F7F5F3",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');

        .story-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 96px;
          align-items: center;
        }

        .story-img {
          width: 100%;
          height: 560px;
          object-fit: cover;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        .story-wave-text {
          font-size: clamp(14px, 1.5vw, 20px);
        }

        @media (max-width: 900px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .story-img {
            height: 380px;
            border-radius: 24px;
          }
        }

        @media (max-width: 600px) {
          .story-img {
            height: 280px;
            border-radius: 20px;
          }

          .story-wave-text {
            font-size: 14px;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
        }}
      >
        <div className="story-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "1px",
                  backgroundColor: "#FF6500",
                }}
              />
              <span
                style={{
                  color: "#FF6500",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                OUR STORY
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(28px, 4vw, 58px)",
                lineHeight: "1.05",
                fontWeight: "700",
                color: "#111",
                margin: "0 0 32px 0",
              }}
            >
              Where Tradition
              <br />
              Becomes Timeless Art
            </h2>

            <p
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: "2",
                color: "#444",
                marginBottom: "20px",
              }}
            >
              <strong>Since 1995, Riya Art Palace</strong> has been dedicated to
              preserving artistic traditions while bringing timeless handmade
              creations into modern homes.
            </p>

            <p
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: "2",
                color: "#444",
              }}
            >
              Founded in Jaipur, Rajasthan, our family-owned handicraft brand
              promotes authentic Rajasthani handmade products while creating
              sustainable employment opportunities for women artisans.
            </p>
          </div>

          <div>
            <Image
              src={storyImg}
              alt="Our Story"
              className="story-img"
              width={700}
              height={560}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "64px",
        }}
      >
        <svg
          viewBox="0 0 1440 260"
          style={{
            width: "100%",
            height: "auto",
            minHeight: "180px",
            display: "block",
          }}
          preserveAspectRatio="none"
        >
          <path
            fill="#F2DFD1"
            d="
              M0,55
              C180,10 360,100 540,55
              C720,10 900,100 1080,55
              C1260,10 1440,100 1440,55
              L1440,205
              C1260,250 1080,160 900,205
              C720,250 540,160 360,205
              C180,250 0,160 0,205
              Z
            "
          />
        </svg>

        <div
          style={{
            position: "absolute",
            inset: "0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              width: "100%",
              margin: "0 auto",
              paddingLeft: "clamp(16px, 4vw, 40px)",
              paddingRight: "clamp(16px, 4vw, 40px)",
            }}
          >
            <p
              className="story-wave-text"
              style={{
                fontWeight: "600",
                lineHeight: "1.8",
                color: "#111",
              }}
            >
              Family Owned Handicraft Brand Founded In Jaipur, Rajasthan.
            </p>

            <p
              className="story-wave-text"
              style={{
                fontWeight: "600",
                lineHeight: "1.8",
                color: "#111",
              }}
            >
              Today Led By Kedar And Aakash Khandelwal, Combining Traditional
              Mastery With A Modern Vision.
            </p>
          </div>
        </div>
        
      </div>
      {/* Hero Banner */}
              <div className="gp-hero">
                <Image
                  src={heroImg}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: "0",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
        
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.50) 45%, transparent 75%)",
                  }}
                />
        
                <div
                  style={{
                    position: "relative",
                    zIndex: "10",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "1280px",
                      width: "100%",
                      margin: "0 auto",
                      paddingLeft: "clamp(16px, 4vw, 40px)",
                      paddingRight: "clamp(16px, 4vw, 40px)",
                    }}
                  >
                    <div style={{ maxWidth: "580px" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: "#FF8A1E",
                          fontSize: "clamp(36px, 5vw, 72px)",
                          fontWeight: "600",
                          margin: "0 0 8px 0",
                          lineHeight: "1",
                        }}
                      >
                        5,000+
                      </h3>
        
                      <h2
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: "#fff",
                          fontSize: "clamp(20px, 3.5vw, 52px)",
                          lineHeight: "1.1",
                          fontWeight: "600",
                          margin: "0 0 16px 0",
                        }}
                      >
                        Women Artisans Empowered by Craft
                      </h2>
        
                      <p
                        style={{
                          color: "rgba(255,255,255,0.90)",
                          fontSize: "clamp(12px, 1.2vw, 16px)",
                          lineHeight: "1.9",
                          maxWidth: "480px",
                          margin: "0",
                          fontFamily: "sans-serif",
                        }}
                      >
                        We Provide Work-from-home Opportunities That Help Women
                        Artisans Support Their Families While Preserving Traditional
                        Rajasthani Art Forms For Future Generations Creating A
                        Sustainable Ecosystem Of Culture And Livelihood.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
    </section>
  );
}