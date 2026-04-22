import { GoogleGenAI } from "@google/genai";
import type { Claim } from "@/lib/schemas/claim";

export interface AiProvider {
  generateSummary(claim: Claim, language: string): Promise<string>;
}

export class GeminiProvider implements AiProvider {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateSummary(claim: Claim, language: string): Promise<string> {
    const prompt = `
      You are an AI assistant for an insurance company. Your job is to analyze the following insurance claim data and provide a concise, professional summary for the user.
      
      Language requested: ${language} (Please respond ONLY in this language).
      
      Claim Data:
      ${JSON.stringify(claim, null, 2)}
      
      Requirements for the summary:
      1. Start with the file number and the overall status.
      2. Mention how many steps are completed and how many are pending.
      3. Highlight any "actionRequired" from the "Deduction Reason" step or any other step if present.
      4. Conclude with a brief recommendation or next step for the user.
      5. Keep the formatting clean, using bullet points for key findings.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text || "No summary generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate AI summary from Gemini.");
    }
  }
}
