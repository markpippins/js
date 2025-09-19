'use client';

import type { ScannedFile, AnalyzedField } from '@/lib/types';
import { MOCK_OCR_TEXTS } from '@/lib/mock-data';
import { placeholderImages } from '@/lib/placeholder-images';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ScanContextType {
  scannedFiles: ScannedFile[];
  addFile: (file: File) => void;
  getFileById: (id: string) => ScannedFile | undefined;
  updateFileAnalysis: (id: string, analysis: { analyzedFields: AnalyzedField[] }) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);

  const addFile = useCallback((file: File) => {
    const id = crypto.randomUUID();
    const randomImageIndex = Math.floor(Math.random() * placeholderImages.length);
    const { imageUrl, imageHint } = placeholderImages[randomImageIndex];

    const newFile: ScannedFile = {
      id,
      name: file.name,
      status: 'processing',
      imageUrl,
      imageHint,
    };

    setScannedFiles(prev => [newFile, ...prev]);

    // Simulate OCR processing
    setTimeout(() => {
      const randomOcrIndex = Math.floor(Math.random() * MOCK_OCR_TEXTS.length);
      const ocrText = MOCK_OCR_TEXTS[randomOcrIndex];
      setScannedFiles(prev =>
        prev.map(sf =>
          sf.id === id ? { ...sf, status: 'completed', ocrText } : sf
        )
      );
    }, 2000 + Math.random() * 2000);
  }, []);

  const getFileById = useCallback(
    (id: string) => scannedFiles.find(file => file.id === id),
    [scannedFiles]
  );
  
  const updateFileAnalysis = useCallback((id: string, analysis: { analyzedFields: AnalyzedField[] }) => {
    setScannedFiles(prev =>
      prev.map(sf => (sf.id === id ? { ...sf, analysis } : sf))
    );
  }, []);

  return (
    <ScanContext.Provider value={{ scannedFiles, addFile, getFileById, updateFileAnalysis }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}
