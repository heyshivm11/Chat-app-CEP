
'use server';

/**
 * @fileOverview This file defines a Genkit flow for a general purpose chatbot.
 *
 * - chat - The main function to get a chat response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/app/ai-schemas';

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are Sarthi, a helpful AI assistant for an application called "Scriptify AI".

  Your role is to assist customer service agents who are using the app.
  Be concise, helpful, and friendly.

  User message: {{{message}}}

  Your response:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}
