import connectDB from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { slugify } from "@/lib/utils/slug";
import { createProductSchema } from "@/lib/validators/productValidator";

export async function POST(request) {
  try {
    await connectDB();
    const { products } = await request.json();

    if (!products || !Array.isArray(products)) {
      return errorResponse("Invalid products payload. Expected an array.", 400);
    }

    // Load categories & subcategories in memory for fast lookup
    const allCategories = await Category.find({}).lean();
    const allSubcategories = await Subcategory.find({}).lean();

    const categoryMap = new Map();
    allCategories.forEach((c) => {
      categoryMap.set(c.name.toLowerCase().trim(), c._id.toString());
      // Also map by slug so CSV can use either name or slug
      if (c.slug) categoryMap.set(c.slug.toLowerCase().trim(), c._id.toString());
    });

    const subcategoryMap = new Map();
    allSubcategories.forEach((s) => {
      const parentId = s.category ? s.category.toString() : "";
      const key = `${parentId}:${s.name.toLowerCase().trim()}`;
      subcategoryMap.set(key, s._id.toString());
      // Also map by slug
      if (s.slug) {
        const slugKey = `${parentId}:${s.slug.toLowerCase().trim()}`;
        subcategoryMap.set(slugKey, s._id.toString());
      }
    });

    const successItems = [];
    const errors = [];
    const localNames = new Set();
    const localSlugs = new Set();

    // Process each row
    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      const rowIndex = i + 1;
      const name = (row.name || "").trim();

      // Basic field validation
      if (!name || name.length < 2) {
        errors.push({
          row: rowIndex,
          name: name || "Empty Name",
          error: "Product name is required and must be at least 2 characters.",
        });
        continue;
      }

      if (row.price === undefined || isNaN(row.price) || row.price < 0) {
        errors.push({
          row: rowIndex,
          name,
          error: `Invalid price: "${row.price}". Must be a positive number.`,
        });
        continue;
      }

      // 1. Resolve Category ID by Name
      const catNameKey = (row.categoryName || "").toLowerCase().trim();
      if (!catNameKey) {
        errors.push({
          row: rowIndex,
          name,
          error: "Category column is required and cannot be empty.",
        });
        continue;
      }

      const categoryId = categoryMap.get(catNameKey);
      if (!categoryId) {
        errors.push({
          row: rowIndex,
          name,
          error: `Category "${row.categoryName}" not found. Please create it in the admin panel first.`,
        });
        continue;
      }

      // 2. Resolve Subcategory ID if provided
      let subcategoryId = null;
      const subNameKey = (row.subcategoryName || "").toLowerCase().trim();
      if (subNameKey) {
        const subMapKey = `${categoryId}:${subNameKey}`;
        subcategoryId = subcategoryMap.get(subMapKey);
        if (!subcategoryId) {
          errors.push({
            row: rowIndex,
            name,
            error: `Subcategory "${row.subcategoryName}" not found under category "${row.categoryName}".`,
          });
          continue;
        }
      }

      // 3. Generate Slug & Check Local Duplicates
      const slug = slugify(name);
      const lowerName = name.toLowerCase();

      if (localNames.has(lowerName) || localSlugs.has(slug)) {
        errors.push({
          row: rowIndex,
          name,
          error: "Duplicate product name or slug inside this Excel file.",
        });
        continue;
      }
      localNames.add(lowerName);
      localSlugs.add(slug);

      // 4. Check DB Duplicates
      const existingInDB = await Product.findOne({
        $or: [{ name: new RegExp(`^${name}$`, "i") }, { slug }],
      }).lean();

      if (existingInDB) {
        errors.push({
          row: rowIndex,
          name,
          error: `Product with name or slug already exists in the database.`,
        });
        continue;
      }

      // Zod Validation Schema expects category and subcategory to be String (IDs)
      const normalizedRow = {
        name,
        description: row.description || "",
        price: Number(row.price),
        priceUnit: row.priceUnit || "Piece",
        category: categoryId,
        subcategory: subcategoryId || "",
        images: row.images || [],
        productType: row.productType || "",
        primaryMaterial: row.primaryMaterial || "",
        style: row.style || "",
        setType: row.setType || "",
        color: row.color || "",
        sizeCategory: row.sizeCategory || "",
        theme: row.theme || "",
        usageArea: row.usageArea || "",
        bestSelling: !!row.bestSelling,
        newArrival: !!row.newArrival,
      };

      const validation = createProductSchema.safeParse(normalizedRow);
      if (!validation.success) {
        const errMsg = validation.error.issues?.[0]?.message || "Validation failed";
        errors.push({
          row: rowIndex,
          name,
          error: errMsg,
        });
        continue;
      }

      // Add to insert queue
      successItems.push({
        ...normalizedRow,
        slug,
      });
    }

    // Bulk Insert
    if (successItems.length > 0) {
      await Product.insertMany(successItems);
    }

    return successResponse({
      importedCount: successItems.length,
      failedCount: errors.length,
      errors: errors,
    });
  } catch (error) {
    console.error("[bulk/import]", error);
    return errorResponse("Import failed: " + error.message, 500);
  }
}
