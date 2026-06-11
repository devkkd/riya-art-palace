"use client";
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
import Image from "next/image";
const collections = [
  {
    title: "Wall Décor",
    desc: "Hangings, Torans, Dream Catchers, Wind Chimes",
    image: wallDecor,
  },
  {
    title: "Table Décor",
    desc: "Metal Meenakari, Animal Figures, Stone Work",
    image: tableDecor,
  },
  {
    title: "Lac Collection",
    desc: "Diaries, Jewellery Boxes, Pens, Incense Holders",
    image: lacCollection,
  },
  {
    title: "Event Décor",
    desc: "Garden Umbrellas, Embroidery Umbrellas",
    image: eventDecor,
  },
  {
    title: "Festive Collection",
    desc: "Diwali Gifting, Karwa Chauth, T-Light Holders",
    image: festiveCollection,
  },
  {
    title: "Rajasthani Traditional",
    desc: "Puppets, Animal Stuffs, Heritage Crafts",
    image: traditional,
  },
  {
    title: "Handmade Accessories",
    desc: "Keychains, Fridge Magnets, Stone Purses, Mirrors",
    image: accessories,
  },
  {
    title: "Spiritual Items",
    desc: "Pooja Articles, Marble Ganesh Statues",
    image: spiritual,
  },
  {
    title: "Handpainted Articles",
    desc: "Hand-painted Kettles, Decorative Items",
    image: handpainted,
  },
  {
    title: "Diary Collection",
    desc: "Leather Diaries, Lac Diaries, Pen Sets",
    image: diary,
  },
  {
    title: "Christmas Items",
    desc: "Christmas Décor and Ornaments",
    image: christmas,
  },
  {
    title: "Ottomans & Puffs",
    desc: "Handcrafted Seating Accents",
    image: ottoman,
  },
];

export default function Collections() {
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

        .collections-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 48px;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }

        .collection-card {
          position: relative;
          overflow: hidden;
          height: 390px;
          cursor: pointer;
        }

        .collection-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .collection-card:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 1024px) {
          .collections-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .collections-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .collection-card {
            height: 280px;
          }

          .collections-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 32px;
          }
        }

        @media (max-width: 480px) {
          .collections-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3px;
          }

          .collection-card {
            height: 220px;
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
        {/* Header */}
        <div className="collections-header">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "1px",
                  backgroundColor: "#FF6A00",
                }}
              />
              <span
                style={{
                  color: "#FF6A00",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontFamily: "sans-serif",
                }}
              >
                OUR CRAFT
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 68px)",
                lineHeight: "1",
                fontWeight: "700",
                color: "#111",
                margin: "0",
              }}
            >
              Our Collections
            </h2>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              minWidth: "160px",
              padding: "0 28px",
              borderRadius: "999px",
              backgroundColor: "#111",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer",
              fontFamily: "sans-serif",
              flexShrink: "0",
              marginTop: "8px",
            }}
          >
            Custom Orders &nbsp;→
          </button>
        </div>

        {/* Grid */}
        <div className="collections-grid">
          {collections.map((item, index) => (
            <div key={index} className="collection-card">
              <Image src={item.image} alt={item.title} />

              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background:
                    "linear-gradient(to top, #FF8A00 0%, rgba(255,138,0,0.55) 35%, transparent 65%)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  right: "16px",
                  color: "#fff",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(14px, 1.5vw, 19px)",
                    fontWeight: "600",
                    lineHeight: "1.2",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    margin: "0 0 6px 0",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: "clamp(11px, 1vw, 13px)",
                    lineHeight: "1.55",
                    margin: "0",
                    fontFamily: "sans-serif",
                    fontWeight: "400",
                  }}
                >
                  {item.desc} →
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}