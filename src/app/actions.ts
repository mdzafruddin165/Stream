'use server';

import { suggestNextContent, type SuggestNextContentInput, type SuggestNextContentOutput } from "@/ai/flows/suggest-next-content";

export async function getAISuggestion(input: SuggestNextContentInput): Promise<SuggestNextContentOutput> {
  try {
    const result = await suggestNextContent(input);
    return result;
  } catch (error) {
    console.error("AI suggestion failed:", error);
    throw new Error("Failed to get suggestion from AI. Please try again later.");
  }
}
