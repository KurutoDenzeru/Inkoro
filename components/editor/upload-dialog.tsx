'use client';

import { useState, useCallback } from 'react';
import { useEditorStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming shadcn initialized this

export function UploadDialog() {
  const { pdfFile, setPdfFile, isHydrating } = useEditorStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={!pdfFile && !isHydrating}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>Upload PDF</DialogTitle>
          </div>
          <DialogDescription>
            Start by uploading a PDF file to edit and annotate.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          <div className="bg-primary/10 p-4 rounded-none mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            SVG, PNG, JPG or GIF (max. 800x400px) - just kidding, PDF only!
          </p>
          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept="application/pdf"
            onChange={onInputChange}
          />
        </div>

        {/* <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => document.getElementById('pdf-upload')?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Select PDF File
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
