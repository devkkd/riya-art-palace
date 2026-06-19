import connectDB from "@/lib/db/connect";
import Subcategory from "@/lib/models/Subcategory";
import Category from "@/lib/models/Category";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { createSubcategorySchema, updateSubcategorySchema } from "@/lib/validators/subcategoryValidator";
import { slugify } from "@/lib/utils/slug";

export const subcategoryController = {
  async getAllSubcategories(request) {
    try {
      await connectDB();
      
      // Parse category filter from URL search params if present
      const { searchParams } = new URL(request.url);
      const categoryId = searchParams.get("category");
      
      const filter = {};
      if (categoryId) {
        filter.category = categoryId;
      }

      const subcategories = await Subcategory.find(filter)
        .populate("category", "name slug")
        .sort({ name: 1 })
        .lean();

      const formatted = subcategories.map((sub) => ({
        ...sub,
        id: sub._id.toString(),
        category: sub.category
          ? {
              id: sub.category._id.toString(),
              name: sub.category.name,
              slug: sub.category.slug,
            }
          : null,
      }));

      return successResponse(formatted);
    } catch (error) {
      console.error("[subcategory/getAll]", error);
      return errorResponse("Failed to fetch subcategories", 500);
    }
  },

  async createSubcategory(request) {
    try {
      await connectDB();
      const body = await request.json();
      const parsed = createSubcategorySchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const { name, description, category } = parsed.data;
      const slug = slugify(name);

      // Verify if parent category exists
      const parentCategory = await Category.findById(category);
      if (!parentCategory) {
        return errorResponse("Parent category not found", 404);
      }

      // Check if subcategory slug already exists
      const existing = await Subcategory.findOne({ slug });
      if (existing) {
        return errorResponse("A subcategory with this name already exists", 400);
      }

      const newSubcategory = await Subcategory.create({
        name,
        slug,
        description,
        category,
      });

      const populatedSub = await Subcategory.findById(newSubcategory._id)
        .populate("category", "name slug")
        .lean();

      return successResponse(
        {
          subcategory: {
            id: populatedSub._id.toString(),
            name: populatedSub.name,
            slug: populatedSub.slug,
            description: populatedSub.description,
            category: populatedSub.category
              ? {
                  id: populatedSub.category._id.toString(),
                  name: populatedSub.category.name,
                  slug: populatedSub.category.slug,
                }
              : null,
          },
          message: "Subcategory created successfully",
        },
        201
      );
    } catch (error) {
      console.error("[subcategory/create]", error);
      return errorResponse("Failed to create subcategory", 500);
    }
  },

  async updateSubcategory(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;
      const body = await request.json();
      const parsed = updateSubcategorySchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const subcategory = await Subcategory.findById(id);
      if (!subcategory) {
        return errorResponse("Subcategory not found", 404);
      }

      const { name, description, category } = parsed.data;

      // Validate new category if provided
      if (category && category !== subcategory.category.toString()) {
        const parentCategory = await Category.findById(category);
        if (!parentCategory) {
          return errorResponse("Parent category not found", 404);
        }
        subcategory.category = category;
      }

      if (name && name.toLowerCase() !== subcategory.name.toLowerCase()) {
        const slug = slugify(name);
        // Check duplicate slug
        const existing = await Subcategory.findOne({ _id: { $ne: id }, slug });
        if (existing) {
          return errorResponse("Another subcategory with this name already exists", 400);
        }
        subcategory.name = name;
        subcategory.slug = slug;
      }

      if (description !== undefined) subcategory.description = description;

      await subcategory.save();

      const populatedSub = await Subcategory.findById(subcategory._id)
        .populate("category", "name slug")
        .lean();

      return successResponse({
        subcategory: {
          id: populatedSub._id.toString(),
          name: populatedSub.name,
          slug: populatedSub.slug,
          description: populatedSub.description,
          category: populatedSub.category
            ? {
                id: populatedSub.category._id.toString(),
                name: populatedSub.category.name,
                slug: populatedSub.category.slug,
              }
            : null,
        },
        message: "Subcategory updated successfully",
      });
    } catch (error) {
      console.error("[subcategory/update]", error);
      return errorResponse("Failed to update subcategory", 500);
    }
  },

  async deleteSubcategory(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;

      const subcategory = await Subcategory.findById(id);
      if (!subcategory) {
        return errorResponse("Subcategory not found", 404);
      }

      await Subcategory.findByIdAndDelete(id);

      return successResponse({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("[subcategory/delete]", error);
      return errorResponse("Failed to delete subcategory", 500);
    }
  },
};
