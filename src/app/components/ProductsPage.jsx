"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "./Navbar";
import FollowUs from "./FollowUs";
import Footer from "./Footer";
import { useCatalog } from "@/app/components/CatalogContext";
import { useCart } from "@/app/components/CartContext";

const moqOptions = ["1 - 100 pcs","100 - 500 pcs","500 - 1000 pcs","1000+ pcs"];
const sortOptions = ["Recommended","New Arrivals","Price High to Low","Price Low to High"];


/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

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
  font-family: "Manrope", sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: -0.04em;
  color: #0E0E0E;
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
    font-family: "Manrope", sans-serif;
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
      font-family: "Manrope", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0E0E0E;

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
    font-family: "Manrope", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0E0E0E;

    margin-bottom: 18px;
   
  }
  .pp-radio-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    cursor: pointer;
  }
  .pp-radio-row span {   font-family: "Manrope", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #333;
}
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
      font-family: "Manrope", sans-serif;

    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

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
  .pp-prod-count {   font-family: "Manrope", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #666;
}
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
     PRODUCT CARD
  ══════════════════════════════════════ */
  .pc-card {
    width: 100%;
    background: #F7F5F3;
    display: flex;
    flex-direction: column;
    transition: transform .25s ease, box-shadow .25s ease;
    overflow: hidden;
    cursor: pointer;
  }
  .pc-card:hover {
    transform: translateY(-3px);
    // box-shadow: 0 18px 36px rgba(0,0,0,.09);
  }
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
  .pc-body {
    padding: 16px 16px 14px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .pc-title {
    font-family: "Manrope", sans-serif;
    font-size: 17px;
    font-weight: 700;
    line-height: 160%;
    letter-spacing: -0.02em;
    color: #0E0E0E;
    margin-bottom: 14px;
  }
  .pc-price {
    font-family: "Manrope", sans-serif;
    font-size: 17px;
    font-weight: 700;
    line-height: 160%;
    letter-spacing: -0.02em;
    color: #0E0E0E;
    margin-bottom: 16px;
  }
  .pc-subtitle {
    font-size: 14px;
    font-weight: 400;
  line-height: 160%;
    color: #4B4B4B;
    margin-bottom: 0;
  }
  .pc-qty-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 14px;
  }
  .pc-qty-label {
    font-size: 13px;
    font-family: "Manrope", sans-serif;
    font-weight: 900;
    letter-spacing: 0.6px;
    color: #0E0E0E;
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
  font-family: "Manrope", sans-serif;
    font-size: 15px;
    font-weight: 500;
    min-width: 38px;
    text-align: center;
    color: #1D1D1D;
  }
  .pc-cart-btn {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 999px;
    background: #F85700;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    font-family: "Manrope", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 14px;
    transition: background .2s, transform .15s;
  }
  .pc-cart-btn:hover { background: #e84f00; transform: translateY(-1px); }
  .pc-enquiry {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 2px;
  }
  .pc-enquiry a {
  font-family: "Manrope", sans-serif;

    font-size: 13px;
    font-weight: 700;
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
  .pp-page-btn.active { background: #111; color: white; border-color: #111; }
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
    font-family: "Manrope", sans-serif;
  font-weight: 700;

    cursor: pointer;

    transition: background .2s;
  }
  .pp-see-more-btn:hover { background: #333; }

  /* ── WhatsApp FAB ── */
  .pp-wa-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: #5AC44D;
  color: #FFFFFF;
  text-decoration: none;

  padding: 15px 20px;
  border-radius: 99px;

  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1;

  z-index: 9999;

  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.pp-wa-btn:hover {
  transform: translateY(-2px);
  background: #4CAF50;
}

.pp-wa-btn svg {
  width: 22px;
  height: 22px;
  color: #FFFFFF;
  flex-shrink: 0;
}

.pp-wa-btn span {
  color: #FFFFFF;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
}

@media (max-width:768px) {
  .pp-wa-btn {
    right: 16px;
    bottom: 16px;
    padding: 12px 18px;
  }

  .pp-wa-btn span {
    font-size: 16px;
  }

  .pp-wa-btn svg {
    width: 20px;
    height: 20px;
  }
}
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
    .pc-body { padding: 10px; }
    .pc-title { font-size: 14px; }
    .pc-price { font-size: 13px; }
    .pc-subtitle { font-size: 11px; }
    .pc-qty-ctrl { width: 100px; height: 38px; padding: 0 10px; }
    .pc-qty-num { font-size: 14px; }
    .pc-qty-btn { font-size: 22px; }
    .pc-cart-btn { height: 42px; font-size: 12px; }
    .pc-enquiry a { font-size: 11px; }
    
  }
  @media (max-width: 480px) {
    .pc-img-wrap { height: 140px; }
    .pc-qty-ctrl { width: 88px; }
  }
`;

/* ============================================================
   DATA
   (Better: move this to src/app/data/products.js and import
   in both this file and products/[id]/page.jsx so data stays in sync)
   ============================================================ */




/* ============================================================
   PRODUCT CARD (Grid listing)
   ============================================================ */
function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(500);
  const [added, setAdded] = useState(false);

  const formattedPrice = typeof product.price === "number"
    ? `₹ ${product.price}/${product.priceUnit || "Piece"}`
    : product.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc-card" onClick={() => router.push(`/products/${product.slug}`)}>
      <div className="pc-img-wrap">
        <img
          src={product.images?.[0] || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          className="pc-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="pc-body">
        <h3 className="pc-title">{product.name}</h3>
        <div className="pc-price">{formattedPrice}</div>
        <div className="pc-subtitle">{product.productType || product.primaryMaterial || "Handmade Craft"}</div>

        <div className="pc-qty-row">
          <span className="pc-qty-label">QUANTITY</span>
          <div className="pc-qty-ctrl">
            <button className="pc-qty-btn" onClick={(e) => { e.stopPropagation(); setQty(p => p > 1 ? p - 1 : 1); }} aria-label="Decrease">−</button>
            <span className="pc-qty-num">{qty}</span>
            <button className="pc-qty-btn" onClick={(e) => { e.stopPropagation(); setQty(p => p + 1); }} aria-label="Increase">+</button>
          </div>
        </div>

        <button
          className="pc-cart-btn"
          onClick={handleAddToCart}
          style={added ? { background: "#22c55e" } : {}}
        >
          {added ? "✓ Added to Cart" : "+ Add to Cart"}
        </button>

        <div className="pc-enquiry">
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push("/enquiry?type=india"); }}>
            India Enquiry →
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push("/enquiry?type=export"); }}>
            Export Enquiry →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, subcategories, products: allProducts, loading } = useCatalog();

  const categorySlugParam = searchParams.get("category");
  const searchQueryParam = searchParams.get("q");

  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [selectedSubCatId, setSelectedSubCatId] = useState("all");
  const [selectedMOQ, setSelectedMOQ] = useState("");
  const [selectedSort, setSelectedSort] = useState("Recommended");

  // Sync category filter with URL query param
  useEffect(() => {
    if (categorySlugParam) {
      setActiveCategorySlug(categorySlugParam);
      setSelectedSubCatId("all");
    } else if (categories.length > 0 && !activeCategorySlug) {
      setActiveCategorySlug(categories[0].slug);
    }
  }, [categorySlugParam, categories, activeCategorySlug]);

  const activeCategory = categories.find(c => c.slug === activeCategorySlug) || categories[0];
  const activeCategoryId = activeCategory?.id || activeCategory?._id;

  // Filter subcategories for the sidebar based on active category
  const filteredSubcategories = subcategories.filter(sub => {
    const catId = typeof sub.category === "object" ? sub.category.id || sub.category._id : sub.category;
    return catId === activeCategoryId;
  });

  const getProductMOQ = (price) => {
    if (!price || isNaN(price)) return "1 - 100 pcs";
    const numPrice = Number(price);
    if (numPrice < 50) return "1000+ pcs";
    if (numPrice < 100) return "500 - 1000 pcs";
    if (numPrice < 200) return "100 - 500 pcs";
    return "1 - 100 pcs";
  };

  // Filter products in memory
  let filteredProducts = allProducts.filter(prod => {
    // 1. Filter by category
    const catSlug = prod.category?.slug || (typeof prod.category === "object" ? prod.category.slug : "");
    if (activeCategorySlug && catSlug !== activeCategorySlug) return false;

    // 2. Filter by subcategory
    if (selectedSubCatId !== "all") {
      const subId = prod.subcategory?.id || prod.subcategory?._id || prod.subcategory?.toString();
      if (subId !== selectedSubCatId) return false;
    }

    // 3. Filter by search query from Navbar
    if (searchQueryParam) {
      const q = searchQueryParam.toLowerCase();
      const nameMatch = prod.name?.toLowerCase().includes(q);
      const descMatch = prod.description?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch) return false;
    }

    // 4. Filter by MOQ
    if (selectedMOQ) {
      const prodMOQ = getProductMOQ(prod.price);
      if (prodMOQ !== selectedMOQ) return false;
    }

    // 5. Filter by New Arrivals
    if (selectedSort === "New Arrivals") {
      if (!prod.newArrival) return false;
    }

    return true;
  });

  // Apply Sorting
  if (selectedSort === "Price Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "Price High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "New Arrivals") {
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const handleClearFilters = () => {
    setSelectedSubCatId("all");
    setSelectedMOQ("");
    setSelectedSort("Recommended");
  };

  return (
    <>
      <Navbar />
      <style jsx>{styles}</style>

      <div className="pp-page">
        <div className="pp-container">

          {/* Title */}
          <div className="pp-title">
            {searchQueryParam ? `Search Results for "${searchQueryParam}"` : "Product Collections"}
          </div>

          {/* Category Pills */}
          <div className="pp-cat-row">
            {loading ? (
              <span style={{ fontSize: "14px", color: "#666", padding: "10px 0" }}>Loading collections...</span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id || cat._id}
                  className={`pp-cat-pill${activeCategorySlug === cat.slug ? " active" : ""}`}
                  onClick={() => {
                    router.push(`/products?category=${cat.slug}`);
                  }}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>

          {/* ── LISTING VIEW ── */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "100px 0" }}>
              <div className="adm-loading-spinner" />
            </div>
          ) : (
            <div className="pp-layout">

              {/* Sidebar */}
              <aside className="pp-sidebar">
                <div className="pp-filter-top">
                  <h3>Filters</h3>
                  <button className="pp-clear-btn" onClick={handleClearFilters}>
                    Clear All
                  </button>
                </div>

                <div className="pp-filter-section">
                  <h4>Sub Category</h4>
                  <label className="pp-radio-row">
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubCatId === "all"}
                      onChange={() => setSelectedSubCatId("all")}
                    />
                    <span>All Products</span>
                  </label>
                  {filteredSubcategories.map((item) => (
                    <label className="pp-radio-row" key={item.id || item._id}>
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubCatId === (item.id || item._id)}
                        onChange={() => setSelectedSubCatId(item.id || item._id)}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>

                <div className="pp-filter-section">
                  <h4>MOQ (Minimum Order Quantity)</h4>
                  {moqOptions.map((item) => (
                    <label className="pp-radio-row" key={item}>
                      <input type="radio" name="moq" checked={selectedMOQ === item} onChange={() => setSelectedMOQ(item)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div className="pp-filter-section">
                  <h4>Sort by</h4>
                  {sortOptions.map((item) => (
                    <label className="pp-radio-row" key={item}>
                      <input type="radio" name="sort" checked={selectedSort === item} onChange={() => setSelectedSort(item)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <button className="pp-apply-btn" onClick={() => {}}>Apply Filter</button>
              </aside>

              {/* Products Area */}
              <div>
                <div className="pp-prod-header">
                  <div className="pp-prod-count">Showing {filteredProducts.length} Products</div>
                  <select
                    className="pp-sort-select"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="New Arrivals">Sort By Latest</option>
                    <option value="Price Low to High">Price Low To High</option>
                    <option value="Price High to Low">Price High To Low</option>
                  </select>
                </div>

                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
                    <h3>No products found in this category</h3>
                    <p style={{ marginTop: "10px", fontSize: "14px" }}>Please select another category or check back later.</p>
                  </div>
                ) : (
                  <div className="pp-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id || product._id} product={product} />
                    ))}
                  </div>
                )}

                {filteredProducts.length > 0 && (
                  <>
                    <div className="pp-pagination">
                      <button className="pp-page-btn active">1</button>
                      <button className="pp-page-btn">2</button>
                      <button className="pp-page-btn">3</button>
                      <button className="pp-page-btn">→</button>
                    </div>

                    <div className="pp-see-more">
                      <button className="pp-see-more-btn">See More Products</button>
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

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