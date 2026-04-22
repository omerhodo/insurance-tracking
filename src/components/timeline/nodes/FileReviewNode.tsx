"use client";

import { Mail, FileCheck2, FileX2, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { FileReviewNode as TFileReviewNode } from "@/lib/schemas/claim";

interface Props {
  node: TFileReviewNode;
  isLast?: boolean;
}

export function FileReviewNode({ node, isLast }: Props) {
  const d = node.details;
  const initials = getInitials(d.assignedAdjuster);

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Adjuster */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
          {/* Avatar */}
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
              Atanan Eksper
            </p>
            <p className="text-sm font-semibold text-foreground">
              {d.assignedAdjuster}
            </p>
            <a
              href={`mailto:${d.adjusterEmail}`}
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
            >
              <Mail className="h-3 w-3" />
              {d.adjusterEmail}
            </a>
          </div>
          <Badge
            variant="outline"
            className="ml-auto shrink-0 text-[10px] font-mono border-primary/20 text-primary bg-primary/5"
          >
            {d.registrationNumber}
          </Badge>
        </div>

        {/* Documents received */}
        {d.documentsReceived.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FileCheck2 className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-green-500">
                Teslim Alınan Belgeler ({d.documentsReceived.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.documentsReceived.map((doc) => (
                <Badge
                  key={doc}
                  variant="outline"
                  className={cn(
                    "text-xs border-green-500/25 text-green-400 bg-green-500/8"
                  )}
                >
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Documents missing */}
        {d.documentsMissing.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FileX2 className="h-4 w-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400">
                Eksik Belgeler ({d.documentsMissing.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.documentsMissing.map((doc) => (
                <Badge
                  key={doc}
                  variant="outline"
                  className="text-xs border-red-500/25 text-red-400 bg-red-500/8"
                >
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {d.notes && (
          <>
            <Separator className="opacity-50" />
            <div className="flex items-start gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {d.notes}
              </p>
            </div>
          </>
        )}
      </div>
    </TimelineNode>
  );
}
