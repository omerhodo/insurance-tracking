import { MOCK_CLAIM_DATA, type MockClaimData } from "@/data/claim-mock";

/**
 * Simulates a real API call with a configurable network delay.
 * In Phase 2, this will be consumed by the `useClaimData` TanStack Query hook.
 *
 * @param delayMs - Artificial network latency in milliseconds (default: 1200ms)
 * @returns A resolved Promise containing the full claim object
 */
export async function fetchClaimData(delayMs = 1200): Promise<MockClaimData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a very rare 503 to exercise error boundaries in dev
      if (process.env.NEXT_PUBLIC_SIMULATE_ERROR === "true") {
        reject(new Error("Simulated API error (503): Service Unavailable"));
        return;
      }
      resolve(MOCK_CLAIM_DATA);
    }, delayMs);
  });
}
