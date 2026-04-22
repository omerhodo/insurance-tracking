"use client";

import { AlertTriangle, Clock, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import {
  formatCurrency,
  formatDate,
  formatDeadlineRelative,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  DeductionReasonNode as TDeductionReasonNode,
  DeductionItem,
} from "@/lib/schemas/claim";

interface Props {
  node: TDeductionReasonNode;
  isLast?: boolean;
}

// ─── Single deduction row ─────────────────────────────────────────────────────

function DeductionRow({
  item,
  currency,
}: {
  item: DeductionItem;
  currency: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">
          {item.reason}
        </span>
        <span className="text-sm font-mono font-bold text-red-400 shrink-0">
          − {formatCurrency(item.amount, currency)}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

import { AiDocumentAnalyzer } from "@/components/timeline/AiDocumentAnalyzer";
import { useClaimStore } from "@/store/use-claim-store";

// ... inside DeductionReasonNode component ...
export function DeductionReasonNode({ node, isLast }: Props) {
  const d = node.details;
  const deadlineLabel = formatDeadlineRelative(d.uploadDeadline);
  const resolvedStatus = useClaimStore(
    (s) => s.aiAnalyzer.resolvedDocumentStatus
  );

  // If the AI analyzer successfully finished, override the static status.
  // In a real app, this would persist to the backend.
  const activeDocumentStatus = resolvedStatus ?? d.documentStatus;

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Cost flow summary */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 flex-wrap">
          <div className="text-center min-w-[100px]">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Brüt Ekspertiz
            </p>
            <p className="text-sm font-bold font-mono text-foreground">
              {formatCurrency(d.originalAppraisalCost, d.currency)}
            </p>
          </div>
          <span className="text-muted-foreground text-lg font-light">−</span>
          <div className="text-center min-w-[80px]">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Toplam Kesinti
            </p>
            <p className="text-sm font-bold font-mono text-red-400">
              {formatCurrency(d.totalDeductions, d.currency)}
            </p>
          </div>
          <span className="text-muted-foreground text-lg font-light">=</span>
          <div className="text-center min-w-[100px]">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
              Net Ödenecek
            </p>
            <p className="text-base font-extrabold font-mono text-primary">
              {formatCurrency(d.netPayableAmount, d.currency)}
            </p>
          </div>
        </div>

        {/* Deduction list */}
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Kesinti Kalemleri
          </p>
          <div className="rounded-lg border border-border/40 bg-muted/20 px-3">
            {d.deductions.map((item) => (
              <DeductionRow
                key={item.reason}
                item={item}
                currency={d.currency}
              />
            ))}
          </div>
        </div>

        {/* Required document section */}
        {d.requiresDocument && (
          <>
            <Separator className="opacity-50" />
            <div
              className={cn(
                "rounded-lg border p-4 space-y-3 transition-colors duration-500",
                activeDocumentStatus === "PENDING"
                  ? "border-amber-500/30 bg-amber-500/8"
                  : activeDocumentStatus === "APPROVED"
                    ? "border-green-500/25 bg-green-500/8"
                    : "border-border/50 bg-muted/30"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {d.requiredDocument}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {d.requiredDocumentReason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Son tarih: {formatDate(d.uploadDeadline)} —{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        deadlineLabel.includes("saat") ||
                          deadlineLabel.includes("dakika")
                          ? "text-red-400"
                          : "text-amber-400"
                      )}
                    >
                      {deadlineLabel}
                    </span>
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    "ml-auto text-[10px] uppercase tracking-wide transition-colors",
                    activeDocumentStatus === "PENDING"
                      ? "status-in-progress"
                      : activeDocumentStatus === "APPROVED"
                        ? "status-completed"
                        : "status-pending"
                  )}
                >
                  {activeDocumentStatus === "PENDING"
                    ? "Yükleme Bekleniyor"
                    : activeDocumentStatus === "UPLOADED"
                      ? "Yüklendi"
                      : activeDocumentStatus === "APPROVED"
                        ? "Onaylandı"
                        : "Reddedildi"}
                </Badge>
              </div>

              {/* AI Document Analyzer (Handles Upload UI + Simulated AI steps) */}
              {activeDocumentStatus === "PENDING" ? (
                <AiDocumentAnalyzer nodeId={node.id} />
              ) : null}
            </div>
          </>
        )}
      </div>
    </TimelineNode>
  );
}
