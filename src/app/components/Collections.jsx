"use client";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/app/components/CatalogContext";
import wallDecor from "../assets/wall-decor.jpg";
import tableDecor from "../assets/table-decor.jpg";
import lacCollection from "../assets/lac-collection.jpg";
import eventDecor from "../assets/event-decor.jpg";
import festiveCollection from "../assets/festive-collection.jpg";
import traditional from "../assets/traditional.jpg";
import accessories from "../assets/accessories.jpg";
import spiritual from "../assets/spiritual.jpg";
import handpainted from "../assets/handpainted.jpg";
import diary from "../assets/diary.jpg";
import christmas from "../assets/christmas.jpg";
import ottoman from "../assets/ottoman.jpg";

const LOCAL_IMAGE_MAP = {
  "Wall Décor":            wallDecor.src        || wallDecor,
  "Table Décor":           tableDecor.src       || tableDecor,
  "Lac Collection":        lacCollection.src    || lacCollection,
  "Event Décor":           eventDecor.src       || eventDecor,
  "Festive Collection":    festiveCollection.src|| festiveCollection,
  "Rajasthani Traditional":traditional.src      || traditional,
  "Handmade Accessories":  accessories.src      || accessories,
  "Spiritual Items":       spiritual.src        || spiritual,
  "Handpainted Articles":  handpainted.src      || handpainted,
  "Diary Collection":      diary.src            || diary,
  "Christmas Items":       christmas.src        || christmas,
  "Ottomans & Puffs":      ottoman.src          || ottoman,
};

// Loading skeleton card
function SkeletonCard({ tall }) {
  return (
    <div style={{
      borderRadius: 16,
      background: "linear-gradient(110deg, #ede8e3 25%, #e4ddd6 50%, #ede8e3 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      height: tall ? "100%" : "100%",
      minHeight: tall ? 420 : 200,
    }} />
  );
}

