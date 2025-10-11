'use client';

import { useState } from 'react';
import { ComponentGenerator } from './component-generator';
import { CodeDisplay } from './code-display';
import { ProjectSetup } from './project-setup';
import { ThemeCustomizer } from './theme-customizer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function BreezeBlocksUI() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 lg:p-8">
      <div className="flex flex-col gap-8">
        <ComponentGenerator setGeneratedCode={setGeneratedCode} setIsLoading={setIsLoading} isLoading={isLoading} />
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">Project Setup</AccordionTrigger>
            <AccordionContent>
              <ProjectSetup />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">Theme Customization</AccordionTrigger>
            <AccordionContent>
              <ThemeCustomizer />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="relative">
        <CodeDisplay generatedCode={generatedCode} isLoading={isLoading} />
      </div>
    </div>
  );
}
