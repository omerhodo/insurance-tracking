"use client";

import {
  Car,
  Phone,
  Mail,
  Hash,
  CalendarDays,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatDateOnly } from "@/lib/formatters";
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
  const cfg = STATUS_CONFIG[node.status];

  const StatusDot = () => {
    switch (node.status as ProcessStatus) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
      case "IN_PROGRESS":
        return (
          <Loader2 className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
        );
      case "PENDING":
        return <Clock className="h-4 w-4 text-slate-400 shrink-0" />;
      case "REJECTED":
        return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
        node.status === "IN_PROGRESS" && "bg-amber-500/8"
      )}
    >
      <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums w-4 shrink-0">
        {index + 1}
      </span>
      <StatusDot />
      <span
        className={cn(
          "text-xs flex-1 leading-tight",
          node.status === "IN_PROGRESS"
            ? "font-semibold text-amber-300"
            : node.status === "COMPLETED"
              ? "text-muted-foreground line-through decoration-muted-foreground/40"
              : "text-muted-foreground"
        )}
      >
        {node.title}
      </span>
      {node.status === "IN_PROGRESS" && (
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
  const vehicle = claim.vehicleInfo;

  // Extract adjuster from FILE_REVIEW step (type-safe narrowing)
  const fileReview = claim.processDetails.find((s) => s.type === "FILE_REVIEW");
  const adjuster =
    fileReview?.type === "FILE_REVIEW" ? fileReview.details : null;

  return (
    <aside className="flex flex-col gap-4">
      {/* ── Claim summary ──────────────────────────────────────────────────── */}
      <SidebarCard title="Hasar Özeti" icon={<Hash className="h-3.5 w-3.5" />}>
        <div className="space-y-0">
          <InfoRow label="Hasar No" value={claim.claimId} mono />
          <InfoRow label="Poliçe No" value={claim.policyNumber} mono />
          <InfoRow label="Sigortalı" value={claim.insuredName} />
          <InfoRow
            label="Hasar Tarihi"
            value={formatDateOnly(claim.incidentDate)}
          />
          <InfoRow
            label="Bildirim Tarihi"
            value={formatDateOnly(claim.claimDate)}
          />
          <InfoRow label="Olay Türü" value={claim.incidentType} />
          <InfoRow
            label="Net Tutar"
            value={
              <span className="text-primary font-bold">
                {formatCurrency(claim.totalEstimatedDamage, claim.currency)}
              </span>
            }
          />
        </div>
      </SidebarCard>

      {/* ── Vehicle info ────────────────────────────────────────────────────── */}
      <SidebarCard
        title="Araç Bilgileri"
        icon={<Car className="h-3.5 w-3.5" />}
      >
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg bg-muted/40">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 shrink-0">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {vehicle.make} {vehicle.model}
            </p>
            <p className="text-xs text-muted-foreground">
              {vehicle.year} · {vehicle.color}
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto text-[11px] font-mono border-border/40"
          >
            {claim.vehiclePlate}
          </Badge>
        </div>
        <div className="space-y-0">
          <InfoRow
            label="Marka / Model"
            value={`${vehicle.make} ${vehicle.model}`}
          />
          <InfoRow label="Yıl" value={String(vehicle.year)} />
          <InfoRow label="Renk" value={vehicle.color} />
          <InfoRow label="VIN (Son 8)" value={vehicle.vin.slice(-8)} mono />
        </div>
      </SidebarCard>

      {/* ── Process steps mini ──────────────────────────────────────────────── */}
      <SidebarCard
        title="İşlem Adımları"
        icon={<ShieldAlert className="h-3.5 w-3.5" />}
      >
        <div className="space-y-0.5">
          {claim.processDetails.map((node, idx) => (
            <MiniStep key={node.id} node={node} index={idx} />
          ))}
        </div>
      </SidebarCard>

      {/* ── Assigned adjuster ───────────────────────────────────────────────── */}
      {adjuster && (
        <SidebarCard
          title="Atanan Eksper"
          icon={<Phone className="h-3.5 w-3.5" />}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
              {adjuster.assignedAdjuster
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {adjuster.assignedAdjuster}
              </p>
              <a
                href={`mailto:${adjuster.adjusterEmail}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5 truncate"
              >
                <Mail className="h-3 w-3 shrink-0" />
                {adjuster.adjusterEmail}
              </a>
            </div>
          </div>
          <Separator className="my-3 opacity-40" />
          <InfoRow label="Kayıt No" value={adjuster.registrationNumber} mono />
        </SidebarCard>
      )}
    </aside>
  );
}
