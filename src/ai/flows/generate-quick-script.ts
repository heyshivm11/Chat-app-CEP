'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a quick chat script using AI.
 *
 * It takes a prompt as input and outputs a generated script.
 *
 * - generateQuickScript - The main function to generate the script.
 * - GenerateQuickScriptInput - The input type for the generateQuickScript function.
 * - GenerateQuickScriptOutput - The return type for the generateQuickScript function.
 */

import {ai} from '@/ai/genkit';
import type { GenerateQuickScriptInput, GenerateQuickScriptOutput } from '@/app/ai-schemas';
import { GenerateQuickScriptInputSchema, GenerateQuickScriptOutputSchema } from '@/app/ai-schemas';


export async function generateQuickScript(input: GenerateQuickScriptInput): Promise<GenerateQuickScriptOutput> {
  return generateQuickScriptFlow(input);
}

const generateQuickScriptPrompt = ai.definePrompt({
  name: 'generateQuickScriptPrompt',
  input: {schema: GenerateQuickScriptInputSchema},
  output: {schema: GenerateQuickScriptOutputSchema},
  prompt: `You are an expert customer service script writer. You are concise, professional, and friendly.
  Based on the following request, generate a short script.

  Request: {{{prompt}}}

  Generated Script:`,
});

const generateQuickScriptFlow = ai.defineFlow(
  {
    name: 'generateQuickScriptFlow',
    inputSchema: GenerateQuickScriptInputSchema,
    outputSchema: GenerateQuickScriptOutputSchema,
  },
  async input => {
    const {output} = await generateQuickScriptPrompt(input);
    return output!;
  }
);
