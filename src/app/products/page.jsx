import { Suspense } from "react";
import ProductsPage from "../components/ProductsPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F7F5F3" }} />}>
      <ProductsPage />
    </Suspense>
  );
}
