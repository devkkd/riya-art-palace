"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import FollowUs from "../../components/FollowUs";
import Footer from "../../components/Footer";
import { useCatalog } from "@/app/components/CatalogContext";
import ValuesSection from "@/app/components/ValuesSection.jsx";
import { useCart } from "@/app/components/CartContext";


/* ── Reviews Section ────────────────────────────────────────── */
function StarDisplay({ rating, size = 16 }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s<=rating ? "#F85700" : "#E0D9D1", fontSize:size, lineHeight:1 }}>★</span>
      ))}
    </span>
  );
}

function ReviewsSection({ productId }) {
  const [reviews,    setReviews]    = useState([]);
  const [avgRating,  setAvgRating]  = useState(0);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setReviews(j.data.reviews);
          setAvgRating(j.data.avgRating);
          setTotal(j.data.total);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "";

  return (
    <div style={{ borderTop:"1px solid #E0D9D1", paddingTop:36, marginTop:16, marginBottom:48 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontFamily:"Manrope,sans-serif", fontSize:20, fontWeight:800, color:"#0E0E0E", marginBottom:6 }}>
            Customer Reviews
          </div>
          {total > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <StarDisplay rating={Math.round(avgRating)} size={20}/>
              <span style={{ fontFamily:"Manrope,sans-serif", fontSize:15, fontWeight:700, color:"#0E0E0E" }}>{avgRating}</span>
              <span style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888" }}>({total} review{total!==1?"s":""})</span>
            </div>
          )}
        </div>
        <a href="/account" style={{ display:"inline-flex", alignItems:"center", gap:6, height:44, padding:"0 22px", border:"1.5px solid #C3BCB4", borderRadius:999, fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, color:"#555", textDecoration:"none", transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#F85700";e.currentTarget.style.color="#F85700";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#C3BCB4";e.currentTarget.style.color="#555";}}>
          ✍ Write a Review
        </a>
      </div>

      {loading ? (
        <div style={{ padding:"32px 0", display:"flex", justifyContent:"center" }}>
          <div style={{ width:28, height:28, border:"3px solid #E5DDD5", borderTopColor:"#F85700", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign:"center", padding:"32px 0", fontFamily:"Manrope,sans-serif", color:"#aaa", fontSize:14 }}>
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background:"#fff", border:"1.5px solid #E0D9D1", borderRadius:14, padding:"20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"#F85700", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:14, flexShrink:0 }}>
                      {(r.userName||"A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700, color:"#0E0E0E" }}>{r.userName || "Anonymous"}</div>
                      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:11, color:"#aaa" }}>{fmtDate(r.createdAt)}</div>
                    </div>
                  </div>
                  <StarDisplay rating={r.rating} size={15}/>
                </div>
                <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:"#D1FAE5", color:"#065F46" }}>✓ Verified Purchase</span>
              </div>

              {r.title && (
                <div style={{ fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700, color:"#0E0E0E", marginBottom:6 }}>{r.title}</div>
              )}
              {r.body && (
                <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#555", lineHeight:1.7 }}>{r.body}</div>
              )}

              {r.adminReply && (
                <div style={{ marginTop:12, background:"#F7F5F3", borderRadius:10, padding:"12px 16px", borderLeft:"3px solid #F85700" }}>
                  <div style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#F85700", marginBottom:4 }}>SELLER REPLY</div>
                  <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#555" }}>{r.adminReply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

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

  /* Back button */
  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #F85700;
    cursor: pointer;
    padding: 18px 0 4px;
  }
  .pd-back-btn:hover { text-decoration: underline; }
  .pd-back-arrow {
    font-size: 18px;
    line-height: 1;
  }

  /* Breadcrumb */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0 28px;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    color: #888;
  }
  .pd-breadcrumb span { color: #888; }
  .pd-breadcrumb button {
    background: none;
    border: none;
    font-size: 14px;
    font-family: "Manrope", sans-serif;
    color: #F85700;
    cursor: pointer;
    padding: 0;
  }
  .pd-breadcrumb button:hover { text-decoration: underline; }

  /* Detail layout */
  .pd-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
    margin-bottom: 64px;
  }

  /* Image grid — 2×2 */
  .pd-img-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .pd-img-cell {
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-radius: 4px;
    cursor: zoom-in;
    position: relative;
    background: #EDE8E3;
  }
  .pd-img-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .35s ease;
  }
  .pd-img-cell:hover img { transform: scale(1.04); }

  /* Right info panel */
  .pd-info { display: flex; flex-direction: column; gap: 0; }

  .pd-product-name {
    font-family: "Manrope", sans-serif;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: #0E0E0E;
    margin-bottom: 10px;
  }
  .pd-product-price {
    font-family: "Manrope", sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #0E0E0E;
    margin-bottom: 6px;
  }
  .pd-product-subtitle {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }

  /* Quantity row */
  .pd-qty-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  .pd-qty-label{
    font-size:15px;
    font-weight:600;
    color:#111;
  }
  .pd-qty-ctrl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 130px;
    height: 48px;
    border: 1px solid #C3BCB4;
    border-radius: 999px;
    padding: 0 16px;
    background: transparent;
  }
  .pd-qty-btn {
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
  .pd-qty-num {
    font-size: 16px;
    font-weight: 600;
    min-width: 36px;
    text-align: center;
    color: #1D1D1D;
  }
  .pd-action-row{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:24px;
    margin-bottom:24px;
  }
  .pd-qty-row{
    width:100%;
    height:54px;
    display:flex;
    align-items:center;
    padding:0;
    margin-bottom:0;
  }
  .pd-qty-ctrl{
    margin-left:auto;
  }

  /* Add to cart */
  .pd-cart-btn{
    width:100%;
    height:54px;
    border:none;
    border-radius:999px;
    background:#F85700;
    color:#fff;
    font-size:15px;
    font-weight:600;
    font-family:"Poppins",sans-serif;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition: background .2s;
  }
  .pd-cart-btn:hover { background: #e84f00; }

  /* Enquiry buttons row */
  .pd-enquiry-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:24px;
    margin-bottom:28px;
  }
  .pd-enquiry-btn{
    width:100%;
    height:54px;
    border:1.5px solid #C3BCB4;
    border-radius:999px;
    background:#fff;
    font-size:15px;
    font-weight:600;
    font-family:"Poppins",sans-serif;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
  }

  /* Description */
  .pd-section-title {
    font-family: "Manrope", sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #0E0E0E;
    margin-bottom: 14px;
    padding-top: 24px;
    border-top: 1px solid #E0D9D1;
  }
  .pd-desc-text {
    font-family: "Manrope", sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.75;
    color: #333;
  }

  /* Specification Table */
  .pd-spec-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0;
  }
  .pd-spec-table tr {
    border-bottom: 1px solid #E8E2DC;
  }
  .pd-spec-table tr:last-child { border-bottom: none; }
  .pd-spec-table td {
    padding: 12px 0;
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    vertical-align: top;
  }
  .pd-spec-table td:first-child {
    font-weight: 600;
    color: #888;
    width: 42%;
    padding-right: 16px;
  }
  .pd-spec-table td:last-child {
    font-weight: 500;
    color: #0E0E0E;
  }

  /* ── Related Products ── */
  .pd-related {
    padding: 48px 0 64px;
    border-top: 1px solid #D7CEC5;
  }
  .pd-related-title {
    font-family: "Manrope", sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #0E0E0E;
    text-align: center;
    margin-bottom: 32px;
    letter-spacing: -0.02em;
  }
  .pd-related-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }

  /* Related card */
  .pd-rel-card {
    background: #F7F5F3;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform .25s ease, box-shadow .25s ease;
    overflow: hidden;
  }
  .pd-rel-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0,0,0,.08);
  }
  .pd-rel-img-wrap {
    width: 100%;
    aspect-ratio: 3/4;
    overflow: hidden;
    position: relative;
    background: #EDE8E3;
  }
  .pd-rel-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .35s ease;
  }
  .pd-rel-card:hover .pd-rel-img-wrap img { transform: scale(1.04); }
  .pd-rel-body {
    padding: 12px 10px 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .pd-rel-name {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #0E0E0E;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .pd-rel-price {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #0E0E0E;
    margin-bottom: 4px;
  }
  .pd-rel-sub {
    font-size: 11px;
    color: #777;
    margin-bottom: 10px;
  }
  .pd-rel-qty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .pd-rel-qty-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #111;
    text-transform: uppercase;
  }
  .pd-rel-qty-ctrl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 88px;
    height: 34px;
    border: 1px solid #C3BCB4;
    border-radius: 999px;
    padding: 0 10px;
    background: transparent;
  }
  .pd-rel-qty-btn {
    border: none;
    background: transparent;
    font-size: 20px;
    font-weight: 300;
    color: #111;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    display: flex;
    align-items: center;
    user-select: none;
  }
  .pd-rel-qty-num {
    font-size: 13px;
    font-weight: 500;
    min-width: 24px;
    text-align: center;
  }
  .pd-rel-cart-btn {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #F85700;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition:
    background .2s ease,
    transform .15s ease,
    opacity .2s ease;
}

