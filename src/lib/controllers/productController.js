import connectDB from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { createProductSchema, updateProductSchema } from "@/lib/validators/productValidator";
import { slugify } from "@/lib/utils/slug";

export const productController = {
  async getAllProducts(request) {
    try {
      await connectDB();

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const categoryId = searchParams.get("category");
      const subcategoryId = searchParams.get("subcategory");
      const q = searchParams.get("q");

      const filter = {};
      if (categoryId && categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = categoryId;
      }
      if (subcategoryId && subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
        filter.subcategory = subcategoryId;
      }
      if (q) {
        filter.$or = [
          { name: new RegExp(q, "i") },
          { description: new RegExp(q, "i") },
        ];
      }

      const products = await Product.find(filter)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      const formatted = products.map((prod) => ({
        ...prod,
        id: prod._id.toString(),
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

      return successResponse(formatted);
    } catch (error) {
      console.error("[product/getAll]", error);
      return errorResponse("Failed to fetch products", 500);
    }
  },

  async getProductById(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return errorResponse("Invalid product ID format", 400);
      }

      const prod = await Product.findById(id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean();

      if (!prod) {
        return errorResponse("Product not found", 404);
      }

      const formatted = {
        ...prod,
        id: prod._id.toString(),
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
      };

      return successResponse(formatted);
    } catch (error) {
      console.error("[product/getOne]", error);
      return errorResponse("Failed to fetch product", 500);
    }
  },

  async createProduct(request) {
    try {
      await connectDB();
      const body = await request.json();
      const parsed = createProductSchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const data = parsed.data;
      const slug = slugify(data.name);

      // Check duplicate slug or name
      const existing = await Product.findOne({
        $or: [{ name: new RegExp(`^${data.name}$`, "i") }, { slug }],
      });

      if (existing) {
        return errorResponse("Product name already exists", 400);
      }

      // Verify category
      const categoryExists = await Category.exists({ _id: data.category });
      if (!categoryExists) {
        return errorResponse("Category not found", 404);
      }

      // Verify subcategory if provided
      let subcategoryVal = null;
      if (data.subcategory && data.subcategory.trim() !== "") {
        const subExists = await Subcategory.findOne({ _id: data.subcategory, category: data.category });
        if (!subExists) {
          return errorResponse("Subcategory not found or does not belong to selected category", 400);
        }
        subcategoryVal = subExists._id;
      }

      const newProduct = await Product.create({
        ...data,
        slug,
        subcategory: subcategoryVal,
      });

      return successResponse(
        {
          product: {
            id: newProduct._id.toString(),
            name: newProduct.name,
            slug: newProduct.slug,
          },
          message: "Product created successfully",
        },
        201
      );
    } catch (error) {
      console.error("[product/create]", error);
      return errorResponse("Failed to create product", 500);
    }
  },

  async updateProduct(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return errorResponse("Invalid product ID format", 400);
      }

      const body = await request.json();
      const parsed = updateProductSchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const product = await Product.findById(id);
      if (!product) {
        return errorResponse("Product not found", 404);
      }

      const data = parsed.data;

      // Handle name change
      if (data.name && data.name.toLowerCase() !== product.name.toLowerCase()) {
        const slug = slugify(data.name);
        const existing = await Product.findOne({
          _id: { $ne: id },
          $or: [{ name: new RegExp(`^${data.name}$`, "i") }, { slug }],
        });

        if (existing) {
          return errorResponse("Another product with this name already exists", 400);
        }
        product.name = data.name;
        product.slug = slug;
      }

      // Check category change
      const currentCategory = data.category || product.category.toString();
      if (data.category && data.category !== product.category.toString()) {
        const categoryExists = await Category.exists({ _id: data.category });
        if (!categoryExists) {
          return errorResponse("Category not found", 404);
        }
        product.category = data.category;
      }

      // Check subcategory change
      if (data.subcategory !== undefined) {
        if (data.subcategory && data.subcategory.trim() !== "") {
          const subExists = await Subcategory.findOne({ _id: data.subcategory, category: currentCategory });
          if (!subExists) {
            return errorResponse("Subcategory not found or does not belong to category", 400);
          }
          product.subcategory = subExists._id;
        } else {
          product.subcategory = null;
        }
      }

      // Update remaining fields
      const simpleFields = [
        "description", "price", "priceUnit", "images",
        "productType", "primaryMaterial", "style", "setType",
        "color", "sizeCategory", "theme", "usageArea",
        "bestSelling", "newArrival"
      ];

      for (const field of simpleFields) {
        if (data[field] !== undefined) {
          product[field] = data[field];
        }
      }

      await product.save();

      return successResponse({
        product: {
          id: product._id.toString(),
          name: product.name,
          slug: product.slug,
        },
        message: "Product updated successfully",
      });
    } catch (error) {
      console.error("[product/update]", error);
      return errorResponse("Failed to update product", 500);
    }
  },

  async deleteProduct(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return errorResponse("Invalid product ID format", 400);
      }

      const product = await Product.findById(id);
      if (!product) {
        return errorResponse("Product not found", 404);
      }

      await Product.findByIdAndDelete(id);

      return successResponse({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("[product/delete]", error);
      return errorResponse("Failed to delete product", 500);
    }
  },
};
