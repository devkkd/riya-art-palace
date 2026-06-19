import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { errorResponse, successResponse } from "@/lib/utils/response";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse workbook
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with raw values
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    // Normalize keys and map fields
    const normalizedRows = rows.map((row) => {
      const normalized = {};
      for (const key of Object.keys(row)) {
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "");
        normalized[normalizedKey] = row[key];
      }
      
      const priceVal = normalized.price !== undefined && normalized.price !== "" ? Number(normalized.price) : 0;

      return {
        name: (normalized.name || "").toString().trim(),
        description: (normalized.description || normalized.desc || "").toString().trim(),
        price: isNaN(priceVal) ? 0 : priceVal,
        priceUnit: (normalized.priceunit || normalized.unit || "Piece").toString().trim(),
        categoryName: (normalized.category || "").toString().trim(),
        subcategoryName: (normalized.subcategory || "").toString().trim(),
        productType: (normalized.producttype || "").toString().trim(),
        primaryMaterial: (normalized.primarymaterial || "").toString().trim(),
        style: (normalized.style || "").toString().trim(),
        setType: (normalized.settype || "").toString().trim(),
        color: (normalized.color || "").toString().trim(),
        sizeCategory: (normalized.sizecategory || "").toString().trim(),
        theme: (normalized.theme || "").toString().trim(),
        usageArea: (normalized.usagearea || "").toString().trim(),
        bestSelling:
          (normalized.bestselling || "").toString().toLowerCase().trim() === "yes" ||
          (normalized.bestselling || "").toString().toLowerCase().trim() === "true" ||
          normalized.bestselling === true ||
          (normalized.bestselling || "").toString().trim() === "1",
        newArrival:
          (normalized.newarrival || "").toString().toLowerCase().trim() === "yes" ||
          (normalized.newarrival || "").toString().toLowerCase().trim() === "true" ||
          normalized.newarrival === true ||
          (normalized.newarrival || "").toString().trim() === "1",
        imagesRaw: (normalized.images || "").toString().trim(),
      };
    });

    // Extract unique filenames that are not absolute/relative URLs
    const uniqueImages = new Set();
    const finalRows = normalizedRows.map((row) => {
      let images = [];
      if (row.imagesRaw) {
        const parts = row.imagesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        
        images = parts.map((part) => {
          // Check if it's a URL or path
          if (part.startsWith("http://") || part.startsWith("https://") || part.startsWith("/")) {
            return part; // Full URL already
          }
          uniqueImages.add(part);
          return part; // simple filename
        });
      }
      
      const { imagesRaw, ...rest } = row;
      return {
        ...rest,
        images,
      };
    });

    return successResponse({
      rows: finalRows,
      requiredImages: Array.from(uniqueImages),
    });
  } catch (error) {
    console.error("[bulk/parse]", error);
    return errorResponse("Failed to parse Excel file: " + error.message, 500);
  }
}
