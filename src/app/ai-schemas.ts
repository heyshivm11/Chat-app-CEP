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

// Schema for generateQuickScript
export const GenerateQuickScriptInputSchema = z.object({
    prompt: z.string().describe('The prompt to generate a script from.'),
});
export type GenerateQuickScriptInput = z.infer<typeof GenerateQuickScriptInputSchema>;

export const GenerateQuickScriptOutputSchema = z.object({
    script: z.string().describe('The generated chat script.'),
});
export type GenerateQuickScriptOutput = z.infer<typeof GenerateQuickScriptOutputSchema>;
