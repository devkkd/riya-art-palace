import connectDB from "@/lib/db/connect";
import Category from "@/lib/models/Category";
import Subcategory from "@/lib/models/Subcategory";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { createCategorySchema, updateCategorySchema } from "@/lib/validators/categoryValidator";
import { slugify } from "@/lib/utils/slug";

export const categoryController = {
  async getAllCategories() {
    try {
      await connectDB();
      const categories = await Category.find({}).sort({ name: 1 }).lean();
      
      // Get subcategory counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (cat) => {
          const subCount = await Subcategory.countDocuments({ category: cat._id });
          return {
            ...cat,
            id: cat._id.toString(),
            subcategoriesCount: subCount,
          };
        })
      );

      return successResponse(categoriesWithCounts);
    } catch (error) {
      console.error("[category/getAll]", error);
      return errorResponse("Failed to fetch categories", 500);
    }
  },

  async createCategory(request) {
    try {
      await connectDB();
      const body = await request.json();
      const parsed = createCategorySchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const { name, description, image } = parsed.data;
      const slug = slugify(name);

      // Check if category or slug already exists
      const existing = await Category.findOne({
        $or: [{ name: new RegExp(`^${name}$`, "i") }, { slug }],
      });

      if (existing) {
        return errorResponse("Category name or slug already exists", 400);
      }

      const newCategory = await Category.create({
        name,
        slug,
        description,
        image,
      });

      return successResponse(
        {
          category: {
            id: newCategory._id.toString(),
            name: newCategory.name,
            slug: newCategory.slug,
            description: newCategory.description,
            image: newCategory.image,
          },
          message: "Category created successfully",
        },
        201
      );
    } catch (error) {
      console.error("[category/create]", error);
      return errorResponse("Failed to create category", 500);
    }
  },

  async updateCategory(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;
      const body = await request.json();
      const parsed = updateCategorySchema.safeParse(body);

      if (!parsed.success) {
        const message = parsed.error.issues?.[0]?.message || "Invalid input";
        return errorResponse(message, 422);
      }

      const category = await Category.findById(id);
      if (!category) {
        return errorResponse("Category not found", 404);
      }

      const { name, description, image } = parsed.data;

      if (name && name.toLowerCase() !== category.name.toLowerCase()) {
        const slug = slugify(name);
        // Check if another category has the same name or slug
        const existing = await Category.findOne({
          _id: { $ne: id },
          $or: [{ name: new RegExp(`^${name}$`, "i") }, { slug }],
        });

        if (existing) {
          return errorResponse("Another category with this name or slug already exists", 400);
        }
        category.name = name;
        category.slug = slug;
      }

      if (description !== undefined) category.description = description;
      if (image) category.image = image;

      await category.save();

      return successResponse({
        category: {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        },
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("[category/update]", error);
      return errorResponse("Failed to update category", 500);
    }
  },

  async deleteCategory(request, context) {
    try {
      await connectDB();
      const params = await context.params;
      const id = params.id;

      const category = await Category.findById(id);
      if (!category) {
        return errorResponse("Category not found", 404);
      }

      // Check if there are any subcategories linked to this category
      const subcategoriesExist = await Subcategory.exists({ category: id });
      if (subcategoriesExist) {
        return errorResponse(
          "Cannot delete category. Please delete all associated subcategories first.",
          400
        );
      }

      await Category.findByIdAndDelete(id);

      return successResponse({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("[category/delete]", error);
      return errorResponse("Failed to delete category", 500);
    }
  },
};
