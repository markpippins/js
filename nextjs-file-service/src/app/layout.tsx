import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Using Geist Sans only as per globals.css font-family
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Scan, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/app-logo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js ScanView',
  description: 'OCR Scanning Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <AppLogo className="h-8 w-8 text-sidebar-primary" />
                <h1 className="text-xl font-semibold text-sidebar-foreground">ScanView</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Ingest Scans">
                      <Scan />
                      <span>Ingest Scans</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                {/* Example for another page if needed later
                <SidebarMenuItem>
                   <Link href="/dashboard" legacyBehavior passHref>
                    <SidebarMenuButton tooltip="Dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                */}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
              <SidebarTrigger className="md:hidden" /> {/* Hidden on md and larger screens */}
              {/* Additional header content can go here */}
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
