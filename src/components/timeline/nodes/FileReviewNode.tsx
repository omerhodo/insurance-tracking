"use client";

import { Calendar, CheckSquare } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import type { FileReviewNode as TFileReviewNode } from "@/lib/schemas/claim";

interface Props {
  node: TFileReviewNode;
  isLast?: boolean;
}

export function FileReviewNode({ node, isLast }: Props) {
  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-3">
        {node.reviewReferralDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              Referral: {node.reviewReferralDate}
            </span>
          </div>
        )}
        {node.reviewCompletionDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              Completion: {node.reviewCompletionDate}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
