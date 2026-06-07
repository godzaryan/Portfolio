import { generateObject, type GenerateObjectResult } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { terminalLayoutSchema, type TerminalLayout } from "./schema";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

// Array of free-tier models verified for availability
const FALLBACK_MODELS = [
  groq("llama-3.3-70b-versatile"), // Primary heavyweight
  groq("llama-3.1-8b-instant"), // Reliable fallback
  google("gemini-1.5-flash"), // Reliable ultimate fallback
];

export async function generateDynamicLayout(
  prompt: string,
  systemContext: string
): Promise<GenerateObjectResult<TerminalLayout>> {
  let lastError: Error | null = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const result = await generateObject({
        model,
        mode: model.provider.includes("groq") ? "json" : "auto",
        schema: terminalLayoutSchema,
        system: systemContext,
        prompt,
      });
      
      return result;
    } catch (error: any) {
      console.warn(`[AI SDK] Model ${model.modelId} failed:`, error.message);
      lastError = error;
      
      // If it's a rate limit (429) or service unavailable (503), continue to next model
      if (error?.message?.includes("429") || error?.message?.includes("503") || error?.message?.includes("rate limit") || error?.message?.includes("not found")) {
        continue;
      }
      
      // Wait, the instructions said to "seamlessly drop back down... on 429 Rate Limit error". 
      // We will fallback on any error just to be safe.
      continue;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
}
