"use client";
import { useState } from "react";
import logo from "../assets/logo.png";
import indiamartLogo from "../assets/indiamart.png";
import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "./CatalogContext";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

const company = [
  { name: "About Us",           href: "/about" },
  { name: "Contact Us",         href: "/contact" },
  { name: "Privacy Policy",     href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Refund Policy",      href: "/refund-policy" },
  { name: "Shipping Policy",    href: "/shipping-policy" },
];

const socials = [
  { label: "WhatsApp",  href: "https://wa.me/918047635730", icon: "💬" },
  { label: "Instagram", href: "#",                          icon: "📸" },
  { label: "Facebook",  href: "#",                          icon: "📘" },
];

function CategoryCol({ category }) {
  const [open, setOpen] = useState(false);
  const subs = category.subcategories || [];

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: "relative" }}
    >
      <Link
        href={`/products?category=${encodeURIComponent(category.slug)}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 10px", borderRadius: 8,
          background: open ? "rgba(255,255,255,.65)" : "transparent",
          fontSize: 13, fontWeight: 700,
         fontfamily: "'Mona Sans', serif",
          // fontStyle: "italic",
          color: open ? "#F85700" : "#1a1a1a",
          textDecoration: "none",
          letterSpacing: "0.01em", lineHeight: 1.4,
          transition: "background .2s, color .2s",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}
      >
        {category.name}
        {subs.length > 0 && (
          <span style={{
            fontSize: 10, color: "#F85700",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .25s", display: "inline-block",
            flexShrink: 0,
          }}>▾</span>
        )}
      </Link>

      {subs.length > 0 && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 180, background: "#fff",
          border: "1px solid #e8d0c0", borderRadius: 10,
          boxShadow: "0 12px 32px rgba(60,35,20,.13)",
          padding: "6px", margin: 0, listStyle: "none", zIndex: 20,
          opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden",
          transform: open ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity .2s, transform .2s, visibility .2s",
          pointerEvents: open ? "auto" : "none",
        }}>
          {subs.map(sub => (
            <li key={sub.id || sub.name}>
              <Link
                href={`/products?category=${encodeURIComponent(category.slug)}&subcategory=${encodeURIComponent(sub.slug || sub.name)}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: 7,
                  fontSize: 12, color: "#555", textDecoration: "none",
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="#fce8dc"; e.currentTarget.style.color="#F85700"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#555"; }}
              >
                {sub.name}
                <span style={{ fontSize: 10, color: "#F85700", opacity: .6 }}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail]           = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { categories, subcategories, loading } = useCatalog();

  const footerCats = categories.map(cat => ({
    ...cat,
    subcategories: subcategories.filter(s => s.category === cat.id),
  }));

  return (
    <footer style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .ft-w { max-width:1280px; margin:0 auto; padding:0 clamp(16px,4vw,56px); }

        /* Newsletter */
        .ft-nl { background:#e87500; padding:22px clamp(16px,4vw,56px); }
        .ft-nl-in { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
        .ft-nl-title { font-size:17px; font-weight:800; color:#fff; margin:0 0 2px; }
        .ft-nl-sub { font-size:12px; color:rgba(255,255,255,.75); margin:0; }
        .ft-nl-form { display:flex; gap:8px; flex-shrink:0; flex-wrap:wrap; }
        .ft-nl-inp { height:40px; padding:0 14px; border:1.5px solid rgba(255,255,255,.4); border-radius:8px; background:#e87500; color:#fff; font-family:'Manrope',sans-serif; font-size:13px; outline:none; min-width:210px; }
        .ft-nl-inp::placeholder { color:rgba(255,255,255,.6); }
        .ft-nl-inp:focus { border-color:#fff; background:#e87500; }
        .ft-nl-btn { height:40px; padding:0 20px; border:2px solid #fff; border-radius:8px; background:#fff; color:#F85700; font-family:'Manrope',sans-serif; font-size:13px; font-weight:800; cursor:pointer; white-space:nowrap; transition:all .15s; }
        .ft-nl-btn:hover { background:#1a1a1a; border-color:#1a1a1a; color:#fff; }

        /* Main */
        .ft-main { background:#FDF4EE; border-top:1px solid #e8d0c0; padding:36px clamp(16px,4vw,56px) 30px; }
        .ft-grid { max-width:1280px; margin:0 auto; display:grid; grid-template-columns:220px 1fr; gap:48px; align-items:start; }

        /* Brand */
        .ft-tagline { font-size:13px; font-weight:700; color:#1a1a1a; margin:8px 0 5px; font-style:italic; }
        .ft-desc { font-size:12px; color:#888; line-height:1.65; margin:0 0 14px; }
        .ft-ci { display:flex; align-items:flex-start; gap:8px; margin-bottom:9px; }
        .ft-ci-val { font-size:11.5px; color:#777; line-height:1.5; }
        .ft-ci-val a { color:#777; text-decoration:none; }
        .ft-ci-val a:hover { color:#F85700; }
        .ft-socials { display:flex; gap:6px; margin-top:14px; flex-wrap:wrap; }
        .ft-soc { display:flex; align-items:center; gap:4px; height:30px; padding:0 10px; border:1.5px solid #e8d0c0; border-radius:7px; background:#fff; font-family:'Manrope',sans-serif; font-size:11.5px; font-weight:600; color:#666; text-decoration:none; transition:all .15s; }
        .ft-soc:hover { border-color:#F85700; color:#F85700; background:#FFF9F6; }
        .ft-im { display:inline-flex; align-items:center; background:#fff; border:1px solid #e8d0c0; border-radius:7px; padding:4px 9px; margin-bottom:5px; cursor:pointer; transition:border-color .15s; }
        .ft-im:hover { border-color:#F85700; }
        .ft-im-lnk { display:block; font-size:11px; color:#F85700; font-weight:700; margin-bottom:14px; text-decoration:none; }
        .ft-im-lnk:hover { text-decoration:underline; }

        /* Cats grid */
        .ft-cats { display:grid; grid-template-columns:repeat(4,1fr); gap:4px 12px; align-items:stretch; }
        .ft-cat-item {
          display:block; min-height:40px;
        }
        .ft-company-row { margin-top:24px; padding-top:20px; border-top:1px solid #e8d0c0; display:grid; grid-template-columns:repeat(4,1fr); gap:4px 12px; }

        /* Company col */
        .ft-co-head { font-size:11px; font-weight:800; color:#1a1a1a;fontfamily: "'Mona Sans', serif"; letter-spacing:.07em; margin-bottom:10px; padding:8px 10px 0; }
        .ft-co-list { list-style:none; padding:0; margin:0; }
        .ft-co-list li { margin-bottom:7px; padding:0 10px; }
        .ft-co-link { font-size:12px; color:#888; text-decoration:none; transition:color .15s; }
        .ft-co-link:hover { color:#F85700; }

        /* Bottom */
        .ft-bot { background:#f5e8dc; border-top:1px solid #e8d0c0; padding:12px clamp(16px,4vw,56px); }
        .ft-bot-in { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
        .ft-copy { font-size:11px; color:#aaa; margin:0; }
        .ft-copy a { color:#F85700; font-weight:700; text-decoration:none; }
        .ft-copy a:hover { text-decoration:underline; }
        .ft-tags { display:flex; gap:6px; flex-wrap:wrap; }
        .ft-tag { font-size:10px; font-weight:600; color:#bbb; border:1px solid #ddd; border-radius:5px; padding:2px 8px; background:#fff; }

        @media(max-width:1100px){ .ft-cats{grid-template-columns:repeat(3,1fr);} } @media(max-width:900px){ .ft-grid{grid-template-columns:1fr;gap:28px;} .ft-cats{grid-template-columns:repeat(4,1fr);} }
        @media(max-width:600px){ .ft-nl-in{flex-direction:column;align-items:flex-start;} .ft-nl-form{width:100%;} .ft-nl-inp{min-width:0;flex:1;} .ft-cats{grid-template-columns:repeat(2,1fr);} .ft-bot-in{flex-direction:column;align-items:flex-start;} }
      `}</style>

      {/* Newsletter */}
      {/* <div className="ft-nl">
        <div className="ft-nl-in">
          <div>
            <p className="ft-nl-title">Join the Riya Art Palace Circle</p>
            <p className="ft-nl-sub">New arrivals, B2B offers &amp; handicraft stories in your inbox.</p>
          </div>
          {subscribed
            ? <p style={{ color:"#fff", fontWeight:700, fontSize:13 }}>✓ Subscribed! Thank you.</p>
            : (
              <form className="ft-nl-form" onSubmit={e => { e.preventDefault(); if(email.trim()){ setSubscribed(true); setEmail(""); }}}>
                <input type="email" className="ft-nl-inp" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="ft-nl-btn">Subscribe →</button>
              </form>
            )
          }
        </div>
      </div> */}

      {/* Main */}
      <div className="ft-main">
        <div className="ft-grid">

          {/* Brand + Contact */}
          <div>
            <Image src={logo} alt="Riya Art Palace" style={{ height:46, width:"auto", objectFit:"contain", display:"block" }} />
            <p className="ft-tagline">"Crafting Tradition for You"</p>
            <p className="ft-desc">Family-owned handicraft brand from Jaipur, Rajasthan. Authentic handmade creations since 1995.</p>

            <a href="#" className="ft-im">
              <Image src={indiamartLogo} alt="IndiaMart" width={95} height={28} style={{ objectFit:"contain", width:95, height:"auto" }} />
            </a>
            <a href="#" className="ft-im-lnk">Visit Our Indiamart Store →</a>

            <div className="ft-ci"><MapPin size={13} color="#F85700" strokeWidth={2} style={{flexShrink:0,marginTop:2}}/><span className="ft-ci-val">C 143, NEW LOHA MANDI, MACHEDA,<br/> Jaipur, Rajasthan – 302013</span></div>
            <div className="ft-ci"><Phone size={13} color="#F85700" strokeWidth={2} style={{flexShrink:0,marginTop:2}}/><span className="ft-ci-val"><a href="tel:+918047635730">+91-8385007350</a></span></div>
            <div className="ft-ci"><Mail size={13} color="#F85700" strokeWidth={2} style={{flexShrink:0,marginTop:2}}/><span className="ft-ci-val"><a href="mailto:riya_art_palace@yahoo.com">riya_art_palace@yahoo.com</a></span></div>
            <div className="ft-ci"><Building2 size={13} color="#F85700" strokeWidth={2} style={{flexShrink:0,marginTop:2}}/><span className="ft-ci-val">GST: 08AIBPM9441J1ZZ · Est. 1995</span></div>

            <div className="ft-socials">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ft-soc">
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories grid */}
          <div>
            <div className="ft-cats">
              {!loading && footerCats.map(cat => (
                <CategoryCol key={cat.id} category={cat} />
              ))}
            </div>

            {/* Company row — separate below categories */}
            <div className="ft-company-row">
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0 12px",
                  paddingTop: 4,
                }}>
                  <div>
                    <div className="ft-co-head">Company</div>
                    <ul className="ft-co-list">
                      {company.map(item => (
                        <li key={item.name}>
                          <Link href={item.href} className="ft-co-link">{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="ft-bot">
        <div className="ft-bot-in">
          <p className="ft-copy">
            © 2025 Riya Art Palace. All rights reserved. Crafted by{" "}
            <a href="https://www.kontentkraftdigital.com/" target="_blank" rel="noopener noreferrer">Kontent Kraft Digital</a>
          </p>
          <div className="ft-tags">
            <span className="ft-tag">🔒 Secure Payments</span>
            <span className="ft-tag">🚚 Pan India Shipping</span>
            <span className="ft-tag">⭐ Est. 1995</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
