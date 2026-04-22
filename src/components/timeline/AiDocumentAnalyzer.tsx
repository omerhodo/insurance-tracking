"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClaimStore } from "@/store/use-claim-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// keys for simulation steps
const ANALYSIS_STEP_KEYS = [
  "analyzer.reading",
  "analyzer.ocr",
  "analyzer.validating",
  "analyzer.matching",
  "analyzer.finished",
];

interface Props {
  nodeId: string;
}

export function AiDocumentAnalyzer({ nodeId }: Props) {
  const { t } = useTranslation();
  const analyzer = useClaimStore((s) => s.aiAnalyzer);
  const setAnalyzerFile = useClaimStore((s) => s.setAnalyzerFile);
  const startAnalysis = useClaimStore((s) => s.startAnalysis);
  const resolveAnalysis = useClaimStore((s) => s.resolveAnalysis);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // ── Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnalyzerFile(file.name, file.size);
      startAnalysis();
    }
  };

  // ── Simulate AI progress
  useEffect(() => {
    if (analyzer.status === "loading") {
      setCurrentStepIdx(0);
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < ANALYSIS_STEP_KEYS.length - 1) {
          setCurrentStepIdx(step);
        } else {
          clearInterval(interval);
          resolveAnalysis("APPROVED");
        }
      }, 1200); // 1.2s per step to make it readable

      return () => clearInterval(interval);
    }
  }, [analyzer.status, resolveAnalysis]);

  // ── Render: Idle (Upload Button)
  if (analyzer.status === "idle") {
    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <Button
          id={`upload-doc-btn-${nodeId}`}
          size="sm"
          className="w-full gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 hover:text-amber-200"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {t("common.uploadDocument")}
        </Button>
      </>
    );
  }

  // ── Render: Loading or Success
  const isSuccess = analyzer.status === "success";

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-colors duration-500",
        isSuccess
          ? "border-green-500/30 bg-green-500/10"
          : "border-blue-500/40 bg-blue-500/10"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon box */}
        <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-lg shrink-0 transition-colors",
            isSuccess
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          )}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5 animate-pulse" />
          )}
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {analyzer.fileName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {!isSuccess && (
              <Loader2 className="h-3 w-3 text-blue-400 animate-spin shrink-0" />
            )}
            {isSuccess && (
              <Sparkles className="h-3 w-3 text-green-400 shrink-0" />
            )}
            <p
              className={cn(
                "text-[11px] uppercase tracking-wide truncate transition-colors",
                isSuccess
                  ? "text-green-400 font-bold"
                  : "text-blue-400 font-semibold"
              )}
            >
              {isSuccess
                ? t("analyzer.success")
                : t(ANALYSIS_STEP_KEYS[currentStepIdx])}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar (Loading only) */}
      {!isSuccess && (
        <div className="mt-3 relative h-1.5 w-full rounded-full bg-blue-500/20 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.max(
                15,
                (currentStepIdx / (ANALYSIS_STEP_KEYS.length - 1)) * 100
              )}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
