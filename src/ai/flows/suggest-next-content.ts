'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting what content to watch next based on the user's watch history.
 *
 * - suggestNextContent - A function that suggests the next content to watch.
 * - SuggestNextContentInput - The input type for the suggestNextContent function.
 * - SuggestNextContentOutput - The output type for the suggestNextContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextContentInputSchema = z.object({
  watchHistory: z
    .array(z.string())
    .describe('An array of titles of movies and TV shows the user has watched.'),
});
export type SuggestNextContentInput = z.infer<typeof SuggestNextContentInputSchema>;

const SuggestNextContentOutputSchema = z.object({
  suggestedContent: z
    .string()
    .describe('The title of the movie or TV show suggested for the user to watch next.'),
  reason: z.string().describe('The reason why this content is suggested.'),
});
export type SuggestNextContentOutput = z.infer<typeof SuggestNextContentOutputSchema>;

export async function suggestNextContent(input: SuggestNextContentInput): Promise<SuggestNextContentOutput> {
  return suggestNextContentFlow(input);
}

const suggestNextContentPrompt = ai.definePrompt({
  name: 'suggestNextContentPrompt',
  input: {schema: SuggestNextContentInputSchema},
  output: {schema: SuggestNextContentOutputSchema},
  prompt: `You are a movie and TV show recommendation expert.

Based on the user's watch history, suggest what they should watch next and explain your reasoning.

Watch History:
{{#each watchHistory}}- {{this}}\n{{/each}}

Suggestion:`,
});

const suggestNextContentFlow = ai.defineFlow(
  {
    name: 'suggestNextContentFlow',
    inputSchema: SuggestNextContentInputSchema,
    outputSchema: SuggestNextContentOutputSchema,
  },
  async input => {
    const {output} = await suggestNextContentPrompt(input);
    return output!;
  }
);
