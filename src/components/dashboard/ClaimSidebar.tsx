"use client";

import {
  Hash,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { STATUS_CONFIG } from "@/components/timeline/shared/status-config";
import type { Claim, ProcessNode, ProcessStatus } from "@/lib/schemas/claim";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SidebarCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-border/20 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-[12px] font-semibold text-foreground text-right",
          mono && "font-mono"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Mini step indicator ──────────────────────────────────────────────────────

function MiniStep({ node, index }: { node: ProcessNode; index: number }) {
  const { t } = useTranslation();
  
  const StatusDot = () => {
    switch (node.status as ProcessStatus) {
      case "Completed":
      case "Report Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
      case "In Progress":
        return (
          <Loader2 className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
        );
      case "Pending":
        return <Clock className="h-4 w-4 text-slate-400 shrink-0" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
        node.status === "In Progress" && "bg-amber-500/8"
      )}
    >
      <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums w-4 shrink-0">
        {index + 1}
      </span>
      <StatusDot />
      <span
        className={cn(
          "text-xs flex-1 leading-tight",
          node.status === "In Progress"
            ? "font-semibold text-amber-300"
            : node.status === "Completed" || node.status === "Report Completed"
              ? "text-muted-foreground line-through decoration-muted-foreground/40"
              : "text-muted-foreground"
        )}
      >
        {t(`timeline.nodes.${node.title}`)}
      </span>
      {node.status === "In Progress" && (
        <ChevronRight className="h-3 w-3 text-amber-400/60 shrink-0" />
      )}
    </div>
  );
}

// ─── ClaimSidebar ─────────────────────────────────────────────────────────────

interface ClaimSidebarProps {
  claim: Claim;
}

export function ClaimSidebar({ claim }: ClaimSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="flex flex-col gap-4">
      {/* ── Claim summary ──────────────────────────────────────────────────── */}
      <SidebarCard title={t("sidebar.fileInfo")} icon={<Hash className="h-3.5 w-3.5" />}>
        <div className="space-y-0">
          <InfoRow label={t("sidebar.fileNo")} value={claim.fileNo} mono />
          <InfoRow label={t("sidebar.process")} value={t("hero.title")} />
          <InfoRow label={t("sidebar.status")} value={t(`timeline.status.${claim.currentStatus}`)} />
          <InfoRow label={t("sidebar.estimatedTime")} value={claim.estimatedRemainingTime} />
        </div>
      </SidebarCard>

      {/* ── Process steps mini ──────────────────────────────────────────────── */}
      <SidebarCard
        title={t("sidebar.processSteps")}
        icon={<ShieldAlert className="h-3.5 w-3.5" />}
      >
        <div className="space-y-0.5">
          {claim.processDetails.map((node, idx) => (
            <MiniStep key={node.id || idx} node={node} index={idx} />
          ))}
        </div>
      </SidebarCard>
      
      {/* ── Info message ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-400/80 leading-relaxed">
          {t("sidebar.infoMessage")}
        </p>
      </div>
    </aside>
  );
}
