'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitFileRequest, type ServiceResponse } from '@/services/brokerClient';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface FileProcessResult {
  fileName: string;
  fileSize: number;
  processedAt: string;
  extractedText?: string;
  metadata?: Record<string, unknown>;
}

export default function ServiceBrokerClient() {
  const { toast } = useToast();
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResponse, setFileResponse] = useState<ServiceResponse<any> | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState(false);

  // General error state
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }
    setFileLoading(true);
    setError(null);

    const res = await submitFileRequest<FileProcessResult>(
      'nextjs',
      'fileService',
      'processDocument',
      {
        extractText: true,
        generateMetadata: true,
      },
      selectedFile
    );

    setFileResponse(res);
    setFileLoading(false);

    if (res?.ok) {
      toast({
        title: 'File Processed',
        description: `Successfully processed ${selectedFile.name}.`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to process file.',
        variant: 'destructive',
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileResponse(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Service Broker Demo - Next.js
          </CardTitle>
          <CardDescription>
            Demonstrate service broker integration for file processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
              {/* File Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">File Processing</CardTitle>
                  <CardDescription>
                    Upload a file to be processed by the service broker
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                      ${dragActive ? 'border-primary bg-accent/20' : 'border-input hover:border-primary/70'}
                    `}
                  >
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                      disabled={fileLoading}
                    />
                    <Label
                      htmlFor="file-upload"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className={`w-12 h-12 mb-3 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Any file type supported by the service broker
                      </p>
                    </Label>
                  </div>

                  {selectedFile && (
                    <div className="p-3 border rounded-md flex items-center justify-between bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(selectedFile.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleFileUpload}
                          disabled={fileLoading}
                          size="sm"
                        >
                          {fileLoading ? 'Processing...' : 'Process File'}
                        </Button>
                        <Button
                          onClick={clearFile}
                          variant="outline"
                          size="sm"
                          disabled={fileLoading}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* File Response Display */}
              {fileResponse && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">File Processing Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                      {JSON.stringify(fileResponse, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}