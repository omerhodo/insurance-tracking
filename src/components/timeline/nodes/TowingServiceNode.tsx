"use client";

import { MapPin, Calendar } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { useTranslation } from "react-i18next";
import type { TowingServiceNode as TTowingServiceNode } from "@/lib/schemas/claim";

interface Props {
  node: TTowingServiceNode;
  isLast?: boolean;
}

export function TowingServiceNode({ node, isLast }: Props) {
  const { t } = useTranslation();

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.pickupLocation && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.pickupLocation")}: {node.pickupLocation}
            </span>
          </div>
        )}
        {node.towingDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.towingDate")}: {node.towingDate}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
