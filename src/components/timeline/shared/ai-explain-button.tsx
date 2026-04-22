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



// ─── Component ────────────────────────────────────────────────────────────────

interface AiExplainButtonProps {
  stepId: string;
  nodeType: string;
  className?: string;
}

export function AiExplainButton({
  stepId,
  nodeType,
  className,
}: AiExplainButtonProps) {
  const { t } = useTranslation();
  const isOpen = useClaimStore((s) => !!s.aiPopovers[stepId]);
  const toggleAiPopover = useClaimStore((s) => s.toggleAiPopover);

  const titleKey = `timeline.aiExplanations.${nodeType}.title`;
  const contentKey = `timeline.aiExplanations.${nodeType}.content`;
  
  const hasExplanation = t(titleKey) !== titleKey;
  
  const explanation = {
    title: hasExplanation ? t(titleKey) : nodeType,
    content: hasExplanation ? t(contentKey) : t("timeline.noExplanation"),
  };

  return (
    <Popover open={isOpen} onOpenChange={() => toggleAiPopover(stepId)}>
      {/*
       * Base UI PopoverTrigger renders its own <button> element.
       * Style it directly via className — no asChild needed.
       */}
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
        className="w-80 p-0 border-blue-500/20 shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-blue-500/15 bg-blue-500/5 rounded-t-lg">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {t("timeline.aiAssistant")}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">
            {explanation.title}
          </p>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation.content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 pb-3">
          <p className="text-[11px] text-muted-foreground/60">
            {t("timeline.aiDisclaimer")}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
