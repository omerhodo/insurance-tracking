"use client";

import { Calendar, FileText, AlertTriangle, Building2, Phone } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { useTranslation } from "react-i18next";
import type { ClaimNotificationNode as TClaimNotificationNode } from "@/lib/schemas/claim";

interface Props {
  node: TClaimNotificationNode;
  isLast?: boolean;
}

export function ClaimNotificationNode({ node, isLast }: Props) {
  const { t } = useTranslation();

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.dateTime && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.dateTime")}: {node.dateTime}
            </span>
          </div>
        )}
        {node.reportType && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.reportType")}: {node.reportType}
            </span>
          </div>
        )}
        {node.reasonForDamage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.reasonForDamage")}: {node.reasonForDamage}
            </span>
          </div>
        )}
        {node.reportingParty && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.reportingParty")}: {node.reportingParty}
            </span>
          </div>
        )}
        {node.contact && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 sm:col-span-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.contact")}: {node.contact}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
