"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const STATUS_ICON = {
  "Shipment picked up":     "📦",
  "In Transit":             "🚚",
  "Out for delivery":       "🛵",
  "Delivered":              "✅",
  "Cancelled":              "❌",
};

function getIcon(activity = "") {
  for (const [key, icon] of Object.entries(STATUS_ICON)) {
    if (activity.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "📍";
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function TrackOrderPage() {
  const { awb }  = useParams();
  const router   = useRouter();
  const [data,   setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!awb) return;
    setLoading(true);
    fetch(`/api/orders/track/${encodeURIComponent(awb)}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) setData(j.data);
        else setError(j.message || "Could not fetch tracking info.");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, [awb]);

  const activities = data?.shipment_track_activities || [];
  const currentStatus = data?.current_status || "In Transit";

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Poppins:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        .tr-page{background:#F7F5F3;min-height:80vh;padding:48px 0 80px}
        .tr-inner{max-width:680px;margin:0 auto;padding:0 20px}
        .tr-back{background:none;border:none;font-family:"Manrope",sans-serif;font-size:13px;font-weight:600;color:#F85700;cursor:pointer;margin-bottom:24px;padding:0;display:flex;align-items:center;gap:6px}
        .tr-back:hover{opacity:.8}
        .tr-card{background:#fff;border:1.5px solid #E0D9D1;border-radius:18px;padding:32px 28px;margin-bottom:20px}
        .tr-title{font-family:"Manrope",sans-serif;font-size:22px;font-weight:800;color:#0E0E0E;margin-bottom:4px}
        .tr-awb{font-family:monospace;font-size:13px;color:#888;margin-bottom:20px;letter-spacing:0.04em}
        .tr-status-badge{display:inline-flex;align-items:center;gap:8px;background:#FFF3ED;border:1.5px solid #F85700;border-radius:999px;padding:6px 18px;font-family:"Manrope",sans-serif;font-size:13px;font-weight:700;color:#F85700;margin-bottom:24px}
        .tr-timeline{position:relative;padding-left:36px}
        .tr-timeline::before{content:"";position:absolute;left:13px;top:6px;bottom:6px;width:2px;background:#E0D9D1;border-radius:2px}
        .tr-step{position:relative;margin-bottom:24px}
        .tr-step:last-child{margin-bottom:0}
        .tr-dot{position:absolute;left:-30px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid #E0D9D1;display:flex;align-items:center;justify-content:center;font-size:11px;z-index:1}
        .tr-step.active .tr-dot{border-color:#F85700;background:#FFF3ED}
        .tr-step-title{font-family:"Manrope",sans-serif;font-size:14px;font-weight:700;color:#0E0E0E;margin-bottom:2px}
        .tr-step-loc{font-family:"Poppins",sans-serif;font-size:12px;color:#888;margin-bottom:2px}
        .tr-step-date{font-family:"Poppins",sans-serif;font-size:11px;color:#aaa}
        .tr-empty{text-align:center;padding:40px 0;color:#999;font-family:"Manrope",sans-serif;font-size:15px}
        .tr-error{background:#FEE2E2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;color:#991B1B;font-family:"Manrope",sans-serif;font-size:14px;margin-bottom:20px}
        .tr-spinner{width:36px;height:36px;border:3px solid #E5DDD5;border-top-color:#F85700;border-radius:50%;animation:spin .7s linear infinite;margin:60px auto}
        @media(max-width:600px){.tr-card{padding:22px 16px}}
      `}</style>

      <div className="tr-page">
        <div className="tr-inner">
          <button className="tr-back" onClick={() => router.back()}>
            ← Back
          </button>

          <div className="tr-card">
            <div className="tr-title">Track Shipment</div>
            <div className="tr-awb">AWB: {awb}</div>

            {loading ? (
              <div className="tr-spinner" />
            ) : error ? (
              <div className="tr-error">⚠️ {error}</div>
            ) : (
              <>
                {/* Current status badge */}
                <div className="tr-status-badge">
                  🚚 {currentStatus}
                </div>

                {/* Delivered date */}
                {data?.delivered_date && (
                  <div style={{ fontFamily: "Manrope,sans-serif", fontSize: 13, color: "#16a34a", fontWeight: 700, marginBottom: 20 }}>
                    ✅ Delivered on {fmtDate(data.delivered_date)}
                  </div>
                )}

                {/* Timeline */}
                {activities.length === 0 ? (
                  <div className="tr-empty">No tracking events yet. Please check back later.</div>
                ) : (
                  <div className="tr-timeline">
                    {activities.map((act, i) => (
                      <div key={i} className={`tr-step${i === 0 ? " active" : ""}`}>
                        <div className="tr-dot">{getIcon(act.activity)}</div>
                        <div className="tr-step-title">{act.activity || "Update"}</div>
                        {act.location && (
                          <div className="tr-step-loc">📍 {act.location}</div>
                        )}
                        {act.date && (
                          <div className="tr-step-date">{fmtDate(act.date)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Refresh hint */}
          {!loading && !error && (
            <div style={{ textAlign: "center", fontFamily: "Manrope,sans-serif", fontSize: 12, color: "#aaa", marginTop: 8 }}>
              Tracking updates every few hours. Last refreshed: {new Date().toLocaleTimeString("en-IN")}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
