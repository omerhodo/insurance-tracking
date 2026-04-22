"use server";

import tr from "../locales/tr.json";
import en from "../locales/en.json";
import type { Claim } from "@/lib/schemas/claim";
import { GeminiProvider } from "@/services/ai/ai-provider";

const locales: Record<string, any> = { tr, en };

export async function generateAiSummary(
  claim: Claim,
  language: string
): Promise<string> {
  const t = (key: string) => {
    const [section, sub] = key.split(".");
    return locales[language]?.actions?.[section]?.[sub] || key;
  };

  try {
    const provider = new GeminiProvider();
    const summary = await provider.generateSummary(claim, language);
    return summary;
  } catch (error: any) {
    console.error("Error in generateAiSummary action:", error);
    if (error.message.includes("GEMINI_API_KEY")) {
      return t("ai.keyMissing");
    }
    return t("ai.error");
  }
}
