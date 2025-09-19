'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { analyzeOcrText, AnalysisState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ScannedFile } from '@/lib/types';
import { Bot, Lightbulb, Loader2, ServerCrash } from 'lucide-react';
import { useEffect } from 'react';
import { useScan } from '@/contexts/ScanContext';

const initialState: AnalysisState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Reasoning Assistant Tool
        </>
      )}
    </Button>
  );
}

export default function ReviewAnalysis({ file }: { file: ScannedFile }) {
  const { updateFileAnalysis } = useScan();
  const [state, formAction] = useFormState(analyzeOcrText, file.analysis ? { ...file.analysis, timestamp: Date.now() } : initialState);

  useEffect(() => {
    if (state.analyzedFields) {
        updateFileAnalysis(file.id, { analyzedFields: state.analyzedFields });
    }
  }, [state, file.id, updateFileAnalysis]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-muted-foreground" />
          AI Reasoning Assistant
        </CardTitle>
        <CardDescription>
          Use AI to identify key fields and suggest values from the OCR text.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction}>
          <input type="hidden" name="ocrText" value={file.ocrText} />
          <SubmitButton />
        </form>
        
        {state?.error && (
            <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {state?.analyzedFields && (
            <div className="space-y-4 pt-4">
                <h3 className="font-semibold">Analysis Results:</h3>
                <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Field Name</TableHead>
                        <TableHead>Suggested Value</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {state.analyzedFields.map((field, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium">{field.fieldName}</TableCell>
                        <TableCell>{field.suggestedValue}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
