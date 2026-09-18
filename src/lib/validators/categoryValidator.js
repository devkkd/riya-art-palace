import { z } from "zod";

export const createCategorySchema = z.object({
  name:            z.string().min(2).max(50).trim(),
  description:     z.string().max(500).trim().optional().default(""),
  longDescription: z.string().max(5000).trim().optional().default(""),
  image:           z.string().url("Valid image URL is required"),
  order:           z.number().int().min(0).optional().default(0),
  showOnHome:      z.boolean().optional().default(true),
});

export const updateCategorySchema = z.object({
  name:            z.string().min(2).max(50).trim().optional(),
  description:     z.string().max(500).trim().optional(),
  longDescription: z.string().max(5000).trim().optional(),
  image:           z.string().url("Valid image URL is required").optional(),
  order:           z.number().int().min(0).optional(),
  showOnHome:      z.boolean().optional(),
});
