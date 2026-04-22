"use client";

import { Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClaimStore } from "@/store/use-claim-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";


import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { explainTimelineStep } from "@/actions/ai-actions";
import type { ProcessNode } from "@/lib/schemas/claim";

// ─── Component ────────────────────────────────────────────────────────────────

interface AiExplainButtonProps {
  step: ProcessNode;
  className?: string;
}

export function AiExplainButton({
  step,
  className,
}: AiExplainButtonProps) {
  const { t, i18n } = useTranslation();
  const stepId = step.id!;
  const isOpen = useClaimStore((s) => !!s.aiPopovers[stepId]);
  const toggleAiPopover = useClaimStore((s) => s.toggleAiPopover);

  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !explanation && !loading) {
      const fetchExplanation = async () => {
        setLoading(true);
        try {
          const result = await explainTimelineStep(step, i18n.language);
          setExplanation(result);
        } catch (error) {
          console.error("AI Explanation Error:", error);
          setExplanation(t("timeline.aiError"));
        } finally {
          setLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [isOpen, explanation, loading, step, i18n.language, t]);

  const title = t(`timeline.nodes.${step.title}`);

  return (
    <Popover open={isOpen} onOpenChange={() => toggleAiPopover(stepId)}>
      <PopoverTrigger
        id={`ai-explain-${stepId}`}
        aria-label={t("timeline.aiExplain")}
        className={cn(
          "flex items-center justify-center h-8 w-8 min-h-0 min-w-0",
          "rounded-full transition-all duration-200 cursor-pointer",
          "border-none bg-transparent p-0",
          "hover:bg-blue-500/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
          isOpen && "bg-blue-500/15",
          className
        )}
      >
        <Sparkles
          className={cn(
            "h-4 w-4 transition-colors duration-200",
            isOpen ? "text-blue-400" : "text-muted-foreground"
          )}
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 border-blue-500/20 shadow-xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-blue-500/15 bg-blue-500/5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {t("timeline.aiAssistant")}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">
            {title}
          </p>
        </div>

        {/* Body */}
        <div className="px-4 py-4 min-h-[100px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              <p className="text-[11px] text-muted-foreground animate-pulse">
                {t("timeline.aiLoading")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation || t("timeline.noExplanation")}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-3">
          <p className="text-[11px] text-muted-foreground/60 italic">
            {t("timeline.aiDisclaimer")}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
