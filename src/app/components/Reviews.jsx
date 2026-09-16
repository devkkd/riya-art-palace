"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import insta1 from "../assets/insta1.jpg";
import insta2 from "../assets/insta2.jpg";
import insta3 from "../assets/insta3.jpg";
import insta4 from "../assets/insta4.jpg";
import insta5 from "../assets/insta5.jpg";
import indiamart from "../assets/indiamart.png";
import { useUser } from "@/app/components/UserContext";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const STATIC_REVIEWS = [
  { id:"s1", userName:"Verified International Buyer", rating:5, title:"", body:"Loved the attention to detail and authentic handmade finish. Highly recommended for handicraft lovers worldwide." },
  { id:"s2", userName:"Verified International Buyer", rating:5, title:"", body:"Beautiful craftsmanship and premium quality products. Delivery was smooth and professional." },
  { id:"s3", userName:"Verified International Buyer", rating:5, title:"", body:"Excellent export packaging and authentic Rajasthani artistry. Will order again." },
  { id:"s4", userName:"Verified International Buyer", rating:5, title:"", body:"Unique handcrafted products with outstanding detailing and finishing." },
  { id:"s5", userName:"Verified International Buyer", rating:5, title:"", body:"Great communication and beautiful handmade collections for our store." },
];

/* ── Write Review Modal (guest — for homepage button) ── */
function WriteReviewModal({ onClose }) {
  const { user } = useUser();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [selOrder, setSelOrder] = useState(null);
  const [selIdx,   setSelIdx]   = useState(0);
  const [rating,   setRating]   = useState(0);
  const [hover,    setHover]    = useState(0);
  const [title,    setTitle]    = useState("");
  const [body,     setBody]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");
  const LABELS = ["","Poor","Fair","Good","Very Good","Excellent"];

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch("/api/orders/my")
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          const eligible = (j.data.orders || []).filter(o =>
            !["pending","cancelled","returned"].includes(o.orderStatus)
          );
          setOrders(eligible);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const items = selOrder?.items || [];
  const selProduct = items[selIdx];

  const submit = async () => {
    if (!selProduct) { setError("Please select a product"); return; }
    if (rating === 0) { setError("Please select a rating"); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selProduct.productId?.toString(), orderId: selOrder.id || selOrder._id, rating, title: title.trim(), body: body.trim() }),
      });
      const json = await res.json();
      if (json.success) setSuccess(true);
      else setError(json.message || "Failed to submit");
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp = { width:"100%", padding:"11px 14px", border:"1.5px solid #E0D9D1", borderRadius:10, background:"#FAF8F6", fontFamily:"Manrope,sans-serif", fontSize:13, color:"#1a1a1a", outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:520, padding:"28px 28px 32px", boxShadow:"0 32px 80px rgba(0,0,0,.2)", maxHeight:"92vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div style={{ fontFamily:"Manrope,sans-serif", fontSize:19, fontWeight:800, color:"#1a1a1a" }}>Write a Review</div>
          <button onClick={onClose} style={{ background:"#F0EDE9", border:"none", width:32, height:32, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"#555" }}>✕</button>
        </div>

        {success ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:18, color:"#1a1a1a", marginBottom:8 }}>Thank you!</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888", marginBottom:24 }}>Your review has been submitted.</div>
            <button onClick={onClose} style={{ height:46, padding:"0 32px", border:"none", borderRadius:999, background:"#F85700", color:"#fff", fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700, cursor:"pointer" }}>Done</button>
          </div>
        ) : !user ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:8 }}>Login Required</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888", marginBottom:20 }}>Please login to your account to write a review.</div>
          </div>
        ) : loading ? (
          <div style={{ textAlign:"center", padding:40 }}><div style={{ width:32, height:32, border:"3px solid #E5DDD5", borderTopColor:"#F85700", borderRadius:"50%", animation:"spin .7s linear infinite", margin:"0 auto" }}/></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:8 }}>No eligible orders</div>
            <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888" }}>You can only review products from confirmed orders.</div>
          </div>
        ) : (
          <>
            {/* Order select */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:8 }}>Select Order</label>
              <select value={selOrder?.id || ""} onChange={e => { const o = orders.find(ord => (ord.id||ord._id) === e.target.value); setSelOrder(o||null); setSelIdx(0); }}
                style={{ ...inp, height:42, cursor:"pointer" }}>
                <option value="">— Pick an order —</option>
                {orders.map(o => <option key={o.id||o._id} value={o.id||o._id}>{o.orderId} · ₹{o.totalAmount}</option>)}
              </select>
            </div>

            {selOrder && items.length > 1 && (
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:8 }}>Select Product</label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {items.map((item,idx) => (
                    <div key={idx} onClick={() => setSelIdx(idx)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:`1.5px solid ${selIdx===idx?"#F85700":"#E0D9D1"}`, borderRadius:10, cursor:"pointer", background:selIdx===idx?"#FFF9F6":"#fff" }}>
                      {item.image && <img src={item.image} alt={item.productName} style={{ width:38, height:38, borderRadius:6, objectFit:"cover", flexShrink:0 }}/>}
                      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:600 }}>{item.productName}</div>
                      {selIdx===idx && <span style={{ marginLeft:"auto", color:"#F85700" }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selOrder && items.length === 1 && selProduct && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#F7F5F3", borderRadius:10, marginBottom:16 }}>
                {selProduct.image && <img src={selProduct.image} alt={selProduct.productName} style={{ width:40, height:40, borderRadius:6, objectFit:"cover" }}/>}
                <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:600 }}>{selProduct?.productName}</div>
              </div>
            )}

            {/* Stars */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".5px", marginBottom:10 }}>Rating *</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                    style={{ fontSize:36, background:"none", border:"none", cursor:"pointer", color:s<=(hover||rating)?"#F85700":"#E0D9D1", lineHeight:1, padding:"0 2px", transition:"color .1s, transform .1s", transform:s<=(hover||rating)?"scale(1.12)":"scale(1)" }}>★</button>
                ))}
                {(hover||rating) > 0 && <span style={{ marginLeft:8, fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, color:"#F85700" }}>{LABELS[hover||rating]}</span>}
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:7 }}>Review Title</label>
              <input style={inp} placeholder="e.g. Great quality!" value={title} onChange={e => setTitle(e.target.value)} maxLength={100}/>
            </div>

            <div style={{ marginBottom:18 }}>
              <label style={{ fontFamily:"Manrope,sans-serif", fontSize:11, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:".5px", display:"block", marginBottom:7 }}>Your Review</label>
              <textarea style={{ ...inp, height:96, padding:"10px 14px", resize:"vertical", lineHeight:1.65 }} placeholder="Share your experience…" value={body} onChange={e => setBody(e.target.value)} maxLength={1000}/>
              <div style={{ fontFamily:"Manrope,sans-serif", fontSize:10, color:"#bbb", textAlign:"right", marginTop:3 }}>{body.length}/1000</div>
            </div>

            {error && <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:8, padding:"9px 14px", fontFamily:"Manrope,sans-serif", fontSize:12, color:"#991B1B", marginBottom:14 }}>{error}</div>}

            <button onClick={submit} disabled={submitting || rating === 0 || !selOrder} style={{ width:"100%", height:48, border:"none", borderRadius:999, background:(submitting||rating===0||!selOrder)?"#ccc":"#F85700", color:"#fff", fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700, cursor:(submitting||rating===0||!selOrder)?"not-allowed":"pointer", transition:"background .2s" }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const gallery = [insta1, insta2, insta3, insta4, insta5];

/* ── Reel Card — autoplay on hover ── */
function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true);

  // IntersectionObserver — autoplay when visible on mobile
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.play().catch(() => {}); setPlaying(true); }
        else { el.pause(); setPlaying(false); }
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
  };
  const handleMouseLeave = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(p => !p);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position:"relative", flexShrink:0,
        width:220, aspectRatio:"9/16",
        borderRadius:18, overflow:"hidden",
        background:"#111", cursor:"pointer",
        boxShadow:"0 8px 28px rgba(0,0,0,.18)",
        transition:"transform .3s, box-shadow .3s",
      }}
      onMouseOver={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,.28)"; }}
      onMouseOut={e  => { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.18)";  }}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbUrl || undefined}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
      />

      {/* Gradient overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 45%)",
        pointerEvents:"none",
      }}/>

      {/* Instagram icon top-right */}
      <div style={{
        position:"absolute", top:12, right:12,
        width:32, height:32, borderRadius:8,
        background:"radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
      }}>
        <InstagramIcon />
      </div>

      {/* Play indicator */}
      {!playing && (
        <div style={{
          position:"absolute", inset:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          pointerEvents:"none",
        }}>
          <div style={{
            width:48, height:48, borderRadius:"50%",
            background:"rgba(255,255,255,.2)", backdropFilter:"blur(4px)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><polygon points="6,3 20,12 6,21"/></svg>
          </div>
        </div>
      )}

      {/* Mute toggle + title */}
      <div style={{ position:"absolute", bottom:12, left:12, right:12, display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:8 }}>
        {reel.title && (
          <div style={{
            fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:700, color:"#fff",
            lineHeight:1.4, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            textShadow:"0 1px 4px rgba(0,0,0,.5)",
          }}>{reel.title}</div>
        )}
        <button onClick={toggleMute} style={{
          flexShrink:0, width:28, height:28, borderRadius:"50%",
          background:"rgba(255,255,255,.2)", backdropFilter:"blur(4px)",
          border:"none", cursor:"pointer", color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12,
        }}>
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}

/* ── Reels Section ── */
function ReelsSection() {
  const [reels,   setReels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("/api/reels")
      .then(r => r.json())
      .then(j => { if (j.success) setReels(j.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reels.length === 0) return;
    let animId;
    let speed = 0.6; // px per frame
    const tick = () => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += speed;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    const pause = () => cancelAnimationFrame(animId);
    const resume = () => { animId = requestAnimationFrame(tick); };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
    };
  }, [reels]);

  // Show nothing if no reels
  if (!loading && reels.length === 0) return null;

  return (
    <div>
      {/* Label */}
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"20px" }}>
        <div style={{ width:"72px", height:"1px", backgroundColor:"#FF6500" }} />
        <span style={{ color:"#FF6500", fontSize:"13px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.8px", fontFamily:"'Manrope',sans-serif" }}>
          SOCIAL THAT FEELS HUMAN
        </span>
      </div>

      {/* Header */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:16, marginBottom:36 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,3vw,44px)", fontWeight:"800", color:"#0E0E0E", margin:0, lineHeight:1.2, letterSpacing:"-0.02em" }}>
          Follow Our Craft Journey
        </h2>
        <a href="https://www.instagram.com/riya_art_palace/" target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
            <InstagramIcon />
          </div>
          <span style={{ fontSize:18, color:"#0E0E0E", fontFamily:"'Manrope',sans-serif", fontWeight:500, letterSpacing:"-0.01em" }}>@riya_art_palace</span>
        </a>
      </div>

      {/* Reels row */}
      {loading ? (
        <div style={{ display:"flex", gap:16 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ flexShrink:0, width:220, aspectRatio:"9/16", borderRadius:18, background:"linear-gradient(110deg,#ede8e3 25%,#e4ddd6 50%,#ede8e3 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }}/>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display:"flex", gap:16,
            overflowX:"auto", paddingBottom:8,
            scrollbarWidth:"none", msOverflowStyle:"none",
            cursor:"grab",
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...reels, ...reels].map((reel, i) => (
            <ReelCard key={`${reel.id}-${i}`} reel={reel} />
          ))}
        </div>
      )}

      <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export default function SocialProof() {
  const scrollRef = useRef(null);
  const [writeOpen, setWriteOpen]   = useState(false);
  const [dbReviews, setDbReviews]   = useState([]);
  const [avgRating, setAvgRating]   = useState(4.8);
  const [loadingRev, setLoadingRev] = useState(true);

  // Fetch latest approved reviews (no productId = general fetch won't work,
  // so we use admin endpoint without auth — create a public endpoint for homepage)
  useEffect(() => {
    fetch("/api/reviews/homepage")
      .then(r => r.json())
      .then(j => {
        if (j.success && j.data.reviews?.length > 0) {
          setDbReviews(j.data.reviews);
          if (j.data.avgRating) setAvgRating(j.data.avgRating);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRev(false));
  }, []);

  const displayReviews = dbReviews.length > 0 ? dbReviews : STATIC_REVIEWS;

  return (
    <section
  style={{
    backgroundColor: "#F7F5F3",
    paddingTop: "30px",
    paddingBottom: "50px",
  }}
>
      <style>{`
        div::-webkit-scrollbar { display: none; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');

        .sp-outer {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: clamp(16px, 4vw, 40px);
          padding-right: clamp(16px, 4vw, 40px);
        }

        .sp-reviews-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 48px;
        }

        .sp-ratings-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }

        .sp-insta-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 48px;
        }

        .sp-gallery {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          overflow: hidden;
          border-radius: 12px;
        }

        .sp-gallery-img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        @media (max-width: 768px) {
          .sp-reviews-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sp-insta-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sp-gallery {
            grid-template-columns: repeat(3, 1fr);
            border-radius: 10px;
          }

          .sp-gallery-img {
            height: 130px;
          }

          .sp-gallery-item:nth-child(4),
          .sp-gallery-item:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .sp-gallery {
            grid-template-columns: repeat(2, 1fr);
          }

          .sp-gallery-img {
            height: 160px;
          }

          .sp-gallery-item:nth-child(4) {
            display: block;
          }

          .sp-gallery-item:nth-child(5) {
            display: none;
          }
        }
      `}</style>

      <div className="sp-outer">

        {/* ── Reviews ── */}
        <div style={{ marginBottom: "96px" }}>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "72px", height: "1px", backgroundColor: "#FF6500" }} />
            <span
  style={{
    color: "#FF6500",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontFamily: "'Manrope', sans-serif",
  }}
>
  CLIENT LOVE
</span>
          </div>

          {/* Header row */}
          <div className="sp-reviews-header">
           <h2
  style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(34px, 3vw, 44px)",
    fontWeight: "800",
    color: "#0E0E0E",
    margin: "0",
    lineHeight: "1.2",
    letterSpacing: "-0.02em",
  }}
>
  What Our Buyers Say
</h2>

            <div className="sp-ratings-row">
              <span
  style={{
    color: "#FF6500",
    fontWeight: "700",
    fontSize: "22px",
    fontFamily: "'Manrope', sans-serif",
    whiteSpace: "nowrap",
  }}
>
  {avgRating.toFixed(1)} Reviews ★★★★★
</span>

              {/* Google Logo */}
              <svg height="24" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.41V32h31.86c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.76.36 15.63 16.32.17 35.45.17c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.64.31z" fill="#4285F4"/>
              </svg>

              {/* Indiamart */}
              <Image
  src={indiamart}
  alt="IndiaMart"
  width={120}
  height={32}
  style={{
    width: "120px",
    height: "auto",
    objectFit: "contain",
  }}
/>
            </div>

            <button onClick={() => setWriteOpen(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "48px", minWidth: "170px", padding: "0 28px",
              borderRadius: "999px", backgroundColor: "#111", color: "#fff",
              fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap",
              border: "none", cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.2px",
              transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background="#F85700"}
              onMouseLeave={e => e.currentTarget.style.background="#111"}
            >
              Write a Review &nbsp;→
            </button>
          </div>

          {/* Review Cards - horizontal scroll */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "12px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayReviews.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  flexShrink: "0",
                  width: "260px",
                  backgroundColor: "#fff",
                  border: "1px solid #E0D8D0",
                  borderRadius: "16px",
                  padding: "24px",
                  minHeight: "240px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ fontSize: "16px", letterSpacing: "3px", color: "#F85700", margin: "0 0 16px 0" }}>
                  {"★".repeat(item.rating || 5)}
                  <span style={{ color:"#E0D8D0" }}>{"★".repeat(5-(item.rating||5))}</span>
                </p>
                {item.title && (
                  <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:700, color:"#1a1a1a", margin:"0 0 8px 0" }}>{item.title}</p>
                )}
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#555", flex: "1", margin: "0", fontFamily: "'Manrope', sans-serif" }}>
                  {item.body || item.text}
                </p>
                <div style={{ marginTop: "20px", paddingTop:"16px", borderTop:"1px solid #F0EDE9" }}>
                  <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:700, color:"#1a1a1a", margin:"0 0 2px" }}>
                    {item.userName || item.author || "Verified Buyer"}
                  </p>
                  {item.createdAt && (
                    <p style={{ fontSize:11, color:"#bbb", margin:0 }}>
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { month:"short", year:"numeric" })}
                    </p>
                  )}
                  {item.adminReply && (
                    <div style={{ marginTop:10, background:"#FFF9F6", border:"1px solid #F85700", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700, color:"#F85700", marginBottom:3 }}>SELLER REPLY</div>
                      <div style={{ fontFamily:"'Manrope',sans-serif", fontSize:12, color:"#555", lineHeight:1.5 }}>{item.adminReply}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Modal */}
          {writeOpen && <WriteReviewModal onClose={() => setWriteOpen(false)} />}
        </div>

        {/* ── Reels / Instagram Section ── */}
        <ReelsSection />
      </div>
    </section>
  );
}