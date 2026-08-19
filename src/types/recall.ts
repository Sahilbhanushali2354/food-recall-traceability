import type { Severity } from "./common";

export type RecallSummary = {
  id: string;
  reason: string;
  severity: Severity;
  issuedAt: string;

  ingredients: string[];
  affectedBatches: string[];

  productCount: number;

  storeCount: number;
};

export type RecallImpactRow = {
  severity: Severity;
  reason: string;
  issuedAt: string;
  ingredient: string;
  affectedBatches: string;
  product: string;
  brand: string;
  category: string;
  batchCode: string;
  hops: number;
  chain: string[];
  stores: string[];
  storeChains: string[];
  storeCount: number;
};

export type RecallImpactResponse = {
  recall: {
    id: string;
    severity: Severity;
    reason: string;
    issuedAt: string;
  };
  impact: RecallImpactRow[];
};
