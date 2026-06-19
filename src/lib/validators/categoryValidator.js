import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").trim(),
  description: z.string().max(500, "Description cannot exceed 500 characters").trim().optional().default(""),
  image: z.string().url("Valid image URL is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").trim().optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").trim().optional(),
  image: z.string().url("Valid image URL is required").optional(),
});
