'use server';

import { revalidatePath } from 'next/cache';
import { addScan, updateScan, storeFile } from './mock-data';
import type { Scan } from '@/types';

// Placeholder for actual AI OCR flow
async function performOcr(fileUrl: string, fileName: string): Promise<string> {
  // In a real application, this would call your Genkit AI flow
  // e.g., const result = await ocrFlow.run({ documentUrl: fileUrl });
  // For now, simulate with mock text.
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate OCR processing time
  return `Mock OCR Text for ${fileName}:\n\nThis is a sample extracted text. It would contain the actual content of the scanned document. For example, if it was an invoice, it might list items, prices, and totals. If it was a letter, it would contain the body of the letter.\n\nTimestamp: ${new Date().toLocaleTimeString()}`;
}

export async function processFile(formData: FormData): Promise<{ scan?: Scan, error?: string }> {
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { error: 'No file selected or file is empty.' };
  }

  // Basic file type validation (example for images)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type. Please upload an image or PDF.' };
  }

  let newScan: Scan;
  try {
    // 1. Initial record creation (status: Processing)
    newScan = await addScan({
      fileName: file.name,
      fileSize: file.size,
      status: 'Processing',
      // fileUrl will be updated after storing
    });

    // Revalidate the path to show the new "Processing" scan immediately
    revalidatePath('/');

    // 2. Store the file (e.g., to cloud storage)
    // For now, storeFile is a mock that returns a placeholder URL.
    // In a real app, this might take time and could fail.
    const storedFileUrl = await storeFile(file);
    await updateScan(newScan.id, { fileUrl: storedFileUrl });
    newScan.fileUrl = storedFileUrl;


    // 3. Perform OCR (long-running process)
    // This part should ideally not block the response if it's very long.
    // For simplicity in this example, we await it.
    // In a more robust system, you might trigger a background job.
    const ocrText = await performOcr(storedFileUrl, file.name);

    // 4. Update scan record with OCR text and status
    const updatedScan = await updateScan(newScan.id, {
      ocrText: ocrText,
      status: 'Completed',
    });

    if (!updatedScan) {
      // This case should ideally be handled more gracefully
      await updateScan(newScan.id, { status: 'Error', ocrText: 'Failed to finalize scan update.' });
      return { error: 'Failed to finalize scan update after OCR.' };
    }
    
    revalidatePath('/');
    revalidatePath(`/review/${updatedScan.id}`);
    return { scan: updatedScan };

  } catch (error) {
    console.error('Error processing file:', error);
    // If newScan was created, update its status to Error
    if (newScan! && newScan!.id) {
      await updateScan(newScan.id, { status: 'Error', ocrText: 'An unexpected error occurred during processing.' });
    }
    revalidatePath('/');
    return { error: 'An unexpected error occurred during processing.' };
  }
}
