import storyImg from "../assets/story.jpg";
import Image from "next/image";
const features = [
  "Since 1995 - Trusted Craftsmanship",
  "Empowering 5,000+ Women Artisans",
  "Authentic Handmade Creations",
  "Customized and Creative Designs",
  "A Perfect Blend of Tradition & Elegance",
  "Customer-Focused, Quality-Driven",
];

export default function AboutSection() {
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

        .about-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .about-story-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 96px;
          align-items: center;
          margin-bottom: 0;
        }

        .about-story-img {
          width: 100%;
          height: 560px;
          object-fit: cover;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          display: block;
        }

        .about-wave-text {
          font-size: clamp(14px, 1.5vw, 20px);
        }

        @media (max-width: 900px) {
          .about-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .about-story-img {
            height: 380px;
            border-radius: 24px;
          }
        }

        @media (max-width: 600px) {
          .about-feature-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .about-story-img {
            height: 280px;
            border-radius: 20px;
          }

          .about-wave-text {
            font-size: 14px;
          }
        }
      `}</style>

      {/* Top Wave Banner */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <svg
            viewBox="0 0 1440 180"
            style={{ width: "100%", height: "180px", display: "block" }}
            preserveAspectRatio="none"
          >
            <path
              fill="#F2DFD1"
              d="M0,40
                 C180,0 360,80 540,40
                 C720,0 900,80 1080,40
                 C1260,0 1440,80 1440,40
                 L1440,140
                 C1260,180 1080,100 900,140
                 C720,180 540,100 360,140
                 C180,180 0,100 0,140
                 Z"
            />
          </svg>

          <div
            style={{
              position: "absolute",
              inset: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 24px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textAlign: "center",
                fontSize: "clamp(16px, 3vw, 34px)",
                fontWeight: "700",
                color: "#111",
                margin: "0",
                lineHeight: "1.3",
              }}
            >
              Riya Art Palace - Where Tradition Becomes Timeless Art
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
        }}
      >
        {/* Features Grid */}
        <div style={{ marginBottom: "80px" }}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontWeight: "600",
              color: "#111",
              marginBottom: "40px",
              fontFamily: "sans-serif",
            }}
          >
            Why Choose Us?
          </h3>

          <div className="about-feature-grid">
            {features.map((item, index) => (
              <div
                key={index}
                style={{
                  height: "80px",
                  borderRadius: "16px",
                  border: "1px solid #E3D4C8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "0 20px",
                  fontSize: "clamp(12px, 1.2vw, 15px)",
                  fontWeight: "500",
                  fontFamily: "sans-serif",
                  color: "#111",
                  backgroundColor:
                    index === 0 || index === 2 || index === 4
                      ? "#F2DFD1"
                      : "#FAF8F6",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

     {/* Story Section */}
        
      </div>   

    
    </section>
  );
}