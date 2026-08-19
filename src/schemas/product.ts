import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "intermediate",
  "biscuit",
  "bar",
  "cake",
  "snack",
  "multipack",
] as const;

const recipeItemSchema = z.object({
  name: z.string().trim().min(1),
  quantity: z.string().trim().default(""),
});

export function buildCreateProductSchema(existingNames: string[] = []) {
  const taken = new Set(existingNames.map((n) => n.toLowerCase()));

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Give the product a name of at least 2 characters")
        .max(80, "That name is too long")
        .refine((value) => !taken.has(value.toLowerCase()), {
          message: "A product with this name already exists",
        }),
      brand: z.string().trim().min(1, "Brand is required"),
      batchCode: z.string().trim().max(40, "That batch code is too long").default(""),
      category: z.enum(PRODUCT_CATEGORIES),
      ingredients: z.array(recipeItemSchema).default([]),
      components: z.array(recipeItemSchema).default([]),
      stores: z.array(z.string().trim().min(1)).default([]),
    })
    .refine((value) => value.ingredients.length + value.components.length > 0, {

      path: ["ingredients"],
      message:
        "Add at least one ingredient or component, otherwise nothing can be traced to this product",
    })
    .refine(
      (value) => !value.components.some((c) => c.name.toLowerCase() === value.name.toLowerCase()),
      {
        path: ["components"],
        message: "A product can't be one of its own components",
      },
    );
}

export const createProductSchema = buildCreateProductSchema();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductRecipeItem = z.infer<typeof recipeItemSchema>;
