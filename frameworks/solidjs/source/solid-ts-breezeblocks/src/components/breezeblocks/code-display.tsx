'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Clipboard, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CodeDisplayProps = {
  generatedCode: string;
  isLoading: boolean;
};

export function CodeDisplay({ generatedCode, isLoading }: CodeDisplayProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!generatedCode) return;

    navigator.clipboard
      .writeText(generatedCode)
      .then(() => {
        setHasCopied(true);
        toast({ title: 'Copied to clipboard!' });
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy code to clipboard.',
        });
      });
  };

  return (
    <Card className="sticky top-8 h-full min-h-[calc(100vh-10rem)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          Generated Code
        </CardTitle>
        {generatedCode && (
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="h-[calc(100%-6rem)]">
        <ScrollArea className="h-full w-full rounded-md border bg-muted/30">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[95%]" />
            </div>
          ) : generatedCode ? (
            <pre className="p-4 text-sm font-code">
              <code>{generatedCode}</code>
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
              <p>
                Your generated component code will appear here. <br />
                Describe a component and click "Generate" to start.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
