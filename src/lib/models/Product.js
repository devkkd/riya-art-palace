import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
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
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    priceUnit: {
      type: String,
      trim: true,
      default: "Piece",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    // Specifications
    productType: {
      type: String,
      trim: true,
      default: "",
    },
    primaryMaterial: {
      type: String,
      trim: true,
      default: "",
    },
    style: {
      type: String,
      trim: true,
      default: "",
    },
    setType: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    sizeCategory: {
      type: String,
      trim: true,
      default: "",
    },
    theme: {
      type: String,
      trim: true,
      default: "",
    },
    usageArea: {
      type: String,
      trim: true,
      default: "",
    },
    bestSelling: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ slug: 1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
