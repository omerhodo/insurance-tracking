"use client";

import { Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClaimStore } from "@/store/use-claim-store";
import { cn } from "@/lib/utils";

// ─── Canned AI explanations per node type ────────────────────────────────────

const AI_EXPLANATIONS: Record<string, { title: string; content: string }> =
  {
    "Towing Service": {
      title: "Araç Çekme Hizmeti Hakkında",
      content:
        "Araç çekme hizmeti, kaza sonrası aracınızın yetkili servis merkezine güvenli şekilde taşınmasını sağlar. Bu adım otomatik olarak başlatılır; amaç, ekspertiz öncesinde hasarın korunarak doğru tespit edilmesini sağlamaktır. Çekici firması, TRAMER uyumlu anlaşmalı hizmet sağlayıcıları arasından seçilir.",
    },
    "File Review": {
      title: "Dosya İnceleme ve Kayıt Hakkında",
      content:
        "Dosya inceleme sürecinde atanmış ekspern tüm belgelerinizi poliçe şartlarına göre doğrular. Eksik belgeler bu aşamada tespit edilir ve sürecin ilerlemesi için tamamlanması istenir. Kayıt numarası oluşturulması, talebinizin resmi olarak sisteme alındığını ifade eder.",
    },
    "Appraisal": {
      title: "Araç Ekspertizi Hakkında",
      content:
        "Ekspertiz, TRAMER lisanslı bir uzman tarafından her hasar bölgesinin ayrı ayrı değerlendirildiği kritik bir adımdır. 'Toplam Hasar' (Total Loss) tespiti, parçanın tamir maliyetinin yeni parça maliyetinin %70'ini aşması durumunda verilir. Ekspertiz raporu, kesinti hesaplamalarının ve ödeme tutarının temelini oluşturur.",
    },
    "Claim Notification": {
      title: "Poliçe Kapsam Doğrulaması Hakkında",
      content:
        "Kapsam doğrulaması, hasar talebinin sigorta poliçenizin kapsamında olup olmadığını belirler. Muafiyet tutarı, hasar ödemesinden önce sigortalının karşıladığı sabit bir miktardır. Kapsam dışı durumlar (yarış, DUI vb.) bu aşamada tespit edilir; hiçbirinin uygulanmadığı onaylanmıştır.",
    },
    "Deduction Reason": {
      title: "Kesinti Gerekçeleri Hakkında",
      content:
        "Kesintiler SEDDK yönetmelikleri çerçevesinde uygulanır. 'Aşınma Payı' (depreciation), aracın yaşı ve kilometre durumuna göre aktüeryal tablolar kullanılarak hesaplanan yasal bir indirimdir. Poliçe muafiyeti ise sözleşmenin 4.2.1 maddesinde tanımlanan sabit bir tutardır. Bu kesintiler yasal zorunluluk olup değiştirilemez.",
    },
    "Payment Information": {
      title: "Ödeme İşlemi Hakkında",
      content:
        "Net tazminat tutarı, tüm kesintiler onaylandıktan sonra poliçenizde kayıtlı IBAN'a EFT ile aktarılır. Bankalararası EFT süreleri genellikle 1–2 iş günüdür. İşlem başladığında size bir hareket numarası (Transaction ID) iletilecektir. Ödeme aşamasının başlayabilmesi için Kesinti Gerekçesi adımının tamamlanması gerekmektedir.",
    },
  };

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
  const isOpen = useClaimStore((s) => !!s.aiPopovers[stepId]);
  const toggleAiPopover = useClaimStore((s) => s.toggleAiPopover);

  const explanation = AI_EXPLANATIONS[nodeType] || { title: nodeType, content: "Bu adım hakkında detaylı bilgi bulunmamaktadır." };

  return (
    <Popover open={isOpen} onOpenChange={() => toggleAiPopover(stepId)}>
      {/*
       * Base UI PopoverTrigger renders its own <button> element.
       * Style it directly via className — no asChild needed.
       */}
      <PopoverTrigger
        id={`ai-explain-${stepId}`}
        aria-label="AI ile açıkla"
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
              AI Asistan
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
            Bu açıklama, karmaşık sigorta terimlerini anlaşılır kılmak için AI
            tarafından oluşturulmuştur.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
