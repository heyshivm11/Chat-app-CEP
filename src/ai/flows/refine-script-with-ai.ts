// refine-script-with-ai.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to refine a given chat script using AI.
 *
 * It takes a script and optional context/sentiment information as input, and outputs a refined script.
 *
 * - refineScript - The main function to refine the script.
 * - RefineScriptInput - The input type for the refineScript function.
 * - RefineScriptOutput - The return type for the refineScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineScriptInputSchema = z.object({
  script: z.string().describe('The chat script to refine.'),
  context: z.string().optional().describe('The context of the chat.').default(""),
  sentiment: z.string().optional().describe('The sentiment of the customer.').default(""),
});
export type RefineScriptInput = z.infer<typeof RefineScriptInputSchema>;

const RefineScriptOutputSchema = z.object({
  refinedScript: z.string().describe('The refined chat script.'),
});
export type RefineScriptOutput = z.infer<typeof RefineScriptOutputSchema>;

export async function refineScript(input: RefineScriptInput): Promise<RefineScriptOutput> {
  return refineScriptFlow(input);
}

const refineScriptPrompt = ai.definePrompt({
  name: 'refineScriptPrompt',
  input: {schema: RefineScriptInputSchema},
  output: {schema: RefineScriptOutputSchema},
  prompt: `You are an AI assistant specialized in refining chat scripts for customer service.

  Given the following script, chat context, and customer sentiment, generate a refined version of the script that is more tailored to the situation.

  Original Script: {{{script}}}

  Chat Context: {{{context}}}

  Customer Sentiment: {{{sentiment}}}

  Refined Script:`,
});

const refineScriptFlow = ai.defineFlow(
  {
    name: 'refineScriptFlow',
    inputSchema: RefineScriptInputSchema,
    outputSchema: RefineScriptOutputSchema,
  },
  async input => {
    const {output} = await refineScriptPrompt(input);
    return output!;
  }
);
