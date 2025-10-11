import ServiceBrokerClient from '@/components/service-broker-client';
import { Toaster } from '@/components/ui/toaster';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ServiceBrokerClient />
      <Toaster />
    </div>
  );
}