export type { CreateIngredientInput } from "@/schemas/ingredient";

export type CreateIngredientResult = {
  name: string;
  category: string;
  allergens: string[];
};

export type IngredientOption = {
  name: string;
  category: string;
  allergens: string[];
};

export type CriticalIngredientRow = {
  ingredient: string;
  category: string;
  productCount: number;
  storeCount: number;
};
