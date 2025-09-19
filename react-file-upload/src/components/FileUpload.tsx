'use client';

import { useScan } from '@/contexts/ScanContext';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

export function FileUpload() {
  const { addFile } = useScan();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      addFile(files[0]);
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200',
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={onFileInputChange}
        accept="image/*"
      />
      <div className="text-center">
        <UploadCloud className={cn('mx-auto h-12 w-12', isDragging ? 'text-primary' : 'text-muted-foreground')} />
        <p className="mt-4 text-lg font-semibold">
          Drag & drop your file here
        </p>
        <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
        <p className="mt-4 text-xs text-muted-foreground">Supports: PNG, JPG, GIF</p>
      </div>
    </div>
  );
}
