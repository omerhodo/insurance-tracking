/**
 * Node Registry — maps ProcessType to its specific React component.
 *
 * Pattern: switch-based renderer for full TypeScript type narrowing.
 * The discriminated union on `node.type` means each case's `node` is
 * automatically narrowed to the correct subtype — zero type-casting needed
 * inside individual node components.
 *
 * To add a new step type:
 *   1. Add the schema + type to `src/lib/schemas/claim.ts`
 *   2. Create `src/components/timeline/nodes/MyNewNode.tsx`
 *   3. Add a `case "MY_NEW_TYPE":` branch below
 */

"use client";

import { TowingServiceNode } from "./nodes/TowingServiceNode";
import { FileReviewNode } from "./nodes/FileReviewNode";
import { AppraisalNode } from "./nodes/AppraisalNode";
import { CoverageCheckNode } from "./nodes/CoverageCheckNode";
import { DeductionReasonNode } from "./nodes/DeductionReasonNode";
import { PaymentNode } from "./nodes/PaymentNode";
import { CustomNodeCard } from "./CustomNodeCard";
import { useClaimStore } from "@/store/use-claim-store";
import type { ProcessNode } from "@/lib/schemas/claim";

// ─── Registry renderer ────────────────────────────────────────────────────────

interface NodeRendererProps {
  node: ProcessNode;
  isLast?: boolean;
}

/**
 * The registry render function. Reads `node.type` and delegates to
 * the matching specific component. TypeScript narrows the type in each case.
 */
export function NodeRenderer({ node, isLast = false }: NodeRendererProps) {
  switch (node.type) {
    case "TOWING_SERVICE":
      return <TowingServiceNode node={node} isLast={isLast} />;
    case "FILE_REVIEW":
      return <FileReviewNode node={node} isLast={isLast} />;
    case "APPRAISAL":
      return <AppraisalNode node={node} isLast={isLast} />;
    case "COVERAGE_CHECK":
      return <CoverageCheckNode node={node} isLast={isLast} />;
    case "DEDUCTION_REASON":
      return <DeductionReasonNode node={node} isLast={isLast} />;
    case "PAYMENT":
      return <PaymentNode node={node} isLast={isLast} />;
    default:
      // TypeScript exhaustiveness check — will error at compile-time if a
      // new ProcessType is added to the schema but not handled here.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = node;
      return null;
  }
}

// ─── Timeline renderer (nodes + dynamic inserts) ─────────────────────────────

interface TimelineProps {
  nodes: readonly ProcessNode[];
}

/**
 * Renders the full timeline list, interleaving dynamic custom nodes
 * (from Zustand store) between each process step.
 */
export function Timeline({ nodes }: TimelineProps) {
  const dynamicNodes = useClaimStore((s) => s.dynamicNodes);

  return (
    <div className="relative">
      {nodes.map((node, idx) => {
        const isLast = idx === nodes.length - 1;
        const insertedNodes = dynamicNodes[`after:${node.id}`] ?? [];

        return (
          <div key={node.id}>
            {/* Process step node */}
            <NodeRenderer node={node} isLast={isLast && insertedNodes.length === 0} />

            {/* Dynamically inserted custom nodes after this step */}
            {insertedNodes.map((customNode) => (
              <CustomNodeCard
                key={customNode.id}
                afterStepId={node.id}
                node={customNode}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
