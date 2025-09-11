'use server';

/**
 * @fileOverview A general-purpose chat assistant for customer service agents.
 *
 * - chatAssistant - A function that provides AI-powered assistance.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 * - ChatAssistantOutput - The return type for the chatAssistant function.
 */

import {ai} from '@/ai/genkit';
import type { ChatAssistantInput, ChatAssistantOutput } from '@/app/ai-schemas';
import { ChatAssistantInputSchema, ChatAssistantOutputSchema } from '@/app/ai-schemas';

export async function chatAssistant(input: ChatAssistantInput): Promise<ChatAssistantOutput> {
  return chatAssistantFlow(input);
}

const chatAssistantPrompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {schema: ChatAssistantInputSchema},
  output: {schema: ChatAssistantOutputSchema},
  prompt: `You are a helpful assistant for a customer service agent. Your goal is to help them be more effective.
  You can paraphrase text, answer questions, or provide information.

  User query: {{{query}}}

  Your response:`,
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await chatAssistantPrompt(input);
    return output!;
  }
);
