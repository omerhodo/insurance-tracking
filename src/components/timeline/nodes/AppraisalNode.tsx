"use client";

import { Wrench, BadgeCheck, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  AppraisalNode as TAppraisalNode,
  DamageArea,
} from "@/lib/schemas/claim";

interface Props {
  node: TAppraisalNode;
  isLast?: boolean;
}

// ─── Severity → badge class ───────────────────────────────────────────────────

function severityClass(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes("total"))
    return "border-red-500/30 text-red-400 bg-red-500/10";
  if (s.includes("major"))
    return "border-amber-500/30 text-amber-400 bg-amber-500/10";
  if (s.includes("triggered"))
    return "border-orange-500/30 text-orange-400 bg-orange-500/10";
  return "border-blue-500/30 text-blue-400 bg-blue-500/10";
}

// ─── Single damage row ────────────────────────────────────────────────────────

function DamageRow({ area, currency }: { area: DamageArea; currency: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground truncate">{area.area}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium",
            severityClass(area.severity)
          )}
        >
          {area.severity}
        </Badge>
        <span className="text-sm font-mono font-semibold text-foreground min-w-[80px] text-right">
          {formatCurrency(area.estimatedCost, currency)}
        </span>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppraisalNode({ node, isLast }: Props) {
  const d = node.details;

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Appraiser info */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/40">
          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-foreground">
            {d.appraiserName}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5"
          >
            {d.appraiserLicense}
          </Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            {d.serviceCenter}
          </span>
          <span className="text-xs text-muted-foreground w-full">
            {formatDate(d.appraisalDate, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Damage areas */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Hasar Bölgeleri
          </p>
          <div className="rounded-lg border border-border/40 overflow-hidden bg-muted/20 px-3">
            {d.damageAreas.map((area) => (
              <DamageRow key={area.area} area={area} currency={d.currency} />
            ))}
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Cost summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>İşçilik Maliyeti</span>
            <span className="font-mono">
              {formatCurrency(d.laborCost, d.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                Toplam Ekspertiz
              </span>
            </div>
            <Badge className="text-sm font-bold font-mono bg-primary/15 text-primary border-primary/30 border">
              {formatCurrency(d.totalAppraisalCost, d.currency)}
            </Badge>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-right">
          Rapor No:{" "}
          <span className="font-mono text-foreground">{d.reportId}</span>
        </p>
      </div>
    </TimelineNode>
  );
}
