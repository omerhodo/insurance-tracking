"use client";

import { Car, Clock, PlusCircle } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { useTranslation } from "react-i18next";
import type { SubstituteRentalVehicleNode as TSubstituteRentalVehicleNode } from "@/lib/schemas/claim";

interface Props {
  node: TSubstituteRentalVehicleNode;
  isLast?: boolean;
}

export function SubstituteRentalVehicleNode({ node, isLast }: Props) {
  const { t } = useTranslation();

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.vehicleModel && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 sm:col-span-2">
            <Car className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {node.vehicleModel}
            </span>
          </div>
        )}
        {node.vehicleDuration && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {node.vehicleDuration}
            </span>
          </div>
        )}
        {node.extraDuration && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <PlusCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.extraDuration")}: {node.extraDuration}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
