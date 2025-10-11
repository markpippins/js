import { getScanById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CalendarDays, ScanText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReviewPageProps {
  params: {
    scanId: string;
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const scan = await getScanById(params.scanId);

  if (!scan || scan.status !== 'Completed') {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" /> Review Document: {scan.fileName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" /> Uploaded on {format(new Date(scan.uploadDate), 'PPP p')}
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ingest
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ScanText className="h-5 w-5 text-primary" /> Extracted Text (OCR Output)
            </h3>
            <ScrollArea className="h-[400px] md:h-[600px] w-full rounded-md border p-4 bg-muted/30">
              <pre className="text-sm whitespace-pre-wrap break-words font-sans">
                {scan.ocrText || 'No OCR text available.'}
              </pre>
            </ScrollArea>
          </div>
          <div className="space-y-4">
             <h3 className="text-lg font-semibold">Original Document Preview</h3>
            <div className="border rounded-md overflow-hidden aspect-[3/4] relative bg-muted">
              {scan.fileUrl ? (
                <Image
                  src={scan.fileUrl}
                  alt={`Preview of ${scan.fileName}`}
                  layout="fill"
                  objectFit="contain"
                  data-ai-hint={scan.dataAiHint || "document scan"}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <p>File Size: {scan.fileSize ? `${(scan.fileSize / (1024*1024)).toFixed(2)} MB` : 'N/A'}</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const scan = await getScanById(params.scanId);
  if (!scan) {
    return { title: 'Scan Not Found' };
  }
  return {
    title: `Review: ${scan.fileName} - ScanView`,
    description: `Review OCR output for ${scan.fileName}.`,
  };
}
