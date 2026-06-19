"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CatalogContext = createContext({
  categories: [],
  subcategories: [],
  products: [],
  loading: true,
  error: null,
  refreshCatalog: () => {},
});

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/catalog");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data.categories || []);
        setSubcategories(json.data.subcategories || []);
        setProducts(json.data.products || []);
        setError(null);
      } else {
        setError(json.message || "Failed to load catalog data.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <CatalogContext.Provider
      value={{
        categories,
        subcategories,
        products,
        loading,
        error,
        refreshCatalog: fetchCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
