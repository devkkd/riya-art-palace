"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/app/components/CatalogContext";
import { useCart } from "@/app/components/CartContext";

import wallDecor from "../assets/wall-decor.jpg";
import tableDecor from "../assets/table-decor.jpg";
import lacCollection from "../assets/lac-collection.jpg";
import eventDecor from "../assets/event-decor.jpg";
import handpainted from "../assets/handpainted.jpg";

const staticMockProducts = [
  { id: "mock-1", isMock: true, image: wallDecor,      name: "Pom Pom Wall Hangings",   price: 100, priceUnit: "Piece", description: "Wall hanging | Gota POM POM", slug: "pom-pom-wall-hangings", subcategory: { name: "Wall Decor" } },
  { id: "mock-2", isMock: true, image: tableDecor,     name: "Table Decor Showpiece",    price: 250, priceUnit: "Piece", description: "Handcrafted table decor piece", slug: "table-decor-showpiece", subcategory: { name: "Table Decor" } },
  { id: "mock-3", isMock: true, image: lacCollection,  name: "Lac Bangle Set",           price: 180, priceUnit: "Set",   description: "Traditional lac bangles", slug: "lac-bangle-set", subcategory: { name: "Lac Collection" } },
  { id: "mock-4", isMock: true, image: eventDecor,     name: "Event Decor Torana",       price: 350, priceUnit: "Piece", description: "Handmade event decoration", slug: "event-decor-torana", subcategory: { name: "Event Decor" } },
  { id: "mock-5", isMock: true, image: handpainted,    name: "Hand Painted Art Piece",   price: 499, priceUnit: "Piece", description: "Hand painted Rajasthani art", slug: "hand-painted-art", subcategory: { name: "Handpainted" } },
];

