/**
 * Root page — serves as the dashboard entry point.
 * Phase 4 will replace this with the full dashboard UI.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          MiOX Insurance Technologies
        </p>
        <h1 className="text-4xl font-bold tracking-tight ai-gradient-text">
          AI-Powered Claim Orchestrator
        </h1>
        <p className="text-muted-foreground max-w-md">
          Phase 1 complete — project scaffolded, design system ready.
          <br />
          Awaiting Phase 2 approval.
        </p>
      </div>

      <div className="glass rounded-2xl px-6 py-4 text-sm text-muted-foreground ai-glow-ring">
        ✅ Next.js · TypeScript · Tailwind v4 · shadcn/ui · TanStack Query ·
        Zustand · Zod
      </div>
    </main>
  );
}
