"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NodeIcon } from "./shared/icon-map";
import { AiExplainButton } from "./shared/ai-explain-button";
import { STATUS_CONFIG } from "./shared/status-config";
import { formatDate } from "@/lib/formatters";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import type { ProcessNode, ProcessStatus } from "@/lib/schemas/claim";
import type { ReactNode } from "react";

// ─── Status icon map ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ProcessStatus }) {
  const cls = "h-3.5 w-3.5";
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className={cn(cls, "text-green-500")} />;
    case "IN_PROGRESS":
      return <Loader2 className={cn(cls, "text-amber-400 animate-spin")} />;
    case "PENDING":
      return <Clock className={cn(cls, "text-slate-400")} />;
    case "REJECTED":
      return <AlertCircle className={cn(cls, "text-red-400")} />;
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimelineNodeProps {
  node: ProcessNode;
  /** The node-specific content rendered inside the card body */
  children: ReactNode;
  /** Whether this is the last node in the timeline (hides connector line) */
  isLast?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Generic timeline node wrapper.
 *
 * Renders:
 * - Vertical connector line (hidden on last node)
 * - Status-coloured icon circle
 * - Card header: title, status badge, completedAt, AI explain button
 * - Card body: children (node-specific content)
 */
export function TimelineNode({ node, children, isLast = false }: TimelineNodeProps) {
  const cfg = STATUS_CONFIG[node.status];

  return (
    <div className="relative flex gap-4 group" id={`timeline-node-${node.id}`}>
      {/* ── Left rail: dot + connector ─────────────────────────────────────── */}
      <div className="relative flex flex-col items-center shrink-0 w-10">
        {/* Connector line (extends downward, hidden for last node) */}
        {!isLast && (
          <div
            className={cn(
              "absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full",
              cfg.connectorClass,
              "transition-colors duration-500"
            )}
          />
        )}

        {/* Icon circle */}
        <div
          className={cn(
            "relative z-10 flex items-center justify-center",
            "h-10 w-10 rounded-full border border-border/50",
            "transition-all duration-300 group-hover:scale-105",
            cfg.iconBgClass
          )}
        >
          <NodeIcon
            slug={node.icon}
            className={cn("h-5 w-5", cfg.iconColorClass)}
          />

          {/* Status pulse dot */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5",
              "h-3 w-3 rounded-full border-2 border-background",
              cfg.dotClass
            )}
          />
        </div>
      </div>

      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 mb-6 rounded-xl border border-border/50",
          "bg-card/60 backdrop-blur-sm shadow-sm",
          "border-l-2 transition-all duration-300",
          "hover:shadow-md hover:border-border",
          cfg.borderClass
        )}
      >
        {/* Card header */}
        <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-border/40">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground leading-tight">
                {node.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 h-5",
                  "border",
                  cfg.badgeClass
                )}
              >
                <StatusIcon status={node.status} />
                <span className="ml-1">{cfg.label}</span>
              </Badge>
            </div>

            {node.completedAt && (
              <p className="text-[11px] text-muted-foreground">
                {formatDate(node.completedAt)}
              </p>
            )}
          </div>

          {/* AI Explain button */}
          <AiExplainButton
            stepId={node.id}
            nodeType={node.type}
            className="shrink-0"
          />
        </div>

        {/* Card body — node-specific content */}
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
