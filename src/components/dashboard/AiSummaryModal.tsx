"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Claim } from "@/lib/schemas/claim";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  claim: Claim;
}

export function AiSummaryModal({ claim }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsOpen(true);
    if (!summary) {
      setIsGenerating(true);
      // Simulate AI generation time
      setTimeout(() => {
        setIsGenerating(false);
        setSummary(generateMockSummary(claim));
      }, 2000);
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerate}
        className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-blue-500/20"
      >
        <Sparkles className="h-4 w-4" />
        AI Özeti
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] border-blue-500/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
              <BrainCircuit className="h-6 w-6 text-blue-400" />
              AI Agent Analiz Özeti
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin relative z-10" />
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                  Tüm süreç verileri analiz ediliyor...
                </p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
                  {summary?.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') ? "ml-4" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function generateMockSummary(claim: Claim) {
  const completedSteps = claim.processDetails.filter(s => s.status.includes("Completed")).length;
  const pendingSteps = claim.processDetails.filter(s => s.status === "Pending").length;

  return `Dosya No ${claim.fileNo} numaralı ${claim.title} detaylı bir şekilde incelenmiştir. Mevcut duruma göre süreç "${claim.currentStatus}" aşamasında olup tahmini tamamlanma süresi ${claim.estimatedRemainingTime} olarak öngörülmektedir.

Önemli Bulgular:
• Toplam ${claim.processDetails.length} işlem adımının ${completedSteps} tanesi tamamlanmıştır.
• Araç çekimi, hasar bildirimi ve ikame araç tahsisi gibi ilk aşamalar sorunsuz bir şekilde sonuçlanmıştır.
• Ekspertiz raporu tamamlanmış olup, dosya inceleme aşaması devam etmektedir.
• Kesinti nedeni olarak "Mesleki Belge Yüklemesi" beklenmektedir. Bu belge yüklendikten sonra kesinti ve ödeme onay adımlarına geçilebilecektir.
• Ödeme bilgileri ve dosyanın kapanması için bekleyen ${pendingSteps} adım bulunmaktadır.

Tavsiye:
Sürecin hızlanması için acil eylem gerektiren eksik belgelerin (Mesleki Belge) sisteme yüklenmesi gerekmektedir. Ödeme işlemi, kesinti onayının ardından gerçekleştirilecektir.`;
}
