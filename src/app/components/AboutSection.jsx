import riya from "../assets/riya.png";
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
        paddingBottom: "40px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

        /* ── Banner ── */
        .about-banner-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 64px;
          overflow: hidden;
        }

        .about-banner {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        

       .about-banner-text-wrap {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  text-align: center;
}

    .about-banner-title {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  font-size: clamp(22px, 2.3vw, 40px);
  line-height: 160%;
  letter-spacing: -0.02em;
  color: #0E0E0E;
  margin: 0;
  text-align: center;
  max-width: 1100px;
  white-space: nowrap;
}

        /* ── Feature grid ── */
        .about-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

       @media (max-width: 900px) {
  .about-banner {
    height: 180px;
    object-fit: cover;
  }

    .about-banner-title {
    font-size: 30px;
    white-space: normal;
    max-width: 90%;
  }

  .about-feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
    .about-banner-text-wrap{
  padding-left: 20px;
  padding-right: 20px;
}
}

        @media (max-width: 600px) {
  .about-banner-wrapper {
    margin-bottom: 40px;
  }

  .about-banner {
    height: auto !important;
    width: 100%;
    object-fit: contain !important;
  }

   .about-banner-title {
    font-size: 20px;
    line-height: 140%;
    max-width: 95%;
    white-space: normal;
  }

  .about-feature-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

      @media (max-width: 400px) {
    .about-banner-title {
    font-size: 16px;
    line-height: 135%;
  }
}
        
      `}</style>

      {/* ── Banner ── */}
      <div className="about-banner-wrapper">
        <Image
          src={riya}
          alt="Riya Art Palace Banner"
          className="about-banner"
          style={{ width: "100%" }}
          priority
        />
   
        {/* centered title */}
        <div className="about-banner-text-wrap">
          <h2 className="about-banner-title">
            Riya Art Palace — Where Tradition Becomes Timeless Art
          </h2>
        </div>
      </div>

      {/* ── Main Content ── */}
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
    fontFamily: "'Manrope', sans-serif",
    fontSize: "clamp(22px, 2vw, 30px)",
    fontWeight: "700",
    lineHeight: "160%",
    letterSpacing: "-0.04em",
    color: "#0E0E0E",
    marginBottom: "40px",
  }}
>
  Why Choose Us?
</h3>

          <div className="about-feature-grid">
            {features.map((item, index) => (
              <div
                key={index}
                style={{
                  minHeight: "80px",
                  borderRadius: "16px",
                  border: "1px solid #E3D4C8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "16px 20px",
                 fontSize: "clamp(14px, 1vw, 24px)",
fontWeight: "700",
fontFamily: "'Manrope', sans-serif",
lineHeight: "160%",
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
      </div>
    </section>
  );
}