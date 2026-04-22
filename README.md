# AI-Powered Claim Orchestrator — Case Study

## Overview
This project is a high-performance, mobile-first insurance claim dashboard built to address the complexities of modern claims processing. It demonstrates senior-level frontend architectural patterns, focusing on **polymorphic component rendering**, **strict type safety**, and **state-driven UI**.

## Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Zustand + Immer (Immutable updates)
- **Data Fetching:** TanStack React Query
- **Validation:** Zod (Discriminated Unions)
- **Styling:** Tailwind CSS v4 (OKLCH Color Space) + Base UI (shadcn/ui headless components)

---

## Architectural Decisions

### 1. The Registry Pattern (Polymorphic UI)
Insurance claims consist of highly heterogeneous steps (Towing, File Review, Appraisal, Payment, etc.). Using generic `if/else` clusters or massive monolithic components leads to unmaintainable code.

**Solution:** 
We implemented a strict Registry Pattern inside `src/components/timeline/node-registry.tsx`. 
- **Zod Discriminated Unions:** The backend data (mocked) is parsed through a Zod schema that enforces a strict `type` literal (e.g., `"TOWING_SERVICE"`).
- **Exhaustive Switch Renderer:** The `NodeRenderer` uses a `switch (node.type)` statement. Because of TypeScript's discriminated union narrowing, the specific component (like `<TowingServiceNode>`) receives a `node` prop that is *already strictly typed* down to its exact structure.
- **Benefits:** No runtime type-casting (`as TowingServiceNode`). If a new node type is added to the Zod schema but not handled in the renderer, TypeScript throws a compile-time error (`_exhaustiveCheck`).

### 2. Global State Management (Zustand + Immer)
The application requires managing cross-component state that isn't tied to server data, specifically:
- Dynamically inserted user notes/attachments between timeline steps.
- The state machine for the AI Document Analyzer (idle → loading → success → error).
- The visibility state of the AI Explanation popovers.

**Solution:** 
A single Zustand store (`src/store/use-claim-store.ts`) handles these concerns.
- **Immer Middleware:** Allows us to write mutable-looking code (e.g., `state.dynamicNodes[key].push(node)`) while Immer safely handles the underlying immutable state updates.
- **Decoupling:** The Timeline component simply subscribes to the store to see if any dynamic nodes exist `after:stepId`, allowing seamless interleaving of server data and client-side edits without mutating the React Query cache directly.

### 3. Data Integrity & Validation (Zod + React Query)
The dashboard must not crash if the backend sends malformed data (e.g., missing a required timestamp for a specific node type).

**Solution:** 
The `useClaimData` hook wraps the fetch call in a Zod `.parse()`. If the backend violates the contract, the promise rejects, and React Query transitions to an error state. The UI gracefully displays an error boundary with a retry mechanism, rather than crashing the React tree with a "cannot read property of undefined" error.

### 4. Design System (Tailwind v4 + OKLCH)
The UI demands a premium, modern aesthetic ("Glassmorphism", vibrant colors, dark-mode first).

**Solution:** 
We built a custom token system in `globals.css` using the new **OKLCH color space** supported by Tailwind v4. 
- OKLCH provides perceptually uniform lightness, meaning a "500" shade of blue and a "500" shade of yellow have the exact same perceived brightness, making dark-mode contrasts incredibly consistent.
- **Touch Targets:** Enforced globally (`min-h-11`, `min-w-11` for interactive elements) to meet WCAG mobile accessibility standards.

### 5. AI Feature Integration
The dashboard incorporates two simulated AI features to reduce cognitive load:
- **AI Explainers:** Canned, contextual explanations for complex insurance jargon (e.g., "Aşınma Payı" / Depreciation), built into a globally managed Base UI popover system.
- **AI Document Analyzer:** A simulated state machine built into the Zustand store that mimics an OCR + Validation pipeline, giving the user immediate visual feedback during document uploads.

---

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the dashboard. All UI changes are simulated entirely on the client.
