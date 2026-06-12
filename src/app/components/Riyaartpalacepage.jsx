// pages/index.jsx  OR  app/page.jsx
// Usage: Drop this file into your Next.js project.
// Also add to your global CSS / tailwind config:
//  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');
"use client";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FollowUs from "./FollowUs";
import ValuesSection from "./ValuesSection.jsx";
import AboutSection from "./AboutSection";
import Global from "./Global";

import story from "../assets/story.jpg"
import ab1 from "../assets/ab1.png"
import heritage from "../assets/heritage.jpg"
import ab2 from "../assets/ab2.jpg"
import ab3 from "../assets/ab3.jpg"
import ab4 from "../assets/ab4.jpg"
import ab5 from "../assets/ab5.jpg"
import ab6 from "../assets/ab6.jpg"
import ab7 from "../assets/ab7.jpg"
import ab8 from "../assets/ab8.jpg"
import ab9 from "../assets/ab9.jpg"
import ab10 from "../assets/ab10.jpg"
// ─── SMALL REUSABLE COMPONENTS ───────────────────────────────────────────────

const StatBadge = ({ number, label }) => (
  <div style={styles.statBadge}>
    <div style={styles.statNumber}>{number}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const FeaturePill = ({ text }) => (
  <div style={styles.featurePill}>{text}</div>
);

const SectionTitle = ({ children, center = false }) => (
  <h2 style={{ ...styles.sectionTitle, textAlign: center ? "center" : "left" }}>
    {children}
  </h2>
);

const Divider = () => <hr style={styles.divider} />;

// ─── HISTORY STORY ITEM ──────────────────────────────────────────────────────
const StoryItem = ({
  title,
  text,
  imgSrc,
  imgAlt,
  reverse = false,
}) => (
  <div
    className="story-mobile"
    style={{
      ...styles.storyItem,
      flexDirection: reverse ? "row-reverse" : "row",
    }}
  >
    <div style={styles.storyImgWrap}>
      <img src={imgSrc} alt={imgAlt} style={styles.storyImg} />
    </div>

    <div style={styles.storyText}>
      <h3 style={styles.storyTitle}>{title}</h3>
      <p style={styles.storyBody}>{text}</p>
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RiyaArtPalacePage() {
  return (
    <>
      < Navbar />
      <style jsx>{`
  .story-item {
    display: flex;
    align-items: center;
    gap: 80px;
  }

  .story-item.reverse {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    .story-item,
    .story-item.reverse {
      flex-direction: column !important;
      gap: 24px;
    }

    .story-item div {
      width: 100% !important;
    }
  }

  /* ── WOMEN ARTISANS SECTION ───────────────────────────────── */
  .women-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 40px;
    display: grid;
    grid-template-columns: 320px 1fr 320px;
    align-items: center;
    gap: 60px;
  }

  .women-img-wrap {
    width: 320px;
    height: 450px;
    overflow: hidden;
  }
    .left-image {
  margin-top: 120px;
}

.right-image {
  margin-top: -180px;
}

  .women-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .left-women-img {
    border-radius: 180px 180px 180px 180px;
  }

  .right-women-img {
    border-radius: 180px 180px 180px 80px;
  }
    

  .women-text {
    text-align: center;
  }

  .women-number {
    font-family: 'Playfair Display', serif;
    font-size: clamp(60px, 6vw, 96px);
    font-weight: 700;
    color: #F86300;
    margin-bottom: 20px;
  }

  .women-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 4vw, 64px);
    font-weight: 700;
    color: #111;
    line-height: 1.15;
    margin-bottom: 24px;
  }

  .women-body {
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    line-height: 1.9;
    color: #222;
    max-width: 620px;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    .women-section {
      grid-template-columns: 1fr;
      gap: 50px;
      padding: 20px 20px;
    }

    .women-img-wrap {
      width: 260px;
      height: 380px;
      margin: 0 auto;
    }

    .left-women-img,
    .right-women-img {
      border-radius: 150px 150px 70px 150px;
    }
  }

  @media (max-width: 600px) {
    .women-section {
      padding: 20px 16px;
      gap: 36px;
    }

    .women-img-wrap {
      width: 220px;
      height: 320px;
    }

    .women-number {
      font-size: 56px;
    }

    .women-title {
      font-size: 34px;
    }

    .women-body {
      font-size: 16px;
    }

    .women-body br {
      display: none;
    }
  }
  /* HERO RESPONSIVE */

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    padding: 20px 16px !important;
  }

  .hero-section > div:first-child {
    order: 1;
  }

  .hero-section > div:last-child {
    order: 2;
  }

  .hero-section img {
    width: 100% !important;
    height: 260px !important;
    object-fit: cover !important;
    border-radius: 20px !important;
  }

  .hero-section h2 {
    margin-right: 0 !important;
  }

  .hero-section p {
    margin-right: 0 !important;
  }
}  
`}</style>
      <style jsx global>{`
  @media (max-width: 768px) {
    .story-mobile {
      flex-direction: column !important;
      gap: 24px !important;
      align-items: stretch !important;
    }

    .story-mobile > div {
      width: 100% !important;
      flex: 0 0 100% !important;
      max-width: 100% !important;
    }

    .story-mobile img {
      width: 100% !important;
      height: 250px !important;
      object-fit: cover !important;
    }
  }
    .whatsapp-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: #5AC44D;
  color: #fff;
  text-decoration: none;

  padding: 15px 20px;
  border-radius: 99px;

  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 500;

  z-index: 9999;

  box-shadow: 0 8px 25px rgba(0,0,0,.15);
  transition: all .3s ease;
}

.whatsapp-btn:hover {
  transform: translateY(-2px);
}

@media (max-width:768px) {
  .whatsapp-btn {
    right: 16px;
    bottom: 16px;
    padding: 12px 18px;
    font-size: 16px;
  }
}
`}</style>
      <div style={styles.page}>

        <div
          style={{
            textAlign: "center",
            marginBottom: "80px",
          }}
        >
          <p
            style={{
              color: "#555",
              fontSize: "14px",
              fontWeight: "400",
              marginTop: "30px",
              marginBottom: "24px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            About Us
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
fontSize: "clamp(26px, 2.6vw, 44px)",              fontWeight: "700",
              color: "#111",
              lineHeight: "1.15",
              letterSpacing: "-0.5px",
             maxWidth: "1400px",
whiteSpace: "nowrap",
              margin: "0 auto",
            }}
          >
            Riya Art Palace – Where Tradition Becomes Timeless Art
          </h2>
        </div>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section
  className="hero-section"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "40px",
    alignItems: "center",
    padding: "40px 0",
  }}
>
          {/* Left Image */}
          <div>
            <img
              src={story.src}
              alt="Riya Art Palace showroom"
              style={{
                width: "100%",
                height: "380px",
                objectFit: "cover",
                borderTopRightRadius: "24px",
                borderBottomRightRadius: "24px",
                display: "block",
              }}
            />
          </div>

          {/* Right Content */}
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3vw, 48px)",
                fontWeight: "700",
                color: "#F86300",
                lineHeight: "1.15",
                marginBottom: "28px",
                marginRight: "40px"
              }}
            >
              Since 1995 - Crafting Tradition for You
            </h2>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "15px",
                lineHeight: "1.9",
                color: "#333",
                marginBottom: "24px",
                marginRight: "40px"
              }}
            >
              <strong>Welcome to Riya Art Palace,</strong> where creativity meets
              craftsmanship and every creation tells a story.
              <br />
              For decades, we have been dedicated to preserving artistic traditions
              while bringing timeless handmade creations into modern homes.
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "15px",
                lineHeight: "1.9",
                color: "#333",
                marginBottom: "14px",
                marginRight: "40px"
              }}
            >
              <strong>At Riya Art Palace,</strong> art is more than décor—it is a
              celebration of culture, heritage, and skilled craftsmanship.
              Our collections are thoughtfully designed to reflect elegance,
              authenticity, and creativity, making every piece unique and meaningful.
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "15px",
                lineHeight: "1.9",
                color: "#333",
                marginBottom: "24px",
                marginRight: "40px"
              }}
            >
              What truly defines us is our commitment to empowering communities.
              We proudly provide livelihood opportunities to more than
              <strong> 5,000 women artisans</strong>, enabling them to work from
              the comfort of their homes, support their families, and keep
              traditional art forms alive for future generations.
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "15px",
                lineHeight: "1.9",
                color: "#333",
                marginRight: "40px"
              }}
            >
              Every handcrafted piece carries the passion, dedication, and artistry
              of skilled hands that have perfected their craft over the years.
              When you choose <strong>Riya Art Palace</strong>, you are not only
              choosing quality and tradition—you are supporting a journey of
              empowerment, creativity, and heritage.
            </p>
          </div>
        </section>

