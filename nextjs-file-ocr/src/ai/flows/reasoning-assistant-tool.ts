// src/ai/flows/reasoning-assistant-tool.ts
'use server';

/**
 * @fileOverview An AI tool that analyzes OCR text, identifies fields, and suggests possible values.
 *
 * - reasoningAssistantTool - A function that processes OCR output and provides insights.
 * - ReasoningAssistantToolInput - The input type for the reasoningAssistantTool function.
 * - ReasoningAssistantToolOutput - The return type for the reasoningAssistantTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasoningAssistantToolInputSchema = z.object({
  ocrText: z
    .string()
    .describe('The OCR output text to be analyzed for field identification and value suggestion.'),
});
export type ReasoningAssistantToolInput = z.infer<typeof ReasoningAssistantToolInputSchema>;

const ReasoningAssistantToolOutputSchema = z.object({
  analyzedFields: z
    .array(z.object({fieldName: z.string(), suggestedValue: z.string()}))
    .describe('An array of identified fields and their suggested values from the OCR text.'),
});
export type ReasoningAssistantToolOutput = z.infer<typeof ReasoningAssistantToolOutputSchema>;

export async function reasoningAssistantTool(input: ReasoningAssistantToolInput): Promise<ReasoningAssistantToolOutput> {
  return reasoningAssistantToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reasoningAssistantToolPrompt',
  input: {schema: ReasoningAssistantToolInputSchema},
  output: {schema: ReasoningAssistantToolOutputSchema},
  prompt: `You are an AI assistant designed to analyze OCR output text and provide insights.

  Your task is to identify key fields within the text and suggest possible values for each field.
  The output should be an array of objects, where each object contains the fieldName and a suggestedValue.

  OCR Text: {{{ocrText}}}
  \n  Output the analyzed fields in a JSON format.
  `,
});

const reasoningAssistantToolFlow = ai.defineFlow(
  {
    name: 'reasoningAssistantToolFlow',
    inputSchema: ReasoningAssistantToolInputSchema,
    outputSchema: ReasoningAssistantToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
