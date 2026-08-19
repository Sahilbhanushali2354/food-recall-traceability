"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { RecallSummary, RecallImpactResponse } from "@/types";

export const recallKeys = {
  all: ["recalls"] as const,
  list: () => [...recallKeys.all, "list"] as const,
  impact: (id: string) => [...recallKeys.all, "impact", id] as const,
};

export function useRecalls() {
  return useQuery({
    queryKey: recallKeys.list(),
    queryFn: ({ signal }) => apiGet<RecallSummary[]>("/recalls", undefined, signal),
  });
}

export function useRecallImpact(recallId: string | null | undefined) {
  return useQuery({
    queryKey: recallKeys.impact(recallId ?? ""),
    queryFn: ({ signal }) => apiGet<RecallImpactResponse>(`/recalls/${encodeURIComponent(recallId!)}`, undefined, signal),
    enabled: Boolean(recallId),
  });
}
