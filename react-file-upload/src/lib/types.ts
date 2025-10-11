export type AnalyzedField = {
  fieldName: string;
  suggestedValue: string;
};

export type ScannedFile = {
  id: string;
  name: string;
  status: 'processing' | 'completed' | 'failed';
  ocrText?: string;
  imageUrl: string;
  imageHint: string;
  analysis?: {
    analyzedFields: AnalyzedField[];
  };
};
