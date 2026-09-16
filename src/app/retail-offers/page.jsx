"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCatalog } from "@/app/components/CatalogContext";
import { useCart } from "@/app/components/CartContext";
import { useCurrency } from "@/app/components/CurrencyContext";
import { FaWhatsapp } from "react-icons/fa";
import ProductWatermark from "@/app/components/ProductWatermark";

function RetailProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [qty,   setQty]   = useState(product.minOrderQty ?? 1);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      style={{
        background: "#fff", borderRadius: 14, border: "1px solid #E8E2DC",
        overflow: "hidden", cursor: "pointer",
        transition: "box-shadow .25s, transform .25s",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.1)"; e.currentTarget.style.transform="translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ aspectRatio:"1/1", background:"#F5E6D8", overflow:"hidden", position:"relative" }}>
        <img src={product.images?.[0] || "https://placehold.co/400x400?text=No+Image"}
          alt={product.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        />
        <ProductWatermark />
      </div>

      {/* Body */}
      <div style={{ padding:"14px 14px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        {/* Retail badge */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
          <span style={{ fontSize:10, fontWeight:700, background:"#D1FAE5", color:"#065F46", padding:"2px 8px", borderRadius:999, letterSpacing:"0.05em" }}>
            RETAIL OFFER
          </span>
          {product.sku && (
            <span style={{ fontSize:10, color:"#bbb", fontFamily:"monospace" }}>{product.sku}</span>
          )}
        </div>

        <h3 style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:6, lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {product.name}
        </h3>

        <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
          <span style={{ fontFamily:"Manrope,sans-serif", fontSize:16, fontWeight:800, color:"#1a1a1a" }}>{format(product.price)}</span>
          <span style={{ fontFamily:"Manrope,sans-serif", fontSize:11, color:"#aaa" }}>/ {product.priceUnit || "Piece"}</span>
        </div>

        {(product.productType || product.primaryMaterial) && (
          <div style={{ fontFamily:"Manrope,sans-serif", fontSize:11, color:"#999", marginBottom:12 }}>
            {product.productType || product.primaryMaterial}
          </div>
        )}

        <hr style={{ border:"none", borderTop:"1px solid #F0EDE9", margin:"auto 0 10px" }}/>

        {/* MOQ */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontFamily:"Manrope,sans-serif", fontSize:10, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:".06em" }}>Min. Qty</span>
          <div style={{ display:"flex", alignItems:"center", border:"1.5px solid #D7CEC5", borderRadius:999, overflow:"hidden", height:34 }}>
            <button onClick={e=>{e.stopPropagation();setQty(p=>Math.max(product.minOrderQty??1,p-1));}}
              style={{ width:32,height:34,border:"none",background:"#F7F5F3",fontSize:18,fontWeight:300,cursor:"pointer",color:"#333",display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none" }}>−</button>
            <span style={{ minWidth:36,textAlign:"center",fontFamily:"Manrope,sans-serif",fontSize:13,fontWeight:600,color:"#1a1a1a",borderLeft:"1.5px solid #D7CEC5",borderRight:"1.5px solid #D7CEC5",height:34,display:"flex",alignItems:"center",justifyContent:"center" }}>{qty}</span>
            <button onClick={e=>{e.stopPropagation();setQty(p=>p+1);}}
              style={{ width:32,height:34,border:"none",background:"#F7F5F3",fontSize:18,fontWeight:300,cursor:"pointer",color:"#333",display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none" }}>+</button>
          </div>
        </div>

        <button onClick={handleAdd}
          style={{ width:"100%", height:42, border:"none", borderRadius:8,
            background: added ? "#16a34a" : "#1a1a1a", color:"#fff",
            fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:800,
            cursor:"pointer", letterSpacing:"0.06em", textTransform:"uppercase",
            transition:"background .2s", marginBottom:8 }}
          onMouseEnter={e=>{if(!added)e.currentTarget.style.background="#F85700";}}
          onMouseLeave={e=>{if(!added)e.currentTarget.style.background="#1a1a1a";}}
        >
          {added ? "✓ Added" : "Add to Cart"}
        </button>

        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {["india","export"].map(type => (
            <button key={type} onClick={e=>{e.stopPropagation();router.push(`/enquiry?type=${type}`);}}
              style={{ flex:1, background:"none", border:"none", fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:600, color:"#888", cursor:"pointer", padding:0, transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#F85700"}
              onMouseLeave={e=>e.currentTarget.style.color="#888"}
            >
              {type === "india" ? "India →" : "Export →"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RetailOffersPage() {
  const router = useRouter();
  const { products, categories, loading } = useCatalog();
  const [catFilter, setCatFilter] = useState("");
  const [search,    setSearch]    = useState("");

  const retailProducts = products.filter(p => p.showInRetail);

  const filtered = retailProducts.filter(p => {
    if (catFilter && p.category?.id !== catFilter && p.category?._id?.toString() !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.name?.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        .ro-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        @media(max-width:1100px){ .ro-grid{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:768px){  .ro-grid{grid-template-columns:repeat(2,1fr); gap:14px;} }
        @media(max-width:480px){  .ro-grid{grid-template-columns:repeat(2,1fr); gap:10px;} }
      `}</style>

      <div style={{ background:"#F7F5F3", minHeight:"80vh", paddingBottom:80 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#fce8dc,#F7F5F3)", borderBottom:"1px solid #e8d0c0", padding:"52px clamp(16px,5vw,64px) 40px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#F85700", marginBottom:14 }}>
              <span style={{ width:40, height:2, background:"#F85700", display:"block" }}/>
              Retail Offers
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"#1a1a1a", margin:"0 0 12px", lineHeight:1.15, letterSpacing:"-0.02em" }}>
              Retail Collection
            </h1>
            <p style={{ fontFamily:"Manrope,sans-serif", fontSize:15, color:"#666", lineHeight:1.7, margin:"0 0 28px", maxWidth:560 }}>
              Handpicked products available for retail purchase. Order in smaller quantities — perfect for personal use, gifting, or small businesses.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:"1", maxWidth:360 }}>
                <input type="text" placeholder="Search retail products…" value={search} onChange={e=>setSearch(e.target.value)}
                  style={{ width:"100%", height:46, padding:"0 16px 0 42px", border:"1.5px solid #e8d0c0", borderRadius:10, fontFamily:"Manrope,sans-serif", fontSize:13, outline:"none", background:"#fff", boxSizing:"border-box" }}/>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#aaa", fontSize:14 }}>🔍</span>
              </div>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                style={{ height:46, padding:"0 14px", border:"1.5px solid #e8d0c0", borderRadius:10, fontFamily:"Manrope,sans-serif", fontSize:13, outline:"none", background:"#fff", minWidth:180 }}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"40px clamp(16px,5vw,64px) 0" }}>
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:80 }}>
              <div style={{ width:36, height:36, border:"3px solid #E5DDD5", borderTopColor:"#F85700", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🛍️</div>
              <div style={{ fontFamily:"Manrope,sans-serif", fontSize:18, fontWeight:800, color:"#1a1a1a", marginBottom:8 }}>
                {retailProducts.length === 0 ? "No Retail Offers Yet" : "No products match your filter"}
              </div>
              <div style={{ fontFamily:"Manrope,sans-serif", fontSize:14, color:"#888", marginBottom:24 }}>
                {retailProducts.length === 0
                  ? "Admin can mark products as Retail Offers from the dashboard."
                  : "Try clearing the filters."}
              </div>
              <button onClick={() => router.push("/products")}
                style={{ height:48, padding:"0 32px", border:"none", borderRadius:999, background:"#F85700", color:"#fff", fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
                Browse All Products
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888", marginBottom:20 }}>
                Showing <strong style={{ color:"#1a1a1a" }}>{filtered.length}</strong> retail offer{filtered.length !== 1 ? "s" : ""}
                {catFilter || search ? " (filtered)" : ""}
              </div>
              <div className="ro-grid">
                {filtered.map(p => <RetailProductCard key={p.id||p._id} product={p}/>)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/918047635730" target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", right:24, bottom:24, display:"flex", alignItems:"center", gap:8, background:"#5AC44D", color:"#fff", textDecoration:"none", padding:"12px 20px", borderRadius:99, fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:600, zIndex:9999, boxShadow:"0 8px 24px rgba(0,0,0,.15)", transition:"transform .2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
        onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
      >
        <FaWhatsapp size={20}/> For Bulk
      </a>

      <Footer />
    </>
  );
}
