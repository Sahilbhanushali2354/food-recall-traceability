export type SeedAllergen = {
  name: string;
};

export type SeedStore = {
  name: string;
  chain: string;
  city: string;
};

export type SeedIngredient = {
  name: string;

  category: string;

  allergens: string[];
};

export type SeedSupplier = {
  name: string;
  country: string;
  certification: string;

  supplies: Array<{
    ingredient: string;
    batchCode: string;
    suppliedOn: string;
  }>;
};

export type SeedProduct = {
  name: string;
  brand: string;
  batchCode: string;

  category: string;

  fromIngredients?: Record<string, string>;

  fromProducts?: Record<string, string>;

  soldAt?: Array<{ store: string; since: string }>;
};

export type SeedRecall = {
  id: string;
  reason: string;
  severity: "critical" | "high" | "moderate";
  issuedAt: string;
  affects: Array<{
    ingredient: string;
    affectedBatches: string;
  }>;
};
