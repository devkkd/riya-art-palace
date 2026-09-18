import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Long description shown on products listing page
    longDescription: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    // Display order — lower number appears first (default 0)
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    // Show this category on the homepage collections section
    showOnHome: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
