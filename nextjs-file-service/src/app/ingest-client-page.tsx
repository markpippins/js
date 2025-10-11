'use client';

import { useState, useEffect } from 'react';
import type { Scan } from '@/types';
import FileUploaderCard from '@/components/file-uploader-card';
import ScanListCard from '@/components/scan-list-card';
import { processFile } from '@/lib/actions'; // Import server action

interface IngestClientPageProps {
  initialScans: Scan[];
}

export default function IngestClientPage({ initialScans }: IngestClientPageProps) {
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [isProcessing, setIsProcessing] = useState(false);

  // Effect to keep scans up-to-date if initialScans changes (e.g., due to revalidation)
  useEffect(() => {
    setScans(initialScans);
  }, [initialScans]);

  const handleFileProcessed = (newScan: Scan | null, updatedScanList?: Scan[]) => {
    if (updatedScanList) {
      setScans(updatedScanList); // If the action returns the full list
    } else if (newScan) {
       // If a scan is being updated (e.g. from Processing to Completed)
      setScans(prevScans => {
        const existingScanIndex = prevScans.findIndex(s => s.id === newScan.id);
        if (existingScanIndex !== -1) {
          const updatedScans = [...prevScans];
          updatedScans[existingScanIndex] = newScan;
          return updatedScans.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        }
        // If it's a brand new scan not yet in the list (though action should handle this)
        return [newScan, ...prevScans].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      });
    }
  };
  

  return (
    <div className="space-y-8">
      <FileUploaderCard 
        onFileProcessed={handleFileProcessed} 
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        processFileAction={processFile}
      />
      <ScanListCard scans={scans} isProcessingAny={isProcessing} />
    </div>
  );
}
