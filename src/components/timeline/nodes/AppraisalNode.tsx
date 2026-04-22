"use client";

import { Calendar, User, Phone } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { useTranslation } from "react-i18next";
import type { AppraisalNode as TAppraisalNode } from "@/lib/schemas/claim";

interface Props {
  node: TAppraisalNode;
  isLast?: boolean;
}

export function AppraisalNode({ node, isLast }: Props) {
  const { t } = useTranslation();

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.expertAssignmentDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.expertAssignmentDate")}: {node.expertAssignmentDate}
            </span>
          </div>
        )}
        {node.expertInfo && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {t("timeline.labels.expertInfo")}: {node.expertInfo}
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
