import type { ProductAllergenRow } from "./allergen";

export type ProductStore = {
  name: string;
  chain: string;
  city: string;
  since: string;
};

export type ProductSummary = {
  name: string;
  brand: string;
  batchCode: string;
  category: string;
  stores: ProductStore[];

  components: string[];
};

export type ProductOriginRow = {
  ingredient: string;
  category: string;
  depth: number;
  chain: string[];
  suppliers: string[];
  batches: string[];
};

export type ProductDetailResponse = {
  product: ProductSummary;
  origins: ProductOriginRow[];
  allergens: ProductAllergenRow[];
};

export type ProductListRow = {
  name: string;
  brand: string;
  batchCode: string;
  category: string;
  ingredientCount: number;
  componentCount: number;
  storeCount: number;
};

export type { CreateProductInput, ProductRecipeItem } from "@/schemas/product";

export type CreateProductResult = {
  name: string;

  created: boolean;
  ingredientCount: number;
  componentCount: number;
  storeCount: number;
};