<a
  href="https://wa.me/919876543210"
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-btn"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.41 0 .04 5.37.04 12c0 2.11.55 4.17 1.59 5.99L0 24l6.18-1.61A11.94 11.94 0 0 0 12.04 24C18.67 24 24 18.63 24 12c0-3.2-1.25-6.2-3.48-8.52ZM12.04 21.8c-1.79 0-3.54-.48-5.08-1.38l-.36-.21-3.67.96.98-3.58-.23-.37A9.73 9.73 0 0 1 2.24 12c0-5.41 4.4-9.8 9.8-9.8 2.62 0 5.08 1.02 6.93 2.87A9.73 9.73 0 0 1 21.84 12c0 5.4-4.39 9.8-9.8 9.8Zm5.37-7.34c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.58.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43 0 1.43 1.03 2.81 1.17 3 .14.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z"/>
  </svg>

  <span>For Bulk</span>
</a>
        < AboutSection />



        {/* ── HERO GALLERY STRIP ────────────────────────────────────── */}
        <section style={styles.galleryStrip}>
  <img
    src={ab1.src}
    alt="Gallery"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</section>

<div
  style={{
    textAlign: "center",
    marginBottom: "70px",
  }}
>
</div>

        {/* ── OUR HISTORY ───────────────────────────────────────────── */}
        <section style={styles.section}>
          <SectionTitle>Our History</SectionTitle>


          <StoryItem
            title="Our Heritage & Foundation"
            text={
              <>
                <p>
                  <strong>Founded in Jaipur, Rajasthan, Riya Art Palace</strong> is a family-owned handicraft brand dedicated to preserving and promoting the rich heritage of traditional Indian craftsmanship.
                </p>

                <br />

                <p>
                  The company was established 30 years ago by our grandfather with a vision to bring authentic Rajasthani handmade products to a wider audience while also creating sustainable employment opportunities for rural women.
                </p>
              </>
            }
  imgSrc={heritage.src}
            imgAlt="Heritage foundation"
          />
          <Divider />

          <StoryItem
            title="Empowering Artisans & Expanding the Legacy"
            text={
              <>
                <p>
                  By empowering skilled artisans and women to work from home, the foundation of the business was built not only on creativity and tradition, but also on social responsibility and community support.
                </p>

                <br />

                <p>
                  Over the years, our father further expanded the business, strengthening the company's presence in the handicraft industry and introducing new product categories inspired by Rajasthan's vibrant culture and artistry.
                </p>
              </>
            }
            imgSrc={ab2.src}
            imgAlt="Artisans at work"
            reverse
          />
          <Divider />

          <StoryItem
            title="Carrying Forward the Family Tradition"
            text={
              <>
                <p>
                  Today, the brand is proudly led by the owner duo, Kedar and Aakash Khandelwal, who continue the family legacy with a modern approach while staying deeply connected to traditional craftsmanship.
                </p>

                <br />

                <p>
                  Every product at Riya Art Palace is carefully handcrafted using traditional techniques, intricate detailing, and locally sourced raw materials, reflecting the beauty and cultural richness of Rajasthan.
                </p>
              </>
            }
            imgSrc={ab3.src}
            imgAlt="Family tradition"
          />
          <Divider />

          <StoryItem
            title="Our Handcrafted Product Collection"
            text={
              <>
                <p>
                  Our wide range of handcrafted products includes decorative hangings, torans, dream catchers, festive décor, umbrellas, lac handicrafts, metal art, spiritual décor, souvenirs, and gifting items.
                </p>

                <br />

                <p>
                  For seasonal collections, we also create unique festive decorations that combine global trends with authentic Rajasthani artistry.
                </p>
              </>
            }
            imgSrc={ab4.src}
            imgAlt="Handcrafted product collection"
            reverse
          />
          <Divider />

          <StoryItem
            title="Best-Selling Handcrafted Creations"
            text={
              <>
                <p>
                  Among our best-selling products are miniature elephant hangings and handcrafted decorative collections, appreciated for their vibrant colours, detailed craftsmanship, and traditional appeal.
                </p>
              </>
            }
            imgSrc={ab5.src}
            imgAlt="Best Selling Handcrafted Creations"
          />
          <Divider />

          <StoryItem
            title="Growing Recognition Across Global Markets"
            text={
              <>
                <p>
                  Over the years, Riya Art Palace has received a positive response from buyers across India as well as international markets, including enquiries from countries such as Spain, the Netherlands, and Denmark.
                </p>

                <br />

                <p>
                  Our commitment to quality, handmade excellence, and cultural authenticity continues to make us a trusted name in the world of Indian handicrafts.
                </p>
              </>
            }
            imgSrc={ab6.src}
            imgAlt="Global Recognition"
            reverse
          />
          <Divider />
          <StoryItem
            title="Our Vision & Commitment"
            text={
              <>
                <p>
                  At Riya Art Palace, we believe every handmade product carries a story of tradition, creativity, and craftsmanship crafted with passion and designed to bring the timeless beauty of Rajasthan into homes around the world.
                </p>
              </>
            }
            imgSrc={ab7.src}
            imgAlt="Vision and Commitment"
          />
        </section>

        {/* ── PHOTO COLLAGE STRIP ───────────────────────────────────── */}
        <section style={styles.collageStrip}>
          {[
            ab8.src
          ].map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i}`} style={styles.collageImg} />
          ))}
        </section>

        < Global />



        {/* ── WOMEN ARTISANS ────────────────────────────────────────── */}
        <section className="women-section">

          {/* LEFT IMAGE */}
          <div className="women-img-wrap left-image">
  <img
    src={ab9.src}
    alt="Women artisan"
    className="women-img left-women-img"
  />
</div>

          {/* CENTER TEXT */}
          <div className="women-text">
            <div className="women-number">5,000+</div>

            <h2 className="women-title">
              Women Artisans
              <br />
              Empowered by Craft
            </h2>

            <p className="women-body">
              We Provide Work-from-home Opportunities
              <br />
              That Help Women Artisans Support Their
              <br />
              Families While Preserving Traditional
              <br />
              Rajasthani Art Forms For Future Generations
              <br />
              Creating A Sustainable Ecosystem Of Culture
              <br />
              And Livelihood.
            </p>
          </div>

          {/* RIGHT IMAGE */}
        <div className="women-img-wrap right-image">
  <img
    src={ab10.src}
    alt="Women artisan"
    className="women-img right-women-img"
  />
</div>

        </section>
        < ValuesSection />
        < FollowUs />

        < Footer />

      </div>

    </>
  );
}

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
// (All responsive breakpoints handled via maxWidth / percentage widths.
//  For true media-query responsive behavior in Next.js add a <style> tag or
//  use the companion CSS module / Tailwind classes listed at the bottom.)

const colors = {
  primary: "#C8392B",       // deep red – main brand
  primaryLight: "#E8543A",  // warm coral
  gold: "#D4A017",          // ochre/gold accent
  dark: "#1A1A1A",
  charcoal: "#3D3D3D",
  midGray: "#666666",
  lightGray: "#F5F5F0",
  white: "#FFFFFF",
  border: "#E0DACE",
  sectionBg: "#FDFCF8",
};

const fonts = {
  display: "'Playfair Display', 'Georgia', serif",
  body: "'Poppins', 'Helvetica Neue', sans-serif",
};

const styles = {
  // PAGE
  page: {
    fontFamily: fonts.body,
    color: colors.dark,
    backgroundColor: "#F7F5F3",
    margin: 0,
    padding: 0,
    overflowX: "hidden",
  },




  // HERO
  hero: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "40px",
    padding: "60px 40px",
    backgroundColor: "#F7F5F3",
    position: "relative",
  },
  heroOverlay: { display: "none" },
  heroContent: {
    flex: "1 1 400px",
    maxWidth: "600px",
  },
  heroEyebrow: {
    fontFamily: fonts.body,
    fontSize: "12px",
    fontWeight: "600",
    color: colors.gold,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "14px",
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: "clamp(26px, 4vw, 42px)",
    fontWeight: "700",
    color: colors.dark,
    lineHeight: "1.2",
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: "14px",
    fontWeight: "400",
    color: colors.charcoal,
    lineHeight: "1.75",
    marginBottom: "16px",
  },
  heroBody: {
    fontFamily: fonts.body,
    fontSize: "13px",
    color: colors.midGray,
    lineHeight: "1.8",
  },
  heroImgWrap: {
    flex: "1 1 320px",
    maxWidth: "500px",
  },
  heroImg: {
    width: "100%",
    height: "340px",
    objectFit: "cover",
    borderRadius: "8px",
    display: "block",
  },

  // STATS ROW
  statsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0",
    backgroundColor: colors.primary,
    padding: "28px 40px",
  },
  statBadge: {
    textAlign: "center",
    padding: "0 40px",
    color: colors.white,
  },
  statNumber: {
    fontFamily: fonts.display,
    fontSize: "clamp(16px, 2.5vw, 22px)",
    fontWeight: "700",
    marginBottom: "4px",
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: "12px",
    opacity: 0.85,
    letterSpacing: "0.5px",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // PILLS
  pillsSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
    padding: "28px 40px",
    backgroundColor: colors.lightGray,
    borderBottom: `1px solid ${colors.border}`,
  },
  featurePill: {
    fontFamily: fonts.body,
    fontSize: "13px",
    fontWeight: "500",
    color: colors.charcoal,
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "24px",
    padding: "8px 20px",
    whiteSpace: "nowrap",
  },

  // GALLERY STRIP
  galleryStrip: {
    display: "flex",
    gap: "0",
    overflow: "hidden",
    height: "320px",
  },
  galleryImg: {
    flex: "1 1 25%",
    width: "25%",
    height: "320px",
    objectFit: "cover",
    display: "block",
  },

  // SECTION
  section: {
    padding: "80px 40px",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(22px, 3vw, 32px)",
    fontWeight: "700",
    color: "#F86300",
    marginBottom: "50px",
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${colors.border}`,
    margin: "32px 0",
  },

  // STORY ITEM
  storyItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "80px",
    width: "100%",
  },
  storyText: {
    flex: "0 0 48%",

    width: "48%",
  },
  storyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(32px,3vw,52px)",
    fontWeight: "700",
    color: "black",
    lineHeight: "1.15",
    marginBottom: "24px",
  },
  storyBody: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "17px",
    fontWeight: "400",
    lineHeight: "1.9",
    color: "#4A4A4A",
  },
  storyImgWrap: {
    flex: "0 0 48%",
    width: "48%",
  },

  storyImg: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    display: "block",
  },

  // COLLAGE STRIP
  collageStrip: {
    display: "flex",
    gap: "4px",
    overflow: "hidden",
    padding: "0",
    backgroundColor: colors.dark,
  },
  collageImg: {
    flex: "1 1 20%",
    width: "20%",
    height: "300px",
    objectFit: "cover",
    display: "block",
    opacity: 0.88,
    transition: "opacity 0.3s",
  },

  // WORLDWIDE
  worldwideWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    alignItems: "flex-start",
  },
  worldwideText: {
    flex: "1 1 360px",
  },
  worldwideMap: {
    flex: "1 1 320px",
    backgroundColor: "#FFF8EE",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mapImg: {
    width: "100%",
    opacity: 0.75,
  },
  bodyText: {
    fontFamily: fonts.body,
    fontSize: "13px",
    color: colors.midGray,
    lineHeight: "1.8",
    marginBottom: "16px",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "24px",
    marginTop: "8px",
  },
  orgBadge: {
    fontFamily: fonts.body,
    fontSize: "11px",
    fontWeight: "600",
    color: colors.primary,
    backgroundColor: "#FFF0EE",
    border: `1px solid #FFCDC9`,
    borderRadius: "4px",
    padding: "4px 12px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  shippingFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  shippingItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  shippingIcon: {
    fontSize: "24px",
    lineHeight: "1",
    marginTop: "2px",
  },
  shippingTitle: {
    fontFamily: fonts.body,
    fontSize: "14px",
    fontWeight: "600",
    color: colors.dark,
    marginBottom: "2px",
  },
  shippingDesc: {
    fontFamily: fonts.body,
    fontSize: "12px",
    color: colors.midGray,
  },

  // IMPORT CTA
  importCta: {
    backgroundColor: "#FFF8EE",
    borderTop: `3px solid ${colors.gold}`,
    padding: "60px 40px",
    textAlign: "center",
  },
  importTitle: {
    fontFamily: fonts.display,
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: "700",
    color: colors.dark,
    marginBottom: "16px",
  },
  importSubtitle: {
    fontFamily: fonts.body,
    fontSize: "14px",
    color: colors.midGray,
    lineHeight: "1.75",
    maxWidth: "700px",
    margin: "0 auto 32px",
  },
  importCategoriesRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "36px",
  },
  importCategory: {
    fontFamily: fonts.body,
    fontSize: "12px",
    fontWeight: "500",
    color: colors.charcoal,
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "20px",
    padding: "6px 16px",
  },
  ctaButton: {
    fontFamily: fonts.body,
    fontSize: "15px",
    fontWeight: "600",
    color: colors.white,
    backgroundColor: colors.primary,
    border: "none",
    borderRadius: "6px",
    padding: "14px 36px",
    cursor: "pointer",
    letterSpacing: "0.5px",
  },
};