"use client";

import { CalendarCheck } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { useTranslation } from "react-i18next";
import type { ClosedNode as TClosedNode } from "@/lib/schemas/claim";

interface Props {
  node: TClosedNode;
  isLast?: boolean;
}

export function ClosedNode({ node, isLast }: Props) {
  const { t } = useTranslation();

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-3">
        {node.completionDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CalendarCheck className="h-4 w-4 text-green-500 shrink-0" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {t("timeline.labels.completionDate")}: {node.completionDate}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
