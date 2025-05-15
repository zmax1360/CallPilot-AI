// 'use server';
/**
 * @fileOverview Generates real-time summaries of calls.
 *
 * - generateCallSummary - A function that handles the generation of call summaries.
 * - GenerateCallSummaryInput - The input type for the generateCallSummary function.
 * - GenerateCallSummaryOutput - The return type for the generateCallSummary function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCallSummaryInputSchema = z.object({
  callTranscript: z
    .string()
    .describe('The transcript of the call to be summarized.'),
});
export type GenerateCallSummaryInput = z.infer<typeof GenerateCallSummaryInputSchema>;

const GenerateCallSummaryOutputSchema = z.object({
  summary: z.string().describe('The summary of the call.'),
});
export type GenerateCallSummaryOutput = z.infer<typeof GenerateCallSummaryOutputSchema>;

export async function generateCallSummary(input: GenerateCallSummaryInput): Promise<GenerateCallSummaryOutput> {
  return generateCallSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCallSummaryPrompt',
  input: {schema: GenerateCallSummaryInputSchema},
  output: {schema: GenerateCallSummaryOutputSchema},
  prompt: `You are an expert call summarizer. Generate a concise and informative summary of the following call transcript:

Call Transcript:
{{{callTranscript}}}

Summary:`,
});

const generateCallSummaryFlow = ai.defineFlow(
  {
    name: 'generateCallSummaryFlow',
    inputSchema: GenerateCallSummaryInputSchema,
    outputSchema: GenerateCallSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
