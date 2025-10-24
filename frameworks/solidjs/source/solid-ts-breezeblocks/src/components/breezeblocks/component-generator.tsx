'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateAndFormatComponent } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

type ComponentGeneratorProps = {
  setGeneratedCode: (code: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
};

export function ComponentGenerator({ setGeneratedCode, setIsLoading, isLoading }: ComponentGeneratorProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedCode('');
    const result = await generateAndFormatComponent(values.description);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
    } else if (result.formattedCode) {
      setGeneratedCode(result.formattedCode);
      toast({
        title: 'Success!',
        description: 'Component code generated and formatted.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6" />
          Component Generator
        </CardTitle>
        <CardDescription>
          Describe the UI component you want to create. Powered by AI to generate SolidJS and TailwindCSS code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A responsive card component with an image, title, description, and a call-to-action button."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Component
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
