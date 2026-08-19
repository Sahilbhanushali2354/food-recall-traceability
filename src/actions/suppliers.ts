"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { SupplyChainOptions, SupplierReachRow, RiskResponse } from "@/types";

export const supplierKeys = {
  all: ["suppliers"] as const,
  options: () => [...supplierKeys.all, "options"] as const,
  reach: (name: string) => [...supplierKeys.all, "reach", name] as const,
};

export const riskKeys = {
  all: ["risk"] as const,
  overview: () => [...riskKeys.all, "overview"] as const,
};

export function useSupplyChainOptions() {
  return useQuery({
    queryKey: supplierKeys.options(),
    queryFn: ({ signal }) => apiGet<SupplyChainOptions>("/suppliers", undefined, signal),
    staleTime: 5 * 60_000,
  });
}

export function useSupplierReach(supplierName: string | null | undefined) {
  return useQuery({
    queryKey: supplierKeys.reach(supplierName ?? ""),
    queryFn: ({ signal }) => apiGet<SupplierReachRow[]>(`/suppliers/${encodeURIComponent(supplierName!)}`, undefined, signal),
    enabled: Boolean(supplierName),
  });
}

export function useRisk() {
  return useQuery({
    queryKey: riskKeys.overview(),
    queryFn: ({ signal }) => apiGet<RiskResponse>("/risk", undefined, signal),
  });
}
