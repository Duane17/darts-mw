// src/lib/public-api/queries.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getHomeContent } from "./api-client";
import type { HomeContent } from "./api-types";

/**
 * Fetches Home content using React Query.
 * Keeps a short stale time so repeat navigations are fast.
 */
export function useHomeContentQuery() {
  return useQuery<HomeContent>({
    queryKey: ["home-content"],
    queryFn: () => getHomeContent(),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}
