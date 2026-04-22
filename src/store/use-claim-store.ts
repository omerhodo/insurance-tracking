import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { DocumentStatus } from "@/lib/schemas/claim";

// ─── Custom Node Types ────────────────────────────────────────────────────────

/** A user-inserted note between two timeline steps. */
export interface CustomNoteNode {
  id: string;
  kind: "NOTE";
  content: string;
  createdAt: string; // ISO string
  author: string;
}

/** A user-inserted attachment between two timeline steps. */
export interface CustomAttachmentNode {
  id: string;
  kind: "ATTACHMENT";
  fileName: string;
  fileType: string;
  fileSize: number; // bytes
  createdAt: string;
  author: string;
}

export type CustomNode = CustomNoteNode | CustomAttachmentNode;

// ─── AI Analyzer State ────────────────────────────────────────────────────────

export type AiAnalyzerStatus = "idle" | "loading" | "success" | "error";

export interface AiAnalyzerState {
  status: AiAnalyzerStatus;
  /** The file selected by the user (kept in store for status display) */
  fileName: string | null;
  fileSize: number | null;
  /** Error message from a failed simulated analysis */
  errorMessage: string | null;
  /** Override for the document status after a successful analysis */
  resolvedDocumentStatus: DocumentStatus | null;
}

// ─── Store shape ──────────────────────────────────────────────────────────────

interface ClaimState {
  /**
   * Dynamic nodes inserted between existing process steps.
   * Key = `"after:{stepId}"` — e.g. `"after:step-2"`.
   * Value = ordered list of custom nodes.
   */
  dynamicNodes: Record<string, CustomNode[]>;

  /**
   * Tracks which node AI popovers are currently open.
   * Key = step `id` (e.g. "step-1").
   */
  aiPopovers: Record<string, boolean>;

  /** State for the AI Document Analyzer on the Deduction step. */
  aiAnalyzer: AiAnalyzerState;
}

interface ClaimActions {
  // ── Dynamic Node Management ──────────────────────────────────────────────

  /** Insert a custom node after a given step id. */
  addDynamicNode: (afterStepId: string, node: CustomNode) => void;

  /** Remove a custom node by its own `id`. */
  removeDynamicNode: (afterStepId: string, nodeId: string) => void;

  // ── AI Popover Management ────────────────────────────────────────────────

  /** Toggle the AI explanation popover for a specific step. */
  toggleAiPopover: (stepId: string) => void;

  /** Close all open AI popovers. */
  closeAllAiPopovers: () => void;

  // ── AI Document Analyzer ─────────────────────────────────────────────────

  /** Called when the user selects a file for upload. */
  setAnalyzerFile: (fileName: string, fileSize: number) => void;

  /** Kick off the simulated AI analysis. */
  startAnalysis: () => void;

  /** Mark analysis as successful. */
  resolveAnalysis: (documentStatus: DocumentStatus) => void;

  /** Mark analysis as failed. */
  failAnalysis: (errorMessage: string) => void;

  /** Reset the analyzer back to idle. */
  resetAnalyzer: () => void;
}

const INITIAL_ANALYZER_STATE: AiAnalyzerState = {
  status: "idle",
  fileName: null,
  fileSize: null,
  errorMessage: null,
  resolvedDocumentStatus: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useClaimStore = create<ClaimState & ClaimActions>()(
  devtools(
    immer((set) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      dynamicNodes: {},
      aiPopovers: {},
      aiAnalyzer: INITIAL_ANALYZER_STATE,

      // ── Dynamic Node actions ───────────────────────────────────────────────
      addDynamicNode: (afterStepId, node) =>
        set((state) => {
          const key = `after:${afterStepId}`;
          if (!state.dynamicNodes[key]) {
            state.dynamicNodes[key] = [];
          }
          state.dynamicNodes[key].push(node);
        }),

      removeDynamicNode: (afterStepId, nodeId) =>
        set((state) => {
          const key = `after:${afterStepId}`;
          if (state.dynamicNodes[key]) {
            state.dynamicNodes[key] = state.dynamicNodes[key].filter(
              (n) => n.id !== nodeId
            );
          }
        }),

      // ── AI Popover actions ─────────────────────────────────────────────────
      toggleAiPopover: (stepId) =>
        set((state) => {
          state.aiPopovers[stepId] = !state.aiPopovers[stepId];
        }),

      closeAllAiPopovers: () =>
        set((state) => {
          state.aiPopovers = {};
        }),

      // ── AI Analyzer actions ────────────────────────────────────────────────
      setAnalyzerFile: (fileName, fileSize) =>
        set((state) => {
          state.aiAnalyzer.fileName = fileName;
          state.aiAnalyzer.fileSize = fileSize;
          state.aiAnalyzer.status = "idle";
          state.aiAnalyzer.errorMessage = null;
          state.aiAnalyzer.resolvedDocumentStatus = null;
        }),

      startAnalysis: () =>
        set((state) => {
          state.aiAnalyzer.status = "loading";
          state.aiAnalyzer.errorMessage = null;
        }),

      resolveAnalysis: (documentStatus) =>
        set((state) => {
          state.aiAnalyzer.status = "success";
          state.aiAnalyzer.resolvedDocumentStatus = documentStatus;
        }),

      failAnalysis: (errorMessage) =>
        set((state) => {
          state.aiAnalyzer.status = "error";
          state.aiAnalyzer.errorMessage = errorMessage;
        }),

      resetAnalyzer: () =>
        set((state) => {
          state.aiAnalyzer = INITIAL_ANALYZER_STATE;
        }),
    })),
    { name: "ClaimStore" }
  )
);
