"use client";

import { User, CreditCard, Banknote, FileText } from "lucide-react";
import { TimelineNode } from "@/components/timeline/TimelineNode";
import type { PaymentInformationNode as TPaymentInformationNode } from "@/lib/schemas/claim";

interface Props {
  node: TPaymentInformationNode;
  isLast?: boolean;
}

export function PaymentInformationNode({ node, isLast }: Props) {
  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {node.paidTo && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">{node.paidTo}</span>
          </div>
        )}
        {node.iban && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-mono text-foreground">{node.iban}</span>
          </div>
        )}
        {node.paymentAmount && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <Banknote className="h-4 w-4 text-green-500 shrink-0" />
            <span className="text-sm font-bold text-green-500">{node.paymentAmount}</span>
          </div>
        )}
        {node.note && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground">{node.note}</span>
          </div>
        )}
      </div>
    </TimelineNode>
  );
}
