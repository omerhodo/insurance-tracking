import type { ProcessStatus } from "@/lib/schemas/claim";

/** Per-status visual configuration used by TimelineNode and StatusBadge. */
export const STATUS_CONFIG: Record<
  ProcessStatus,
  {
    label: string;
    badgeClass: string;
    iconBgClass: string;
    iconColorClass: string;
    connectorClass: string;
    dotClass: string;
    borderClass: string;
  }
> = {
  "Completed": {
    label: "Tamamlandı",
    badgeClass: "status-completed",
    iconBgClass: "bg-green-500/15",
    iconColorClass: "text-green-500",
    connectorClass: "bg-green-500/40",
    dotClass: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    borderClass: "border-l-green-500/60",
  },
  "In Progress": {
    label: "Devam Ediyor",
    badgeClass: "status-in-progress",
    iconBgClass: "bg-amber-500/15",
    iconColorClass: "text-amber-400",
    connectorClass: "bg-amber-500/30",
    dotClass:
      "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse",
    borderClass: "border-l-amber-400/60",
  },
  "Pending": {
    label: "Beklemede",
    badgeClass: "status-pending",
    iconBgClass: "bg-slate-500/10",
    iconColorClass: "text-slate-400",
    connectorClass: "bg-slate-500/20",
    dotClass: "bg-slate-400",
    borderClass: "border-l-slate-500/20",
  },
  "Report Completed": {
    label: "Rapor Tamamlandı",
    badgeClass: "status-completed",
    iconBgClass: "bg-green-500/15",
    iconColorClass: "text-green-500",
    connectorClass: "bg-green-500/40",
    dotClass: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    borderClass: "border-l-green-500/60",
  },
};
