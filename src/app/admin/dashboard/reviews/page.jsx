"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Star, Search, MessageCircle, Plus, X } from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";
import { useCatalog } from "@/app/components/CatalogContext";

const STATUS_COLORS = {
  approved: { bg: "#D1FAE5", text: "#065F46" },
  pending:  { bg: "#FEF3C7", text: "#92400E" },
  rejected: { bg: "#FEE2E2", text: "#991B1B" },
};

function StarRow({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? "#F85700" : "#ddd", fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

/* ── Create Review Modal ── */
function CreateReviewModal({ onClose, onCreated }) {
  const { products } = useCatalog();
  const [form, setForm] = useState({ productId:"", reviewerName:"", rating:5, title:"", reviewBody:"", status:"approved" });
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState("");
  const [hover,  setHover]    = useState(0);

  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const setInp = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const inp = { width:"100%", padding:"10px 14px", border:"1.5px solid var(--adm-border)", borderRadius:8, fontFamily:"inherit", fontSize:13, color:"var(--adm-text)", outline:"none", background:"var(--adm-white)", boxSizing:"border-box" };

  const submit = async () => {
    setError("");
    if (!form.productId)     { setError("Please select a product"); return; }
    if (!form.reviewerName.trim()) { setError("Reviewer name is required"); return; }
    setSaving(true);
    try {
      const res  = await fetch("/api/reviews/admin", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { onCreated(); onClose(); }
      else setError(json.message || "Failed to create");
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal-container" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">Create Review</h3>
          <button className="adm-modal-close" onClick={onClose}><X size={16}/></button>
        </div>
        <div className="adm-modal-body">
          {error && <div className="adm-alert adm-alert-danger" style={{ marginBottom:16 }}>{error}</div>}

          <div className="adm-form-group">
            <label className="adm-form-label">Product <span>*</span></label>
            <select className="adm-form-select" value={form.productId} onChange={setInp("productId")}>
              <option value="">— Select Product —</option>
              {products.map(p => <option key={p.id||p._id} value={p.id||p._id}>{p.name}</option>)}
            </select>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Reviewer Name <span>*</span></label>
            <input className="adm-form-input" placeholder="e.g. Verified International Buyer" value={form.reviewerName} onChange={setInp("reviewerName")} />
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Rating <span>*</span></label>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                  onClick={() => set("rating")(s)}
                  style={{ fontSize:32, background:"none", border:"none", cursor:"pointer", lineHeight:1, padding:"0 2px",
                    color: s <= (hover || form.rating) ? "#F85700" : "#ddd",
                    transform: s <= (hover || form.rating) ? "scale(1.1)" : "scale(1)",
                    transition: "color .1s, transform .1s" }}>★</button>
              ))}
              <span style={{ marginLeft:8, fontSize:13, fontWeight:700, color:"#F85700" }}>
                {["","Poor","Fair","Good","Very Good","Excellent"][hover || form.rating]}
              </span>
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Title</label>
            <input className="adm-form-input" placeholder="Review title (optional)" value={form.title} onChange={setInp("title")} maxLength={100} />
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Review Body</label>
            <textarea className="adm-form-input" style={{ height:90, resize:"vertical" }} placeholder="Write the review…" value={form.reviewBody} onChange={setInp("reviewBody")} maxLength={1000} />
          </div>

          <div className="adm-form-group" style={{ margin:0 }}>
            <label className="adm-form-label">Status</label>
            <div style={{ display:"flex", gap:8 }}>
              {["approved","pending","rejected"].map(s => {
                const sc = STATUS_COLORS[s];
                return (
                  <button key={s} type="button" onClick={() => set("status")(s)} style={{
                    height:34, padding:"0 16px", border:"1.5px solid",
                    borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer",
                    borderColor: form.status===s ? sc.text : "#D7CEC5",
                    background:  form.status===s ? sc.bg  : "transparent",
                    color:       form.status===s ? sc.text : "var(--adm-muted)",
                    transition:"all .15s",
                  }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Creating…" : "Create Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews,      setReviews]      = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const [page,         setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);
  const [newStatus,    setNewStatus]    = useState("");
  const [adminReply,   setAdminReply]   = useState("");
  const [updating,     setUpdating]     = useState(false);
  const [createOpen,   setCreateOpen]   = useState(false);
  const LIMIT = 20;

  const fetchReviews = async (status = statusFilter, p = page) => {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ admin: "1", page: p, limit: LIMIT });
      if (status) params.append("status", status);
      const res  = await fetch(`/api/reviews?${params}`);
      const json = await res.json();
      if (json.success) { setReviews(json.data.reviews); setTotal(json.data.total); }
      else setError(json.message || "Failed to load reviews");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [page, statusFilter]);

  const openReview = (r) => {
    setSelected(r);
    setNewStatus(r.status);
    setAdminReply(r.adminReply || "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res  = await fetch(`/api/reviews/${selected.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminReply }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Review updated"); setSelected(null); fetchReviews();
        setTimeout(() => setSuccess(""), 3000);
      } else setError(json.message || "Failed");
    } catch { setError("Network error"); }
    finally { setUpdating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setSelected(null); fetchReviews();
    setSuccess("Deleted"); setTimeout(() => setSuccess(""), 3000);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const filtered   = search
    ? reviews.filter(r =>
        r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.title?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  const pendingCount = reviews.filter(r => r.status === "pending").length;

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:24, fontWeight:700 }}>
            Reviews
            {pendingCount > 0 && (
              <span style={{ marginLeft:10, background:"#F85700", color:"#fff", fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:999 }}>
                {pendingCount} pending
              </span>
            )}
          </h2>
          <p style={{ fontSize:13, color:"var(--adm-muted)", marginTop:2 }}>{total} total reviews</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="adm-btn adm-btn-primary" onClick={() => setCreateOpen(true)}>
            <Plus size={14}/> Create Review
          </button>
          <button className="adm-btn" onClick={() => fetchReviews()}><RefreshCw size={14}/> Refresh</button>
        </div>
      </div>

      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom:16 }}>{error}</div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom:16 }}>{success}</div>}

      {/* Filters */}
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200, maxWidth:320 }}>
          <Search size={15} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"var(--adm-muted)" }}/>
          <input type="text" className="adm-form-input" placeholder="Search product, user, title…"
            style={{ paddingLeft:36, height:40 }} value={search}
            onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="adm-form-select" style={{ width:160, height:40 }} value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        {(search || statusFilter) && (
          <button className="adm-btn" style={{ height:40 }}
            onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}>Reset</button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:48 }}>
          <div className="adm-loading-spinner"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><MessageCircle size={40}/></div>
          <div className="adm-empty-state-title">No reviews found</div>
          <div className="adm-empty-state-desc">Customer reviews on delivered orders will appear here.</div>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const sc = STATUS_COLORS[r.status] || { bg:"#F3F4F6", text:"#374151" };
                    return (
                      <tr key={r.id} style={{ fontWeight: r.status==="pending" ? 700 : 400 }}>
                        <td>
                          <div style={{ fontWeight:600, fontSize:13, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {r.product?.name || "—"}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize:13 }}>{r.user?.name || "Anonymous"}</div>
                          <div style={{ fontSize:11, color:"var(--adm-muted)" }}>{r.user?.email || ""}</div>
                        </td>
                        <td><StarRow rating={r.rating}/></td>
                        <td>
                          <div style={{ fontSize:13, fontWeight:600, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {r.title || <span style={{ color:"var(--adm-muted)", fontWeight:400 }}>No title</span>}
                          </div>
                          {r.body && (
                            <div style={{ fontSize:11, color:"var(--adm-muted)", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {r.body}
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:sc.bg, color:sc.text }}>
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ fontSize:12, color:"var(--adm-muted)" }}>{formatDate(r.createdAt)}</td>
                        <td>
                          <button className="adm-btn" style={{ padding:"6px 12px", fontSize:12 }}
                            onClick={() => openReview(r)}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
              <button className="adm-btn" disabled={page<=1} onClick={() => setPage(p=>p-1)}>← Prev</button>
              <span style={{ display:"flex", alignItems:"center", fontSize:13, padding:"0 12px" }}>Page {page} of {totalPages}</span>
              <button className="adm-btn" disabled={page>=totalPages} onClick={() => setPage(p=>p+1)}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {createOpen && (
        <CreateReviewModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => { fetchReviews(); setSuccess("Review created"); setTimeout(() => setSuccess(""), 3000); }}
        />
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal-container"
            style={{ maxWidth:560, maxHeight:"92vh", display:"flex", flexDirection:"column" }}
            onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Review — {selected.product?.name}</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="adm-modal-body" style={{ flex:1, overflowY:"auto" }}>
              {/* Info grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {[
                  ["Customer", selected.user?.name || "Anonymous"],
                  ["Email",    selected.user?.email || "—"],
                  ["Product",  selected.product?.name || "—"],
                  ["Rating",   ""],
                ].map(([label, value]) => (
                  <div key={label} className="adm-card" style={{ padding:"12px 16px" }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", color:"var(--adm-muted)", marginBottom:4 }}>{label}</div>
                    {label === "Rating"
                      ? <StarRow rating={selected.rating}/>
                      : <div style={{ fontSize:13, fontWeight:600 }}>{value}</div>
                    }
                  </div>
                ))}
              </div>

              {/* Review content */}
              {selected.title && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", color:"var(--adm-muted)", marginBottom:4 }}>Title</div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{selected.title}</div>
                </div>
              )}
              {selected.body && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", color:"var(--adm-muted)", marginBottom:4 }}>Review</div>
                  <div style={{ background:"var(--adm-bg)", borderRadius:8, padding:"12px 16px", fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{selected.body}</div>
                </div>
              )}

              {/* Status buttons */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Status</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["approved","pending","rejected"].map(s => {
                    const sc = STATUS_COLORS[s];
                    return (
                      <button key={s} type="button" onClick={() => setNewStatus(s)}
                        style={{
                          height:36, padding:"0 16px", border:"1.5px solid",
                          borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer",
                          borderColor: newStatus===s ? sc.text : "#D7CEC5",
                          background:  newStatus===s ? sc.bg  : "transparent",
                          color:       newStatus===s ? sc.text : "var(--adm-muted)",
                          transition: "all .15s",
                        }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Reply */}
              <div>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Admin Reply <span style={{ fontSize:11, fontWeight:400, color:"var(--adm-muted)" }}>(visible to customer)</span></div>
                <textarea className="adm-form-input"
                  style={{ height:90, padding:"10px 14px", resize:"vertical", width:"100%", fontFamily:"inherit", fontSize:13 }}
                  placeholder="Write a public reply to this review…"
                  value={adminReply}
                  onChange={e => setAdminReply(e.target.value)}/>
              </div>
            </div>

            <div className="adm-modal-footer" style={{ display:"flex", justifyContent:"space-between" }}>
              <button className="adm-btn" style={{ color:"#e53e3e", borderColor:"#e53e3e" }}
                onClick={() => handleDelete(selected.id)}>Delete</button>
              <div style={{ display:"flex", gap:8 }}>
                <button className="adm-btn" onClick={() => setSelected(null)}>Cancel</button>
                <button className="adm-btn adm-btn-primary" disabled={updating} onClick={handleSave}>
                  {updating ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
