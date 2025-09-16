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
import type { RefineScriptInput, RefineScriptOutput } from '@/app/ai-schemas';
import { RefineScriptInputSchema, RefineScriptOutputSchema } from '@/app/ai-schemas';


export async function refineScript(input: RefineScriptInput): Promise<RefineScriptOutput> {
  return refineScriptFlow(input);
}

const refineScriptPrompt = ai.definePrompt({
  name: 'humanizeScriptPrompt',
  input: {schema: RefineScriptInputSchema},
  output: {schema: RefineScriptOutputSchema},
  prompt: `You are an AI assistant specialized in making chat scripts sound more human and natural for customer service agents.

  Your goal is to rewrite the given script to be less robotic and more conversational, while keeping the original meaning intact. Provide a creative and friendly alternative.

  Original Script: {{{script}}}

  Humanized Script:`,
  config: {
    temperature: 0.9,
  }
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
