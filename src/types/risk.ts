import type { SupplierRiskRow } from "./supplier";
import type { CriticalIngredientRow } from "./ingredient";

export type RiskResponse = {
  suppliers: SupplierRiskRow[];
  ingredients: CriticalIngredientRow[];
};
