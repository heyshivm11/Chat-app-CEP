"use server";

import { refineScript } from "@/ai/flows/refine-script-with-ai";
import { generateQuickScript } from "@/ai/flows/generate-quick-script";
import type { RefineScriptInput, GenerateQuickScriptInput } from "./ai-schemas";


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

export async function getQuickScript(input: GenerateQuickScriptInput) {
    try {
      const result = await generateQuickScript(input);
      return { success: true, data: result };
    } catch (error) {
      console.error("AI script generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      return { success: false, error: `Failed to generate script: ${errorMessage}` };
    }
  }
