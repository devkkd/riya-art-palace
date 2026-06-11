// pages/index.jsx  OR  app/page.jsx
// Usage: Drop this file into your Next.js project.
// Also add to your global CSS / tailwind config:
//  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FollowUs from "./FollowUs";
import ValuesSection from "./ValuesSection.jsx";
import AboutSection from "./AboutSection";
import Global from "./Global";
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
const StoryItem = ({ title, text, imgSrc, imgAlt, reverse = false }) => (
  <div
    style={{
      ...styles.storyItem,
      flexDirection: reverse ? "row-reverse" : "row",
    }}
  >
    <div style={styles.storyText}>
      <h3 style={styles.storyTitle}>{title}</h3>
      <p style={styles.storyBody}>{text}</p>
    </div>
    <div style={styles.storyImgWrap}>
      <img src={imgSrc} alt={imgAlt} style={styles.storyImg} />
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RiyaArtPalacePage() {
  return (
    <>
      < Navbar />
     

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
      fontSize: "clamp(30px, 3.2vw, 52px)",
      fontWeight: "700",
      color: "#111",
      lineHeight: "1.15",
      letterSpacing: "-0.5px",
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    Riya Art Palace – Where Tradition Becomes Timeless Art
  </h2>
</div>

        {/* ── HERO ──────────────────────────────────────────────────── */}
<section
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
      src="https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&q=80"
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
        color: "#FF6500",
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

       < AboutSection />

        

        {/* ── HERO GALLERY STRIP ────────────────────────────────────── */}
        <section style={styles.galleryStrip}>
          {[
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&q=80",
            "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=300&q=80",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80",
          ].map((src, i) => (
            <img key={i} src={src} alt={`Craft ${i + 1}`} style={styles.galleryImg} />
          ))}
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
            text="Riya Art Palace was founded in 1995 by a passionate artisan family deeply rooted in the crafting traditions of Jaipur. Starting with a small workshop, our founder dedicated his life to preserving and promoting Rajasthan's rich artisanal heritage. The foundation was built on the belief that every handmade piece carries a story — a story of skill, patience, and love for the craft."
            imgSrc="https://images.unsplash.com/photo-1477587458883-47145ed31b0d?w=400&q=80"
            imgAlt="Heritage foundation"
          />
          <Divider />

          <StoryItem
            title="Empowering Artisans & Expanding the Legacy"
            text="Through the 2000s, we expanded our network of skilled artisans, actively empowering women craftspeople from rural Rajasthan. By providing training, fair wages, and a global platform, Riya Art Palace became more than a store — it became a movement. Today we work with over 5,000 artisans, bringing livelihoods and dignity to hundreds of families across the region."
            imgSrc="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80"
            imgAlt="Artisans at work"
            reverse
          />
          <Divider />

          <StoryItem
            title="Carrying Forward the Family Tradition"
            text="The second generation of the founding family took the reins in 2010, blending traditional craftsmanship with modern design sensibilities. New collections were introduced while the old masters continued to mentor younger artisans. This beautiful transfer of knowledge ensures that age-old techniques are never lost to time."
            imgSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
            imgAlt="Family tradition"
          />
          <Divider />

          <StoryItem
            title="Our Handcrafted Product Collection"
            text="Over the years our catalog has grown to include Blue Pottery, Lac Bangles, Wooden Handicrafts, Block Printed Textiles, Marble Inlay Work, Miniature Paintings, Meenakari Jewelry, and much more. Every product is hand-selected for authenticity, quality, and the preservation of its traditional technique."
            imgSrc="https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?w=400&q=80"
            imgAlt="Handcrafted products"
            reverse
          />
          <Divider />

          <StoryItem
            title="Best-Selling Handcrafted Creations"
            text="From our iconic hand-painted ceramic blue pottery to intricately carved wooden elephants, certain pieces have become signatures of Riya Art Palace. These best-sellers travel to homes and galleries around the globe, representing the very finest of Jaipur's artistic heritage."
            imgSrc="https://images.unsplash.com/photo-1601000938268-4cc40aee0a3e?w=400&q=80"
            imgAlt="Best sellers"
          />
          <Divider />

          <StoryItem
            title="Growing Recognition Across Establishments"
            text="Our dedication to quality has earned recognition from international trade bodies, cultural institutions, and export councils. We have participated in global craft fairs across Europe, North America, and the Middle East, proudly representing Rajasthani artistry on the world stage."
            imgSrc="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=400&q=80"
            imgAlt="Recognition"
            reverse
          />
          <Divider />

          <StoryItem
            title="Our Vision & Commitment"
            text="Our vision is a world where handmade art is celebrated, artisans are respected, and heritage crafts thrive. We remain committed to sustainable practices, fair trade, and the preservation of India's incredible craft legacy. Every purchase at Riya Art Palace is a vote for tradition, dignity, and art."
            imgSrc="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"
            imgAlt="Vision commitment"
          />
        </section>

        {/* ── PHOTO COLLAGE STRIP ───────────────────────────────────── */}
        <section style={styles.collageStrip}>
          {[
            "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=300&q=80",
            "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80",
            "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=300&q=80",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&q=80",
          ].map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i}`} style={styles.collageImg} />
          ))}
        </section>

       < Global />

        

        {/* ── WOMEN ARTISANS ────────────────────────────────────────── */}
        <section style={styles.womenSection}>
          <div style={styles.womenText}>
            <div style={styles.womenNumber}>5,000+</div>
            <h2 style={styles.womenTitle}>Women Artisans Empowered by Craft</h2>
            <p style={styles.womenBody}>
              At the heart of Riya Art Palace is our commitment to empowering women. We partner with Self
              Help Groups, NGOs, and government programs like NRLM to train and employ women artisans from
              rural Rajasthan. From Lac Bangle makers in Jaipur to Block Print dyers in Sanganer, our
              artisan network spans the entire state, providing sustainable incomes and preserving dying crafts.
              Each product you buy directly funds these women's livelihoods and futures.
            </p>
          </div>
          <div style={styles.womenImgWrap}>
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80"
              alt="Women artisans"
              style={styles.womenImg}
            />
          </div>
        </section>
        < ValuesSection />
        < FollowUs />

        < Footer />

      </div>
     
      </>
  );} 

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
        backgroundColor:"#F7F5F3",
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
        heroOverlay: {display: "none" },
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
        height: "220px",
  },
        galleryImg: {
          flex: "1 1 25%",
        width: "25%",
        height: "220px",
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
          fontFamily: fonts.display,
        fontSize: "clamp(22px, 3vw, 32px)",
        fontWeight: "700",
        color: colors.dark,
        marginBottom: "8px",
  },
        divider: {
          border: "none",
        borderTop: `1px solid ${colors.border}`,
        margin: "32px 0",
  },

        // STORY ITEM
     storyItem: {
  gap: "70px",
  alignItems: "center",
},
        storyText: {
          flex: "1 1 320px",
  },
      storyTitle: {
  fontFamily: fonts.display,
  fontSize: "clamp(30px,3vw,48px)",
  fontWeight: "700",
  color: "#FF6500",
  lineHeight: "1.2",
  marginBottom: "24px",
},
storyBody: {
  fontSize: "16px",
  lineHeight: "1.9",
  color: "#444",
},
      
      storyImgWrap: {
  flex: "0 0 520px",
},

storyImg: {
  width: "520px",
  height: "360px",
  objectFit: "cover",
  borderRadius: "24px",
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
        height: "200px",
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

        // WOMEN ARTISANS
        womenSection: {
          display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "40px",
        padding: "60px 40px",
        maxWidth: "1100px",
        margin: "0 auto",
  },
        womenText: {
          flex: "1 1 360px",
  },
        womenNumber: {
          fontFamily: fonts.display,
        fontSize: "clamp(48px, 8vw, 80px)",
        fontWeight: "700",
        color: colors.primary,
        lineHeight: "1",
        marginBottom: "8px",
  },
        womenTitle: {
          fontFamily: fonts.display,
        fontSize: "clamp(22px, 3vw, 30px)",
        fontWeight: "700",
        color: colors.dark,
        marginBottom: "20px",
  },
        womenBody: {
          fontFamily: fonts.body,
        fontSize: "13px",
        color: colors.midGray,
        lineHeight: "1.85",
  },
        womenImgWrap: {
          flex: "1 1 320px",
  },
        womenImg: {
          width: "100%",
        height: "380px",
        objectFit: "cover",
        borderRadius: "120px 120px 8px 8px",
        display: "block",
  },

        // FOOTER
        footer: {
          backgroundColor: colors.dark,
        color: colors.white,
        padding: "60px 40px 0",
  },
        footerInner: {
          display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
        paddingBottom: "48px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
        footerBrand: {
          fontFamily: fonts.display,
        fontSize: "22px",
        fontWeight: "700",
        color: colors.gold,
        marginBottom: "8px",
  },
        footerTagline: {
          fontFamily: fonts.body,
        fontSize: "13px",
        color: "rgba(255,255,255,0.6)",
        marginBottom: "20px",
  },
        footerAddress: {
          fontFamily: fonts.body,
        fontSize: "12px",
        color: "rgba(255,255,255,0.55)",
        marginBottom: "6px",
  },
        footerHeading: {
          fontFamily: fonts.display,
        fontSize: "15px",
        fontWeight: "600",
        color: colors.gold,
        marginBottom: "16px",
  },
        footerLink: {
          display: "block",
        fontFamily: fonts.body,
        fontSize: "12px",
        color: "rgba(255,255,255,0.6)",
        textDecoration: "none",
        marginBottom: "8px",
  },
        footerBottom: {
          fontFamily: fonts.body,
        fontSize: "12px",
        color: "rgba(255,255,255,0.4)",
        textAlign: "center",
        padding: "20px 0",
        maxWidth: "1100px",
        margin: "0 auto",
  },
};

/*
──────────────────────────────────────────────────────────────────
  RESPONSIVE CSS — Add this to your global stylesheet (globals.css)
  to handle mobile/tablet breakpoints:

  @media (max-width: 768px) {
    // Nav
    nav { padding: 12px 20px; }
    // Hero flex column
    section[class*="hero"] { flex-direction: column; padding: 40px 20px; }
    // Gallery strip scrollable
    .galleryStrip { flex-wrap: nowrap; overflow-x: auto; }
    .galleryStrip img { min-width: 60vw; flex: 0 0 60vw; }
    // Story items column
    .storyItem { flex-direction: column !important; }
    .storyImgWrap { flex: none; width: 100% !important; }
    .storyImg { width: 100% !important; height: 200px; }
    // Stats row wrap
    .statsRow > div { padding: 12px 20px; }
    .statDivider { display: none; }
    // Section padding
    section { padding: 40px 20px !important; }
  }

  OR — simply use Tailwind responsive classes (md:flex-row, etc.)
  and replace the inline styles with className props.
──────────────────────────────────────────────────────────────────
*/