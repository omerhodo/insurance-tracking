"use client";

import { TowingServiceNode } from "./nodes/TowingServiceNode";
import { ClaimNotificationNode } from "./nodes/ClaimNotificationNode";
import { AppraisalNode } from "./nodes/AppraisalNode";
import { SubstituteRentalVehicleNode } from "./nodes/SubstituteRentalVehicleNode";
import { FileReviewNode } from "./nodes/FileReviewNode";
import { DeductionReasonNode } from "./nodes/DeductionReasonNode";
import { PaymentInformationNode } from "./nodes/PaymentInformationNode";
import { ClosedNode } from "./nodes/ClosedNode";
import { CustomNodeCard } from "./CustomNodeCard";
import { useClaimStore } from "@/store/use-claim-store";
import type { ProcessNode } from "@/lib/schemas/claim";

interface NodeRendererProps {
  node: ProcessNode;
  isLast?: boolean;
}

export function NodeRenderer({ node, isLast = false }: NodeRendererProps) {
  switch (node.title) {
    case "Towing Service":
      return <TowingServiceNode node={node} isLast={isLast} />;
    case "Claim Notification":
      return <ClaimNotificationNode node={node} isLast={isLast} />;
    case "Appraisal":
      return <AppraisalNode node={node} isLast={isLast} />;
    case "Substitute Rental Vehicle":
      return <SubstituteRentalVehicleNode node={node} isLast={isLast} />;
    case "File Review":
      return <FileReviewNode node={node} isLast={isLast} />;
    case "Deduction Reason":
      return <DeductionReasonNode node={node} isLast={isLast} />;
    case "Payment Information":
      return <PaymentInformationNode node={node} isLast={isLast} />;
    case "Closed":
      return <ClosedNode node={node} isLast={isLast} />;
    default:
      const _exhaustiveCheck: never = node;
      return null;
  }
}

import { AddDynamicNodeButton } from "./AddDynamicNodeButton";

interface TimelineProps {
  nodes: readonly ProcessNode[];
}

export function Timeline({ nodes }: TimelineProps) {
  const dynamicNodes = useClaimStore((s) => s.dynamicNodes);

  return (
    <div className="relative">
      {nodes.map((node, idx) => {
        const isLast = idx === nodes.length - 1;
        const insertedNodes = dynamicNodes[`after:${node.id}`] ?? [];

        return (
          <div key={node.id || idx}>
            {/* Process step node */}
            <NodeRenderer
              node={node}
              isLast={isLast && insertedNodes.length === 0}
            />

            {/* Dynamically inserted custom nodes after this step */}
            {insertedNodes.map((customNode) => (
              <CustomNodeCard
                key={customNode.id}
                afterStepId={node.id || String(idx)}
                node={customNode}
              />
            ))}

            {/* Insertion Button - only if not the very last item in the whole chain */}
            {(!isLast || insertedNodes.length > 0) && (
              <AddDynamicNodeButton afterStepId={node.id || String(idx)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
