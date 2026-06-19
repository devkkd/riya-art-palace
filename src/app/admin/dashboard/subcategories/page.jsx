"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  AlertTriangle,
  FolderTree,
  Filter
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: ""
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [selectedCategoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Failed to load categories dropdown", err);
    }
  };

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      let url = "/api/subcategories";
      if (selectedCategoryFilter) {
        url += `?category=${selectedCategoryFilter}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setSubcategories(json.data);
      } else {
        setError(json.message || "Failed to load subcategories.");
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
    setFormData({
      name: "",
      description: "",
      category: categories[0]?.id || ""
    });
    setCurrentSubcategoryId(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (subcategory) => {
    setModalMode("edit");
    setFormData({
      name: subcategory.name,
      description: subcategory.description || "",
      category: subcategory.category?.id || ""
    });
    setCurrentSubcategoryId(subcategory.id);
    setFormError("");
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Subcategory name is required.");
      return;
    }
    if (!formData.category) {
      setFormError("Please select a parent category.");
      return;
    }

    setSaving(true);

    try {
      const url = modalMode === "create" 
        ? "/api/subcategories" 
        : `/api/subcategories/${currentSubcategoryId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Subcategory saved successfully.");
        setModalOpen(false);
        fetchSubcategories();
      } else {
        setFormError(json.message || "Failed to save subcategory.");
      }
    } catch (err) {
      setFormError("Network error. Failed to save subcategory.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (subcategory) => {
    setSubcategoryToDelete(subcategory);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!subcategoryToDelete) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/subcategories/${subcategoryToDelete.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Subcategory deleted successfully.");
        setDeleteConfirmOpen(false);
        setSubcategoryToDelete(null);
        fetchSubcategories();
      } else {
        setError(json.message || "Failed to delete subcategory.");
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      setError("Network error. Failed to delete subcategory.");
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
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "24px", fontWeight: 700 }}>Subcategories</h2>
          <p style={{ fontSize: "13px", color: "var(--adm-muted)", marginTop: "2px" }}>
            Add and manage subcategories under main parent categories
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Category Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
            <Filter size={16} style={{ color: "var(--adm-muted)" }} />
            <select
              className="adm-form-select"
              style={{ width: "180px", padding: "8px 12px", fontSize: "13px" }}
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button className="adm-btn adm-btn-primary" onClick={openCreateModal}>
            <Plus size={16} />
            Add Subcategory
          </button>
        </div>
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
      ) : subcategories.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon">
            <FolderTree size={40} />
          </div>
          <h3 className="adm-empty-state-title">No subcategories found</h3>
          <p className="adm-empty-state-desc">
            {selectedCategoryFilter 
              ? "There are no subcategories in this category yet." 
              : "Get started by creating your first product subcategory."}
          </p>
          <button className="adm-btn adm-btn-primary" style={{ marginTop: "16px" }} onClick={openCreateModal}>
            <Plus size={16} />
            Create Subcategory
          </button>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Subcategory Name</th>
                  <th>Parent Category</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <td>
                      <span className="adm-table-title">{subcategory.name}</span>
                    </td>
                    <td>
                      <span className="adm-table-category">
                        {subcategory.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td style={{ maxWidth: "300px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {subcategory.description || "—"}
                    </td>
                    <td>
                      {subcategory.createdAt 
                        ? new Date(subcategory.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button className="adm-btn" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => openEditModal(subcategory)}>
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <button className="adm-btn adm-btn-danger" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => openDeleteConfirm(subcategory)}>
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Subcategory Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{modalMode === "create" ? "Add Subcategory" : "Edit Subcategory"}</h3>
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

                {categories.length === 0 ? (
                  <div className="adm-alert adm-alert-danger">
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>
                      You must create at least one <strong>Category</strong> before you can add subcategories.
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="adm-form-group">
                      <label className="adm-form-label">
                        Parent Category<span>*</span>
                      </label>
                      <select
                        className="adm-form-select"
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        disabled={saving}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="adm-form-group">
                      <label className="adm-form-label">
                        Subcategory Name<span>*</span>
                      </label>
                      <input
                        type="text"
                        className="adm-form-input"
                        placeholder="e.g. Marble Elephants"
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
                        placeholder="Describe the subcategory..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn" onClick={() => setModalOpen(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving || categories.length === 0}>
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: "adm-spin 1s linear infinite" }} />
                      Saving...
                    </>
                  ) : (
                    "Save Subcategory"
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
              <h3 className="adm-modal-title" style={{ color: "#DC2626" }}>Delete Subcategory</h3>
              <button className="adm-modal-close" onClick={() => setDeleteConfirmOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "14px", color: "var(--adm-text)", lineHeight: 1.5 }}>
                Are you sure you want to delete the subcategory <strong>{subcategoryToDelete?.name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="adm-modal-footer" style={{ borderTop: "none", background: "none" }}>
              <button className="adm-btn" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="adm-btn adm-btn-danger" onClick={handleDeleteSubmit} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
