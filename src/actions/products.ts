"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiClient } from "@/lib/api-client";
import { recallKeys } from "./recalls";
import { allergenKeys } from "./allergens";
import { riskKeys, supplierKeys } from "./suppliers";
import { searchKeys } from "./search";
import type {
  ProductDetailResponse,
  ProductListRow,
  CreateProductInput,
  CreateProductResult,
} from "@/types";

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (name: string) => [...productKeys.all, "detail", name] as const,
};

const TOUCHED_BY_A_WRITE = [
  productKeys.all,
  recallKeys.all,
  allergenKeys.all,
  riskKeys.all,
  supplierKeys.all,
  searchKeys.all,
];

export function useProducts() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    TOUCHED_BY_A_WRITE.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

  const { data: products, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: productKeys.list(),
    queryFn: ({ signal }) => apiGet<ProductListRow[]>("/products", undefined, signal),
  });

  const createProduct = useMutation({
    mutationFn: (input: CreateProductInput) =>
      apiClient.post("/products", input) as unknown as Promise<CreateProductResult>,
    onSuccess: invalidate,
  });

  const deleteProduct = useMutation({
    mutationFn: (name: string) =>
      apiClient.delete(`/products/${encodeURIComponent(name)}`) as unknown as Promise<{
        name: string;
        deleted: boolean;
      }>,
    onSuccess: invalidate,
  });

  return { products, isLoading, isFetching, error, refetch, createProduct, deleteProduct };
}

export function useProduct(name: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(name ?? ""),
    queryFn: ({ signal }) =>
      apiGet<ProductDetailResponse>(`/products/${encodeURIComponent(name!)}`, undefined, signal),
    enabled: Boolean(name),
  });
}
