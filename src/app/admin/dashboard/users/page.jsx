"use client";
import { useEffect, useState } from "react";
import { Search, Users, Phone, Mail, MapPin, Calendar, RefreshCw } from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [selected, setSelected] = useState(null);
  const LIMIT = 20;

  const fetchUsers = async (q = search, p = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (q) params.append("q", q);
      const res  = await fetch(`/api/users?${params}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTotal(json.data.total);
      } else {
        setError(json.message || "Failed to load users");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 24, fontWeight: 700 }}>Users</h2>
          <p style={{ fontSize: 13, color: "var(--adm-muted)", marginTop: 2 }}>
            All registered customers — {total} total
          </p>
        </div>
        <button className="adm-btn" onClick={() => fetchUsers()}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 24, display: "flex", gap: 10 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--adm-muted)" }} />
          <input
            type="text"
            className="adm-form-input"
            placeholder="Search by phone, name or email..."
            style={{ paddingLeft: 36, height: 40 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="adm-btn adm-btn-primary" style={{ height: 40 }}>Search</button>
        {search && (
          <button type="button" className="adm-btn" style={{ height: 40 }} onClick={() => { setSearch(""); setPage(1); fetchUsers("", 1); }}>Clear</button>
        )}
      </form>

      {/* Error */}
      {error && <div className="adm-alert adm-alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : users.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><Users size={40} /></div>
          <div className="adm-empty-state-title">No users found</div>
          <div className="adm-empty-state-desc">Customers who sign in via OTP will appear here.</div>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Phone</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelected(u)}
                    >
                      <td style={{ color: "var(--adm-muted)", fontSize: 12 }}>{(page - 1) * LIMIT + i + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Phone size={13} style={{ color: "var(--adm-accent)" }} />
                          <span className="adm-table-title">+91 {u.phone}</span>
                        </div>
                      </td>
                      <td>{u.name}</td>
                      <td style={{ color: "var(--adm-muted)", fontSize: 13 }}>{u.email}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={13} style={{ color: "var(--adm-muted)" }} />
                          <span>{u.addresses}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: u.isActive ? "#D1FAE5" : "#FEE2E2",
                          color:      u.isActive ? "#065F46" : "#991B1B",
                        }}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--adm-muted)" }}>{formatDate(u.lastLogin)}</td>
                      <td style={{ fontSize: 13, color: "var(--adm-muted)" }}>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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

      {/* User Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-modal-container" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">User Details</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Phone",      `+91 ${selected.phone}`],
                  ["Name",       selected.name  || "—"],
                  ["Email",      selected.email || "—"],
                  ["Addresses",  `${selected.addresses} saved`],
                  ["Status",     selected.isActive ? "Active" : "Inactive"],
                  ["Last Login", formatDate(selected.lastLogin)],
                  ["Joined",     formatDate(selected.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid var(--adm-border)" }}>
                    <span style={{ fontSize: 13, color: "var(--adm-muted)", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "var(--adm-charcoal)", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
