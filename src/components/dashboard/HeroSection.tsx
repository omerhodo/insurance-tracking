"use client";

import {
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AiSummaryModal } from "./AiSummaryModal";
import type { Claim } from "@/lib/schemas/claim";

// ─── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

function MetricCard({
  label,
  value,
  subValue,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card/50 p-4 flex flex-col gap-2 min-h-[88px]",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      <div>
        <div className="text-sm font-bold text-foreground leading-tight">
          {value}
        </div>
        {subValue && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

interface HeroSectionProps {
  claim: Claim;
}

export function HeroSection({ claim }: HeroSectionProps) {
  const { t } = useTranslation();
  const completedSteps = claim.processDetails.filter(
    (s) => s.status.includes("Completed")
  ).length;
  const totalSteps = claim.processDetails.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
      {/* ── Decorative background ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.8 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0 0) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Orbs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-blue-500/6 blur-3xl" />
      </div>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="relative px-5 pt-5 pb-4 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
            MiOX Sigorta · Hasar Takip Merkezi
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {t("hero.title")}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher />

          <Badge
            variant="outline"
            className="font-mono text-[11px] border-primary/25 text-primary bg-primary/5"
          >
            {t("hero.file")}: {claim.fileNo}
          </Badge>

          <AiSummaryModal claim={claim} />
        </div>
      </div>

      {/* ── Metric triptych ─────────────────────────────────────────────────── */}
      <div className="relative px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Status */}
        <MetricCard
          label={t("hero.currentStatus")}
          className="border border-blue-500/30 bg-blue-500/10"
          icon={<Activity className="h-3.5 w-3.5" />}
          value={
            <span className="text-base font-extrabold text-blue-400">
              {t(`timeline.status.${claim.currentStatus}`)}
            </span>
          }
          subValue={t("hero.stepProgress", { completed: completedSteps, total: totalSteps })}
        />

        {/* ETA */}
        <MetricCard
          label={t("hero.remainingTime")}
          icon={<Clock className="h-3.5 w-3.5" />}
          value={claim.estimatedRemainingTime}
          subValue={t("hero.updatedToday")}
        />

        {/* Progress */}
        <MetricCard
          label={t("hero.processProgress")}
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          value={<span className="font-mono text-base">%{progressPercent}</span>}
          subValue={t("hero.stepProgress", { completed: completedSteps, total: totalSteps })}
        />
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────────── */}
      <div className="relative px-5 pb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-muted-foreground font-medium">
            {t("hero.processProgress")}
          </span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted/60 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-blue-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
