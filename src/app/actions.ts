"use server";

import { refineScript } from "@/ai/flows/refine-script-with-ai";
import { chat } from "@/ai/flows/chatbot-flow";
import type { RefineScriptInput } from "./ai-schemas";
import type { ChatInput } from "@/ai/flows/chatbot-flow";


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

export async function getChatResponse(input: ChatInput) {
    try {
        const result = await chat(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Chatbot request failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to get response: ${errorMessage}` };
    }
}
