"use server";

import { refineScript, RefineScriptInput } from "@/ai/flows/refine-script-with-ai";
import { chatAssistant, ChatAssistantInput } from "@/ai/flows/chat-assistant";

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
