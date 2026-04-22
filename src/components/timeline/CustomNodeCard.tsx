"use client";

import { StickyNote, Paperclip, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClaimStore, type CustomNode } from "@/store/use-claim-store";
import { formatDate, formatFileSize } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface Props {
  afterStepId: string;
  node: CustomNode;
}

/**
 * Renders a dynamically-inserted custom node (Note or Attachment).
 * Displayed between existing timeline steps, indented to signal "inline" nature.
 */
export function CustomNodeCard({ afterStepId, node }: Props) {
  const removeDynamicNode = useClaimStore((s) => s.removeDynamicNode);

  const isNote = node.kind === "NOTE";

  return (
    <div
      className={cn("relative flex gap-4 group ml-5 mb-4")}
      id={`custom-node-${node.id}`}
    >
      {/* Connector indent line */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <div className="flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-border/60 bg-background">
          {isNote ? (
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wide border-border/50 text-muted-foreground"
            >
              {isNote ? "Not" : "Ek"}
            </Badge>
            <span className="text-[11px] text-muted-foreground">
              {node.author} · {formatDate(node.createdAt)}
            </span>
          </div>

          {isNote ? (
            <p className="text-sm text-foreground leading-relaxed">
              {node.content}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate font-medium">{node.fileName}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                ({formatFileSize(node.fileSize)})
              </span>
            </div>
          )}
        </div>

        {/* Remove button */}
        <Button
          id={`remove-custom-${node.id}`}
          variant="ghost"
          size="sm"
          aria-label="Notu kaldır"
          onClick={() => removeDynamicNode(afterStepId, node.id)}
          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
