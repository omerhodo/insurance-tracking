"use client";

import {
  AlertTriangle,
  Calendar,
  Car,
  User,
  FileWarning,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Claim } from "@/lib/schemas/claim";

// ─── Claim status display map ─────────────────────────────────────────────────

const STATUS_MAP: Record<
  string,
  {
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  PENDING_DEDUCTION_APPROVAL: {
    label: "Kesinti Onayı Bekleniyor",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  COMPLETED: {
    label: "Tamamlandı",
    colorClass: "text-green-400",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/30",
    dotClass: "bg-green-400",
  },
  IN_PROGRESS: {
    label: "İşlemde",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    dotClass: "bg-blue-400",
  },
  REJECTED: {
    label: "Reddedildi",
    colorClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    dotClass: "bg-red-400",
  },
};

function getStatus(key: string) {
  return (
    STATUS_MAP[key] ?? {
      label: key.replace(/_/g, " "),
      colorClass: "text-muted-foreground",
      bgClass: "bg-muted/40",
      borderClass: "border-border/50",
      dotClass: "bg-muted-foreground",
    }
  );
}

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
  const status = getStatus(claim.currentStatus);
  const vehicle = claim.vehicleInfo;
  const completedSteps = claim.processDetails.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const totalSteps = claim.processDetails.length;

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
            AI-Powered Claim Orchestrator
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher />

          <Badge
            variant="outline"
            className="font-mono text-[11px] border-primary/25 text-primary bg-primary/5"
          >
            {claim.claimId}
          </Badge>
          <Badge
            variant="outline"
            className="font-mono text-[11px] border-border/50 text-muted-foreground"
          >
            {claim.policyNumber}
          </Badge>
        </div>
      </div>

      {/* ── Claimant + vehicle bar ─────────────────────────────────────────── */}
      <div className="relative px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground border-b border-border/40">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium text-foreground">
            {claim.insuredName}
          </span>
        </span>
        <span className="text-border/60 hidden sm:block">·</span>
        <span className="flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 shrink-0" />
          {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
        <span className="text-border/60 hidden sm:block">·</span>
        <Badge
          variant="outline"
          className="text-[11px] font-mono border-border/40 text-muted-foreground"
        >
          {claim.vehiclePlate}
        </Badge>
        <span className="text-border/60 hidden sm:block">·</span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <FileWarning className="h-3.5 w-3.5" />
          {claim.incidentType} ·{" "}
          {formatDate(claim.incidentDate, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Metric triptych ─────────────────────────────────────────────────── */}
      <div className="relative px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Status — most prominent */}
        <MetricCard
          label="Güncel Durum"
          className={cn(
            "border sm:col-span-1",
            status.bgClass,
            status.borderClass
          )}
          icon={
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full animate-pulse inline-block shrink-0",
                status.dotClass
              )}
            />
          }
          value={
            <span className={cn("text-base font-extrabold", status.colorClass)}>
              {status.label}
            </span>
          }
          subValue={`Adım ${completedSteps + 1} / ${totalSteps}`}
        />

        {/* ETA */}
        <MetricCard
          label="Tahmini Tamamlanma"
          icon={<Calendar className="h-3.5 w-3.5" />}
          value={`~${claim.estimatedCompletionDays} iş günü`}
          subValue={`Talep tarihi: ${formatDate(claim.claimDate, { day: "numeric", month: "short", year: "numeric" })}`}
        />

        {/* Damage amount */}
        <MetricCard
          label="Tahmini Hasar Bedeli"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          value={
            <span className="font-mono text-base">
              {formatCurrency(claim.totalEstimatedDamage, claim.currency)}
            </span>
          }
          subValue="Net ödenecek tutar onayı bekleniyor"
        />
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────────── */}
      <div className="relative px-5 pb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-muted-foreground font-medium">
            İşlem İlerlemesi
          </span>
          <span className="text-[11px] font-bold text-foreground tabular-nums">
            %{claim.progressPercent}
          </span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted/60 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-blue-500 transition-all duration-700"
            style={{ width: `${claim.progressPercent}%` }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]" />
        </div>
      </div>

      {/* ── Urgent action banner ──────────────────────────────────────────────── */}
      {claim.urgentActionRequired && claim.urgentActionMessage && (
        <div className="relative mx-5 mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-300 leading-tight">
              Acil İşlem Gerekli
            </p>
            <p className="text-xs text-amber-400/80 mt-0.5 leading-relaxed">
              {claim.urgentActionMessage}
            </p>
          </div>
          <Badge className="ml-auto shrink-0 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30">
            48 Saat
          </Badge>
        </div>
      )}
    </div>
  );
}
