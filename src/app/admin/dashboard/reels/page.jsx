"use client";
import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, RefreshCw, Upload, Film, Eye, EyeOff, GripVertical, X, Loader2, AlertTriangle } from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

export default function AdminReelsPage() {
  const [reels,    setReels]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [modalOpen,setModalOpen]= useState(false);

  // form state
  const [videoFile,    setVideoFile]    = useState(null);
  const [thumbFile,    setThumbFile]    = useState(null);
  const [title,        setTitle]        = useState("");
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [formError,    setFormError]    = useState("");
  const [preview,      setPreview]      = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [deleting,     setDeleting]     = useState(null);
  const [reordering,   setReordering]   = useState(false);
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const fetchReels = async () => {
    setLoading(true); setError("");
    try {
      // Admin fetch — include inactive
      const res  = await fetch("/api/reels?admin=1");
      const json = await res.json();
      if (json.success) setReels(json.data);
      else setError(json.message || "Failed to load");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReels(); }, []);

  const showSuccess = msg => { setSuccess(msg); setTimeout(() => setSuccess(""), 3500); };

  /* ── Upload helper ── */
  const uploadFile = async (file) => {
    const compressedFile = file; // videos can't be compressed client-side easily
    const formData = new FormData();
    formData.append("file", compressedFile);
    const res  = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Upload failed");
    return json.data.url;
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { setFormError("Only video files allowed"); return; }
    if (file.size > 50 * 1024 * 1024) { setFormError("Video must be under 50MB"); return; }
    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
    setFormError("");
  };

  const handleThumbSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setFormError("Only image files for thumbnail"); return; }
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
    setFormError("");
  };

  const handleCreate = async () => {
    setFormError("");
    if (!videoFile) { setFormError("Please select a video"); return; }
    setUploading(true); setUploadPct(10);
    try {
      const videoUrl = await uploadFile(videoFile);
      setUploadPct(70);
      const thumbUrl = thumbFile ? await uploadFile(thumbFile) : "";
      setUploadPct(90);

      const res  = await fetch("/api/reels", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), videoUrl, thumbUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setUploadPct(100);
        setModalOpen(false);
        resetForm();
        fetchReels();
        showSuccess("Reel uploaded successfully!");
      } else {
        setFormError(json.message || "Failed to save");
      }
    } catch (err) {
      setFormError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  const resetForm = () => {
    setVideoFile(null); setThumbFile(null); setTitle(""); setFormError("");
    setPreview(null); setThumbPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this reel permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/reels/${id}`, { method: "DELETE" });
      setReels(prev => prev.filter(r => r.id !== id));
      showSuccess("Reel deleted");
    } catch { setError("Delete failed"); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (reel) => {
    try {
      await fetch(`/api/reels/${reel.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !reel.isActive }),
      });
      setReels(prev => prev.map(r => r.id === reel.id ? { ...r, isActive: !r.isActive } : r));
    } catch { setError("Update failed"); }
  };

  const moveReel = async (index, direction) => {
    const newReels  = [...reels];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newReels.length) return;
    [newReels[index], newReels[swapIndex]] = [newReels[swapIndex], newReels[index]];
    setReels(newReels);
    setReordering(true);
    try {
      await Promise.all(newReels.map((r, i) =>
        fetch(`/api/reels/${r.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ order: i }) })
      ));
      showSuccess("Order saved");
    } catch { setError("Failed to save order"); fetchReels(); }
    finally { setReordering(false); }
  };

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:24, fontWeight:700 }}>
            Reels
          </h2>
          <p style={{ fontSize:13, color:"var(--adm-muted)", marginTop:2 }}>
            {reels.length} reel{reels.length !== 1 ? "s" : ""} · shown in Instagram section on homepage
          </p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="adm-btn adm-btn-primary" onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus size={15}/> Upload Reel
          </button>
          <button className="adm-btn" onClick={fetchReels} disabled={loading}>
            <RefreshCw size={14}/> Refresh
          </button>
        </div>
      </div>

      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom:16 }}><AlertTriangle size={15}/><span>{error}</span></div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom:16 }}><span>{success}</span></div>}

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:56 }}>
          <div className="adm-loading-spinner"/>
        </div>
      ) : reels.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><Film size={40}/></div>
          <div className="adm-empty-state-title">No reels uploaded</div>
          <div className="adm-empty-state-desc">Upload videos to display in the Instagram section on your homepage.</div>
          <button className="adm-btn adm-btn-primary" style={{ marginTop:16 }} onClick={() => { resetForm(); setModalOpen(true); }}>
            <Plus size={14}/> Upload First Reel
          </button>
        </div>
      ) : (
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
          gap:16,
        }}>
          {reels.map((reel, index) => (
            <div key={reel.id} style={{
              background:"var(--adm-white)", border:"1.5px solid var(--adm-border)",
              borderRadius:14, overflow:"hidden", position:"relative",
              opacity: reel.isActive ? 1 : 0.55, transition:"opacity .2s",
            }}>
              {/* Order badge */}
              <div style={{ position:"absolute", top:8, left:8, zIndex:2, background:"rgba(0,0,0,.65)", color:"#fff", fontSize:11, fontWeight:700, borderRadius:6, padding:"2px 8px" }}>
                #{index+1}
              </div>

              {/* Video preview */}
              <div style={{ position:"relative", aspectRatio:"9/16", background:"#111", overflow:"hidden" }}>
                <video
                  src={reel.videoUrl}
                  poster={reel.thumbUrl || undefined}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  muted playsInline preload="metadata"
                />
                {!reel.isActive && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"#fff", fontSize:12, fontWeight:700, background:"rgba(0,0,0,.6)", padding:"4px 12px", borderRadius:999 }}>HIDDEN</span>
                  </div>
                )}
              </div>

              {/* Info + actions */}
              <div style={{ padding:"12px 12px 10px" }}>
                <div style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, color:"var(--adm-text)", marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {reel.title || <span style={{ color:"var(--adm-muted)", fontWeight:400 }}>Untitled</span>}
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {/* Toggle active */}
                  <button
                    title={reel.isActive ? "Hide" : "Show"}
                    onClick={() => toggleActive(reel)}
                    className="adm-btn"
                    style={{ padding:"5px 10px", fontSize:12, display:"flex", alignItems:"center", gap:4,
                      background: reel.isActive ? "#D1FAE5" : "transparent",
                      color:      reel.isActive ? "#065F46" : "var(--adm-muted)",
                      borderColor: reel.isActive ? "#6EE7B7" : undefined,
                    }}
                  >
                    {reel.isActive ? <Eye size={12}/> : <EyeOff size={12}/>}
                    {reel.isActive ? "Live" : "Hidden"}
                  </button>

                  {/* Move up */}
                  <button
                    className="adm-btn" style={{ padding:"5px 8px" }}
                    disabled={index === 0 || reordering}
                    onClick={() => moveReel(index, "up")}
                    title="Move up"
                  >↑</button>

                  {/* Move down */}
                  <button
                    className="adm-btn" style={{ padding:"5px 8px" }}
                    disabled={index === reels.length - 1 || reordering}
                    onClick={() => moveReel(index, "down")}
                    title="Move down"
                  >↓</button>

                  {/* Delete */}
                  <button
                    className="adm-btn adm-btn-danger"
                    style={{ padding:"5px 10px", fontSize:12, marginLeft:"auto" }}
                    onClick={() => handleDelete(reel.id)}
                    disabled={deleting === reel.id}
                  >
                    {deleting === reel.id ? <Loader2 size={12} style={{ animation:"adm-spin 1s linear infinite" }}/> : <Trash2 size={12}/>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => { if(!uploading) { setModalOpen(false); resetForm(); }}}>
          <div className="adm-modal-container" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Upload Reel</h3>
              <button className="adm-modal-close" onClick={() => { if(!uploading) { setModalOpen(false); resetForm(); }}}><X size={16}/></button>
            </div>
            <div className="adm-modal-body">
              {formError && (
                <div className="adm-alert adm-alert-danger" style={{ marginBottom:16 }}>
                  <AlertTriangle size={14}/><span>{formError}</span>
                </div>
              )}

              {/* Video upload */}
              <div className="adm-form-group">
                <label className="adm-form-label">Video File <span>*</span></label>
                {preview ? (
                  <div style={{ position:"relative", borderRadius:12, overflow:"hidden", aspectRatio:"9/16", maxWidth:200, margin:"0 auto", background:"#000" }}>
                    <video src={preview} style={{ width:"100%", height:"100%", objectFit:"cover" }} controls muted/>
                    <button onClick={() => { setVideoFile(null); setPreview(null); if(videoInputRef.current) videoInputRef.current.value=""; }}
                      style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,.6)", border:"none", color:"#fff", width:24, height:24, borderRadius:"50%", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                  </div>
                ) : (
                  <div className="adm-uploader-area" onClick={() => videoInputRef.current?.click()}>
                    <input ref={videoInputRef} type="file" accept="video/*" style={{ display:"none" }} onChange={handleVideoSelect} disabled={uploading}/>
                    <Film size={28} style={{ color:"var(--adm-muted)" }}/>
                    <span className="adm-uploader-text"><strong>Click to select video</strong></span>
                    <span className="adm-uploader-hint">MP4, MOV, WebM · Max 50MB · Portrait (9:16) recommended</span>
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className="adm-form-group">
                <label className="adm-form-label">Thumbnail Image <span style={{ fontWeight:400, color:"var(--adm-muted)" }}>(optional)</span></label>
                {thumbPreview ? (
                  <div style={{ position:"relative", borderRadius:10, overflow:"hidden", width:80, aspectRatio:"9/16", background:"#111" }}>
                    <img src={thumbPreview} alt="thumb" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <button onClick={() => { setThumbFile(null); setThumbPreview(null); if(thumbInputRef.current) thumbInputRef.current.value=""; }}
                      style={{ position:"absolute", top:3, right:3, background:"rgba(0,0,0,.6)", border:"none", color:"#fff", width:20, height:20, borderRadius:"50%", cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                  </div>
                ) : (
                  <div className="adm-uploader-area" style={{ padding:"14px" }} onClick={() => thumbInputRef.current?.click()}>
                    <input ref={thumbInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleThumbSelect} disabled={uploading}/>
                    <span className="adm-uploader-text" style={{ fontSize:13 }}><strong>Click to add thumbnail</strong></span>
                    <span className="adm-uploader-hint">JPEG, PNG, WebP</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="adm-form-group" style={{ margin:0 }}>
                <label className="adm-form-label">Title / Caption</label>
                <input className="adm-form-input" placeholder="e.g. Meenakari Elephant Set" value={title} onChange={e => setTitle(e.target.value)} disabled={uploading}/>
              </div>

              {/* Progress bar */}
              {uploading && (
                <div style={{ marginTop:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Manrope,sans-serif", fontSize:12, color:"var(--adm-muted)", marginBottom:6 }}>
                    <span>Uploading…</span>
                    <span>{uploadPct}%</span>
                  </div>
                  <div style={{ height:6, background:"var(--adm-border)", borderRadius:999, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${uploadPct}%`, background:"var(--adm-accent)", borderRadius:999, transition:"width .3s ease" }}/>
                  </div>
                </div>
              )}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => { setModalOpen(false); resetForm(); }} disabled={uploading}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleCreate} disabled={uploading || !videoFile}>
                {uploading ? <><Loader2 size={14} style={{ animation:"adm-spin 1s linear infinite" }}/> Uploading…</> : <><Upload size={14}/> Upload Reel</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
