"use client";
import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Globe, ArrowRight, CheckCircle } from "lucide-react";

/* ── Data ── */
const countries    = ["India","United States","United Kingdom","Australia","Canada","Germany","France","UAE","Singapore","Other"];
const enquiryTypes = ["Wholesale / Bulk Order","Retail Order","Custom Design","OEM / Private Label","General Enquiry"];
const quantities   = ["Less than 100 units","100 – 500 units","500 – 1000 units","1000 – 5000 units","5000+ units"];
const categoryList = ["Wall Décor","Table Décor","Lac Collection","Event Décor","Festive Collection","Rajasthani Traditional","Handmade Accessories","Spiritual Items","Handpainted Articles","Diary Collection","Christmas Items","Ottomans & Puffs","Other"];
const toggleOpts   = ["Yes","No","Not Sure"];

const INP = { width:"100%", padding:"12px 15px", border:"1.5px solid #e8d5c8", borderRadius:10, background:"#fff", fontFamily:"Manrope,sans-serif", fontSize:13, color:"#1a1a1a", outline:"none", boxSizing:"border-box" };
const LBL = { fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:700, color:"#555", marginBottom:5, display:"block" };

function Toggle({ value, onChange }) {
  return (
    <div style={{ display:"flex", gap:8 }}>
      {toggleOpts.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)} style={{
          padding:"8px 18px", borderRadius:999, fontFamily:"Manrope,sans-serif",
          fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s",
          border: value===o ? "2px solid #F85700" : "1.5px solid #ddd",
          background: value===o ? "#F85700" : "#fff",
          color: value===o ? "#fff" : "#888",
        }}>{o}</button>
      ))}
    </div>
  );
}

