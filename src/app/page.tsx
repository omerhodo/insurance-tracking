"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClaimData, CLAIM_QUERY_KEY } from "@/hooks/use-claim-data";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ClaimSidebar } from "@/components/dashboard/ClaimSidebar";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Timeline } from "@/components/timeline";

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          {t("errors.dataLoadFailed")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      <Button
        id="retry-btn"
        onClick={onRetry}
        variant="outline"
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        {t("common.retry")}
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useTranslation();
  const { data: claim, isLoading, isError, error } = useClaimData();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: CLAIM_QUERY_KEY });
  };

  return (
    /*
     * Outermost shell: full-viewport height, subtle radial gradient
     * to give depth to the dark background.
     */
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.3 0.08 265 / 0.35), transparent)",
      }}
    >
      {/* ── Content container ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Loading */}
        {isLoading && <DashboardSkeleton />}

        {/* Error */}
        {isError && (
          <ErrorState
            message={error?.message ?? t("errors.serverError")}
            onRetry={handleRetry}
          />
        )}

        {/* Success */}
        {claim && (
          <div className="space-y-6">
            {/* ── Hero section ── full width ─────────────────────────────── */}
            <HeroSection claim={claim} />

            {/*
             * ── Content grid ───────────────────────────────────────────────
             * Mobile  (< lg): single column — timeline then sidebar
             * Desktop (≥ lg): two columns — timeline (flexible) | sidebar (340px, sticky)
             */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
              {/* ── Timeline panel ─────────────────────────────────────────── */}
              <main
                id="claim-timeline"
                aria-label="Hasar süreç zaman çizelgesi"
              >
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {t("timeline.title")}
                  </h2>
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-xs text-muted-foreground">
                    {t("timeline.completion", {
                      completed: claim.processDetails.filter((s) =>
                        s.status.includes("Completed")
                      ).length,
                      total: claim.processDetails.length,
                    })}
                  </span>
                </div>

                <Timeline nodes={claim.processDetails} />
              </main>

              {/* ── Sidebar panel ──────────────────────────────────────────── */}
              <div
                className="lg:sticky lg:top-6 lg:self-start"
                aria-label="Hasar özet paneli"
              >
                <ClaimSidebar claim={claim} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
