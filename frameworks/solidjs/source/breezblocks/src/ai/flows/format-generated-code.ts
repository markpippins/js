'use server';

/**
 * @fileOverview This flow formats generated code using Prettier.
 *
 * - formatGeneratedCode - A function that formats code.
 * - FormatGeneratedCodeInput - The input type for the formatGeneratedCode function.
 * - FormatGeneratedCodeOutput - The return type for the formatGeneratedCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {format} from 'prettier';

const FormatGeneratedCodeInputSchema = z.object({
  code: z.string().describe('The code to format.'),
});

export type FormatGeneratedCodeInput = z.infer<typeof FormatGeneratedCodeInputSchema>;

const FormatGeneratedCodeOutputSchema = z.object({
  formattedCode: z.string().describe('The formatted code.'),
});

export type FormatGeneratedCodeOutput = z.infer<typeof FormatGeneratedCodeOutputSchema>;

export async function formatGeneratedCode(input: FormatGeneratedCodeInput): Promise<FormatGeneratedCodeOutput> {
  return formatGeneratedCodeFlow(input);
}

const formatGeneratedCodeFlow = ai.defineFlow(
  {
    name: 'formatGeneratedCodeFlow',
    inputSchema: FormatGeneratedCodeInputSchema,
    outputSchema: FormatGeneratedCodeOutputSchema,
  },
  async input => {
    const formattedCode = await format(input.code, {
      parser: 'typescript',
      plugins: [require.resolve('prettier-plugin-tailwindcss')],
    });
    return {formattedCode};
  }
);
