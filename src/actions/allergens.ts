"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { AllergenListItem, HiddenAllergenRow } from "@/types";

export const allergenKeys = {
  all: ["allergens"] as const,
  list: () => [...allergenKeys.all, "list"] as const,
  hidden: (name: string) => [...allergenKeys.all, "hidden", name] as const,
};

export function useAllergens() {
  return useQuery({
    queryKey: allergenKeys.list(),
    queryFn: ({ signal }) => apiGet<AllergenListItem[]>("/allergens", undefined, signal),
    staleTime: 5 * 60_000,
  });
}

export function useHiddenAllergens(allergen: string | null | undefined) {
  return useQuery({
    queryKey: allergenKeys.hidden(allergen ?? ""),
    queryFn: ({ signal }) => apiGet<HiddenAllergenRow[]>(`/allergens/${encodeURIComponent(allergen!)}`, undefined, signal),
    enabled: Boolean(allergen),
  });
}