function Select({ value, onChange, placeholder, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => setOpen(p => !p)} style={{ ...INP, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
        <span style={{ color: value ? "#1a1a1a" : "#b0a098" }}>{value || placeholder}</span>
        <span style={{ fontSize:10, color:"#aaa", display:"inline-block", transition:"transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#fff", border:"1px solid #e8d5c8", borderRadius:10, boxShadow:"0 12px 32px rgba(0,0,0,.12)", zIndex:9999, overflow:"hidden", maxHeight:220, overflowY:"auto" }}>
          {options.map(item => (
            <div key={item} onClick={() => { onChange(item); setOpen(false); }} style={{ padding:"10px 15px", cursor:"pointer", fontSize:13, fontFamily:"Manrope,sans-serif", color:"#1a1a1a", transition:"background .1s" }}
              onMouseEnter={e => e.currentTarget.style.background="#fce8dc"}
              onMouseLeave={e => e.currentTarget.style.background="#fff"}
            >{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Enquiry Form ── */
function EnquiryForm({ type }) {
  const emptyForm = { companyName:"", contactName:"", email:"", country:"", phone:"", enquiryType:"", quantity:"", category:"", customisation:"Yes", packaging:"Yes", message:"" };
  const [form, setForm]         = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const set      = k => v => setForm(f => ({ ...f, [k]: v }));
  const setInput = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.companyName.trim()) { setError("Company name is required"); return; }
    if (!form.contactName.trim()) { setError("Contact person name is required"); return; }
    if (!form.email.trim())       { setError("Business email is required"); return; }
    if (!form.phone.trim())       { setError("Phone / WhatsApp is required"); return; }
    setSubmitting(true);
    try {
      const res  = await fetch("/api/enquiry", { method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ type, companyName:form.companyName, contactName:form.contactName,
          businessEmail:form.email, country:form.country || (type==="india"?"India":""), phone:form.phone,
          enquiryType:form.enquiryType, orderQty:form.quantity, productCategory:form.category,
          customisation:form.customisation, packaging:form.packaging, message:form.message }),
      });
      const json = await res.json();
      if (json.success) { setSuccess(true); setForm(emptyForm); }
      else setError(json.message || "Something went wrong.");
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (success) return (
    <div style={{ textAlign:"center", padding:"48px 20px", background:"#F0FDF4", borderRadius:16, border:"1.5px solid #86EFAC", margin:"8px 0" }}>
      <div style={{ fontSize:52, marginBottom:12 }}><CheckCircle size={52} color="#15803D" strokeWidth={1.5} /></div>
      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:18, fontWeight:800, color:"#15803D", marginBottom:8 }}>Enquiry Submitted!</div>
      <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#166534", marginBottom:24 }}>Our team will get back to you within 24 hours.</div>
      <button onClick={() => setSuccess(false)} style={{ background:"#15803D", color:"#fff", border:"none", borderRadius:999, padding:"10px 28px", fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>
        Submit Another Enquiry
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 20px" }} className="enq-form-grid">

        <div><label style={LBL}>Company Name <span style={{ color:"#F85700" }}>*</span></label>
          <input type="text" placeholder="Your registered business name" value={form.companyName} onChange={setInput("companyName")} style={INP} /></div>

        <div><label style={LBL}>Contact Person Name <span style={{ color:"#F85700" }}>*</span></label>
          <input type="text" placeholder="Your full name" value={form.contactName} onChange={setInput("contactName")} style={INP} /></div>

        <div><label style={LBL}>Business Email <span style={{ color:"#F85700" }}>*</span></label>
          <input type="email" placeholder="Your business email" value={form.email} onChange={setInput("email")} style={INP} /></div>

        {type === "export" ? (
          <div><label style={LBL}>Country <span style={{ color:"#F85700" }}>*</span></label>
            <Select value={form.country} onChange={set("country")} placeholder="Select your country" options={countries.filter(c => c !== "India")} /></div>
        ) : (
          <div><label style={LBL}>City / State</label>
            <input type="text" placeholder="e.g. Mumbai, Maharashtra" value={form.country} onChange={setInput("country")} style={INP} /></div>
        )}

        <div><label style={LBL}>Phone / WhatsApp <span style={{ color:"#F85700" }}>*</span></label>
          <input type="tel" placeholder="Enter your Phone / WhatsApp" value={form.phone} onChange={setInput("phone")} style={INP} /></div>

        <div><label style={LBL}>Type of Enquiry</label>
          <Select value={form.enquiryType} onChange={set("enquiryType")} placeholder="Select Type of Enquiry" options={enquiryTypes} /></div>

        <div><label style={LBL}>Estimated Order Quantity</label>
          <Select value={form.quantity} onChange={set("quantity")} placeholder="Select Estimated Quantity" options={quantities} /></div>

        <div><label style={LBL}>Product Category Interested In</label>
          <Select value={form.category} onChange={set("category")} placeholder="Select Product Category" options={categoryList} /></div>

        <div><label style={LBL}>Do you require customisation?</label>
          <Toggle value={form.customisation} onChange={set("customisation")} /></div>

        <div><label style={LBL}>Custom packaging or branding?</label>
          <Toggle value={form.packaging} onChange={set("packaging")} /></div>

        <div style={{ gridColumn:"1 / -1" }}>
          <label style={LBL}>Message</label>
          <textarea placeholder="Share design references, market preferences, timelines, or any special requirements" value={form.message} onChange={setInput("message")} rows={4}
            style={{ ...INP, resize:"vertical", minHeight:90 }} />
        </div>

      </div>

      {error && <div style={{ marginTop:14, background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:10, padding:"10px 16px", fontFamily:"Manrope,sans-serif", fontSize:12, color:"#991B1B" }}>{error}</div>}

      <div style={{ display:"flex", justifyContent:"center", marginTop:24 }}>
        <button type="button" onClick={handleSubmit} disabled={submitting} style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background: submitting ? "#ccc" : "#F85700", color:"#fff", border:"none", borderRadius:999,
          padding:"16px 44px", fontFamily:"Manrope,sans-serif", fontSize:15, fontWeight:800,
          cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: submitting ? "none" : "0 8px 20px rgba(248,87,0,.3)",
          transition:"all .2s",
        }}
          onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 28px rgba(248,87,0,.35)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(248,87,0,.3)"; }}
        >
          {submitting ? "Submitting…" : "Submit Enquiry"}
          {!submitting && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Modal ── */
function EnquiryModal({ open, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab || "export");
  const overlayRef   = useRef(null);

  useEffect(() => { setTab(initialTab || "export"); }, [initialTab, open]);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(14,14,14,.55)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"enqFadeIn .2s ease" }}>

      <style>{`
        @keyframes enqFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes enqSlideUp { from{opacity:0;transform:translateY(28px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        .enq-scroll::-webkit-scrollbar { width:5px; }
        .enq-scroll::-webkit-scrollbar-thumb { background:#e8d0c0; border-radius:4px; }
        .enq-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px 20px; }
        @media(max-width:600px){ .enq-form-grid{ grid-template-columns:1fr !important; } }
        input::placeholder, textarea::placeholder { color:#b0a098; }
      `}</style>

      <div className="enq-scroll" style={{
        background:"#fce8dc", borderRadius:24, width:"100%", maxWidth:780,
        maxHeight:"92vh", overflowY:"auto",
        boxShadow:"0 40px 100px rgba(0,0,0,.25)",
        animation:"enqSlideUp .35s cubic-bezier(.16,1,.3,1)",
      }}>

        {/* Tabs header */}
        <div style={{
          position:"sticky", top:0, zIndex:5,
          background:"#fce8dc", borderRadius:"24px 24px 0 0",
          borderBottom:"1px solid #e8d0c0",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 28px",
        }}>
          <div style={{ display:"flex", gap:0 }}>
            {[
              { key:"export", label:"Export Enquiry" },
              { key:"india",  label:"India Enquiry" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:"18px 20px", border:"none", background:"none",
                fontFamily:"Manrope,sans-serif", fontSize:14, fontWeight:700,
                color: tab===t.key ? "#F85700" : "#888", cursor:"pointer",
                position:"relative", transition:"color .2s",
                borderBottom: tab===t.key ? "2.5px solid #F85700" : "2.5px solid transparent",
              }}>{t.label}</button>
            ))}
          </div>
          <button onClick={onClose} style={{
            width:36, height:36, border:"none", borderRadius:"50%", background:"rgba(0,0,0,.08)",
            cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
            color:"#555", transition:"background .15s", flexShrink:0,
          }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,.15)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,.08)"}
          >✕</button>
        </div>

        {/* Form title */}
        <div style={{ textAlign:"center", padding:"28px 28px 20px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:"#1a1a1a", margin:0 }}>
            Product Enquiry – Riya Art Palace
          </h2>
          <p style={{ fontFamily:"Manrope,sans-serif", fontSize:13, color:"#888", marginTop:6, marginBottom:0 }}>
            {tab === "export"
              ? "For international wholesale, import & export enquiries"
              : "For domestic bulk orders, retail & custom requirements"}
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding:"0 28px 32px" }}>
          <EnquiryForm key={tab} type={tab} />
        </div>

      </div>
    </div>
  );
}

