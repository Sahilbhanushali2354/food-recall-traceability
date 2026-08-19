import { z } from "zod";

export const INGREDIENT_CATEGORIES = [
  "nut",
  "oil",
  "dairy",
  "grain",
  "cocoa",
  "additive",
  "sweetener",
  "seed",
  "spice",
  "egg",
  "fruit",
] as const;

export function buildCreateIngredientSchema(existingNames: string[] = []) {
  const taken = new Set(existingNames.map((n) => n.toLowerCase()));

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Give the ingredient a name of at least 2 characters")
      .max(80, "That name is too long")
      .refine((value) => !taken.has(value.toLowerCase()), {
        message: "An ingredient with this name already exists",
      }),
    category: z.enum(INGREDIENT_CATEGORIES),

    allergens: z.array(z.string().trim().min(1)).default([]),
  });
}

export const createIngredientSchema = buildCreateIngredientSchema();

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
