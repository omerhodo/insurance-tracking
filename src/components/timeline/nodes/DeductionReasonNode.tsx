"use client";

import { AlertTriangle, Calculator, FileText } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import { AiDocumentAnalyzer } from "../AiDocumentAnalyzer";
import type { DeductionReasonNode as TDeductionReasonNode } from "@/lib/schemas/claim";

interface Props {
  node: TDeductionReasonNode;
  isLast?: boolean;
}

export function DeductionReasonNode({ node, isLast }: Props) {
  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {node.actionRequired && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Action Required
              </p>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                {node.actionRequired}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {node.occupationalDeduction && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <span className="text-[12px] text-muted-foreground">Occupational Deduction</span>
              <span className="text-sm font-semibold text-foreground">{node.occupationalDeduction}</span>
            </div>
          )}
          {node.appreciationDeduction && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <span className="text-[12px] text-muted-foreground">Appreciation Deduction</span>
              <span className="text-sm font-semibold text-foreground">{node.appreciationDeduction}</span>
            </div>
          )}
          {node.policyDeductible && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <span className="text-[12px] text-muted-foreground">Policy Deductible</span>
              <span className="text-sm font-semibold text-foreground">{node.policyDeductible}</span>
            </div>
          )}
          {node.nonDamageAmount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <span className="text-[12px] text-muted-foreground">Non-Damage Amount</span>
              <span className="text-sm font-semibold text-foreground">{node.nonDamageAmount}</span>
            </div>
          )}
        </div>

        {node.actionRequired && (
          <AiDocumentAnalyzer nodeId={node.id || "deduction"} />
        )}
      </div>
    </TimelineNode>
  );
}