export default function Collections() {
  const router  = useRouter();
  const { categories, loading } = useCatalog();

  // Categories already sorted by `order` from the server
  // Filter to only show categories marked for homepage
  const cats = categories.filter(c => c.showOnHome !== false);

  // Layout: first card is tall (spans 2 rows), rest fill in a masonry-like grid
  // We use a CSS grid with auto rows

  return (
    <section style={{ backgroundColor: "#F7F5F3", paddingTop: 72, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Keyframes ── */
        @keyframes shimmer { to { background-position: -200% 0; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

        /* ── Outer ── */
        .coll-outer {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        /* ── Header ── */
        .coll-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 48px;
        }
        .coll-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .coll-eyebrow-line { width: 48px; height: 2px; background: #F85700; border-radius: 2px; }
        .coll-eyebrow-text {
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #F85700;
        }
        .coll-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #0E0E0E;
          margin: 0;
        }
        .coll-subtitle {
          font-family: "Manrope", sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: #888;
          margin-top: 10px;
          line-height: 1.6;
          max-width: 420px;
        }
        .coll-order-btn {
          flex-shrink: 0;
          height: 50px;
          padding: 0 28px;
          border-radius: 999px;
          border: 2px solid #0E0E0E;
          background: transparent;
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0E0E0E;
          cursor: pointer;
          white-space: nowrap;
          transition: background .2s, color .2s;
        }
        .coll-order-btn:hover { background: #0E0E0E; color: #fff; }

        /* ── Grid ── */
        .coll-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 240px;
          gap: 12px;
        }

        /* First card: tall featured */
        .coll-card-featured {
          grid-row: span 2;
          grid-column: span 1;
        }

        /* ── Card ── */
        .coll-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #E8E2DC;
        }
        .coll-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .6s cubic-bezier(.25,.46,.45,.94);
        }
        .coll-card:hover img { transform: scale(1.07); }

        /* Gradient overlay */
        .coll-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(10,10,10,.75) 0%,
            rgba(10,10,10,.25) 45%,
            transparent 70%
          );
          transition: opacity .3s;
        }
        .coll-card:hover .coll-card-overlay {
          background: linear-gradient(to top,
            rgba(10,10,10,.85) 0%,
            rgba(10,10,10,.35) 50%,
            transparent 75%
          );
        }

        /* Card content */
        .coll-card-body {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 20px 18px;
          transform: translateY(4px);
          transition: transform .3s ease;
        }
        .coll-card:hover .coll-card-body { transform: translateY(0); }

        .coll-card-tag {
          display: inline-block;
          font-family: "Manrope", sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
          margin-bottom: 5px;
        }
        .coll-card-name {
          font-family: "Manrope", sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          line-height: 1.3;
          margin: 0 0 4px;
        }
        .coll-card-featured .coll-card-name { font-size: 22px; }
        .coll-card-desc {
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255,255,255,.75);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height .35s ease, opacity .3s ease, margin .3s ease;
        }
        .coll-card:hover .coll-card-desc {
          max-height: 60px;
          opacity: 1;
          margin-top: 4px;
        }
        .coll-card-arrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          font-family: "Manrope", sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #F85700;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity .25s, transform .25s;
        }
        .coll-card:hover .coll-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Count badge */
        .coll-card-count {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 999px;
          padding: 3px 10px;
          font-family: "Manrope", sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          opacity: 0;
          transition: opacity .25s;
        }
        .coll-card:hover .coll-card-count { opacity: 1; }

        /* Bottom CTA strip */
        .coll-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .coll-view-all {
          height: 52px;
          padding: 0 36px;
          border-radius: 999px;
          border: none;
          background: #0E0E0E;
          color: #fff;
          font-family: "Manrope", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background .2s, transform .15s;
        }
        .coll-view-all:hover { background: #F85700; transform: translateY(-2px); }
        .coll-stat {
          font-family: "Manrope", sans-serif;
          font-size: 13px;
          color: #888;
        }
        .coll-stat strong { color: #0E0E0E; }

        /* Responsive */
        @media (max-width: 1100px) {
          .coll-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .coll-header { flex-direction: column; align-items: flex-start; }
          .coll-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 200px;
            gap: 8px;
          }
          .coll-card-featured { grid-row: span 2; }
          .coll-card-name { font-size: 13px; }
          .coll-card-featured .coll-card-name { font-size: 17px; }
          .coll-card-body { padding: 14px 14px 12px; }
        }
        @media (max-width: 480px) {
          .coll-grid { grid-auto-rows: 160px; gap: 6px; }
          .coll-card { border-radius: 12px; }
        }
      `}</style>

      <div className="coll-outer">

        {/* ── Header ── */}
        <div className="coll-header">
          <div>
            <div className="coll-eyebrow">
              <div className="coll-eyebrow-line" />
              <span className="coll-eyebrow-text">Our Craft</span>
            </div>
            <h2 className="coll-title">Our Collections</h2>
            <p className="coll-subtitle">
              Handcrafted with love in Jaipur — explore every category of authentic Rajasthani art.
            </p>
          </div>
          <button
            className="coll-order-btn"
            onClick={() => router.push("/enquiry?type=india")}
          >
            Custom Orders →
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="coll-grid">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`coll-card ${i === 0 ? "coll-card-featured" : ""}`}>
                  <SkeletonCard tall={i === 0} />
                </div>
              ))
            : cats.map((cat, i) => {
                const imgSrc = cat.image
                  || (typeof LOCAL_IMAGE_MAP[cat.name] === "string"
                      ? LOCAL_IMAGE_MAP[cat.name]
                      : LOCAL_IMAGE_MAP[cat.name]?.src)
                  || "";

                return (
                  <div
                    key={cat.id || cat._id}
                    className={`coll-card ${i === 0 ? "coll-card-featured" : ""}`}
                    style={{ animation: `fadeUp .4s ease ${i * 0.05}s both` }}
                    onClick={() => router.push(`/products?category=${cat.slug}`)}
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={cat.name}
                        onError={e => { e.target.src = `https://placehold.co/600x400?text=${encodeURIComponent(cat.name)}`; }}
                      />
                    )}

                    <div className="coll-card-overlay" />

                    {/* Subcategory count badge */}
                    {cat.subcategoriesCount > 0 && (
                      <div className="coll-card-count">
                        {cat.subcategoriesCount} subcategory
                      </div>
                    )}

                    <div className="coll-card-body">
                      {/* <div className="coll-card-tag">Collection</div> */}
                      <h3 className="coll-card-name">{cat.name}</h3>
                      {cat.description && (
                        <p className="coll-card-desc">{cat.description}</p>
                      )}
                      {/* <div className="coll-card-arrow">
                        Explore →
                      </div> */}
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* ── Footer CTA ── */}
        {!loading && cats.length > 0 && (
          <div className="coll-footer">
            <button className="coll-view-all" onClick={() => router.push("/products")}>
              View All Collection
            </button>
          
          </div>
        )}
      </div>
    </section>
  );
}
