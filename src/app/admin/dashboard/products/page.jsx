"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, Upload, X, Image as ImageIcon,
  Loader2, AlertTriangle, Filter, Search, ChevronDown,
  CheckSquare, Square, Trash, Pencil, CheckCheck,
} from "lucide-react";
import AdminShell from "@/app/components/admin/AdminShell";
import ProductWatermark from "@/app/components/ProductWatermark";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");

  // ── Bulk select state ──
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [bulkFields, setBulkFields] = useState({
    category: "", subcategory: "", price: "", priceUnit: "", minOrderQty: "",
    showInRetail: "", bestSelling: "", newArrival: "",
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentProductId, setCurrentProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    priceUnit: "Piece",
    sku: "",
    minOrderQty: 500,
    showInRetail: false,
    category: "",
    subcategory: "",
    images: [],
    productType: "",
    primaryMaterial: "",
    style: "",
    setType: "",
    color: "",
    sizeCategory: "",
    theme: "",
    usageArea: "",
    bestSelling: false,
    newArrival: false
  });
  const [formSubcategories, setFormSubcategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk Upload States
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState([]);
  const [requiredImages, setRequiredImages] = useState([]);
  const [imageUploadStatus, setImageUploadStatus] = useState({});
  const [parsingExcel, setParsingExcel] = useState(false);
  const [importingProducts, setImportingProducts] = useState(false);
  const [bulkImportReport, setBulkImportReport] = useState(null);
  const [bulkImportError, setBulkImportError] = useState("");

  // Helper Image URL states
  const [uploadedMediaList, setUploadedMediaList] = useState([]);
  const [helperUploading, setHelperUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Specifications visible accordion state (optional UI toggle)
  const [showSpecs, setShowSpecs] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryFilter, subcategoryFilter]);

  // Sync subcategories in form when category changes
  useEffect(() => {
    if (formData.category) {
      // Filter subcategories by selected category
      const filtered = subcategories.filter(sub => {
        const catId = typeof sub.category === "object" ? sub.category.id : sub.category;
        return catId === formData.category;
      });
      setFormSubcategories(filtered);
      
      // Clear subcategory if it's not in the new parent category's list
      const isSubValid = filtered.some(sub => sub.id === formData.subcategory);
      if (!isSubValid) {
        setFormData(prev => ({ ...prev, subcategory: "" }));
      }
    } else {
      setFormSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category, subcategories]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/subcategories");
      const json = await res.json();
      if (json.success) {
        setSubcategories(json.data);
      }
    } catch (err) {
      console.error("Failed to load subcategories", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "/api/products?";
      const params = new URLSearchParams();
      if (categoryFilter) params.append("category", categoryFilter);
      if (subcategoryFilter) params.append("subcategory", subcategoryFilter);
      if (searchQuery) params.append("q", searchQuery);

      url += params.toString();

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      } else {
        setError(json.message || "Failed to load products.");
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
      price: "",
      priceUnit: "Piece",
      sku: "",
      minOrderQty: 500,
      showInRetail: false,
      category: categories[0]?.id || "",
      subcategory: "",
      images: [],
      productType: "",
      primaryMaterial: "",
      style: "",
      setType: "",
      color: "",
      sizeCategory: "",
      theme: "",
      usageArea: "",
      bestSelling: false,
      newArrival: false
    });
    setCurrentProductId(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      priceUnit: product.priceUnit || "Piece",
      sku: product.sku || "",
      minOrderQty: product.minOrderQty ?? 500,
      showInRetail: !!product.showInRetail,
      category: product.category?.id || product.category || "",
      subcategory: product.subcategory?.id || product.subcategory || "",
      images: product.images || [],
      productType: product.productType || "",
      primaryMaterial: product.primaryMaterial || "",
      style: product.style || "",
      setType: product.setType || "",
      color: product.color || "",
      sizeCategory: product.sizeCategory || "",
      theme: product.theme || "",
      usageArea: product.usageArea || "",
      bestSelling: !!product.bestSelling,
      newArrival: !!product.newArrival
    });
    setCurrentProductId(product.id);
    setFormError("");
    setModalOpen(true);
  };

  // Compress image client-side to stay under Vercel's 4.5MB body limit
  const compressImage = (file, maxSizeBytes = 3.5 * 1024 * 1024) => {
    return new Promise((resolve) => {
      // If already small enough, skip compression
      if (file.size <= maxSizeBytes) { resolve(file); return; }

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if very large
        const MAX_DIM = 2000;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        // Try progressively lower quality until size is acceptable
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxSizeBytes || quality <= 0.3) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }, "image/jpeg", quality);
        };
        tryCompress();
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  };

  // Upload via /api/upload (with compression to stay under 4.5MB Vercel limit)
  const uploadFileViaPresign = async (file) => {
    const compressed = await compressImage(file);
    const data = new FormData();
    data.append("file", compressed);
    const res  = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.success) return json.data.url;
    throw new Error(json.message || "Upload failed");
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setFormError("");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        setFormError("Only image files are allowed.");
        setUploading(false);
        return;
      }

      try {
        const url = await uploadFileViaPresign(file);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, url],
        }));
      } catch (err) {
        setFormError(err.message || "Image upload failed.");
        break;
      }
    }
    setUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setFormError("A valid price is required.");
      return;
    }
    if (!formData.category) {
      setFormError("Parent category is required.");
      return;
    }
    if (formData.images.length === 0) {
      setFormError("Please upload at least one product image.");
      return;
    }

    setSaving(true);

    try {
      const url = modalMode === "create"
        ? "/api/products"
        : `/api/products/${currentProductId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      // Prepare payload: convert price to number
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Product saved successfully.");
        setModalOpen(false);
        fetchProducts();
      } else {
        setFormError(json.message || "Failed to save product.");
      }
    } catch (err) {
      setFormError("Network error. Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        showSuccessMessage(json.data.message || "Product deleted successfully.");
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
        fetchProducts();
      } else {
        setError(json.message || "Failed to delete product.");
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      setError("Network error. Failed to delete product.");
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Filtered products list (used for bulk select + display)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter && (p.category?.id || p.category) !== categoryFilter) return false;
      if (subcategoryFilter && (p.subcategory?.id || p.subcategory) !== subcategoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, categoryFilter, subcategoryFilter, searchQuery]);

  // ── Bulk select helpers ──
  const visibleProductIds = useMemo(
    () => filteredProducts.map(p => p.id || p._id),
    [filteredProducts]
  );

  const allSelected = visibleProductIds.length > 0 && visibleProductIds.every(id => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleProductIds));
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const res  = await fetch("/api/products/bulk/delete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessMessage(json.data.message);
        setSelectedIds(new Set());
        setBulkDeleteConfirmOpen(false);
        fetchProducts();
      } else {
        setError(json.message || "Bulk delete failed");
      }
    } catch { setError("Network error during bulk delete"); }
    finally { setBulkDeleting(false); }
  };

  const handleBulkEdit = async (e) => {
    if (e) e.preventDefault();
    // Build updates — only non-empty fields
    const updates = {};
    if (bulkFields.category)    updates.category    = bulkFields.category;
    if (bulkFields.subcategory) updates.subcategory = bulkFields.subcategory;
    if (bulkFields.price !== "" && bulkFields.price !== undefined) updates.price = Number(bulkFields.price);
    if (bulkFields.priceUnit)   updates.priceUnit   = bulkFields.priceUnit;
    if (bulkFields.minOrderQty !== "") updates.minOrderQty = Number(bulkFields.minOrderQty);
    if (bulkFields.showInRetail !== "") updates.showInRetail = bulkFields.showInRetail === "true";
    if (bulkFields.bestSelling  !== "") updates.bestSelling  = bulkFields.bestSelling  === "true";
    if (bulkFields.newArrival   !== "") updates.newArrival   = bulkFields.newArrival   === "true";

    if (Object.keys(updates).length === 0) {
      setError("Please select at least one field to update");
      return;
    }

    setBulkEditing(true);
    try {
      const res  = await fetch("/api/products/bulk/edit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), updates }),
      });
      const json = await res.json();
      if (json.success) {
        showSuccessMessage(json.data.message);
        setSelectedIds(new Set());
        setBulkEditOpen(false);
        setBulkFields({ category:"", subcategory:"", price:"", priceUnit:"", minOrderQty:"", showInRetail:"", bestSelling:"", newArrival:"" });
        fetchProducts();
      } else {
        setError(json.message || "Bulk edit failed");
      }
    } catch { setError("Network error during bulk edit"); }
    finally { setBulkEditing(false); }
  };

  const handleCloseBulkModal = () => {
    setBulkModalOpen(false);
    setParsedRows([]);
    setRequiredImages([]);
    setImageUploadStatus({});
    setBulkImportReport(null);
    setBulkImportError("");
    setUploadedMediaList([]);
    setHelperUploading(false);
    setCopiedIndex(null);
  };

  const handleHelperImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setHelperUploading(true);
    const newList = [...uploadedMediaList];

    for (const file of files) {
      try {
        const url = await uploadFileViaPresign(file);
        newList.unshift({ name: file.name, url });
      } catch (err) {
        console.error("Failed to upload helper image", err);
      }
    }

    setUploadedMediaList(newList);
    setHelperUploading(false);
  };

  const handleCopyHelperUrl = (url, idx) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Name",
      "Description",
      "Price",
      "Price Unit",
      "Category",
      "Subcategory",
      "Product Type",
      "Primary Material",
      "Style",
      "Set Type",
      "Color",
      "Size Category",
      "Theme",
      "Usage Area",
      "Best Selling",
      "New Arrival",
      "Images"
    ];
    const exampleRow = [
      "Pom Pom Wall Hanging - Handcrafted",
      "Traditional pom pom hanging handcrafted by local artisans.",
      "180",
      "Piece",
      "Wall Decor",
      "Gota Hangings",
      "Hanging",
      "Wood & Beads",
      "Rajasthani",
      "Single",
      "Multicolor",
      "Medium",
      "Festive",
      "Entrance, Temple",
      "Yes",
      "No",
      "gota_hanging_1.jpg, gota_hanging_2.jpg"
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), exampleRow.map(v => `"${v.replace(/"/g, '""')}"`).join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "riya_art_palace_bulk_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingExcel(true);
    setBulkImportError("");
    setBulkImportReport(null);
    setParsedRows([]);
    setRequiredImages([]);
    setImageUploadStatus({});

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/bulk/parse", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setParsedRows(json.data.rows || []);
        setRequiredImages(json.data.requiredImages || []);
        
        const initialStatus = {};
        (json.data.requiredImages || []).forEach(img => {
          initialStatus[img] = { status: "pending", url: "" };
        });
        setImageUploadStatus(initialStatus);
      } else {
        setBulkImportError(json.message || "Failed to parse spreadsheet file.");
      }
    } catch (err) {
      setBulkImportError("Network error parsing sheet.");
    } finally {
      setParsingExcel(false);
    }
  };

  const handleImagesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      const fileName = file.name;

      // Case-insensitive filename match
      const matchedKey = Object.keys(imageUploadStatus).find(
        k => k.toLowerCase() === fileName.toLowerCase()
      );

      if (matchedKey === undefined) continue;

      setImageUploadStatus(prev => ({
        ...prev,
        [matchedKey]: { ...prev[matchedKey], status: "uploading" }
      }));

      try {
        const url = await uploadFileViaPresign(file);
        setImageUploadStatus(prev => ({
          ...prev,
          [matchedKey]: { status: "done", url }
        }));
      } catch (err) {
        setImageUploadStatus(prev => ({
          ...prev,
          [matchedKey]: { ...prev[matchedKey], status: "failed" }
        }));
      }
    }
  };

  const handleBulkImportSubmit = async () => {
    setImportingProducts(true);
    setBulkImportError("");
    setBulkImportReport(null);

    const finalProducts = parsedRows.map(row => {
      const mappedImages = (row.images || []).map(img => {
        if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
          return img;
        }
        // Case-insensitive lookup
        const matchedKey = Object.keys(imageUploadStatus).find(
          k => k.toLowerCase() === img.toLowerCase()
        );
        return matchedKey ? (imageUploadStatus[matchedKey]?.url || "") : "";
      }).filter(Boolean);

      return {
        ...row,
        images: mappedImages
      };
    });

    try {
      const res = await fetch("/api/products/bulk/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: finalProducts }),
      });

      const json = await res.json();
      if (json.success) {
        setBulkImportReport(json.data);
        if (!json.data.errors || json.data.errors.length === 0) {
          showSuccessMessage(`Imported ${json.data.importedCount} products successfully!`);
          fetchProducts();
          setTimeout(() => {
            handleCloseBulkModal();
          }, 1500);
        } else {
          fetchProducts();
        }
      } else {
        setBulkImportError(json.message || "Failed to import products.");
      }
    } catch (err) {
      setBulkImportError("Network error during bulk import.");
    } finally {
      setImportingProducts(false);
    }
  };

  // Get filtered subcategories for top filter bar
  const topFilterSubcategories = subcategories.filter(sub => {
    const catId = typeof sub.category === "object" ? sub.category.id : sub.category;
    return !categoryFilter || catId === categoryFilter;
  });


  return (
    <AdminShell>
      {/* Page Header */}
      <div className="adm-actions-bar" style={{ gap: "20px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "24px", fontWeight: 700 }}>Products</h2>
          <p style={{ fontSize: "13px", color: "var(--adm-muted)", marginTop: "2px" }}>
            Add, update, and manage products inside your shop catalog
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="adm-btn" onClick={() => setBulkModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Upload size={16} />
            Bulk Import
          </button>
          <button className="adm-btn adm-btn-primary" onClick={openCreateModal} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: "var(--adm-white)",
        padding: "16px 20px",
        borderRadius: "14px",
        border: "1px solid var(--adm-border)",
        marginBottom: "24px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center"
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", flex: "1", minWidth: "200px" }}>
          <Search size={16} style={{ color: "var(--adm-muted)", position: "absolute", left: "12px" }} />
          <input
            type="text"
            placeholder="Search products by name..."
            className="adm-form-input"
            style={{ paddingLeft: "36px", margin: 0, height: "40px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={14} style={{ color: "var(--adm-muted)" }} />
          <select
            className="adm-form-select"
            style={{ width: "160px", height: "40px", padding: "8px 12px", fontSize: "13px" }}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter(""); // Reset subcategory filter when category changes
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            className="adm-form-select"
            style={{ width: "160px", height: "40px", padding: "8px 12px", fontSize: "13px" }}
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            disabled={!categoryFilter}
          >
            <option value="">All Subcategories</option>
            {topFilterSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {(categoryFilter || subcategoryFilter || searchQuery) && (
          <button
            className="adm-btn"
            style={{ height: "40px", padding: "0 12px", fontSize: "13px" }}
            onClick={() => {
              setCategoryFilter("");
              setSubcategoryFilter("");
              setSearchQuery("");
            }}
          >
            Reset
          </button>
        )}
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

      {/* ── Bulk Action Bar ── */}
      {someSelected && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          background: "#EDE9FE", border: "1.5px solid #C4B5FD", borderRadius: 12,
          padding: "12px 18px", marginBottom: 16,
        }}>
          <span style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:700, color:"#5B21B6" }}>
            {selectedIds.size} product{selectedIds.size !== 1 ? "s" : ""} selected
          </span>

          <button onClick={() => setBulkEditOpen(true)}
            style={{ display:"flex", alignItems:"center", gap:6, height:34, padding:"0 16px", border:"none", borderRadius:8, background:"#5B21B6", color:"#fff", fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:700, cursor:"pointer", transition:"background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background="#4C1D95"}
            onMouseLeave={e => e.currentTarget.style.background="#5B21B6"}
          >
            <Pencil size={14}/> Bulk Edit
          </button>

          <button onClick={() => setBulkDeleteConfirmOpen(true)} disabled={bulkDeleting}
            style={{ display:"flex", alignItems:"center", gap:6, height:34, padding:"0 16px", border:"none", borderRadius:8, background:"#DC2626", color:"#fff", fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:700, cursor:"pointer", opacity: bulkDeleting ? .6 : 1 }}
          >
            {bulkDeleting ? <Loader2 size={14} style={{ animation:"adm-spin 1s linear infinite" }}/> : <Trash size={14}/>}
            {bulkDeleting ? "Deleting…" : "Delete Selected"}
          </button>

          <button onClick={() => setSelectedIds(new Set())}
            style={{ display:"flex", alignItems:"center", gap:5, height:34, padding:"0 14px", border:"1.5px solid #C4B5FD", borderRadius:8, background:"transparent", fontFamily:"Manrope,sans-serif", fontSize:12, fontWeight:600, color:"#5B21B6", cursor:"pointer" }}
          >
            <X size={13}/> Clear
          </button>

          <span style={{ marginLeft:"auto", fontFamily:"Manrope,sans-serif", fontSize:12, color:"#7C3AED", fontStyle:"italic" }}>
            {filteredProducts.length} total visible
          </span>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <div className="adm-loading-spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className="adm-empty-state">
          <div className="adm-empty-state-icon">
            <ImageIcon size={40} />
          </div>
          <h3 className="adm-empty-state-title">No products found</h3>
          <p className="adm-empty-state-desc">
            {categoryFilter || subcategoryFilter || searchQuery
              ? "No products match your current search criteria."
              : "Get started by adding your first product to the catalog."}
          </p>
          {!categoryFilter && !subcategoryFilter && !searchQuery && (
            <button className="adm-btn adm-btn-primary" style={{ marginTop: "16px" }} onClick={openCreateModal}>
              <Plus size={16} />
              Create Product
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Select All bar */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"8px 4px" }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" }}>
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                style={{ width:16, height:16, accentColor:"#5B21B6", cursor:"pointer" }}/>
              <span style={{ fontFamily:"Manrope,sans-serif", fontSize:13, fontWeight:600, color:"var(--adm-text)" }}>
                {allSelected ? "Deselect All" : "Select All"} ({filteredProducts.length})
              </span>
            </label>
            {someSelected && (
              <span style={{ fontSize:12, color:"#5B21B6", fontFamily:"Manrope,sans-serif", fontWeight:700 }}>
                ✓ {selectedIds.size} selected
              </span>
            )}
          </div>

          <div className="adm-card-grid">
          {filteredProducts.map((product) => {
            const isSelected = selectedIds.has(product.id || product._id);
            return (
            <div key={product.id} className="adm-item-card" style={{ outline: isSelected ? "2px solid #5B21B6" : "none", outlineOffset:2, position:"relative" }}>
              {/* Checkbox */}
              <div style={{ position:"absolute", top:10, left:10, zIndex:3 }}
                onClick={e => { e.stopPropagation(); toggleSelect(product.id || product._id); }}>
                <div style={{
                  width:22, height:22, borderRadius:6, border:`2px solid ${isSelected ? "#5B21B6" : "#D7CEC5"}`,
                  background: isSelected ? "#5B21B6" : "#fff",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", transition:"all .15s", flexShrink:0,
                }}>
                  {isSelected && <span style={{ color:"#fff", fontSize:13, fontWeight:700, lineHeight:1 }}>✓</span>}
                </div>
              </div>
              <div className="adm-item-img-container" style={{ position: "relative" }}>
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="adm-item-img"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "var(--adm-white)",
                    border: "1px solid var(--adm-border)",
                    color: "var(--adm-charcoal)",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "8px"
                  }}
                >
                  ₹ {product.price}/{product.priceUnit || "Piece"}
                </span>
                <ProductWatermark size="sm" />
              </div>
              <div className="adm-item-content">
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span className="adm-item-badge" style={{ margin: 0 }}>
                    {product.category?.name || "Uncategorized"}
                  </span>
                  {product.sku && (
                    <span style={{ margin: 0, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#EDE9FE", color: "#5B21B6" }}>
                      {product.sku}
                    </span>
                  )}
                  {product.showInRetail && (
                    <span style={{ margin: 0, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#D1FAE5", color: "#065F46" }}>
                      Retail
                    </span>
                  )}
                  {product.subcategory && (
                    <span
                      className="adm-item-badge"
                      style={{
                        margin: 0,
                        background: "#EBE3DA",
                        color: "var(--adm-text)",
                        border: "1px solid var(--adm-border)"
                      }}
                    >
                      {product.subcategory.name}
                    </span>
                  )}
                </div>
                <h3 className="adm-item-title">{product.name}</h3>
                <p className="adm-item-desc" style={{ minHeight: "56px" }}>
                  {product.description || "No description provided."}
                </p>

                {/* Micro specifications list inside card */}
                {(product.productType || product.primaryMaterial || product.color) && (
                  <div style={{
                    fontSize: "11px",
                    color: "var(--adm-muted)",
                    borderTop: "1px dashed var(--adm-border)",
                    paddingTop: "10px",
                    marginBottom: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    {product.productType && <div><strong>Type:</strong> {product.productType}</div>}
                    {product.primaryMaterial && <div><strong>Material:</strong> {product.primaryMaterial}</div>}
                    {product.color && <div><strong>Color:</strong> {product.color}</div>}
                  </div>
                )}

                <div className="adm-item-actions">
                  <button className="adm-btn" onClick={() => openEditModal(product)}>
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button className="adm-btn adm-btn-danger" onClick={() => openDeleteConfirm(product)}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        </>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: "750px", width: "95%", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
            <div className="adm-modal-header" style={{ flexShrink: 0 }}>
              <h3 className="adm-modal-title">{modalMode === "create" ? "Add Product" : "Edit Product"}</h3>
              <button className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
              <div className="adm-modal-body" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {formError && (
                  <div className="adm-alert adm-alert-danger" style={{ marginBottom: "20px" }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Part 1: Basic Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="adm-form-group" style={{ margin: 0, gridColumn: "span 2" }}>
                    <label className="adm-form-label">Product Name<span>*</span></label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Pom Pom Wall Hangings"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Price (₹)<span>*</span></label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="adm-form-input"
                      placeholder="100"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Price Unit<span>*</span></label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Piece, Set, Pair"
                      value={formData.priceUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceUnit: e.target.value }))}
                      disabled={saving}
                      required
                    />
                  </div>
                </div>

                {/* SKU field */}
                <div className="adm-form-group">
                  <label className="adm-form-label">
                    SKU Number
                    <span style={{ fontSize: 11, fontWeight: 400, color: "var(--adm-muted)", marginLeft: 8 }}>
                      (auto-generated if left blank)
                    </span>
                  </label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. RAP-001"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                      disabled={saving}
                      style={{ maxWidth: 200, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em" }}
                    />
                    {formData.sku && (
                      <span style={{ fontSize: 12, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6", padding: "4px 12px", borderRadius: 6, fontFamily: "monospace" }}>
                        {formData.sku}
                      </span>
                    )}
                    {!formData.sku && modalMode === "create" && (
                      <span style={{ fontSize: 12, color: "var(--adm-muted)", fontStyle: "italic" }}>
                        Will be auto-assigned on save
                      </span>
                    )}
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-textarea"
                    placeholder="Provide a description of the product..."
                    style={{ minHeight: "80px" }}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={saving}
                  />
                </div>

                {/* Part 2: Categorization */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Category<span>*</span></label>
                    <select
                      className="adm-form-select"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      disabled={saving}
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Subcategory</label>
                    <select
                      className="adm-form-select"
                      value={formData.subcategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                      disabled={saving || !formData.category}
                    >
                      <option value="">None (Fills general category)</option>
                      {formSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Part 2.5: Product Flags (Best Selling, New Arrivals, MOQ, Retail) */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px", background: "#F9F6F2", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--adm-border)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                    <input type="checkbox" checked={formData.bestSelling}
                      onChange={(e) => setFormData(prev => ({ ...prev, bestSelling: e.target.checked }))}
                      disabled={saving} style={{ width: "18px", height: "18px", accentColor: "var(--adm-accent)" }}/>
                    Best Selling
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                    <input type="checkbox" checked={formData.newArrival}
                      onChange={(e) => setFormData(prev => ({ ...prev, newArrival: e.target.checked }))}
                      disabled={saving} style={{ width: "18px", height: "18px", accentColor: "var(--adm-accent)" }}/>
                    New Arrival
                  </label>
                  {/* Retail Offer toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: formData.showInRetail ? "#065F46" : "inherit" }}>
                    <input type="checkbox" checked={formData.showInRetail}
                      onChange={(e) => setFormData(prev => ({ ...prev, showInRetail: e.target.checked }))}
                      disabled={saving} style={{ width: "18px", height: "18px", accentColor: "#059669" }}/>
                    Show in Retail Offers
                  </label>
                  {/* MOQ */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--adm-text)", whiteSpace: "nowrap" }}>
                      Min Order Qty (MOQ)
                    </label>
                    <input type="number" min="1" value={formData.minOrderQty}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderQty: Number(e.target.value) }))}
                      disabled={saving}
                      style={{ width: 90, height: 36, border: "1.5px solid var(--adm-border)", borderRadius: 8, padding: "0 10px", fontFamily: "inherit", fontSize: 13, outline: "none" }}/>
                  </div>
                </div>

                {/* Part 3: Image Upload Area */}
                <div className="adm-form-group" style={{ marginBottom: "20px" }}>
                  <label className="adm-form-label">Product Images<span>*</span> (Upload at least one)</label>

                  {/* Previews Grid */}
                  {formData.images.length > 0 && (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px"
                    }}>
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} style={{
                          position: "relative",
                          height: "100px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid var(--adm-border)",
                          background: "#F3EFEB"
                        }}>
                          <img src={imgUrl} alt={`Product Image ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={saving}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              background: "rgba(220, 38, 38, 0.9)",
                              border: "none",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justify: "center",
                              padding: 0,
                              cursor: "pointer"
                            }}
                          >
                            <X size={12} style={{ margin: "auto" }} />
                          </button>
                          {index === 0 && (
                            <span style={{
                              position: "absolute",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              background: "rgba(45, 41, 38, 0.85)",
                              color: "#fff",
                              fontSize: "9px",
                              textAlign: "center",
                              padding: "2px 0",
                              fontWeight: 600
                            }}>
                              Thumbnail
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button area */}
                  <div
                    className={`adm-uploader-area`}
                    style={{ height: "100px", cursor: (uploading || saving) ? "not-allowed" : "pointer" }}
                    onClick={() => {
                      if (!uploading && !saving) {
                        document.getElementById("product-image-uploader").click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="product-image-uploader"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      disabled={uploading || saving}
                    />

                    {uploading ? (
                      <>
                        <Loader2 className="adm-uploader-icon adm-spin" size={24} style={{ animation: "adm-spin 1s linear infinite" }} />
                        <span className="adm-uploader-text">Uploading image assets...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="adm-uploader-icon" size={24} />
                        <span className="adm-uploader-text">
                          <strong>Click to upload</strong> images (supports multiple)
                        </span>
                        <span className="adm-uploader-hint">Max. 5MB per image</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Part 4: Specifications Accordion Toggle */}
                <div style={{
                  border: "1px solid var(--adm-border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "8px"
                }}>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#F9F6F2",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    onClick={() => setShowSpecs(p => !p)}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--adm-charcoal)" }}>
                      Product Specifications
                    </span>
                    <ChevronDown size={18} style={{
                      transform: showSpecs ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s"
                    }} />
                  </button>

                  {showSpecs && (
                    <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "var(--adm-white)" }}>
                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Product Type</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Wall Hanging"
                          value={formData.productType}
                          onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Primary Material</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Gota and POM POM"
                          value={formData.primaryMaterial}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryMaterial: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Style</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Traditional"
                          value={formData.style}
                          onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Set Type</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Single Piece, Set of 2"
                          value={formData.setType}
                          onChange={(e) => setFormData(prev => ({ ...prev, setType: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Color</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Multicolor"
                          value={formData.color}
                          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Size Category</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Large"
                          value={formData.sizeCategory}
                          onChange={(e) => setFormData(prev => ({ ...prev, sizeCategory: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Theme</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Festive"
                          value={formData.theme}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                          disabled={saving}
                        />
                      </div>

                      <div className="adm-form-group" style={{ margin: 0 }}>
                        <label className="adm-form-label" style={{ fontSize: "12px" }}>Usage Area</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Entrance, Temple, Living Room"
                          value={formData.usageArea}
                          onChange={(e) => setFormData(prev => ({ ...prev, usageArea: e.target.value }))}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="adm-modal-footer" style={{ flexShrink: 0 }}>
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
                    "Save Product"
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
              <h3 className="adm-modal-title" style={{ color: "#DC2626" }}>Delete Product</h3>
              <button className="adm-modal-close" onClick={() => setDeleteConfirmOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "14px", color: "var(--adm-text)", lineHeight: 1.5 }}>
                Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>?
                This action cannot be undone and will remove the item permanently from the store database.
              </p>
            </div>
            <div className="adm-modal-footer" style={{ borderTop: "none", background: "none" }}>
              <button className="adm-btn" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                Cancel
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={handleDeleteSubmit}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirmOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: "440px" }}>
            <div className="adm-modal-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <h3 className="adm-modal-title" style={{ color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
                <Trash2 size={20} /> Delete Selected Products
              </h3>
              <button className="adm-modal-close" onClick={() => setBulkDeleteConfirmOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="adm-modal-body" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: "14px", color: "var(--adm-text)", lineHeight: 1.6 }}>
                Are you sure you want to permanently delete <strong>{selectedIds.size}</strong> selected products?
              </p>
              <p style={{ fontSize: "12px", color: "var(--adm-muted)", marginTop: "8px" }}>
                This action cannot be undone. These products will be permanently removed from your catalog.
              </p>
            </div>
            <div className="adm-modal-footer" style={{ borderTop: "none", background: "none" }}>
              <button className="adm-btn" onClick={() => setBulkDeleteConfirmOpen(false)} disabled={bulkDeleting}>
                Cancel
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {bulkDeleting ? (
                  <>
                    <Loader2 size={15} style={{ animation: "adm-spin 1s linear infinite" }} />
                    Deleting...
                  </>
                ) : (
                  `Delete ${selectedIds.size} Products`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {bulkEditOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: "650px", width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className="adm-modal-header" style={{ flexShrink: 0 }}>
              <div>
                <h3 className="adm-modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pencil size={18} style={{ color: "#5B21B6" }} />
                  Bulk Edit Products
                </h3>
                <span style={{ fontSize: "12px", color: "#5B21B6", fontWeight: 600 }}>
                  Updating {selectedIds.size} selected product{selectedIds.size !== 1 ? "s" : ""}
                </span>
              </div>
              <button className="adm-modal-close" onClick={() => setBulkEditOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkEdit} style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
              <div className="adm-modal-body" style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#5B21B6", margin: 0, lineHeight: 1.5 }}>
                    💡 <strong>Tip:</strong> Only fill in the fields you wish to change across all {selectedIds.size} selected items. Any fields left blank or set to &quot;Keep Current&quot; will remain unchanged.
                  </p>
                </div>

                {/* Categorization */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Category</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.category}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, category: e.target.value, subcategory: "" }))}
                      disabled={bulkEditing}
                    >
                      <option value="">— Keep Current Category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Subcategory</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.subcategory}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, subcategory: e.target.value }))}
                      disabled={bulkEditing || !bulkFields.category}
                    >
                      <option value="">
                        {!bulkFields.category ? "— Select Category First —" : "— Keep Current Subcategory —"}
                      </option>
                      {subcategories
                        .filter(sub => {
                          if (!bulkFields.category) return true;
                          const catId = typeof sub.category === "object" ? sub.category?._id || sub.category?.id : sub.category;
                          return catId === bulkFields.category;
                        })
                        .map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                {/* Pricing & MOQ */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className="adm-form-input"
                      placeholder="Keep current"
                      value={bulkFields.price}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, price: e.target.value }))}
                      disabled={bulkEditing}
                    />
                  </div>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Price Unit</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.priceUnit}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, priceUnit: e.target.value }))}
                      disabled={bulkEditing}
                    >
                      <option value="">— Keep Current —</option>
                      <option value="Piece">Piece</option>
                      <option value="Set">Set</option>
                      <option value="Pair">Pair</option>
                      <option value="Box">Box</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Min Order Qty (MOQ)</label>
                    <input
                      type="number"
                      min="1"
                      className="adm-form-input"
                      placeholder="Keep current"
                      value={bulkFields.minOrderQty}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, minOrderQty: e.target.value }))}
                      disabled={bulkEditing}
                    />
                  </div>
                </div>

                {/* Flags: Retail, Best Selling, New Arrival */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Show in Retail</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.showInRetail}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, showInRetail: e.target.value }))}
                      disabled={bulkEditing}
                    >
                      <option value="">— Keep Current —</option>
                      <option value="true">Yes, show in retail</option>
                      <option value="false">No, wholesale only</option>
                    </select>
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">Best Selling</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.bestSelling}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, bestSelling: e.target.value }))}
                      disabled={bulkEditing}
                    >
                      <option value="">— Keep Current —</option>
                      <option value="true">Yes, mark best selling</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-form-label">New Arrival</label>
                    <select
                      className="adm-form-select"
                      value={bulkFields.newArrival}
                      onChange={(e) => setBulkFields(prev => ({ ...prev, newArrival: e.target.value }))}
                      disabled={bulkEditing}
                    >
                      <option value="">— Keep Current —</option>
                      <option value="true">Yes, mark new arrival</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="adm-modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="adm-btn"
                  onClick={() => setBulkEditOpen(false)}
                  disabled={bulkEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn adm-btn-primary"
                  disabled={bulkEditing}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {bulkEditing ? (
                    <>
                      <Loader2 size={16} style={{ animation: "adm-spin 1s linear infinite" }} />
                      Updating {selectedIds.size} Products...
                    </>
                  ) : (
                    `Apply Changes to ${selectedIds.size} Products`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {bulkModalOpen && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-container" style={{ maxWidth: "800px", display: "flex", flexDirection: "column", maxHeight: "85vh" }}>
            
            <div className="adm-modal-header" style={{ flexShrink: 0 }}>
              <h3 className="adm-modal-title">Bulk Import Products</h3>
              <button className="adm-modal-close" onClick={handleCloseBulkModal}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body" style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {/* Image URL Generator Helper */}
              <div style={{ background: "#F0FDF4", padding: "16px", borderRadius: "10px", border: "1px solid #BBF7D0", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#166534", marginBottom: "4px" }}>
                  Image URL Generator (Option A Helper)
                </h4>
                <p style={{ fontSize: "12px", color: "#15803d", marginBottom: "12px" }}>
                  Upload your images here to generate public URLs. You can copy these URLs and paste them into the "Images" column of your Excel sheet.
                </p>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="bulk-helper-images"
                    onChange={handleHelperImagesUpload}
                    style={{ display: "none" }}
                    disabled={helperUploading}
                  />
                  <label
                    htmlFor="bulk-helper-images"
                    className="adm-btn"
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", margin: 0, background: "#166534", color: "#fff", borderColor: "#166534" }}
                  >
                    <Upload size={14} />
                    {helperUploading ? "Uploading..." : "Upload Images"}
                  </label>
                </div>

                {uploadedMediaList.length > 0 && (
                  <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px", maxHeight: "150px", overflowY: "auto", padding: "8px" }}>
                    {uploadedMediaList.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderBottom: idx < uploadedMediaList.length - 1 ? "1px solid #F3F4F6" : "none", fontSize: "12px", gap: "10px" }}>
                        <img src={item.url} alt="preview" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px", border: "1px solid #E5E7EB" }} />
                        <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }} title={item.name}>
                          {item.name}
                        </span>
                        <button
                          type="button"
                          className="adm-btn"
                          style={{ padding: "4px 8px", fontSize: "11px", height: "28px" }}
                          onClick={() => handleCopyHelperUrl(item.url, idx)}
                        >
                          {copiedIndex === idx ? "Copied!" : "Copy URL"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {bulkImportError && (
                <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", color: "#DC2626", fontSize: "14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={16} />
                  <span>{bulkImportError}</span>
                </div>
              )}

              {/* Step 1: Download Template */}
              <div style={{ background: "#F9FAFB", padding: "16px", borderRadius: "10px", border: "1px solid #E5E7EB", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text)", marginBottom: "4px" }}>1. Download Excel/CSV Template</h4>
                <p style={{ fontSize: "12px", color: "var(--adm-muted)", marginBottom: "12px" }}>
                  Use our official template structure to prepare your product listings. Fill in details like Name, Price, Category, and Specs.
                </p>
                <button className="adm-btn" onClick={handleDownloadTemplate} style={{ fontSize: "12px", padding: "6px 12px", background: "#fff", border: "1px solid #D1D5DB" }}>
                  Download Template CSV
                </button>
              </div>

              {/* Step 2: Upload Excel File */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text)", marginBottom: "8px" }}>2. Upload Excel/CSV File</h4>
                <div style={{ border: "2px dashed #D1D5DB", padding: "24px 16px", borderRadius: "10px", textAlign: "center", background: "#fff", cursor: "pointer", position: "relative" }}>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelUpload}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                  />
                  <Upload size={24} style={{ color: "var(--adm-muted)", margin: "0 auto 8px auto" }} />
                  <span style={{ fontSize: "13px", color: "var(--adm-text)", display: "block" }}>
                    {parsingExcel ? "Parsing spreadsheet file..." : "Drag & drop or click to upload spreadsheet file"}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--adm-muted)" }}>Supports Excel (.xlsx, .xls) and CSV (.csv)</span>
                </div>
              </div>

              {/* Step 3: Parsed Rows Preview */}
              {parsedRows.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: 600, fontSize: "14px", color: "var(--adm-text)", marginBottom: "8px" }}>
                    Parsed Products List ({parsedRows.length} Rows found)
                  </h4>
                  <div style={{ maxHeight: "200px", overflow: "auto", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                      <thead style={{ background: "#F3F4F6", position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB" }}>Name</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB" }}>Category</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB" }}>Price</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #E5E7EB" }}>Images Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.map((row, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <td style={{ padding: "8px 12px", fontWeight: 500 }}>{row.name || <span style={{ color: "#EF4444" }}>Missing Name</span>}</td>
                            <td style={{ padding: "8px 12px", color: "var(--adm-muted)" }}>{row.categoryName}</td>
                            <td style={{ padding: "8px 12px" }}>₹ {row.price} / {row.priceUnit}</td>
                            <td style={{ padding: "8px 12px" }}>{(row.images || []).length} images</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step 4: Drop Matching Images */}
              {requiredImages.length > 0 && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "16px", borderRadius: "10px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#B45309", marginBottom: "4px" }}>
                    3. Select / Drop Matching Images
                  </h4>
                  <p style={{ fontSize: "12px", color: "#D97706", marginBottom: "12px" }}>
                    The excel sheet refers to the filenames below. Please select the corresponding image files from your computer to upload and match them.
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id="bulk-images-input"
                      onChange={handleImagesSelect}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="bulk-images-input"
                      className="adm-btn"
                      style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", background: "#fff" }}
                    >
                      <ImageIcon size={14} />
                      Choose matching image files
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
                    {requiredImages.map((img) => {
                      const statusObj = imageUploadStatus[img] || { status: "pending", url: "" };
                      let badgeColor = "#6B7280";
                      let badgeBg = "#F3F4F6";
                      let statusText = "Pending Upload";

                      if (statusObj.status === "uploading") {
                        badgeColor = "#3B82F6";
                        badgeBg = "#EFF6FF";
                        statusText = "Uploading...";
                      } else if (statusObj.status === "done") {
                        badgeColor = "#10B981";
                        badgeBg = "#ECFDF5";
                        statusText = "Ready";
                      } else if (statusObj.status === "failed") {
                        badgeColor = "#EF4444";
                        badgeBg = "#FEF2F2";
                        statusText = "Failed";
                      }

                      return (
                        <div key={img} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "11px" }}>
                          <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "120px" }} title={img}>
                            {img}
                          </span>
                          <span style={{ padding: "2px 6px", borderRadius: "999px", background: badgeBg, color: badgeColor, fontWeight: 600 }}>
                            {statusText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Import Report Section */}
              {bulkImportReport && (
                <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "16px", borderRadius: "10px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: 600, fontSize: "14px", color: "#065F46", marginBottom: "6px" }}>Import Execution Report</h4>
                  <p style={{ fontSize: "13px", color: "#047857" }}>
                    Products imported successfully: <strong>{bulkImportReport.importedCount}</strong>
                  </p>
                  
                  {bulkImportReport.failedCount > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <h5 style={{ fontWeight: 600, fontSize: "12px", color: "#991B1B", marginBottom: "4px" }}>
                        Errors encountered ({bulkImportReport.failedCount} rows failed):
                      </h5>
                      <div style={{ maxHeight: "120px", overflowY: "auto", background: "#FFF5F5", padding: "8px", borderRadius: "6px", border: "1px solid #FEE2E2", fontSize: "11px", color: "#991B1B" }}>
                        {bulkImportReport.errors.map((err, idx) => (
                          <div key={idx} style={{ marginBottom: "4px" }}>
                            Row {err.row} [<strong>{err.name}</strong>]: {err.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="adm-modal-footer" style={{ flexShrink: 0 }}>
              <button type="button" className="adm-btn" onClick={handleCloseBulkModal} disabled={importingProducts}>
                Close
              </button>
              <button
                type="button"
                className="adm-btn adm-btn-primary"
                onClick={handleBulkImportSubmit}
                disabled={importingProducts || parsingExcel || parsedRows.length === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {importingProducts ? (
                  <>
                    <Loader2 size={16} style={{ animation: "adm-spin 1s linear infinite" }} />
                    Importing...
                  </>
                ) : (
                  "Confirm Import"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminShell>
  );
}
