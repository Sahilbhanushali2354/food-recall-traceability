export type AllergenListItem = {
  name: string;
  ingredientCount: number;
};

export type HiddenAllergenRow = {
  product: string;
  brand: string;
  category: string;

  sourceIngredient: string;
  depth: number;
  chain: string[];
  stores: string[];
  storeCount: number;
};

export type ProductAllergenRow = {
  allergen: string;
  minDepth: number;
  viaIngredients: string[];
  isDeclaredDirectly: boolean;
};
