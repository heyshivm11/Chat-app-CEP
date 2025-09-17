
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
  prompt: `You are an expert in customer support communications. Your task is to take a customer service chat script and make it sound more human, empathetic, and conversational.

  Analyze the original script and rewrite it to be more natural and less robotic.
  
  - Focus on empathy, clarity, and a positive, helpful tone.
  - Avoid corporate jargon.
  - Maintain the core meaning of the original script.
  - Provide a creative and friendly alternative.

  Original Script:
  "{{{script}}}"
  
  Now, provide the humanized version in the 'refinedScript' output field.`,
  config: {
    temperature: 0.7,
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
