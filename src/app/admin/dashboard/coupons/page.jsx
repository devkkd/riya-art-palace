"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Tag, Plus, X } from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

/* ── helpers ──────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function discountLabel(c) {
  switch (c.couponType) {
    case "percentage":   return `${c.discountValue}% off`;
    case "flat":         return `₹${c.discountValue} off`;
    case "free_shipping":return "Free Shipping";
    case "bxgy":         return `Spend ₹${c.minOrderAmount} → ${c.discountValue}% off`;
    case "first_order":
      return c.firstOrderDiscountKind === "flat"
        ? `₹${c.discountValue} off (1st order)`
        : `${c.discountValue}% off (1st order)`;
    default:             return "—";
  }
}

const TYPE_META = {
  percentage:   { label: "Percentage Off",     icon: "％", color: "#EDE9FE", text: "#5B21B6", desc: "Give a % discount off the order subtotal" },
  flat:         { label: "Flat Amount Off",     icon: "₹",  color: "#DBEAFE", text: "#1E40AF", desc: "Deduct a fixed ₹ amount from the total" },
  free_shipping:{ label: "Free Shipping",       icon: "🚚", color: "#D1FAE5", text: "#065F46", desc: "Waive the shipping charge completely" },
  bxgy:         { label: "Buy X Get Y% Off",    icon: "🎁",  color: "#FEF3C7", text: "#92400E", desc: "Spend a minimum → unlock a % discount" },
  first_order:  { label: "First Order Discount",icon: "🌟", color: "#FCE7F3", text: "#9D174D", desc: "Only valid on a user's very first order" },
};

const BLANK = {
  code: "", description: "",
  couponType: "percentage",
  discountValue: "",
  firstOrderDiscountKind: "percentage",
  minOrderAmount: "",
  maxDiscount: "",
  validFrom: "",
  validUntil: "",
  usageLimit: "",
  onePerUser: true,
  isActive: true,
};

/* ── main component ───────────────────────────────────────── */
export default function AdminCouponsPage() {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [saving,   setSaving]   = useState(false);

  /* fetch */
  const fetchCoupons = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/coupons");
      const json = await res.json();
      if (json.success) setCoupons(json.data);
      else setError(json.message || "Failed");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchCoupons(); }, []);

  /* open create */
  const openCreate = () => { setEditing(null); setForm(BLANK); setShowForm(true); setError(""); };

  /* open edit */
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({
      code:                   c.code,
      description:            c.description || "",
      couponType:             c.couponType,
      discountValue:          c.discountValue ? String(c.discountValue) : "",
      firstOrderDiscountKind: c.firstOrderDiscountKind || "percentage",
      minOrderAmount:         c.minOrderAmount ? String(c.minOrderAmount) : "",
      maxDiscount:            c.maxDiscount   ? String(c.maxDiscount)    : "",
      validFrom:              c.validFrom  ? c.validFrom.slice(0,10)  : "",
      validUntil:             c.validUntil ? c.validUntil.slice(0,10) : "",
      usageLimit:             c.usageLimit ? String(c.usageLimit) : "",
      onePerUser:             c.onePerUser,
      isActive:               c.isActive,
    });
    setShowForm(true); setError("");
  };

  /* save */
  const handleSave = async () => {
    setError("");
    if (!form.code.trim()) { setError("Code is required"); return; }
    if (form.couponType !== "free_shipping" && !form.discountValue) {
      setError("Discount value is required for this type"); return;
    }
    setSaving(true);
    try {
      const body = {
        code:                   form.code.trim().toUpperCase(),
        description:            form.description,
        couponType:             form.couponType,
        discountValue:          Number(form.discountValue) || 0,
        firstOrderDiscountKind: form.firstOrderDiscountKind,
        minOrderAmount:         Number(form.minOrderAmount) || 0,
        maxDiscount:            form.maxDiscount ? Number(form.maxDiscount) : null,
        validFrom:              form.validFrom  || null,
        validUntil:             form.validUntil || null,
        usageLimit:             form.usageLimit ? Number(form.usageLimit) : null,
        onePerUser:             form.onePerUser,
        isActive:               form.isActive,
      };
      const url    = editing ? `/api/coupons/${editing}` : "/api/coupons";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const json   = await res.json();
      if (json.success) {
        setSuccess(editing ? "Coupon updated" : "Coupon created");
        setShowForm(false); fetchCoupons();
        setTimeout(() => setSuccess(""), 3000);
      } else setError(json.message || "Failed");
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method:"DELETE" });
    fetchCoupons();
    setSuccess("Deleted"); setTimeout(() => setSuccess(""), 3000);
  };

  const toggleActive = async (c) => {
    await fetch(`/api/coupons/${c.id}`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    fetchCoupons();
  };

  const sf  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const inp = { className:"adm-form-input" };

  const needsDiscountValue = form.couponType !== "free_shipping";
  const needsMaxCap        = ["percentage","bxgy","first_order"].includes(form.couponType) && form.firstOrderDiscountKind !== "flat";
  const needsMinOrder      = ["bxgy","percentage","flat","first_order"].includes(form.couponType);
  const needsFOKind        = form.couponType === "first_order";

  return (
    <AdminShell>
      {/* ── Header ── */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:24, fontWeight:700 }}>Coupons</h2>
          <p style={{ fontSize:13, color:"var(--adm-muted)", marginTop:2 }}>{coupons.length} total coupons</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="adm-btn" onClick={fetchCoupons}><RefreshCw size={14}/> Refresh</button>
          <button className="adm-btn adm-btn-primary" onClick={openCreate}><Plus size={14}/> New Coupon</button>
        </div>
      </div>

      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom:16 }}>{error}</div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom:16 }}>{success}</div>}

      {/* ── Create / Edit Modal ── */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px", overflowY:"auto" }}>
          <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:680, padding:0, boxShadow:"0 24px 60px rgba(0,0,0,0.18)" }}>

            {/* Modal header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 28px", borderBottom:"1px solid #E0D9D1" }}>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:18, fontWeight:700 }}>{editing?"Edit":"Create"} Coupon</h3>
              <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#555", display:"flex" }}><X size={20}/></button>
            </div>

            <div style={{ padding:"24px 28px" }}>

              {/* ── Step 1: Type picker ── */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:12 }}>
                  Coupon Type
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
                  {Object.entries(TYPE_META).map(([type, meta]) => (
                    <button key={type} type="button"
                      onClick={() => setForm(f => ({ ...f, couponType: type }))}
                      style={{
                        border: `2px solid ${form.couponType===type ? meta.text : "#E0D9D1"}`,
                        borderRadius: 12, padding:"14px 8px", cursor:"pointer", textAlign:"center",
                        background: form.couponType===type ? meta.color : "#FAFAFA",
                        transition:"all .15s",
                      }}>
                      <div style={{ fontSize:22, marginBottom:6 }}>{meta.icon}</div>
                      <div style={{ fontSize:11, fontWeight:700, color: form.couponType===type ? meta.text : "#555", lineHeight:1.3 }}>{meta.label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:10, padding:"10px 14px", background: TYPE_META[form.couponType].color, borderRadius:8, fontSize:13, color: TYPE_META[form.couponType].text, fontWeight:500 }}>
                  💡 {TYPE_META[form.couponType].desc}
                </div>
              </div>

              {/* ── Fields ── */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

                {/* Code */}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Coupon Code *</label>
                  <input {...inp} value={form.code} onChange={sf("code")} placeholder="e.g. SAVE20"
                    style={{ textTransform:"uppercase", width:"100%" }} disabled={!!editing}/>
                  {editing && <div style={{ fontSize:11, color:"var(--adm-muted)", marginTop:4 }}>Code cannot be changed after creation</div>}
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Description</label>
                  <input {...inp} value={form.description} onChange={sf("description")} placeholder="Shown to customer" style={{ width:"100%" }}/>
                </div>

                {/* First order discount kind */}
                {needsFOKind && (
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Discount Kind *</label>
                    <select className="adm-form-select" value={form.firstOrderDiscountKind}
                      onChange={sf("firstOrderDiscountKind")} style={{ width:"100%" }}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                )}

                {/* Discount value */}
                {needsDiscountValue && (
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>
                      {form.couponType === "flat" || (form.couponType === "first_order" && form.firstOrderDiscountKind === "flat")
                        ? "Discount Amount (₹) *"
                        : "Discount (%) *"}
                    </label>
                    <input {...inp} type="number" min="0"
                      value={form.discountValue} onChange={sf("discountValue")}
                      placeholder={form.couponType === "flat" ? "e.g. 100" : "e.g. 20"}
                      style={{ width:"100%" }}/>
                  </div>
                )}

                {/* Min order amount */}
                {needsMinOrder && (
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>
                      {form.couponType === "bxgy" ? "Min Spend to Unlock (₹) *" : "Minimum Order Amount (₹)"}
                    </label>
                    <input {...inp} type="number" min="0"
                      value={form.minOrderAmount} onChange={sf("minOrderAmount")}
                      placeholder="e.g. 500" style={{ width:"100%" }}/>
                  </div>
                )}

                {/* Max discount cap */}
                {needsMaxCap && (
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Max Discount Cap (₹)</label>
                    <input {...inp} type="number" min="0"
                      value={form.maxDiscount} onChange={sf("maxDiscount")}
                      placeholder="Leave blank = no cap" style={{ width:"100%" }}/>
                  </div>
                )}

                {/* Valid from */}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Valid From</label>
                  <input {...inp} type="date" value={form.validFrom} onChange={sf("validFrom")} style={{ width:"100%" }}/>
                </div>

                {/* Valid until */}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Valid Until</label>
                  <input {...inp} type="date" value={form.validUntil} onChange={sf("validUntil")} style={{ width:"100%" }}/>
                </div>

                {/* Usage limit */}
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"var(--adm-muted)", textTransform:"uppercase", display:"block", marginBottom:6 }}>Total Usage Limit</label>
                  <input {...inp} type="number" min="1"
                    value={form.usageLimit} onChange={sf("usageLimit")}
                    placeholder="Leave blank = unlimited" style={{ width:"100%" }}/>
                </div>

              </div>

              {/* Checkboxes */}
              <div style={{ display:"flex", gap:24, marginBottom:24, padding:"14px 16px", background:"#F7F5F3", borderRadius:10 }}>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.onePerUser}
                    onChange={e => setForm(f=>({...f,onePerUser:e.target.checked}))}
                    style={{ accentColor:"#F85700", width:16, height:16 }}/>
                  <div><div style={{ fontWeight:600 }}>One per user</div><div style={{ fontSize:11, color:"var(--adm-muted)" }}>Each customer can use this only once</div></div>
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.isActive}
                    onChange={e => setForm(f=>({...f,isActive:e.target.checked}))}
                    style={{ accentColor:"#F85700", width:16, height:16 }}/>
                  <div><div style={{ fontWeight:600 }}>Active</div><div style={{ fontSize:11, color:"var(--adm-muted)" }}>Coupon is visible and redeemable</div></div>
                </label>
              </div>

              {error && <div className="adm-alert adm-alert-danger" style={{ marginBottom:16 }}>{error}</div>}

              {/* Actions */}
              <div style={{ display:"flex", gap:10 }}>
                <button className="adm-btn adm-btn-primary" disabled={saving} onClick={handleSave} style={{ flex:1 }}>
                  {saving ? "Saving…" : editing ? "Update Coupon" : "Create Coupon"}
                </button>
                <button className="adm-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:48 }}><div className="adm-loading-spinner"/></div>
      ) : coupons.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><Tag size={40}/></div>
          <div className="adm-empty-state-title">No coupons yet</div>
          <div className="adm-empty-state-desc">Create your first coupon to start offering discounts.</div>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr><th>Code</th><th>Type</th><th>Discount</th><th>Min Order</th><th>Used</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {coupons.map(c => {
                  const meta = TYPE_META[c.couponType] || TYPE_META.percentage;
                  return (
                    <tr key={c.id}>
                      <td><span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13, letterSpacing:"0.04em" }}>{c.code}</span></td>
                      <td>
                        <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:meta.color, color:meta.text }}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td style={{ fontWeight:700, fontSize:13 }}>{discountLabel(c)}</td>
                      <td style={{ fontSize:12, color:"var(--adm-muted)" }}>{c.minOrderAmount ? `₹${c.minOrderAmount}` : "—"}</td>
                      <td style={{ fontSize:12 }}>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                      <td style={{ fontSize:12, color:"var(--adm-muted)" }}>{fmtDate(c.validUntil)}</td>
                      <td>
                        <button onClick={() => toggleActive(c)} style={{
                          padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, border:"none", cursor:"pointer",
                          background: c.isActive ? "#D1FAE5" : "#FEE2E2",
                          color:      c.isActive ? "#065F46" : "#991B1B",
                        }}>{c.isActive ? "Active" : "Inactive"}</button>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          <button className="adm-btn" style={{ padding:"5px 12px", fontSize:12 }} onClick={() => openEdit(c)}>Edit</button>
                          <button className="adm-btn" style={{ padding:"5px 12px", fontSize:12, color:"#e53e3e", borderColor:"#e53e3e" }} onClick={() => handleDelete(c.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
