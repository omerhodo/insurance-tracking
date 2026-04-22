"use client";

import { useClaimData } from "@/hooks/use-claim-data";
import { Timeline } from "@/components/timeline";
import { Skeleton } from "@/components/ui/skeleton";

function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <Skeleton className="h-32 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useClaimData();

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          MiOX — Phase 3 Preview
        </p>
        <h1 className="text-2xl font-bold ai-gradient-text">
          AI-Powered Claim Orchestrator
        </h1>
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.claimId} · {data.insuredName} · {data.vehiclePlate}
          </p>
        )}
      </div>

      {isLoading && <TimelineSkeleton />}
      {isError && (
        <p className="text-red-400 text-sm">Hata: {error.message}</p>
      )}
      {data && <Timeline nodes={data.processDetails} />}
    </main>
  );
}
