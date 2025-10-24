import { Blocks } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Blocks className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-bold tracking-tighter">BreezeBlocks</h1>
        </div>
      </div>
    </header>
  );
}
