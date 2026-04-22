import { useQuery } from "@tanstack/react-query";
import { fetchClaimData } from "@/services/claim-api";
import { ClaimSchema, type Claim } from "@/lib/schemas/claim";

/** Stable query key — extracted so other parts of the app can invalidate it. */
export const CLAIM_QUERY_KEY = ["claim", "CLM-2024-00871"] as const;

/**
 * Primary data-fetching hook for the claim dashboard.
 *
 * - Parses the raw API response through the Zod `ClaimSchema`.
 * - Throws on schema mismatch so error boundaries catch it early.
 * - Exposes `isLoading`, `isError`, `data` in a typed, discriminated shape.
 */
export function useClaimData() {
  return useQuery<Claim, Error>({
    queryKey: CLAIM_QUERY_KEY,
    queryFn: async () => {
      const raw = await fetchClaimData();
      // `parse` throws a ZodError on schema mismatch — surfaced by TanStack Query
      return ClaimSchema.parse(raw);
    },
  });
}
