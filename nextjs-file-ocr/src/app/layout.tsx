import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ScanProvider } from '@/contexts/ScanContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'ScanVite',
  description: 'An OCR scanning application to demonstrate AI capabilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background text-foreground">
        <ScanProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
              {children}
            </main>
          </div>
          <Toaster />
        </ScanProvider>
      </body>
    </html>
  );
}
