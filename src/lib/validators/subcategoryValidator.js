import { z } from "zod";

export const createSubcategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").trim(),
  description: z.string().max(500, "Description cannot exceed 500 characters").trim().optional().default(""),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
});

export const updateSubcategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters").trim().optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").trim().optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID").optional(),
});
