"use client";
import { useEffect, useState } from "react";
import {
  RefreshCw, Search, Package, MapPin, Phone, Truck,
  CheckCircle, Clock, XCircle, ChevronDown
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

const STATUS_COLORS = {
  pending:          { bg: "#FEF3C7", text: "#92400E" },
  confirmed:        { bg: "#DBEAFE", text: "#1E40AF" },
  processing:       { bg: "#EDE9FE", text: "#5B21B6" },
  shipped:          { bg: "#D1FAE5", text: "#065F46" },
  out_for_delivery: { bg: "#A7F3D0", text: "#064E3B" },
  delivered:        { bg: "#BBF7D0", text: "#14532D" },
  cancelled:        { bg: "#FEE2E2", text: "#991B1B" },
  returned:         { bg: "#F3F4F6", text: "#374151" },
};

const STATUS_OPTIONS = ["", "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"];

function StatusBadge({ status }) {
  const { bg, text } = STATUS_COLORS[status] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color: text }}>
      {status?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [page, setPage]         = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const LIMIT = 20;

  const fetchOrders = async (status = statusFilter, p = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (status) params.append("status", status);
      const res  = await fetch(`/api/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data.orders);
        setTotal(json.data.total);
      } else {
        setError(json.message || "Failed to load orders");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const openOrder = (order) => {
    setSelected(order);
    setNewStatus(order.orderStatus);
  };

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    setUpdating(true);
    try {
      const res  = await fetch(`/api/orders/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess("Order status updated");
        setSelected(null);
        fetchOrders();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(json.message || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUpdating(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const filteredOrders = search
    ? orders.filter((o) =>
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.phone?.includes(search) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.awbNumber?.includes(search)
      )
    : orders;

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair,serif)", fontSize: 24, fontWeight: 700 }}>Orders</h2>
          <p style={{ fontSize: 13, color: "var(--adm-muted)", marginTop: 2 }}>
            {total} total orders
          </p>
        </div>
        <button className="adm-btn" onClick={() => fetchOrders()}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Messages */}
      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--adm-muted)" }} />
          <input
            type="text"
            className="adm-form-input"
            placeholder="Search order ID, phone, AWB..."
            style={{ paddingLeft: 36, height: 40 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="adm-form-select"
          style={{ width: 180, height: 40 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
        {(search || statusFilter) && (
          <button className="adm-btn" style={{ height: 40 }} onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}>
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><Package size={40} /></div>
          <div className="adm-empty-state-title">No orders found</div>
          <div className="adm-empty-state-desc">Orders placed by customers will appear here.</div>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <div className="adm-table-scroll">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>AWB / Courier</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="adm-table-title" style={{ fontSize: 12, fontFamily: "monospace" }}>
                          {order.orderId}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name || "—"}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--adm-muted)", fontSize: 12, marginTop: 2 }}>
                            <Phone size={11} /> +91 {order.user?.phone || "—"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: "var(--adm-muted)" }}>
                          {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--adm-muted)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {order.items?.[0]?.productName}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>₹{order.totalAmount}</div>
                        {order.shippingCharge > 0 && (
                          <div style={{ fontSize: 11, color: "var(--adm-muted)" }}>+₹{order.shippingCharge} ship</div>
                        )}
                      </td>
                      <td>
                        <span style={{
                          padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                          background: order.paymentMethod === "COD" ? "#FEF3C7" : "#D1FAE5",
                          color:      order.paymentMethod === "COD" ? "#92400E" : "#065F46",
                        }}>
                          {order.paymentMethod}
                        </span>
                        <div style={{ fontSize: 11, marginTop: 3, color: "var(--adm-muted)" }}>{order.paymentStatus}</div>
                      </td>
                      <td><StatusBadge status={order.orderStatus} /></td>
                      <td>
                        {order.awbNumber ? (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>{order.awbNumber}</div>
                            <div style={{ fontSize: 11, color: "var(--adm-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                              <Truck size={11} /> {order.courierName || "—"}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--adm-muted)" }}>Not assigned</span>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--adm-muted)" }}>{formatDate(order.createdAt)}</td>
                      <td>
                        <button className="adm-btn" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => openOrder(order)}>
                          View
                        </button>
                      </td>
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

      {/* Order Detail Modal */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="adm-modal-container"
            style={{ maxWidth: 600, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Order — {selected.orderId}</h3>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body" style={{ flex: 1, overflowY: "auto" }}>

              {/* Status + Payment */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div className="adm-card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted)", marginBottom: 8 }}>Order Status</div>
                  <StatusBadge status={selected.orderStatus} />
                </div>
                <div className="adm-card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted)", marginBottom: 8 }}>Payment</div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{selected.paymentMethod} — {selected.paymentStatus}</div>
                </div>
              </div>

              {/* Customer */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Customer</div>
                <div style={{ fontSize: 13, color: "var(--adm-text)", lineHeight: 1.6 }}>
                  {selected.user?.name || "—"}<br />
                  +91 {selected.user?.phone || "—"}<br />
                  {selected.user?.email || "—"}
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Shipping Address</div>
                <div style={{ fontSize: 13, color: "var(--adm-text)", lineHeight: 1.6 }}>
                  {selected.shippingAddress?.firstName} {selected.shippingAddress?.lastName}<br />
                  {selected.shippingAddress?.line1}{selected.shippingAddress?.line2 ? `, ${selected.shippingAddress.line2}` : ""}<br />
                  {selected.shippingAddress?.city}, {selected.shippingAddress?.state} — {selected.shippingAddress?.pincode}<br />
                  {selected.shippingAddress?.country}<br />
                  📞 {selected.shippingAddress?.phone}
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Items</div>
                <div style={{ border: "1px solid var(--adm-border)", borderRadius: 8, overflow: "hidden" }}>
                  {selected.items?.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                      borderBottom: i < selected.items.length - 1 ? "1px solid var(--adm-border)" : "none"
                    }}>
                      <img src={item.image || "https://placehold.co/48x48"} alt={item.productName}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.productName}</div>
                        <div style={{ fontSize: 12, color: "var(--adm-muted)" }}>
                          ₹{item.price}/{item.priceUnit} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>₹{item.subtotal}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div style={{ background: "var(--adm-bg)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                {[
                  ["Subtotal",  `₹${selected.subtotal}`],
                  ["Shipping",  selected.shippingCharge === 0 ? "Free" : `₹${selected.shippingCharge}`],
                  ["Discount",  selected.discount > 0 ? `-₹${selected.discount}` : "—"],
                  ["Total",     `₹${selected.totalAmount}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--adm-muted)" }}>{label}</span>
                    <span style={{ fontWeight: label === "Total" ? 700 : 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Tracking */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Tracking</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                  <div style={{ color: "var(--adm-muted)" }}>AWB Number</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 600 }}>{selected.awbNumber || "—"}</div>
                  <div style={{ color: "var(--adm-muted)" }}>Courier</div>
                  <div>{selected.courierName || "—"}</div>
                  <div style={{ color: "var(--adm-muted)" }}>Shiprocket Order ID</div>
                  <div style={{ fontFamily: "monospace" }}>{selected.shiprocketOrderId || "—"}</div>
                </div>
                {selected.trackingUrl && (
                  <a href={selected.trackingUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 8, color: "var(--adm-accent)", fontSize: 13, fontWeight: 600 }}>
                    View Live Tracking →
                  </a>
                )}
              </div>

              {/* Update Status */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Update Status</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    className="adm-form-select"
                    style={{ flex: 1 }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.filter(Boolean).map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <button
                    className="adm-btn adm-btn-primary"
                    disabled={updating || newStatus === selected.orderStatus}
                    onClick={handleStatusUpdate}
                  >
                    {updating ? "Saving..." : "Update"}
                  </button>
                </div>
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
