import { BreezeBlocksUI } from '@/components/breezeblocks/breezeblocks-ui';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <BreezeBlocksUI />
      </main>
    </div>
  );
}