function BestSellingCard({ product, qty, onDecrease, onIncrease }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const imgUrl = product.isMock
    ? (product.image?.src || product.image)
    : (product.images?.[0] || "https://placehold.co/400x400?text=No+Image");

  const categoryTag = product.subcategory?.name || product.category?.name || "";

  const handleClick = () => {
    if (product.isMock) router.push("/products");
    else router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.isMock) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="bsc-card" onClick={handleClick}>
      {/* Image */}
      <div className="bsc-img-wrap">
        <img src={imgUrl} alt={product.name} className="bsc-img" />
      </div>

      {/* Body */}
      <div className="bsc-body" onClick={(e) => e.stopPropagation()}>
        {/* Category tag */}
        {categoryTag && (
          <div className="bsc-tag">{categoryTag.toUpperCase()}</div>
        )}

        {/* Name */}
        <h3
          className="bsc-name"
          onClick={handleClick}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="bsc-price-row">
          <span className="bsc-price">₹{typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price}</span>
          <span className="bsc-unit"> / {product.priceUnit || "Piece"}</span>
        </div>

        {/* Material / Type */}
        {(product.productType || product.primaryMaterial) && (
          <div className="bsc-material">{product.productType || product.primaryMaterial}</div>
        )}

        <div className="bsc-divider" />

        {/* Qty */}
        <div className="bsc-qty-row">
          <span className="bsc-qty-label">QTY</span>
          <div className="bsc-qty-ctrl">
            <button className="bsc-qty-btn" onClick={(e) => { e.stopPropagation(); onDecrease(); }}>−</button>
            <span className="bsc-qty-num">{qty}</span>
            <button className="bsc-qty-btn" onClick={(e) => { e.stopPropagation(); onIncrease(); }}>+</button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          className={`bsc-cart-btn${added ? " added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? "✓ ADDED" : "ADD TO CART"}
        </button>

        {/* Enquiry */}
        <div className="bsc-enquiry">
          <button
            className="bsc-enq-btn"
            onClick={(e) => { e.stopPropagation(); router.push("/enquiry?type=india"); }}
          >
            India Enquiry →
          </button>
          <div className="bsc-enq-sep" />
          <button
            className="bsc-enq-btn"
            onClick={(e) => { e.stopPropagation(); router.push("/enquiry?type=export"); }}
          >
            Export Enquiry →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BestSelling() {
  const { products: allProducts, loading } = useCatalog();
  const router = useRouter();
  const [quantities, setQuantities] = useState({});

  const getQty = (id) => quantities[id] !== undefined ? quantities[id] : 500;
  const decrease = (id) => setQuantities(p => ({ ...p, [id]: Math.max(1, getQty(id) - 1) }));
  const increase = (id) => setQuantities(p => ({ ...p, [id]: getQty(id) + 1 }));

  const bestSellingProducts = allProducts.filter((p) => p.bestSelling === true).slice(0, 4);
  const displayProducts = !loading && bestSellingProducts.length > 0 ? bestSellingProducts : staticMockProducts;

  return (
    <section style={{ backgroundColor: "#F7F5F3", paddingTop: "60px", paddingBottom: "60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .bs-outer { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

        /* Grid */
        .bs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* Card */
        .bsc-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #EDE8E2;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: box-shadow .25s, transform .25s;
        }
        .bsc-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,.10);
          transform: translateY(-4px);
        }

        /* Image */
        .bsc-img-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #F5E0C8;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bsc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform .5s ease;
        }
        .bsc-card:hover .bsc-img { transform: scale(1.05); }

        /* Body */
        .bsc-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* Tag */
        .bsc-tag {
          font-family: 'Manrope', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #F85700;
          margin-bottom: 5px;
        }

        /* Name */
        .bsc-name {
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #111;
          line-height: 1.4;
          margin-bottom: 10px;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bsc-name:hover { color: #F85700; }

        /* Price */
        .bsc-price-row { display: flex; align-items: baseline; gap: 3px; margin-bottom: 4px; }
        .bsc-price {
          font-family: 'Manrope', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #111;
        }
        .bsc-unit {
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #999;
        }

        /* Material */
        .bsc-material {
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 12px;
        }

        /* Divider */
        .bsc-divider { border: none; border-top: 1px solid #F0EDE9; margin: 0 0 12px; }

        /* Qty */
        .bsc-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .bsc-qty-label {
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #bbb;
          letter-spacing: 0.06em;
        }
        .bsc-qty-ctrl {
          display: flex;
          align-items: center;
          border: 1.5px solid #D7CEC5;
          border-radius: 999px;
          overflow: hidden;
          height: 36px;
        }
        .bsc-qty-btn {
          width: 34px;
          height: 36px;
          border: none;
          background: #F7F5F3;
          font-size: 18px;
          font-weight: 300;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          transition: background .15s;
        }
        .bsc-qty-btn:hover { background: #EDE8E3; }
        .bsc-qty-num {
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #111;
          min-width: 36px;
          text-align: center;
          border-left: 1.5px solid #D7CEC5;
          border-right: 1.5px solid #D7CEC5;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Cart btn */
        .bsc-cart-btn {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 10px;
          background: #111;
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background .2s;
          text-transform: uppercase;
        }
        .bsc-cart-btn:hover { background: #F85700; }
        .bsc-cart-btn.added { background: #16a34a; }

        /* Enquiry */
        .bsc-enquiry {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid #F0EDE9;
        }
        .bsc-enq-btn {
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color .15s;
        }
        .bsc-enq-btn:hover { color: #F85700; }
        .bsc-enq-sep { width: 1px; height: 12px; background: #D7CEC5; }

        /* Responsive */
        @media (max-width: 1100px) { .bs-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 900px)  { .bs-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px)  {
          .bs-outer { padding: 0 16px; }
          .bs-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .bsc-price { font-size: 16px; }
          .bsc-name { font-size: 13px; }
          .bsc-cart-btn { height: 40px; font-size: 11px; }
        }
      `}</style>

      <div className="bs-outer">
        {/* Header */}
        <div className="bs-header" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
            <div style={{ width: "56px", height: "1px", backgroundColor: "#FF6500" }} />
            <span style={{ color: "#F85700", fontSize: "14px", fontWeight: "700", fontFamily: "'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              MOST LOVED
            </span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", fontWeight: "800", color: "#0E0E0E", margin: 0, lineHeight: 1.2 }}>
            Our Best-Selling Pieces
          </h2>
        </div>

        {/* Grid */}
        <div className="bs-grid">
          {displayProducts.map((product, index) => {
            const id = product.id || product._id || `mock-${index}`;
            return (
              <BestSellingCard
                key={id}
                product={product}
                qty={getQty(id)}
                onDecrease={() => decrease(id)}
                onIncrease={() => increase(id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
