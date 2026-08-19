"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { TraceRoute } from "@/types";

export const traceKeys = {
  all: ["trace"] as const,
  route: (supplier: string, store: string) => [...traceKeys.all, supplier, store] as const,
};

export function useTraceRoute(
  supplier: string | null | undefined,
  store: string | null | undefined,
) {
  return useQuery({
    queryKey: traceKeys.route(supplier ?? "", store ?? ""),
    queryFn: ({ signal }) => apiGet<TraceRoute[]>("/trace", { supplier: supplier!, store: store! }, signal),
    enabled: Boolean(supplier && store),
  });
}
