"use client";

import {
  Phone,
  MapPin,
  ArrowRight,
  Receipt,
  User,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { formatCurrency, formatDate, formatDistance } from "@/lib/formatters";
import type { TowingServiceNode as TTowingServiceNode } from "@/lib/schemas/claim";

interface Props {
  node: TTowingServiceNode;
  isLast?: boolean;
}

export function TowingServiceNode({ node, isLast }: Props) {
  const d = node.details;

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Provider + Driver row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Provider */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground mb-0.5 font-medium uppercase tracking-wide">
                Hizmet Sağlayıcı
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {d.provider}
              </p>
            </div>
          </div>

          {/* Driver */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground mb-0.5 font-medium uppercase tracking-wide">
                Sürücü
              </p>
              <p className="text-sm font-semibold text-foreground">
                {d.driverName}
              </p>
              <a
                href={`tel:${d.driverPhone}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
              >
                <Phone className="h-3 w-3" />
                {d.driverPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-sm text-foreground font-medium truncate max-w-[180px]">
              {d.towedFrom}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground font-medium truncate max-w-[180px]">
              {d.towedTo}
            </span>
          </div>
          <Badge variant="secondary" className="ml-auto shrink-0 text-xs">
            {formatDistance(d.distanceKm)}
          </Badge>
        </div>

        <Separator className="opacity-50" />

        {/* Fee + Invoice row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Fatura:{" "}
              <span className="font-mono text-foreground">
                {d.invoiceNumber}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Çekici Ücreti</span>
            <Badge
              variant="outline"
              className="text-sm font-bold font-mono border-green-500/30 text-green-400 bg-green-500/10"
            >
              {formatCurrency(d.towingFee, d.currency)}
            </Badge>
          </div>
        </div>

        {/* Arrived at */}
        <p className="text-[11px] text-muted-foreground text-right">
          Varış: {formatDate(d.arrivedAt)}
        </p>
      </div>
    </TimelineNode>
  );
}
