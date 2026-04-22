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

const NODE_REGISTRY: Record<ProcessNode["title"], React.ComponentType<{ node: any; isLast?: boolean }>> = {
  "Towing Service": TowingServiceNode,
  "Claim Notification": ClaimNotificationNode,
  "Appraisal": AppraisalNode,
  "Substitute Rental Vehicle": SubstituteRentalVehicleNode,
  "File Review": FileReviewNode,
  "Deduction Reason": DeductionReasonNode,
  "Payment Information": PaymentInformationNode,
  "Closed": ClosedNode,
};

export function NodeRenderer({ node, isLast = false }: NodeRendererProps) {
  const Component = NODE_REGISTRY[node.title];
  if (!Component) return null;
  return <Component node={node} isLast={isLast} />;
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
