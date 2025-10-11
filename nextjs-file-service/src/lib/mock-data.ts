import type { Scan } from '@/types';

let scans: Scan[] = [
  {
    id: '1',
    fileName: 'sample-invoice.png',
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    status: 'Completed',
    ocrText: 'Invoice #123\nTotal: $50.00\nDate: 2023-10-26',
    fileUrl: 'https://placehold.co/600x800.png',
    dataAiHint: 'invoice document',
    fileSize: 102400, // 100KB
  },
  {
    id: '2',
    fileName: 'receipt-nov.jpg',
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Two days ago
    status: 'Completed',
    ocrText: 'Store Receipt\nItem: Coffee - $3.50\nItem: Sandwich - $7.00\nTotal: $10.50',
    fileUrl: 'https://placehold.co/400x600.png',
    dataAiHint: 'store receipt',
    fileSize: 51200, // 50KB
  },
];

// Simulate fetching all scans
export async function getScans(): Promise<Scan[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...scans].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
    }, 500); // Simulate network delay
  });
}

// Simulate fetching a single scan by ID
export async function getScanById(id: string): Promise<Scan | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scans.find(scan => scan.id === id));
    }, 300);
  });
}

// Simulate adding a new scan
export async function addScan(newScanData: Omit<Scan, 'id' | 'uploadDate' | 'status'> & { status?: Scan['status'] }): Promise<Scan> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scan: Scan = {
        ...newScanData,
        id: String(Date.now()), // Simple unique ID
        uploadDate: new Date().toISOString(),
        status: newScanData.status || 'Processing',
      };
      scans.unshift(scan); // Add to the beginning of the array
      resolve(scan);
    }, 500);
  });
}

// Simulate updating a scan (e.g., status or OCR text)
export async function updateScan(id: string, updates: Partial<Scan>): Promise<Scan | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const scanIndex = scans.findIndex(s => s.id === id);
      if (scanIndex !== -1) {
        scans[scanIndex] = { ...scans[scanIndex], ...updates };
        resolve(scans[scanIndex]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
}

// This is a placeholder for where you might store the actual file.
// For this mock version, we don't actually store it.
export async function storeFile(file: File): Promise<string> {
    // In a real app, you would upload this to cloud storage or a server.
    // For now, we'll just return a placeholder URL.
    // The URL could be generated based on the file name or a unique ID.
    return `https://placehold.co/600x800.png?text=${encodeURIComponent(file.name)}`;
}
