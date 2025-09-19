'use client';

import { useScan } from '@/contexts/ScanContext';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, ImageIcon, Loader2 } from 'lucide-react';
import ReviewAnalysis from './_components/ReviewAnalysis';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function ReviewPage() {
  const params = useParams();
  const { getFileById } = useScan();
  const id = typeof params.id === 'string' ? params.id : '';
  const file = getFileById(id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full py-20">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">File not found</h2>
        <p className="mt-2 text-muted-foreground">
          The file you are looking for does not exist or has not been processed yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to Ingest</Link>
        </Button>
      </div>
    );
  }
  
  if (file.status === 'processing' || !file.ocrText) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-20">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="mt-4 text-2xl font-semibold">Processing Document...</h2>
        <p className="mt-2 text-muted-foreground">
          Please wait while we perform OCR on your document.
        </p>
         <Button asChild className="mt-6" variant="outline">
          <Link href="/">Back to Ingest</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl truncate" title={file.name}>
          Review: {file.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Inspect the OCR output and use the AI assistant for analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[8.5/11] w-full rounded-md overflow-hidden border bg-muted/30">
                <Image
                  src={file.imageUrl}
                  alt={`Preview of ${file.name}`}
                  fill
                  className="object-contain p-2"
                  data-ai-hint={file.imageHint}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                OCR Output
              </CardTitle>
              <CardDescription>The raw text extracted from the document.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap font-body">
                {file.ocrText}
              </pre>
            </CardContent>
          </Card>
          
          <Separator />

          <ReviewAnalysis file={file} />
        </div>
      </div>
    </div>
  );
}
