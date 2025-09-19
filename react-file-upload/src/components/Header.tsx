import Link from 'next/link';
import { ScanLine } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <ScanLine className="h-6 w-6" />
          <span className="font-headline">ScanVite</span>
        </Link>
      </div>
    </header>
  );
}
