import connectDB from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request) {
  try {
    await connectDB();

    // Fetch all collections in parallel for fast loading
    const [categories, subcategories, products] = await Promise.all([
      Category.find({}).sort({ order: 1, name: 1 }).lean(),
      Subcategory.find({}).sort({ name: 1 }).lean(),
      Product.find({})
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Format IDs to simple string representation
    const formattedCategories = categories.map((cat) => ({
      ...cat,
      id: cat._id.toString(),
    }));

    const formattedSubcategories = subcategories.map((sub) => ({
      ...sub,
      id:       sub._id.toString(),
      slug:     sub.slug || "",
      name:     sub.name || "",
      category: sub.category ? sub.category.toString() : null,
    }));

    const formattedProducts = products.map((prod) => ({
      ...prod,
      id: prod._id.toString(),
      sku:          prod.sku || "",
      minOrderQty:  prod.minOrderQty ?? 500,
      showInRetail: prod.showInRetail ?? false,
      category: prod.category
        ? {
            id: prod.category._id.toString(),
            name: prod.category.name,
            slug: prod.category.slug,
          }
        : null,
      subcategory: prod.subcategory
        ? {
            id: prod.subcategory._id.toString(),
            name: prod.subcategory.name,
            slug: prod.subcategory.slug,
          }
        : null,
    }));

    return successResponse({
      categories: formattedCategories,
      subcategories: formattedSubcategories,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("[catalog/get]", error);
    return errorResponse("Failed to fetch catalog data", 500);
  }
}
