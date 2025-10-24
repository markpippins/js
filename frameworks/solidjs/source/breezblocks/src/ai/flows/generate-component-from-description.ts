'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate SolidJS UI components with TailwindCSS based on a text description.
 *
 * - generateComponentFromDescription - The main function to generate the component code.
 * - GenerateComponentFromDescriptionInput - The input type for the generateComponentFromDescription function.
 * - GenerateComponentFromDescriptionOutput - The return type for the generateComponentFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComponentFromDescriptionInputSchema = z.object({
  componentDescription: z.string().describe('A description of the UI component to generate, including the desired functionality and appearance.'),
});
export type GenerateComponentFromDescriptionInput = z.infer<typeof GenerateComponentFromDescriptionInputSchema>;

const GenerateComponentFromDescriptionOutputSchema = z.object({
  componentCode: z.string().describe('The generated SolidJS code for the UI component, styled with TailwindCSS.'),
});
export type GenerateComponentFromDescriptionOutput = z.infer<typeof GenerateComponentFromDescriptionOutputSchema>;

export async function generateComponentFromDescription(input: GenerateComponentFromDescriptionInput): Promise<GenerateComponentFromDescriptionOutput> {
  return generateComponentFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComponentFromDescriptionPrompt',
  input: {schema: GenerateComponentFromDescriptionInputSchema},
  output: {schema: GenerateComponentFromDescriptionOutputSchema},
  prompt: `You are an expert SolidJS and TailwindCSS developer.

  Based on the user's description, generate SolidJS code for a UI component styled with TailwindCSS.

  Description: {{{componentDescription}}}

  Ensure the code is well-formatted, efficient, and uses best practices for SolidJS and TailwindCSS.
  The code should be directly usable in a SolidJS project.
  `, // add more specific instructions here
});

const generateComponentFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateComponentFromDescriptionFlow',
    inputSchema: GenerateComponentFromDescriptionInputSchema,
    outputSchema: GenerateComponentFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
