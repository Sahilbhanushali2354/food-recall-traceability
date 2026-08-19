import type { StoreOption } from "./store";

export type SupplierOption = {
  name: string;
  country: string;
  certification: string;
};

export type SupplierReachRow = {
  ingredient: string;
  product: string;
  brand: string;
  hops: number;
  chain: string[];
  stores: string[];
  storeCount: number;
};

export type SupplierRiskRow = {
  supplier: string;
  country: string;
  certification: string;
  ingredientCount: number;
  productsAffected: number;
  storesAffected: number;
};

export type SupplyChainOptions = {
  suppliers: SupplierOption[];
  stores: StoreOption[];
};
