import { FileUpload } from '@/components/FileUpload';
import { ScannedFilesList } from '@/components/ScannedFilesList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function IngestPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">Ingest Documents</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your documents to start the OCR process.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drag & drop a file or click to select.</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Scanned Files</CardTitle>
          <CardDescription>Review your processed documents below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScannedFilesList />
        </CardContent>
      </Card>
    </div>
  );
}
