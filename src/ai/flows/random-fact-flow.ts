
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a random fun fact.
 *
 * - randomFact - The main function to get a random fact.
 * - RandomFactOutput - The return type for the randomFact function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const RandomFactOutputSchema = z.object({
  fact: z.string().describe('A random, interesting, and fun fact.'),
});
export type RandomFactOutput = z.infer<typeof RandomFactOutputSchema>;

const randomFactPrompt = ai.definePrompt({
  name: 'randomFactPrompt',
  output: { schema: RandomFactOutputSchema },
  prompt: `You are a fun AI that provides interesting and random facts.
  
  Please provide one random, interesting, and fun fact. The fact should be relatively short and easy to read.`,
  config: {
    temperature: 1.0,
  }
});

const randomFactFlow = ai.defineFlow(
  {
    name: 'randomFactFlow',
    outputSchema: RandomFactOutputSchema,
  },
  async () => {
    const { output } = await randomFactPrompt();
    return output!;
  }
);

export async function randomFact(): Promise<RandomFactOutput> {
    return randomFactFlow();
}