.pd-rel-cart-btn:hover {
  background: #e84f00;
}

/* Added state */
.pd-rel-cart-btn.added {
  background: #16A34A;
  color: #fff;
  cursor: default;
}

.pd-rel-cart-btn.added:hover {
  background: #16A34A;
  transform: none;
}

.pd-rel-cart-btn:active:not(.added) {
  transform: scale(0.98);
}
  .pd-rel-enquiry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .pd-rel-enquiry a {
    font-size: 11px;
    font-weight: 600;
    color: #111;
    text-decoration: none;
    white-space: nowrap;
  }
  .pd-rel-enquiry a:hover { color: #F85700; }

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

  /* ══════════════════════════════════════
     CART SIDEBAR
  ══════════════════════════════════════ */

  /* Overlay (dark backdrop) */
  .cart-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease;
  }
  .cart-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  /* Drawer panel */
  .cart-drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 380px;
    background: #fff;
    z-index: 10001;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform .35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -8px 0 32px rgba(0,0,0,.12);
  }
  .cart-drawer.open {
    transform: translateX(0);
  }

  /* Drawer header */
  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 18px;
    border-bottom: 1px solid #EDE8E3;
  }
  .cart-title {
    font-family: "Manrope", sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #0E0E0E;
    letter-spacing: -0.01em;
  }
  .cart-close-btn {
    width: 30px;
    height: 30px;
    border: 1.5px solid #C3BCB4;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    color: #555;
    transition: background .15s, color .15s;
    line-height: 1;
    padding: 0;
  }
  .cart-close-btn:hover {
    background: #F85700;
    color: #fff;
    border-color: #F85700;
  }

  /* Cart item */
  .cart-item {
    display: flex;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid #F0EBE5;
  }
  .cart-item-img {
    width: 72px;
    height: 96px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    background: #EDE8E3;
  }
  .cart-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cart-item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cart-item-name {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0E0E0E;
    line-height: 1.4;
  }
  .cart-item-price {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0E0E0E;
  }
  .cart-item-sub {
    font-family: "Manrope", sans-serif;
    font-size: 12px;
    color: #888;
  }
  .cart-item-qty-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  .cart-item-qty-label {
    font-family: "Manrope", sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .cart-item-qty-ctrl {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100px;
    height: 34px;
    border: 1px solid #C3BCB4;
    border-radius: 999px;
    padding: 0 12px;
    background: transparent;
  }
  .cart-item-qty-btn {
    border: none;
    background: transparent;
    font-size: 20px;
    font-weight: 300;
    color: #111;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    user-select: none;
  }
  .cart-item-qty-num {
    font-family: "Manrope", sans-serif;
    font-size: 13px;
    font-weight: 600;
    min-width: 28px;
    text-align: center;
    color: #1D1D1D;
  }

 
  /* =========================
   CART FOOTER
========================= */

.cart-footer{
  margin-top:auto;
  padding:16px;
  
  display:flex;
  flex-direction:column;
  gap:14px;
}

/* Coupon */

.cart-coupon{
  width:100%;
  padding-bottom:18px;
  border-bottom:1px solid #E5DDD5;
  
}

.cart-coupon-label{
  font-family:"Manrope",sans-serif;
  font-size:13px;
  font-weight:700;
  color:#555;
  margin-bottom:8px;
}

.cart-coupon-row{
  position:relative;
  width:100%;
}

.cart-coupon-input{
  width:100%;
  height:42px;
  border:1.5px solid #C3BCB4;
  border-radius:999px;
  padding:0 90px 0 16px;
  font-family:"Poppins",sans-serif;
  font-size:13px;
  background:#FAF8F6;
  outline:none;
}

.cart-coupon-input::placeholder{
  color:#BEBEBE;
}

.cart-coupon-apply{
  position:absolute;
  right:4px;
  top:4px;
  height:34px;
  width:72px;
  border:none;
  border-radius:999px;
  background:#F85700;
  color:#fff;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
}

/* Buttons */

.cart-btn-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  width:100%;
    padding-bottom:18px;
  border-bottom:1px solid #E5DDD5;
}

