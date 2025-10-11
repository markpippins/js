'use client';

import { useScan } from '@/contexts/ScanContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, Eye, FileWarning, Loader2, XCircle } from 'lucide-react';

export function ScannedFilesList() {
  const { scannedFiles } = useScan();

  const getStatusBadge = (status: 'processing' | 'completed' | 'failed') => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
    }
  };

  if (scannedFiles.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No files scanned yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">OCR Preview</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scannedFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>{getStatusBadge(file.status)}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                <p className="truncate max-w-sm">
                    {file.ocrText ? `${file.ocrText.substring(0, 70).replace(/\n/g, ' ')}...` : 'N/A'}
                </p>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm" disabled={file.status !== 'completed'}>
                  <Link href={`/review/${file.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
