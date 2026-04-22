"use server";

import type { Claim } from "@/lib/schemas/claim";
import { GeminiProvider } from "@/services/ai/ai-provider";

export async function generateAiSummary(
  claim: Claim,
  language: string
): Promise<string> {
  try {
    const provider = new GeminiProvider();
    const summary = await provider.generateSummary(claim, language);
    return summary;
  } catch (error: any) {
    console.error("Error in generateAiSummary action:", error);
    if (error.message.includes("GEMINI_API_KEY")) {
      return language === "tr"
        ? "Sistem yöneticisinin GEMINI_API_KEY yapılandırması gerekiyor."
        : "System administrator needs to configure GEMINI_API_KEY.";
    }
    return language === "tr"
      ? "AI özeti oluşturulurken bir hata oluştu."
      : "An error occurred while generating the AI summary.";
  }
}