.cart-continue-btn,
.cart-checkout-btn{
  width:100%;
  height:38px;
  border-radius:999px;
  font-family:"Poppins",sans-serif;
  font-size:12px;
  font-weight:600;
  cursor:pointer;
}

.cart-continue-btn{
  border:1.5px solid #C3BCB4;
  background:#fff;
  color:#333;
}

.cart-checkout-btn{
  border:none;
  background:#F85700;
  color:#fff;
}

/* Powered By */

.cart-footer-powered{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  font-size:10px;
  color:#AAA;
  margin-top:2px;
}

  /* ── Responsive ── */
  @media (max-width: 1200px) {
    .pd-related-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (max-width: 1000px) {
    .pd-layout { grid-template-columns: 1fr; gap: 32px; }
    .pd-related-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .pp-container { padding: 0 16px; }
    .pp-wa-btn { width: 120px; height: 48px; right: 14px; bottom: 14px; font-size: 13px; }
    .pd-related-grid { grid-template-columns: repeat(2, 1fr); }
    .pd-product-name { font-size: 22px; }
    .pd-action-row { flex-direction: row; align-items: center; gap: 12px; }
    .pd-qty-row { flex-shrink: 0; }
    .pd-cart-btn { flex: 1; width: auto; min-width: 0; }
    .cart-drawer { width: 100vw; }
  }
  @media (max-width: 480px) {
    .pd-action-row { flex-direction: row !important; align-items: center; gap: 10px; }
    .pd-qty-label { display:none; }
    .pd-qty-ctrl { width:120px; height:46px; }
    .pd-cart-btn { height:46px; flex:1; font-size:14px; }
  }
`;

/* ============================================================
   CART SIDEBAR
   ============================================================ */
function CartSidebar({
  isOpen,
  onClose,
  product,
  qty,
  setQty,
  onContinueToCheckout,
}) {
  if (!product) return null;

  const formattedPrice = typeof product.price === "number"
    ? `₹ ${product.price}/${product.priceUnit || "Piece"}`
    : product.price;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer${isOpen ? " open" : ""}`}>

        {/* Header */}
        <div className="cart-header">
          <span className="cart-title">CART</span>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Cart Item */}
        <div className="cart-item">
          <div className="cart-item-img">
            <img
              src={product.images?.[0] || "https://placehold.co/400x300?text=No+Image"}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="cart-item-details">
            <div className="cart-item-name">{product.name}</div>
            <div className="cart-item-price">{formattedPrice}</div>
            <div className="cart-item-sub">{product.productType || product.primaryMaterial || "Handmade Craft"}</div>
            <div className="cart-item-qty-row">
              <span className="cart-item-qty-label">QUANTITY</span>
              <div className="cart-item-qty-ctrl">
                <button
                  className="cart-item-qty-btn"
                  onClick={() => setQty(p => p > 1 ? p - 1 : 1)}
                >−</button>
                <span className="cart-item-qty-num">{qty}</span>
                <button
                  className="cart-item-qty-btn"
                  onClick={() => setQty(p => p + 1)}
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
       

        {/* Footer */}
      <div className="cart-footer">

  <div className="cart-coupon">
    <div className="cart-coupon-label">
      Coupon Code
    </div>

    <div className="cart-coupon-row">
      <input
        className="cart-coupon-input"
        placeholder="Type your code here"
      />

      <button className="cart-coupon-apply">
        Apply
      </button>
    </div>
  </div>

  <div className="cart-btn-row">

    <button
      type="button"
      className="cart-continue-btn"
      onClick={onClose}
    >
      Continue Shopping
    </button>

    <button
      type="button"
      className="cart-checkout-btn"
      onClick={onContinueToCheckout}
    >
      Continue To Checkout
    </button>

  </div>

  <div className="cart-footer-powered">
    <span>POWERED BY</span>
    <strong>🚀 Shiprocket</strong>
  </div>

