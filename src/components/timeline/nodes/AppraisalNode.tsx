"use client";

import { Calendar, User, Phone } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import type { AppraisalNode as TAppraisalNode } from "@/lib/schemas/claim";

interface Props {
  node: TAppraisalNode;
  isLast?: boolean;
}

export function AppraisalNode({ node, isLast }: Props) {
  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-3">
        {node.expertAssignmentDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {node.expertAssignmentDate}
            </span>
          </div>
        )}
        {node.expertInfo && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {node.expertInfo}
            </span>
          </div>
        )}
        {node.contact && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">
              {node.contact}
            </span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