/* ── Stats ── */
const stats = [
  { num:"30+",  label:"Years of Craft" },
  { num:"40+",  label:"Countries Served" },
  { num:"500+", label:"Unique Products" },
  { num:"24h",  label:"Response Time" },
];

/* ── Main Section ── */
export default function EnquirySection() {
  const [modal, setModal]         = useState({ open:false, tab:"export" });
  const openModal = tab => setModal({ open:true, tab });

  return (
    <section style={{ background:"#F7F5F3", padding:"64px clamp(16px,5vw,64px)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        .enq-export-btn {
          display:inline-flex; align-items:center; gap:10px;
          background:#F85700; color:#fff; border:none; border-radius:999px;
          padding:15px 32px; font-family:'Manrope',sans-serif;
          font-size:14px; font-weight:800; cursor:pointer;
          box-shadow:0 8px 22px rgba(248,87,0,.28);
          transition:all .2s;
        }
        .enq-export-btn:hover { transform:translateY(-2px); box-shadow:0 14px 30px rgba(248,87,0,.35); background:#e84f00; }
        .enq-india-btn {
          display:inline-flex; align-items:center; gap:10px;
          background:#fff; color:#1a1a1a; border:2px solid #1a1a1a; border-radius:999px;
          padding:13px 28px; font-family:'Manrope',sans-serif;
          font-size:14px; font-weight:800; cursor:pointer;
          transition:all .2s;
        }
        .enq-india-btn:hover { background:#1a1a1a; color:#fff; transform:translateY(-2px); }
        .enq-stat-num { font-family:'Playfair Display',serif; font-size:clamp(26px,3vw,38px); font-weight:800; color:#F85700; line-height:1; margin-bottom:4px; }
        .enq-stat-lbl { font-family:'Manrope',sans-serif; font-size:11px; font-weight:700; color:#999; text-transform:uppercase; letter-spacing:.07em; }
        @media(max-width:768px){
          .enq-top { flex-direction:column!important; }
          .enq-contact-card { width:100%!important; min-width:unset!important; }
          .enq-stats-row { grid-template-columns:1fr 1fr!important; }
        }
      `}</style>

      <div style={{ maxWidth:1280, margin:"0 auto" }}>

        {/* Top */}
        <div className="enq-top" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:40, marginBottom:40, flexWrap:"wrap" }}>

          {/* Left */}
          <div style={{ maxWidth:560, flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#F85700", marginBottom:14 }}>
              <span style={{ width:40, height:2, background:"#F85700", display:"block", flexShrink:0 }} />
              Reach Out
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,46px)", fontWeight:800, color:"#1a1a1a", lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-0.02em" }}>
              Let's Build Something<br />
              <span style={{ color:"#F85700" }}>Beautiful Together</span>
            </h2>
            <p style={{ fontFamily:"Manrope,sans-serif", fontSize:15, color:"#666", lineHeight:1.7, margin:"0 0 28px" }}>
              One of Jaipur's foremost manufacturers &amp; exporters of traditional handicrafts.
              Since 1995, trusted by wholesalers, retail chains &amp; interior brands across 40+ countries.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="enq-export-btn" onClick={() => openModal("export")}>
                <Globe size={16} strokeWidth={2.5} />
                Export Enquiry
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
              <button className="enq-india-btn" onClick={() => openModal("india")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="4" fill="#FF9933"/>
                  <rect x="2" y="10" width="20" height="4" fill="#FFFFFF"/>
                  <rect x="2" y="14" width="20" height="4" fill="#138808"/>
                  <circle cx="12" cy="12" r="1.8" fill="#000080"/>
                </svg>
                India Enquiry
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right — contact card */}
          <div className="enq-contact-card" style={{ background:"#fff", border:"1.5px solid #E8E2DC", borderRadius:16, padding:"20px 24px", minWidth:260, flexShrink:0 }}>
            {[
              { icon:<MapPin size={15} color="#F85700" strokeWidth={2}/>,  label:"Address",       val:"C 143, NEW LOHA MANDI, MACHEDA, Jaipur, Rajasthan – 302013." },
              { icon:<Phone size={15} color="#F85700" strokeWidth={2}/>,   label:"Phone",         val:"+91-8385007350" },
              { icon:<Mail size={15} color="#F85700" strokeWidth={2}/>,    label:"Email",         val:"riya_art_palace@yahoo.com" },
              { icon:<Clock size={15} color="#F85700" strokeWidth={2}/>,   label:"Response Time", val:"Within 24 hours" },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0" }}>
                  <span style={{ flexShrink:0, marginTop:2 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily:"Manrope,sans-serif", fontSize:10, fontWeight:700, color:"#bbb", textTransform:"uppercase", letterSpacing:".06em", marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontFamily:"Manrope,sans-serif", fontSize:12.5, color:"#444", lineHeight:1.5 }}>{item.val}</div>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height:1, background:"#F5F0EC" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        {/* <div className="enq-stats-row" style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          background:"#fff", border:"1.5px solid #E8E2DC",
          borderRadius:16, overflow:"hidden",
        }}>
          {stats.map((s, i) => (
            <div key={s.num} style={{
              padding:"22px 0", textAlign:"center",
              borderLeft: i > 0 ? "1px solid #F0EDE9" : "none",
            }}>
              <div className="enq-stat-num">{s.num}</div>
              <div className="enq-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div> */}

      </div>

      <EnquiryModal
        open={modal.open}
        initialTab={modal.tab}
        onClose={() => setModal(m => ({ ...m, open:false }))}
      />
    </section>
  );
}
