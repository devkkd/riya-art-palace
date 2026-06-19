"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: ""
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [dragging, setDragging] = useState(false);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      } else {
        setError(json.message || "Failed to load categories.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "", description: "", image: "" });
    setCurrentCategoryId(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode("edit");
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image
    });
    setCurrentCategoryId(category.id);
    setFormError("");
    setModalOpen(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setFormError("Only image files (JPEG, PNG, WEBP, etc.) are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }

    setUploading(true);
    setFormError("");

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setFormData((prev) => ({ ...prev, image: json.data.url }));
      } else {
        setFormError(json.message || "Upload failed. Please check your credentials in .env.local.");
      }
    } catch (err) {
      setFormError("Network error. Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    if (!formData.image) {
      setFormError("An image is required. Please upload an image first.");
      return;
    }

    setSaving(true);

    try {
      const url = modalMode === "create" 
        ? "/api/categories" 
        : `/api/categories/${currentCategoryId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Category saved successfully.");
        setModalOpen(false);
        fetchCategories();
      } else {
        setFormError(json.message || "Failed to save category.");
      }
    } catch (err) {
      setFormError("Network error. Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Category deleted successfully.");
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        setError(json.message || "Failed to delete category.");
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      setError("Network error. Failed to delete category.");
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="adm-actions-bar">
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "24px", fontWeight: 700 }}>Categories</h2>
          <p style={{ fontSize: "13px", color: "var(--adm-muted)", marginTop: "2px" }}>
            Create and manage product categories for your catalog
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="adm-alert adm-alert-danger">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="adm-alert adm-alert-success">
          <span>{success}</span>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : categories.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon">
            <ImageIcon size={40} />
          </div>
          <h3 className="adm-empty-state-title">No categories found</h3>
          <p className="adm-empty-state-desc">
            Get started by creating your first product category.
          </p>
          <button className="adm-btn adm-btn-primary" style={{ marginTop: "16px" }} onClick={openCreateModal}>
            <Plus size={16} />
            Create Category
          </button>
        </div>
      ) : (
        <div className="adm-card-grid">
          {categories.map((category) => (
            <div key={category.id} className="adm-item-card">
              <div className="adm-item-img-container">
                <img src={category.image} alt={category.name} className="adm-item-img" />
              </div>
              <div className="adm-item-content">
                <span className="adm-item-badge">
                  {category.subcategoriesCount || 0} {category.subcategoriesCount === 1 ? "subcategory" : "subcategories"}
                </span>
                <h3 className="adm-item-title">{category.name}</h3>
                <p className="adm-item-desc">{category.description || "No description provided."}</p>
                <div className="adm-item-actions">
                  <button className="adm-btn" onClick={() => openEditModal(category)}>
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button className="adm-btn adm-btn-danger" onClick={() => openDeleteConfirm(category)}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{modalMode === "create" ? "Add Category" : "Edit Category"}</h3>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="adm-modal-body">
                {formError && (
                  <div className="adm-alert adm-alert-danger" style={{ marginBottom: "16px" }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Category Name<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="adm-form-input"
                    placeholder="e.g. Wooden Handicrafts"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={saving}
                    required
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-textarea"
                    placeholder="Describe the category..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    disabled={saving}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Category Image<span>*</span>
                  </label>

                  {formData.image ? (
                    <div className="adm-uploader-preview-wrap">
                      <img src={formData.image} alt="Preview" className="adm-uploader-preview-img" />
                      <div className="adm-uploader-preview-overlay">
                        <button
                          type="button"
                          className="adm-btn adm-btn-danger"
                          style={{ background: "#fff", color: "#DC2626", border: "none" }}
                          onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          disabled={saving}
                        >
                          <Trash2 size={14} />
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`adm-uploader-area ${dragging ? "dragging" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("category-image-input").click()}
                    >
                      <input
                        type="file"
                        id="category-image-input"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading || saving}
                      />
                      
                      {uploading ? (
                        <>
                          <Loader2 className="adm-uploader-icon adm-spin" size={28} style={{ animation: "adm-spin 1s linear infinite" }} />
                          <span className="adm-uploader-text">Uploading image to Cloudflare...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="adm-uploader-icon" size={28} />
                          <span className="adm-uploader-text">
                            <strong>Click to upload</strong> or drag and drop
                          </span>
                          <span className="adm-uploader-hint">WEBP, PNG, JPG or SVG (max. 5MB)</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn" onClick={() => setModalOpen(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving || uploading}>
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: "adm-spin 1s linear infinite" }} />
                      Saving...
                    </>
                  ) : (
                    "Save Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: "420px" }}>
            <div className="adm-modal-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <h3 className="adm-modal-title" style={{ color: "#DC2626" }}>Delete Category</h3>
              <button className="adm-modal-close" onClick={() => setDeleteConfirmOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "14px", color: "var(--adm-text)", lineHeight: 1.5 }}>
                Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>? 
                This action cannot be undone.
              </p>
              {categoryToDelete?.subcategoriesCount > 0 && (
                <div className="adm-alert adm-alert-danger" style={{ marginTop: "16px", marginBottom: 0 }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>
                    This category has <strong>{categoryToDelete.subcategoriesCount}</strong> associated subcategories. 
                    You must delete all associated subcategories before deleting the category itself.
                  </span>
                </div>
              )}
            </div>
            <div className="adm-modal-footer" style={{ borderTop: "none", background: "none" }}>
              <button className="adm-btn" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                Cancel
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={handleDeleteSubmit}
                disabled={deleting || (categoryToDelete?.subcategoriesCount > 0)}
              >
                {deleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
