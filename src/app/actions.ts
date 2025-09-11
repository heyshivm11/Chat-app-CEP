"use server";

import { refineScript } from "@/ai/flows/refine-script-with-ai";
import { chatAssistant } from "@/ai/flows/chat-assistant";
import { z } from "zod";

// Schema for refineScript
export const RefineScriptInputSchema = z.object({
  script: z.string().describe('The chat script to refine.'),
  context: z.string().optional().describe('The context of the chat.').default(""),
  sentiment: z.string().optional().describe('The sentiment of the customer.').default(""),
});
export type RefineScriptInput = z.infer<typeof RefineScriptInputSchema>;

export const RefineScriptOutputSchema = z.object({
  refinedScript: z.string().describe('The refined chat script.'),
});
export type RefineScriptOutput = z.infer<typeof RefineScriptOutputSchema>;


export async function getRefinedScript(input: RefineScriptInput) {
  try {
    const result = await refineScript(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI refinement failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to refine script: ${errorMessage}` };
  }
}

// Schema for chatAssistant
export const ChatAssistantInputSchema = z.object({
  query: z.string().describe("The user's query or text to process."),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

export const ChatAssistantOutputSchema = z.object({
  response: z.string().describe("The AI-generated response."),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

export async function getChatResponse(input: ChatAssistantInput) {
    try {
        const result = await chatAssistant(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Chat assistant failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to get chat response: ${errorMessage}` };
    }
}
