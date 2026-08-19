"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiClient } from "@/lib/api-client";
import { allergenKeys } from "./allergens";
import { riskKeys } from "./suppliers";
import { searchKeys } from "./search";
import type { IngredientOption, CreateIngredientInput, CreateIngredientResult } from "@/types";

export const ingredientKeys = {
  all: ["ingredients"] as const,
  list: () => [...ingredientKeys.all, "list"] as const,
};

export function useIngredients() {
  const queryClient = useQueryClient();

  const { data: ingredients, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ingredientKeys.list(),
    queryFn: ({ signal }) => apiGet<IngredientOption[]>("/ingredients", undefined, signal),
    staleTime: 5 * 60_000,
  });

  const createIngredient = useMutation({
    mutationFn: (input: CreateIngredientInput) =>
      apiClient.post("/ingredients", input) as unknown as Promise<CreateIngredientResult>,
    onSuccess: () => {
      for (const queryKey of [
        ingredientKeys.all,
        allergenKeys.all,
        riskKeys.all,
        searchKeys.all,
      ]) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return { ingredients, isLoading, isFetching, error, refetch, createIngredient };
}
