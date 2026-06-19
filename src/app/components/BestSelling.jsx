"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/app/components/CatalogContext";

import wallDecor from "../assets/wall-decor.jpg";
import tableDecor from "../assets/table-decor.jpg";
import lacCollection from "../assets/lac-collection.jpg";
import eventDecor from "../assets/event-decor.jpg";
import handpainted from "../assets/handpainted.jpg";

const staticMockProducts = [
  { id: "mock-1", isMock: true, image: wallDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings" },
  { id: "mock-2", isMock: true, image: tableDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings" },
  { id: "mock-3", isMock: true, image: lacCollection, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings" },
  { id: "mock-4", isMock: true, image: eventDecor, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings" },
  { id: "mock-5", isMock: true, image: handpainted, name: "Pom Pom Wall Hangings", price: "₹ 100/Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings" },
];

export default function BestSelling() {
  const { products: allProducts, loading } = useCatalog();
  const router = useRouter();
  const [quantities, setQuantities] = useState({});

  const handleDecreaseQty = (id) => {
    setQuantities((prev) => {
      const current = prev[id] !== undefined ? prev[id] : 500;
      return { ...prev, [id]: current > 1 ? current - 1 : 1 };
    });
  };

  const handleIncreaseQty = (id) => {
    setQuantities((prev) => {
      const current = prev[id] !== undefined ? prev[id] : 500;
      return { ...prev, [id]: current + 1 };
    });
  };

  const bestSellingProducts = allProducts.filter((p) => p.bestSelling === true).slice(0, 5);
  const displayProducts = !loading && bestSellingProducts.length > 0 ? bestSellingProducts : staticMockProducts;

  return (
    <section
      style={{
        backgroundColor: "#F7F5F3",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&family=Manrope:wght@400;500;700&display=swap');

        .bs-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .bs-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .bs-img {
          width: 100%;
          height: 290px;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 900px) {
          .bs-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .bs-outer {
            padding-left: 16px;
            padding-right: 16px;
          }
          .bs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .bs-img {
            height: 180px;
          }
          .bs-header {
            margin-bottom: 28px !important;
          }
        }
      `}</style>

      <div className="bs-outer">
        <div className="bs-header" style={{ marginBottom: "64px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ width: "56px", height: "1px", backgroundColor: "#FF6500" }} />
            <span
              style={{
                color: "#F85700",
                fontSize: "18px",
                fontWeight: "700",
                lineHeight: "160%",
                letterSpacing: "-0.02em",
                fontFamily: "'Manrope', sans-serif",
                textTransform: "uppercase",
              }}
            >
              MOST LOVED
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "40px",
              fontWeight: "800",
              lineHeight: "160%",
              letterSpacing: "-0.02em",
              color: "#0E0E0E",
              margin: 0,
            }}
          >
            Our Best-Selling Pieces
          </h2>
        </div>

        <div className="bs-grid">
          {displayProducts.map((product, index) => {
            const productId = product.id || product._id || `static-${index}`;
            const imgUrl = product.isMock
              ? (product.image?.src || product.image)
              : (product.images?.[0] || "https://placehold.co/400x300?text=No+Image");
            
            const formattedPrice = typeof product.price === "number"
              ? `₹ ${product.price}/${product.priceUnit || "Piece"}`
              : (product.price || "₹ 100/Piece");
            
            const desc = product.description || product.desc || "";

            return (
              <div
                key={productId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                onClick={() => {
                  if (product.isMock) {
                    router.push("/products");
                  } else {
                    router.push(`/products/${product.slug}`);
                  }
                }}
              >
                <div style={{ marginBottom: "16px", overflow: "hidden" }}>
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="bs-img"
                  />
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    lineHeight: "160%",
                    letterSpacing: "-0.02em",
                    color: "#0E0E0E",
                    marginBottom: "8px",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    lineHeight: "160%",
                    color: "#0E0E0E",
                    marginBottom: "8px",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {formattedPrice}
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "400",
                    lineHeight: "160%",
                    color: "#5F5F5F",
                    marginBottom: "18px",
                    fontFamily: "'Manrope', sans-serif",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    height: "50px",
                  }}
                >
                  {desc}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      lineHeight: "160%",
                      color: "#0E0E0E",
                      margin: 0,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    QUANTITY
                  </p>

                  <div
                    style={{
                      height: "34px",
                      minWidth: "84px",
                      border: "1px solid #CFC7BF",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 8px",
                      backgroundColor: "transparent",
                      flexShrink: 0,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      style={{ fontSize: "16px", fontWeight: "300", color: "#111", cursor: "pointer", lineHeight: "1", userSelect: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecreaseQty(productId);
                      }}
                    >
                      −
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: "500", color: "#0E0E0E", fontFamily: "'Manrope', sans-serif" }}>
                      {quantities[productId] !== undefined ? quantities[productId] : 500}
                    </span>
                    <span
                      style={{ fontSize: "16px", fontWeight: "300", color: "#111", cursor: "pointer", lineHeight: "1", userSelect: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncreaseQty(productId);
                      }}
                    >
                      +
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    height: "42px",
                    backgroundColor: "#F85700",
                    color: "#fff",
                    borderRadius: "999px",
                    fontSize: "clamp(11px, 1.1vw, 14px)",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "12px",
                    fontFamily: "sans-serif",
                    letterSpacing: "0.2px",
                    transition: "background-color 0.2s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f05f00")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6500")}
                >
                  + Add to Cart
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button
                    style={{
                      fontSize: "clamp(12px, 1vw, 14px)",
                      fontWeight: "700",
                      lineHeight: "160%",
                      color: "#0E0E0E",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/enquiry?type=india");
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6500")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
                  >
                    India Enquiry →
                  </button>

                  <button
                    style={{
                      fontSize: "clamp(12px, 1vw, 14px)",
                      fontWeight: "700",
                      lineHeight: "160%",
                      color: "#0E0E0E",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/enquiry?type=export");
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6500")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#111")}
                  >
                    Export Enquiry →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}