"use client";

import { useEffect, useState } from "react";
import {
  Plus, Edit2, Trash2, Upload, X,
  Image as ImageIcon, Loader2, AlertTriangle,
  ArrowUp, ArrowDown,
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

export default function CategoriesPage() {
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState("");
  const [modalOpen, setModalOpen]         = useState(false);
  const [modalMode, setModalMode]         = useState("create");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData]           = useState({ name: "", description: "", longDescription: "", image: "", order: 0, showOnHome: true });
  const [uploading, setUploading]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState("");
  const [dragging, setDragging]           = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete]   = useState(null);
  const [deleting, setDeleting]           = useState(false);
  const [reordering, setReordering]       = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
      else setError(json.message || "Failed to load categories.");
    } catch { setError("Unable to connect to the server."); }
    finally { setLoading(false); }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const moveCategory = async (index, direction) => {
    const newCats   = [...categories];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newCats.length) return;
    [newCats[index], newCats[swapIndex]] = [newCats[swapIndex], newCats[index]];
    setCategories(newCats);
    setReordering(true);
    try {
      await Promise.all(
        newCats.map((cat, i) =>
          fetch(`/api/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i }),
          })
        )
      );
      showSuccessMessage("Category order updated");
    } catch {
      setError("Failed to save order.");
      fetchCategories();
    } finally { setReordering(false); }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "", description: "", longDescription: "", image: "", order: categories.length, showOnHome: true });
    setCurrentCategoryId(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setFormData({ name: category.name, description: category.description || "", longDescription: category.longDescription || "", image: category.image, order: category.order ?? 0, showOnHome: category.showOnHome !== false });
    setCurrentCategoryId(category.id);
    setFormError("");
    setModalOpen(true);
  };

  const handleDragOver   = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave  = () => setDragging(false);
  const handleDrop       = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); };
  const handleFileChange = (e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); };

  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) { setFormError("Only image files allowed."); return; }
    if (file.size > 5 * 1024 * 1024)    { setFormError("File exceeds 5MB."); return; }
    setUploading(true); setFormError("");
    const data = new FormData();
    data.append("file", file);
    try {
      const res  = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) setFormData(p => ({ ...p, image: json.data.url }));
      else setFormError(json.message || "Upload failed.");
    } catch { setFormError("Network error."); }
    finally { setUploading(false); }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name.trim()) { setFormError("Category name is required."); return; }
    if (!formData.image)       { setFormError("An image is required."); return; }
    setSaving(true);
    try {
      const url    = modalMode === "create" ? "/api/categories" : `/api/categories/${currentCategoryId}`;
      const method = modalMode === "create" ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, order: Number(formData.order) }) });
      const json   = await res.json();
      if (json.success) { showSuccessMessage(json.data.message || "Saved."); setModalOpen(false); fetchCategories(); }
      else setFormError(json.message || "Failed to save.");
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const openDeleteConfirm  = (cat) => { setCategoryToDelete(cat); setDeleteConfirmOpen(true); };

  const handleDeleteSubmit = async () => {
    if (!categoryToDelete) return;
    setDeleting(true); setError("");
    try {
      const res  = await fetch(`/api/categories/${categoryToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { showSuccessMessage(json.data.message || "Deleted."); setDeleteConfirmOpen(false); setCategoryToDelete(null); fetchCategories(); }
      else { setError(json.message || "Failed to delete."); setDeleteConfirmOpen(false); }
    } catch { setError("Network error."); setDeleteConfirmOpen(false); }
    finally { setDeleting(false); }
  };

  return (
    <AdminShell>
      {/* Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: 24, fontWeight: 700 }}>Categories</h2>
          <p style={{ fontSize: 13, color: "var(--adm-muted)", marginTop: 2 }}>
            Manage categories · Use ↑↓ arrows to set display order
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {error   && <div className="adm-alert adm-alert-danger"  style={{ marginBottom: 16 }}><AlertTriangle size={16} /><span>{error}</span></div>}
      {success && <div className="adm-alert adm-alert-success" style={{ marginBottom: 16 }}><span>{success}</span></div>}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : categories.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon"><ImageIcon size={40} /></div>
          <h3 className="adm-empty-state-title">No categories found</h3>
          <p className="adm-empty-state-desc">Create your first product category.</p>
          <button className="adm-btn adm-btn-primary" style={{ marginTop: 16 }} onClick={openCreateModal}><Plus size={16} /> Create Category</button>
        </div>
      ) : (
        <div className="adm-card-grid">
          {categories.map((category, index) => (
            <div key={category.id} className="adm-item-card" style={{ position: "relative" }}>
              {/* Order badge */}
              <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "#1a1a1a", color: "#fff", fontFamily: "Manrope,sans-serif", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>
                #{index + 1}
              </div>
              {/* Up/Down arrows */}
              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, display: "flex", gap: 4 }}>
                <button className="adm-btn" style={{ width: 28, height: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: index === 0 ? 0.3 : 1 }}
                  disabled={index === 0 || reordering} onClick={() => moveCategory(index, "up")} title="Move up">
                  <ArrowUp size={13} />
                </button>
                <button className="adm-btn" style={{ width: 28, height: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: index === categories.length - 1 ? 0.3 : 1 }}
                  disabled={index === categories.length - 1 || reordering} onClick={() => moveCategory(index, "down")} title="Move down">
                  <ArrowDown size={13} />
                </button>
              </div>
              <div className="adm-item-img-container">
                <img src={category.image} alt={category.name} className="adm-item-img" />
              </div>
              <div className="adm-item-content">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="adm-item-badge">{category.subcategoriesCount || 0} {category.subcategoriesCount === 1 ? "subcategory" : "subcategories"}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
                    background: category.showOnHome !== false ? "#DCFCE7" : "#F3F4F6",
                    color:      category.showOnHome !== false ? "#166534" : "#6B7280",
                  }}>
                    {category.showOnHome !== false ? "✓ On Home" : "Hidden"}
                  </span>
                </div>
                <h3 className="adm-item-title">{category.name}</h3>
                <p className="adm-item-desc">{category.description || "No description provided."}</p>
                <div className="adm-item-actions">
                  <button className="adm-btn" onClick={() => openEditModal(category)}><Edit2 size={14} /> Edit</button>
                  <button className="adm-btn adm-btn-danger" onClick={() => openDeleteConfirm(category)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{modalMode === "create" ? "Add Category" : "Edit Category"}</h3>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="adm-modal-body">
                {formError && <div className="adm-alert adm-alert-danger" style={{ marginBottom: 16 }}><AlertTriangle size={16} /><span>{formError}</span></div>}

                <div className="adm-form-group">
                  <label className="adm-form-label">Category Name<span>*</span></label>
                  <input type="text" className="adm-form-input" placeholder="e.g. Wall Décor" value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} disabled={saving} required />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description <span style={{ fontWeight:400, color:"var(--adm-muted)", fontSize:11 }}>(short — shown in footer/nav)</span></label>
                  <textarea className="adm-form-textarea" placeholder="Short description..." value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} disabled={saving} />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Long Description
                    <span style={{ fontWeight:400, color:"var(--adm-muted)", fontSize:11, marginLeft:6 }}>(optional — shown on products listing page)</span>
                  </label>
                  <textarea className="adm-form-textarea" placeholder="Write a detailed description for this category. This will appear on the products page when this category is selected..."
                    style={{ minHeight:120 }}
                    value={formData.longDescription || ""}
                    onChange={e => setFormData(p => ({ ...p, longDescription: e.target.value }))}
                    disabled={saving} />
                  <p style={{ fontSize:11, color:"var(--adm-muted)", marginTop:4 }}>
                    Supports plain text. Shown below the category title on the products listing page.
                  </p>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Display Order</label>
                  <input type="number" className="adm-form-input" placeholder="0" min="0" value={formData.order}
                    onChange={e => setFormData(p => ({ ...p, order: Number(e.target.value) }))} disabled={saving} style={{ maxWidth: 120 }} />
                  <p style={{ fontSize: 12, color: "var(--adm-muted)", marginTop: 4 }}>Lower number = shown first. Use ↑↓ arrows on list to reorder.</p>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Homepage Visibility</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
                    {/* Toggle switch */}
                    <div
                      onClick={() => !saving && setFormData(p => ({ ...p, showOnHome: !p.showOnHome }))}
                      style={{
                        width: 44, height: 24, borderRadius: 999, position: "relative",
                        background: formData.showOnHome ? "#F85700" : "#D1D5DB",
                        transition: "background .2s", cursor: saving ? "not-allowed" : "pointer", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 3, left: formData.showOnHome ? 23 : 3,
                        width: 18, height: 18, borderRadius: "50%", background: "#fff",
                        transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                      }} />
                    </div>
                    <span style={{ fontFamily: "Manrope,sans-serif", fontSize: 14, color: "var(--adm-text)" }}>
                      {formData.showOnHome ? "Visible on homepage" : "Hidden from homepage"}
                    </span>
                  </label>
                  <p style={{ fontSize: 12, color: "var(--adm-muted)", marginTop: 6 }}>
                    When off, this category won't appear in the Collections section on the home page.
                  </p>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Category Image<span>*</span></label>
                  {formData.image ? (
                    <div className="adm-uploader-preview-wrap">
                      <img src={formData.image} alt="Preview" className="adm-uploader-preview-img" />
                      <div className="adm-uploader-preview-overlay">
                        <button type="button" className="adm-btn adm-btn-danger" style={{ background: "#fff", color: "#DC2626", border: "none" }}
                          onClick={() => setFormData(p => ({ ...p, image: "" }))} disabled={saving}>
                          <Trash2 size={14} /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`adm-uploader-area ${dragging ? "dragging" : ""}`}
                      onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                      onClick={() => document.getElementById("category-image-input").click()}>
                      <input type="file" id="category-image-input" style={{ display: "none" }} accept="image/*"
                        onChange={handleFileChange} disabled={uploading || saving} />
                      {uploading ? (
                        <><Loader2 size={28} style={{ animation: "adm-spin 1s linear infinite" }} /><span className="adm-uploader-text">Uploading...</span></>
                      ) : (
                        <><Upload size={28} /><span className="adm-uploader-text"><strong>Click to upload</strong> or drag and drop</span><span className="adm-uploader-hint">WEBP, PNG, JPG or SVG (max. 5MB)</span></>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving || uploading}>
                  {saving ? <><Loader2 size={16} style={{ animation: "adm-spin 1s linear infinite" }} /> Saving...</> : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: 420 }}>
            <div className="adm-modal-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <h3 className="adm-modal-title" style={{ color: "#DC2626" }}>Delete Category</h3>
              <button className="adm-modal-close" onClick={() => setDeleteConfirmOpen(false)}><X size={18} /></button>
            </div>
            <div className="adm-modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 14, color: "var(--adm-text)", lineHeight: 1.5 }}>
                Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? This cannot be undone.
              </p>
              {categoryToDelete?.subcategoriesCount > 0 && (
                <div className="adm-alert adm-alert-danger" style={{ marginTop: 16, marginBottom: 0 }}>
                  <AlertTriangle size={16} />
                  <span>Delete all <strong>{categoryToDelete.subcategoriesCount}</strong> subcategories first.</span>
                </div>
              )}
            </div>
            <div className="adm-modal-footer" style={{ borderTop: "none", background: "none" }}>
              <button className="adm-btn" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={handleDeleteSubmit}
                disabled={deleting || categoryToDelete?.subcategoriesCount > 0}>
                {deleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
