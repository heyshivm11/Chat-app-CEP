'use server';

/**
 * @fileOverview A general-purpose chat assistant for customer service agents.
 *
 * - chatAssistant - A function that provides AI-powered assistance.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 * - ChatAssistantOutput - The return type for the chatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s query or text to process.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

export const ChatAssistantOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

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
