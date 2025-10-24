'use server';

import { generateComponentFromDescription } from '@/ai/flows/generate-component-from-description';
import { formatGeneratedCode } from '@/ai/flows/format-generated-code';

export async function generateAndFormatComponent(
  description: string
): Promise<{ formattedCode?: string; error?: string }> {
  if (!description) {
    return { error: 'Please provide a component description.' };
  }

  try {
    const { componentCode } = await generateComponentFromDescription({
      componentDescription: description,
    });

    if (!componentCode) {
      return { error: 'Failed to generate component. Please try again.' };
    }

    const { formattedCode } = await formatGeneratedCode({ code: componentCode });

    return { formattedCode };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please check the console for more details.' };
  }
}
