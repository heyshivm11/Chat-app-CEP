"use server";

import { refineScript } from "@/ai/flows/refine-script-with-ai";
import { chat } from "@/ai/flows/chatbot-flow";
import type { RefineScriptInput, ChatInput } from "./ai-schemas";


export async function getRefinedScript(input: RefineScriptInput) {
  try {
    const result = await refineScript(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to refine script: ${errorMessage}` };
  }
}

export async function getChatResponse(input: ChatInput) {
    try {
        const result = await chat(input);
        return { success: true, data: result };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to get response: ${errorMessage}` };
    }
}
