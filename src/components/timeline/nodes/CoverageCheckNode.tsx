"use client";

import { ShieldCheck, ShieldOff, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CoverageCheckNode as TCoverageCheckNode } from "@/lib/schemas/claim";

interface Props {
  node: TCoverageCheckNode;
  isLast?: boolean;
}

export function CoverageCheckNode({ node, isLast }: Props) {
  const d = node.details;

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Coverage confirmed banner */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border",
            d.coverageConfirmed
              ? "bg-green-500/10 border-green-500/25"
              : "bg-red-500/10 border-red-500/25"
          )}
        >
          {d.coverageConfirmed ? (
            <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />
          ) : (
            <ShieldOff className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-bold",
                d.coverageConfirmed ? "text-green-400" : "text-red-400"
              )}
            >
              {d.coverageConfirmed ? "Kapsam Onaylandı" : "Kapsam Dışı"}
            </p>
            <p className="text-xs text-muted-foreground">
              Onaylayan: {d.confirmedBy}
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto text-xs border-primary/20 text-primary bg-primary/5 shrink-0"
          >
            {d.policyType}
          </Badge>
        </div>

        {/* Key figures */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/40 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
              Poliçe Limiti
            </p>
            <p className="text-base font-bold font-mono text-foreground">
              {formatCurrency(d.coverageLimit, "TRY")}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 text-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
              Muafiyet ({d.deductibleType})
            </p>
            <p className="text-base font-bold font-mono text-foreground">
              {formatCurrency(d.deductibleAmount, "TRY")}
            </p>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Exclusions */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Kontrol Edilen İstisnalar
          </p>
          <div className="flex flex-wrap gap-1.5">
            {d.exclusionsChecked.map((exc) => {
              const applied = d.exclusionsApplied.includes(exc);
              return (
                <div
                  key={exc}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border",
                    applied
                      ? "border-red-500/30 text-red-400 bg-red-500/10"
                      : "border-green-500/25 text-green-400 bg-green-500/8"
                  )}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {exc}
                </div>
              );
            })}
          </div>
          {d.exclusionsApplied.length === 0 && (
            <p className="text-xs text-green-400 mt-2">
              ✓ Hiçbir istisna uygulanmadı.
            </p>
          )}
        </div>

        {d.notes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
            {d.notes}
          </p>
        )}
      </div>
    </TimelineNode>
  );
}
