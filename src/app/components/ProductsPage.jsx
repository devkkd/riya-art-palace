"use client";
import Image from "next/image";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "./Navbar";
import FollowUs from "./FollowUs";
import Footer from "./Footer";
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  /* ── Reset / Base ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page Shell ── */
  .pp-page {
    background: #F7F5F3;
    min-height: 100vh;
    font-family: "Poppins", sans-serif;
  }
  .pp-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px;
  }

  /* ── Page Title ── */
  .pp-title {
    text-align: center;
    font-size: 36px;
    font-weight: 600;
    color: #1D1D1D;
    margin-top: 12px;
    margin-bottom: 28px;
  }

  /* ── Category Pills ── */
  .pp-cat-row {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #D7CEC5;
    scrollbar-width: none;
  }
  .pp-cat-row::-webkit-scrollbar { display: none; }
  .pp-cat-pill {
    min-width: fit-content;
    height: 52px;
    padding: 0 22px;
    border: none;
    border-radius: 999px;
    background: #D7CEC5;
    color: #2B2B2B;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: background .2s, color .2s;
    white-space: nowrap;
  }
  .pp-cat-pill.active {
    background: #F85700;
    color: #fff;
  }
  .pp-cat-pill:hover { opacity: .88; }

  /* ── Layout ── */
  .pp-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 36px;
    align-items: start;
  }

  /* ── Sidebar ── */
  .pp-sidebar { width: 100%; }
  .pp-filter-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 18px;
    border-bottom: 1px solid #CFC6BE;
    margin-bottom: 0;
  }
  .pp-filter-top h3 {
    font-size: 22px;
    font-weight: 600;
    color: #111;
  }
  .pp-clear-btn {
    background: none;
    border: none;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
  }
  .pp-filter-section {
    padding: 24px 0;
    border-bottom: 1px solid #CFC6BE;
  }
  .pp-filter-section h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 18px;
    color: #111;
  }
  .pp-radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    cursor: pointer;
  }
  .pp-radio-row span { font-size: 14px; color: #333; }
  .pp-radio-row input[type="radio"] {
    width: 22px;
    height: 22px;
    accent-color: #F85700;
    cursor: pointer;
  }
  .pp-apply-btn {
    margin-top: 26px;
    width: 110px;
    height: 44px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    transition: background .2s;
  }
  .pp-apply-btn:hover { background: #e85000; }

  /* ── Products Header ── */
  .pp-prod-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .pp-prod-count { font-size: 14px; color: #666; }
  .pp-sort-select {
    border: 1px solid #ddd;
    border-radius: 999px;
    padding: 10px 18px;
    background: white;
    font-size: 13px;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    outline: none;
  }

  /* ── Products Grid ── */
  .pp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  /* ══════════════════════════════════════
     PRODUCT CARD — exact screenshot match
  ══════════════════════════════════════ */
  .pc-card {
    width: 100%;
    
    background: #F7F5F3;
    display: flex;
    flex-direction: column;
    transition: transform .25s ease, box-shadow .25s ease;
    overflow: hidden;
  }
  .pc-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 36px rgba(0,0,0,.09);
  }

  /* Image */
.pc-img-wrap {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.pc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

  /* Body */
  .pc-body {
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  /* Title */
 .pc-title {
  font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.02em;
  color: #0E0E0E;
  margin-bottom: 14px;
}

  /* Price */
 .pc-price {
  font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.02em;
  color: #0E0E0E;
  margin-bottom: 16px;
}

  /* Subtitle */
  .pc-subtitle {
    font-size: 13px;
    color: #4B4B4B;
    margin-bottom: 0;
  }

  /* Quantity row */
  .pc-qty-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 14px;
  }
  .pc-qty-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.6px;
    color: #111;
    text-transform: uppercase;
  }
  .pc-qty-ctrl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 118px;
    height: 46px;
    border: 1px solid #C3BCB4;

    border-radius: 999px;
    padding: 0 14px;
    background: transparent;
  }
  .pc-qty-btn {
    border: none;
    background: transparent;
    font-size: 26px;
    font-weight: 300;
    color: #111;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    user-select: none;
  }
  .pc-qty-num {
    font-size: 16px;
    font-weight: 500;
    min-width: 38px;
    text-align: center;
    color: #1D1D1D;
  }

  /* Add to Cart */
  .pc-cart-btn {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 14px;
    transition: background .2s, transform .15s;
  }
  .pc-cart-btn:hover {
    background: #e84f00;
    transform: translateY(-1px);
  }

  /* Enquiry links */
 .pc-enquiry {
  display: flex;
  align-items: center;
  gap: 24px;   /* 20px-30px ke beech rakh sakte ho */
  margin-top: 2px;
}

.pc-enquiry a {
  font-size: 13px;
  font-weight: 600;
  color: #111;
  text-decoration: none;
  white-space: nowrap;
}
  .pc-enquiry a:hover { color: #F85700; }

  /* ── Pagination ── */
  .pp-pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 48px;
  }
  .pp-page-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    font-size: 14px;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    transition: background .2s, color .2s;
  }
  .pp-page-btn.active {
    background: #111;
    color: white;
    border-color: #111;
  }
  .pp-page-btn:hover:not(.active) { background: #f0ede9; }

  /* ── See More ── */
  .pp-see-more {
    display: flex;
    justify-content: center;
    margin-top: 44px;
    margin-bottom: 20px;
  }
  .pp-see-more-btn {
    height: 54px;
    padding: 0 44px;
    border: none;
    border-radius: 999px;
    background: #111;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    transition: background .2s;
  }
  .pp-see-more-btn:hover { background: #333; }

  /* ── WhatsApp FAB ── */
  .pp-wa-btn {
    position: fixed;
    right: 28px;
    bottom: 28px;
    width: 140px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 999px;
    background: #25D366;
    color: white;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
    box-shadow: 0 8px 28px rgba(0,0,0,.2);
    z-index: 9999;
    transition: transform .2s, background .2s;
  }
  .pp-wa-btn:hover { background: #1ebe59; transform: scale(1.04); }
  .pp-wa-btn svg { font-size: 22px; }

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .pp-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 1000px) {
    .pp-layout { grid-template-columns: 1fr; }
    .pp-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .pp-container { padding: 0 16px; }
    .pp-title { font-size: 26px; }
    .pp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .pc-img-wrap { height: 170px; }
    .pc-body { padding: 10px 10px 10px; }
    .pc-title { font-size: 14px; }
    .pc-price { font-size: 13px; }
    .pc-subtitle { font-size: 11px; }
    .pc-qty-ctrl { width: 100px; height: 38px; padding: 0 10px; }
    .pc-qty-num { font-size: 14px; }
    .pc-qty-btn { font-size: 22px; }
    .pc-cart-btn { height: 42px; font-size: 12px; }
    .pc-enquiry a { font-size: 11px; }
    .pp-wa-btn { width: 120px; height: 48px; right: 14px; bottom: 14px; font-size: 13px; }
  }
  @media (max-width: 480px) {
    .pc-img-wrap { height: 140px; }
    .pc-qty-ctrl { width: 88px; }
  }
`;

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProductCard({ product }) {
  const [qty, setQty] = useState(500);

  return (
    <div className="pc-card">
      {/* Image */}
      <div className="pc-img-wrap">
       <Image
  src={product.image}
  alt={product.name}
  width={300}
  height={400}
  className="pc-img"
/>
      </div>

      {/* Body */}
      <div className="pc-body">
        <h3 className="pc-title">{product.name}</h3>
        <div className="pc-price">{product.price}</div>
        <div className="pc-subtitle">{product.subtitle}</div>

        {/* Quantity */}
        <div className="pc-qty-row">
          <span className="pc-qty-label">QUANTITY</span>
          <div className="pc-qty-ctrl">
            <button
              className="pc-qty-btn"
              onClick={() => setQty((p) => (p > 1 ? p - 1 : 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="pc-qty-num">{qty}</span>
            <button
              className="pc-qty-btn"
              onClick={() => setQty((p) => p + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button className="pc-cart-btn">
          + Add to Cart
        </button>

        {/* Enquiry Links */}
        <div className="pc-enquiry">
          <a href="#">India Enquiry →</a>
          <a href="#">Export Enquiry →</a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DATA
   ============================================================ */
const categories = [
  "Wall Décor",
  "Table Décor",
  "Lac Collection",
  "Event Décor",
  "Festive Collection",
  "Rajasthani Traditional",
  "Handmade Accessories",
  "Spiritual Items",
  "Handpainted Articles",
  "Diary Collection",
  "Christmas Items",
  "Ottomans & Puffs",
];

const subCategories = [
  "All Products",
  "Rajasthani Wall Hanging",
  "Wall Hangings",
  "Torans",
  "Fancy Hangings",
  "Marigold Toran",
  "Marigold Flower Hangings",
  "Wind Chimes",
  "Dream Catcher",
  "Prosperity Hangings",
];

const moqOptions = ["1 - 100 pcs", "100 - 500 pcs", "500 - 1000 pcs", "1000+ pcs"];
const sortOptions = ["Recommended", "New Arrivals", "Price High to Low", "Price Low to High"];

const products = [
  { id: 1, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p1 },
  { id: 2, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p2 },
  { id: 3, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p3 },
  { id: 4, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p4 },
  { id: 5, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p1 },
  { id: 6, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p2 },
  { id: 7, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p3 },
  { id: 8, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p4 },
  { id: 9, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p1 },
  { id: 10, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p2 },
  { id: 11, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p3 },
  { id: 12, name: "Pom Pom Wall Hangings", price: "₹100/Piece", subtitle: "Wall hanging | Gota POM POM", image: p4 },
  
  
];

/* ============================================================
   PAGE
   ============================================================ */
export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("Wall Décor");
  const [selectedSubCat, setSelectedSubCat] = useState("All Products");
  const [selectedMOQ, setSelectedMOQ] = useState("100 - 500 pcs");
  const [selectedSort, setSelectedSort] = useState("Recommended");

  return (
    <>
      <Navbar />

      <style jsx>{styles}</style>

      <div className="pp-page">
        <div className="pp-container">

          {/* Title */}
          <div className="pp-title">Product Collections</div>

          {/* Category Pills */}
          <div className="pp-cat-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pp-cat-pill${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className="pp-layout">

            {/* ── Sidebar ── */}
            <aside className="pp-sidebar">

              <div className="pp-filter-top">
                <h3>Filters</h3>
                <button
                  className="pp-clear-btn"
                  onClick={() => {
                    setSelectedSubCat("All Products");
                    setSelectedMOQ("");
                    setSelectedSort("Recommended");
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Sub Category */}
              <div className="pp-filter-section">
                <h4>Sub Category</h4>
                {subCategories.map((item) => (
                  <label className="pp-radio-row" key={item}>
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubCat === item}
                      onChange={() => setSelectedSubCat(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* MOQ */}
              <div className="pp-filter-section">
                <h4>MOQ (Minimum Order Quantity)</h4>
                {moqOptions.map((item) => (
                  <label className="pp-radio-row" key={item}>
                    <input
                      type="radio"
                      name="moq"
                      checked={selectedMOQ === item}
                      onChange={() => setSelectedMOQ(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div className="pp-filter-section">
                <h4>Sort by</h4>
                {sortOptions.map((item) => (
                  <label className="pp-radio-row" key={item}>
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === item}
                      onChange={() => setSelectedSort(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <button className="pp-apply-btn">Apply Filter</button>
            </aside>

            {/* ── Products Area ── */}
            <div>
              <div className="pp-prod-header">
                <div className="pp-prod-count">Showing {products.length} Products</div>
                <select className="pp-sort-select">
                  <option>Sort By Latest</option>
                  <option>Price Low To High</option>
                  <option>Price High To Low</option>
                </select>
              </div>

              {/* Grid */}
              <div className="pp-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pp-pagination">
                <button className="pp-page-btn active">1</button>
                <button className="pp-page-btn">2</button>
                <button className="pp-page-btn">3</button>
                <button className="pp-page-btn">→</button>
              </div>

              {/* See More */}
              <div className="pp-see-more">
                <button className="pp-see-more-btn">See More Products</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/918385007350"
        target="_blank"
        rel="noopener noreferrer"
        className="pp-wa-btn"
      >
        <FaWhatsapp />
        <span>For Bulk</span>
      </a>

      <FollowUs />
      <Footer />
    </>
  );
}