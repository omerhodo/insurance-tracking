"use client";

import { Banknote, Building2, CreditCard, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimelineNode } from "../TimelineNode";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PaymentNode as TPaymentNode } from "@/lib/schemas/claim";

interface Props {
  node: TPaymentNode;
  isLast?: boolean;
}

export function PaymentNode({ node, isLast }: Props) {
  const d = node.details;

  return (
    <TimelineNode node={node} isLast={isLast}>
      <div className="space-y-4">
        {/* Net amount — hero figure */}
        <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1">
            Net Tazminat Tutarı
          </p>
          <p className="text-3xl font-extrabold font-mono text-primary">
            {formatCurrency(d.netPayableAmount, d.currency)}
          </p>
          <Badge
            variant="outline"
            className="mt-2 text-xs border-slate-500/30 text-slate-400"
          >
            <Clock className="h-3 w-3 mr-1" />
            Ödeme Beklemede
          </Badge>
        </div>

        {/* Bank details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                Banka
              </p>
              <p className="text-sm font-semibold text-foreground">{d.bankName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40">
            <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                IBAN (Son 4)
              </p>
              <p className="text-sm font-semibold font-mono text-foreground">
                ···· {d.ibanLast4}
              </p>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div
          className={cn(
            "flex items-center gap-2.5 p-3 rounded-lg",
            "border border-dashed border-border/60"
          )}
        >
          <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">
            Ödeme Yöntemi:{" "}
            <span className="font-semibold text-foreground">{d.paymentMethod}</span>
          </span>
          {d.transactionId && (
            <Badge variant="outline" className="ml-auto font-mono text-xs">
              {d.transactionId}
            </Badge>
          )}
        </div>

        {d.notes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-3">
            {d.notes}
          </p>
        )}
      </div>
    </TimelineNode>
  );
}
