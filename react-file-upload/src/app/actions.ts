'use server';

import { reasoningAssistantTool } from '@/ai/flows/reasoning-assistant-tool';

export type AnalysisState = {
  analyzedFields?: { fieldName: string; suggestedValue: string }[];
  error?: string;
  timestamp?: number;
};

export async function analyzeOcrText(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const ocrText = formData.get('ocrText') as string;

  if (!ocrText) {
    return { error: 'OCR text is missing.' };
  }

  try {
    const result = await reasoningAssistantTool({ ocrText });
    if ('analyzedFields' in result) {
      return { analyzedFields: result.analyzedFields, timestamp: Date.now() };
    }
    return { error: 'Analysis failed to produce fields.' };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}
