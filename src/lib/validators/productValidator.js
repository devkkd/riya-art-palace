import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters").trim(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").trim().optional().default(""),
  price: z.number({ required_error: "Price is required" }).nonnegative("Price cannot be negative"),
  priceUnit: z.string().trim().default("Piece"),
  category: z.string({ required_error: "Category is required" }).min(1, "Category is required"),
  subcategory: z.string().trim().nullable().optional().or(z.literal("")),
  images: z.array(z.string().url("Valid image URL is required")).min(1, "At least one product image is required"),
  // Specs
  productType: z.string().max(100).trim().optional().default(""),
  primaryMaterial: z.string().max(100).trim().optional().default(""),
  style: z.string().max(100).trim().optional().default(""),
  setType: z.string().max(100).trim().optional().default(""),
  color: z.string().max(100).trim().optional().default(""),
  sizeCategory: z.string().max(100).trim().optional().default(""),
  theme: z.string().max(100).trim().optional().default(""),
  usageArea: z.string().max(200).trim().optional().default(""),
  bestSelling: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters").trim().optional(),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").trim().optional(),
  price: z.number().nonnegative("Price cannot be negative").optional(),
  priceUnit: z.string().trim().optional(),
  category: z.string().min(1, "Category is required").optional(),
  subcategory: z.string().trim().nullable().optional().or(z.literal("")),
  images: z.array(z.string().url("Valid image URL is required")).min(1, "At least one product image is required").optional(),
  // Specs
  productType: z.string().max(100).trim().optional(),
  primaryMaterial: z.string().max(100).trim().optional(),
  style: z.string().max(100).trim().optional(),
  setType: z.string().max(100).trim().optional(),
  color: z.string().max(100).trim().optional(),
  sizeCategory: z.string().max(100).trim().optional(),
  theme: z.string().max(100).trim().optional(),
  usageArea: z.string().max(200).trim().optional(),
  bestSelling: z.boolean().optional(),
  newArrival: z.boolean().optional(),
});
