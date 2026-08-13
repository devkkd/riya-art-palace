"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Search, MessageSquare, Mail, Phone, Globe } from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

const STATUS_COLORS = {
  new:     { bg: "#DBEAFE", text: "#1E40AF" },
  read:    { bg: "#FEF3C7", text: "#92400E" },
  replied: { bg: "#D1FAE5", text: "#065F46" },
  closed:  { bg: "#F3F4F6", text: "#374151" },
};

const STATUS_OPTIONS = ["new", "read", "replied", "closed"];

function StatusBadge({ status }) {
  const { bg, text } = STATUS_COLORS[status] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color: text }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [page, setPage]           = useState(1);
  const [statusFilter, setStatusFilter]   = useState("");
  const [variantFilter, setVariantFilter] = useState("");
  const [search, setSearch]               = useState("");
  const [selected, setSelected]           = useState(null);
  const [newStatus, setNewStatus]         = useState("");
  const [adminNotes, setAdminNotes]       = useState("");
  const [updating, setUpdating]           = useState(false);
  const LIMIT = 20;

  const fetchEnquiries = async (status = statusFilter, variant = variantFilter, p = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (status)  params.append("status", status);
      if (variant) params.append("variant", variant);
      const res  = await fetch(`/api/enquiry?${params}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data.enquiries);
        setTotal(json.data.total);
      } else {
        setError(json.message || "Failed to load enquiries");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, [page, statusFilter, variantFilter]);

  const openEnquiry = (enq) => {
    setSelected(enq);
    setNewStatus(enq.status);
    setAdminNotes(enq.adminNotes || "");
    // Auto-mark as read
    if (enq.status === "new") {
      updateEnquiry(enq.id, { status: "read" }, false);
    }
  };

  const updateEnquiry = async (id, body, refetch = true) => {
    setUpdating(true);
    try {
      const res  = await fetch(`/api/enquiry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        if (refetch) {
          setSuccess("Enquiry updated");
          setSelected(null);
          fetchEnquiries();
          setTimeout(() => setSuccess(""), 3000);
        }
      } else {
        setError(json.message || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSave = () => {
    if (!selected) return;
    updateEnquiry(selected.id, { status: newStatus, adminNotes });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry? This cannot be undone.")) return;
    try {
      await fetch(`/api/enquiry/${id}`, { method: "DELETE" });
      setSelected(null);
      fetchEnquiries();
      setSuccess("Enquiry deleted");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const filtered = search
    ? enquiries.filter((e) =>
        e.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        e.contactName?.toLowerCase().includes(search.toLowerCase()) ||
        e.businessEmail?.toLowerCase().includes(search.toLowerCase()) ||
        e.phone?.includes(search)
      )
    : enquiries;

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 24, fontWeight: 700 }}>
            Enquiries
            {newCount > 0 && (
              <span style={{ marginLeft: 10, background: "#F85700", color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
                {newCount} new
              </span>
            )}
          </h2>
          <p style={{ fontSize: 13, color: "var(--adm-muted)", marginTop: 2 }}>{total} total enquiries</p>
        </div>
        <button className="adm-btn" onClick={() => fetchEnquiries()}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--adm-muted)" }} />
          <input
            type="text"
            className="adm-form-input"
            placeholder="Search company, name, email..."
            style={{ paddingLeft: 36, height: 40 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="adm-form-select" style={{ width: 160, height: 40 }} value={variantFilter}
          onChange={(e) => { setVariantFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="export">Export</option>
          <option value="india">India</option>
        </select>

        <select className="adm-form-select" style={{ width: 160, height: 40 }} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {(search || statusFilter || variantFilter) && (
          <button className="adm-btn" style={{ height: 40 }}
            onClick={() => { setSearch(""); setStatusFilter(""); setVariantFilter(""); setPage(1); }}>
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><MessageSquare size={40} /></div>
          <div className="adm-empty-state-title">No enquiries found</div>
          <div className="adm-empty-state-desc">Customer enquiries submitted from the website will appear here.</div>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((enq) => (
                    <tr key={enq.id} style={{ fontWeight: enq.status === "new" ? 700 : 400 }}>
                      <td>
                        <span style={{
                          padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                          background: enq.enquiryVariant === "export" ? "#EDE9FE" : "#DBEAFE",
                          color:      enq.enquiryVariant === "export" ? "#5B21B6" : "#1E40AF",
                        }}>
                          {enq.enquiryVariant === "export" ? "Export" : "India"}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{enq.companyName}</div>
                        <div style={{ fontSize: 11, color: "var(--adm-muted)" }}>{enq.country}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{enq.contactName}</div>
                        <div style={{ fontSize: 11, color: "var(--adm-muted)", display: "flex", gap: 4, alignItems: "center" }}>
                          <Mail size={10} /> {enq.businessEmail}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--adm-muted)", display: "flex", gap: 4, alignItems: "center" }}>
                          <Phone size={10} /> {enq.phone}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--adm-muted)" }}>{enq.productCategory || "—"}</td>
                      <td style={{ fontSize: 12, color: "var(--adm-muted)" }}>{enq.orderQty || "—"}</td>
                      <td><StatusBadge status={enq.status} /></td>
                      <td style={{ fontSize: 12, color: "var(--adm-muted)" }}>{formatDate(enq.createdAt)}</td>
                      <td>
                        <button className="adm-btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => openEnquiry(enq)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
              <button className="adm-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span style={{ display: "flex", alignItems: "center", fontSize: 13, padding: "0 12px" }}>
                Page {page} of {totalPages}
              </span>
              <button className="adm-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="adm-modal-container"
            style={{ maxWidth: 620, maxHeight: "92vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">
                {selected.enquiryVariant === "export" ? "🌍 Export" : "🇮🇳 India"} Enquiry — {selected.companyName}
              </h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="adm-modal-body" style={{ flex: 1, overflowY: "auto" }}>

              {/* Contact Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  ["Company",       selected.companyName],
                  ["Contact",       selected.contactName],
                  ["Email",         selected.businessEmail],
                  ["Phone",         selected.phone],
                  ["Country",       selected.country],
                  ["Enquiry Type",  selected.enquiryType  || "—"],
                  ["Order Qty",     selected.orderQty     || "—"],
                  ["Category",      selected.productCategory || "—"],
                  ["Customisation", selected.customisation || "—"],
                  ["Packaging",     selected.packaging    || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="adm-card" style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, wordBreak: "break-word" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Message */}
              {selected.message && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Message</div>
                  <div style={{ background: "var(--adm-bg)", borderRadius: 8, padding: "14px 16px", fontSize: 13, lineHeight: 1.7, color: "var(--adm-text)", whiteSpace: "pre-wrap" }}>
                    {selected.message}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Status</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      style={{
                        height: 36, padding: "0 16px", border: "1.5px solid",
                        borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        borderColor: newStatus === s ? STATUS_COLORS[s]?.text : "#D7CEC5",
                        background:  newStatus === s ? STATUS_COLORS[s]?.bg  : "transparent",
                        color:       newStatus === s ? STATUS_COLORS[s]?.text : "var(--adm-muted)",
                        transition: "all .15s",
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Admin Notes</div>
                <textarea
                  className="adm-form-input"
                  style={{ height: 90, padding: "10px 14px", resize: "vertical", width: "100%", fontFamily: "inherit", fontSize: 13 }}
                  placeholder="Internal notes (not visible to customer)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Quick reply link */}
              <a
                href={`mailto:${selected.businessEmail}?subject=Re: Your Enquiry at Riya Art Palace&body=Dear ${selected.contactName},%0A%0AThank you for your enquiry.%0A%0A`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--adm-accent)", fontSize: 13, fontWeight: 600 }}
              >
                <Mail size={14} /> Reply via Email →
              </a>
            </div>

            <div className="adm-modal-footer" style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                className="adm-btn"
                style={{ color: "#e53e3e", borderColor: "#e53e3e" }}
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </button>
              <div style={{ display: "flex", gap: 8 }}>
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
