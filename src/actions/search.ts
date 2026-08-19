"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import { useDebounced } from "@/lib/useDebounced";
import type { SearchResult } from "@/types";

export const searchKeys = {
  all: ["search"] as const,
  term: (term: string) => [...searchKeys.all, term] as const,
};

export function useSearch(
  term: string,
  { minLength = 2, delayMs = 250 }: { minLength?: number; delayMs?: number } = {},
) {
  const debounced = useDebounced(term.trim(), delayMs);
  const ready = debounced.length >= minLength;

  return useQuery({
    queryKey: searchKeys.term(debounced),
    queryFn: ({ signal }) => apiGet<SearchResult[]>("/search", { q: debounced }, signal),
    enabled: ready,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