</div>

      </div>
    </>
  );
}

/* ============================================================
   RELATED PRODUCT CARD (Compact)
   ============================================================ */
/* ============================================================
   RELATED PRODUCT CARD (Compact)
   ============================================================ */
function RelatedCard({ product, router, addToCart }) {
  const [qty, setQty] = useState(500);
  const [added, setAdded] = useState(false);

  const goTo = () => {
    router.push(`/products/${product.slug}`);
  };

  const formattedPrice =
    typeof product.price === "number"
      ? `₹ ${product.price}/${product.priceUnit || "Piece"}`
      : product.price;

  const handleRelatedAddToCart = (e) => {
    e.stopPropagation();

    // Already added hai to dobara add mat karo
    if (added) return;

    // Add selected related product to cart
    addToCart(product, qty);

    // Button state change
    setAdded(true);
  };

  return (
    <div className="pd-rel-card" onClick={goTo}>

      {/* Product Image */}
      <div className="pd-rel-img-wrap">
        <img
          src={
            product.images?.[0] ||
            "https://placehold.co/400x300?text=No+Image"
          }
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Product Details */}
      <div className="pd-rel-body">

        <div className="pd-rel-name">
          {product.name}
        </div>

        <div className="pd-rel-price">
          {formattedPrice}
        </div>

        <div className="pd-rel-sub">
          {product.productType ||
            product.primaryMaterial ||
            "Handmade Craft"}
        </div>

        {/* Quantity */}
        <div className="pd-rel-qty-row">
          <span className="pd-rel-qty-label">
            QTY
          </span>

          <div className="pd-rel-qty-ctrl">

            <button
              type="button"
              className="pd-rel-qty-btn"
              onClick={(e) => {
                e.stopPropagation();

                if (added) return;

                setQty((p) => (p > 1 ? p - 1 : 1));
              }}
            >
              −
            </button>

            <span className="pd-rel-qty-num">
              {qty}
            </span>

            <button
              type="button"
              className="pd-rel-qty-btn"
              onClick={(e) => {
                e.stopPropagation();

                if (added) return;

                setQty((p) => p + 1);
              }}
            >
              +
            </button>

          </div>
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          className={`pd-rel-cart-btn ${added ? "added" : ""}`}
          onClick={handleRelatedAddToCart}
          disabled={added}
        >
          {added ? "✓ Added" : "+ Add to Cart"}
        </button>

        {/* Enquiry */}
        <div className="pd-rel-enquiry">

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/enquiry?type=india");
            }}
          >
            India Enquiry →
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/enquiry?type=export");
            }}
          >
            Export Enquiry →
          </a>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   PRODUCT DETAIL PAGE
   ============================================================ */
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { products, loading } = useCatalog();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(500);
  const [cartOpen, setCartOpen] = useState(false);

  const { slug } = params;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", padding: "120px 0", background: "#F7F5F3", minHeight: "60vh" }}>
          <div className="adm-loading-spinner" />
        </div>
        <Footer />
      </>
    );
  }

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pp-page">
          <div className="pp-container" style={{ padding: "60px 0", textAlign: "center" }}>
            <h2>Product not found</h2>
            <button onClick={() => router.push("/products")} style={{ marginTop: 16, cursor: "pointer", padding: "10px 20px", border: "1px solid #ddd", background: "#fff", borderRadius: "99px" }}>
              ← Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Format price helper
  const formattedPrice = typeof product.price === "number"
    ? `₹ ${product.price}/${product.priceUnit || "Piece"}`
    : product.price;

  const related = products
    .filter((p) => (p.id || p._id) !== (product.id || product._id) && p.category?.slug === product.category?.slug)
    .slice(0, 5);
  // Fallback if not enough related products in the same category
  if (related.length < 5) {
    const fallbacks = products
      .filter((p) => (p.id || p._id) !== (product.id || product._id) && !related.some(r => (r.id || r._id) === (p.id || p._id)))
      .slice(0, 5 - related.length);
    related.push(...fallbacks);
  }

  // Reconstruct specifications object
  const specs = {
    "Product Type": product.productType || "—",
    "Primary Material": product.primaryMaterial || "—",
    "Style": product.style || "—",
    "Set Type": product.setType || "—",
    "Color": product.color || "—",
    "Size Category": product.sizeCategory || "—",
    "Theme": product.theme || "—",
    "Usage Area": product.usageArea || "—",
  };

 const handleAddToCart = () => {
  addToCart(product, qty);
  setCartOpen(true);
};

  return (
    <>
      <Navbar />
      <style jsx>{styles}</style>

      {/* Cart Sidebar */}
    <CartSidebar
  isOpen={cartOpen}
  onClose={() => setCartOpen(false)}
  product={product}
  qty={qty}
  setQty={setQty}
  onContinueToCheckout={() => {
    setCartOpen(false);
    router.push("/cart");
  }}
/>

      <div className="pp-page">
        <div className="pp-container">

          {/* Back Button */}
          <button className="pd-back-btn" onClick={() => router.back()}>
            <span className="pd-back-arrow">←</span>
            Back
          </button>

          {/* Breadcrumb */}
          <div className="pd-breadcrumb">
            <button onClick={() => router.push("/products")}>Products</button>
            <span>›</span>
            <span>{product.category?.name || "Category"}</span>
            <span>›</span>
            <span style={{ color: "#0E0E0E", fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* Main Detail Layout */}
          <div className="pd-layout">

            {/* LEFT — 2×2 Image Grid */}
            <div className="pd-img-grid">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <div className="pd-img-cell" key={i}>
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))
              ) : (
                <div className="pd-img-cell">
                  <img
                    src="https://placehold.co/400x530?text=No+Image"
                    alt="No Image"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>

            {/* RIGHT — Info */}
            <div className="pd-info">
              <h1 className="pd-product-name">{product.name}</h1>
              <div className="pd-product-price">{formattedPrice}</div>
              <div className="pd-product-subtitle">{product.productType || product.primaryMaterial || "Handmade Craft"}</div>

              {/* Quantity + Add to Cart */}
              <div className="pd-action-row">
                <div className="pd-qty-row">
                  <span className="pd-qty-label">QUANTITY</span>
                  <div className="pd-qty-ctrl">
                    <button className="pd-qty-btn" onClick={() => setQty(p => p > 1 ? p - 1 : 1)}>−</button>
                    <span className="pd-qty-num">{qty}</span>
                    <button className="pd-qty-btn" onClick={() => setQty(p => p + 1)}>+</button>
                  </div>
                </div>

                <button className="pd-cart-btn" onClick={handleAddToCart}>
                  + Add to Cart
                </button>
              </div>

              {/* Enquiry Buttons */}
              <div className="pd-enquiry-row">
                <button
                  className="pd-enquiry-btn"
                  onClick={() => router.push("/enquiry?type=india")}
                >
                  India Enquiry →
                </button>
                <button
                  className="pd-enquiry-btn"
                  onClick={() => router.push("/enquiry?type=export")}
                >
                  Export Enquiry →
                </button>
              </div>

              {/* Description */}
              <div className="pd-section-title">Product Description</div>
              <p className="pd-desc-text">{product.description}</p>

              {/* Specification */}
              <div className="pd-section-title" style={{ marginTop: "24px" }}>Product Specification</div>
              <table className="pd-spec-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection productId={product.id || product._id} />

          {/* Related Products */}
          <div className="pd-related">
            <div className="pd-related-title">Related Products</div>
            <div className="pd-related-grid">
             {related.map((p) => (
  <RelatedCard
    key={p.id || p._id}
    product={p}
    router={router}
    addToCart={addToCart}
  />
))}
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

      <ValuesSection />
      <FollowUs />
      <Footer />
    </>
  );
}