"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AiExplainButton } from "./shared/ai-explain-button";
import { STATUS_CONFIG } from "./shared/status-config";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Truck,
  FileText,
  ClipboardList,
  Car,
  FolderOpen,
  Calculator,
  Banknote,
  CheckCircle,
} from "lucide-react";
import type { ProcessNode, ProcessStatus } from "@/lib/schemas/claim";
import type { ReactNode } from "react";

// ─── Status icon map ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ProcessStatus }) {
  const cls = "h-3.5 w-3.5";
  switch (status) {
    case "Completed":
    case "Report Completed":
      return <CheckCircle2 className={cn(cls, "text-green-500")} />;
    case "In Progress":
      return <Loader2 className={cn(cls, "text-amber-400 animate-spin")} />;
    case "Pending":
      return <Clock className={cn(cls, "text-slate-400")} />;
    default:
      return <Clock className={cn(cls, "text-slate-400")} />;
  }
}

function getIconForTitle(title: string) {
  switch (title) {
    case "Towing Service":
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    case "Claim Notification":
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    case "Appraisal":
      return <ClipboardList className="h-5 w-5 text-muted-foreground" />;
    case "Substitute Rental Vehicle":
      return <Car className="h-5 w-5 text-muted-foreground" />;
    case "File Review":
      return <FolderOpen className="h-5 w-5 text-muted-foreground" />;
    case "Deduction Reason":
      return <Calculator className="h-5 w-5 text-muted-foreground" />;
    case "Payment Information":
      return <Banknote className="h-5 w-5 text-muted-foreground" />;
    case "Closed":
      return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
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

export function TimelineNode({
  node,
  children,
  isLast = false,
}: TimelineNodeProps) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[node.status] || {
    label: node.status,
    iconColorClass: "text-slate-400",
    iconBgClass: "bg-slate-500/10",
    borderClass: "border-slate-500/30",
    badgeClass: "border-slate-500/30 text-slate-400 bg-slate-500/10",
    dotClass: "bg-slate-400",
    connectorClass: "bg-slate-500/20",
  };

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
          {getIconForTitle(node.title)}

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
                {t(`timeline.nodes.${node.title}`)}
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
                <span className="ml-1">{t(`timeline.status.${node.status}`)}</span>
              </Badge>
            </div>
          </div>

          {/* AI Explain button */}
          <AiExplainButton
            stepId={node.id!}
            nodeType={node.title}
            className="shrink-0"
          />
        </div>

        {/* Card body — node-specific content */}
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
