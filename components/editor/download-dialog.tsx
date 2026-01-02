'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEditorStore } from "@/lib/store";
import { savePdf } from "@/lib/pdf-utils";
import html2canvas from "html2canvas";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import JSZip from 'jszip';

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DownloadDialog({ open, onOpenChange }: DownloadDialogProps) {
  const { pdfFile, currentPage, numPages } = useEditorStore();
  const [filename, setFilename] = useState("edited-document");
  const [format, setFormat] = useState<"pdf" | "png" | "jpeg" | "webp">("pdf");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (format === "pdf") {
        await savePdf();
      } else {
        // For image formats
        const { setCurrentPage } = useEditorStore.getState();
        const originalPage = currentPage;

        let mimeType = 'image/png';
        let extension = 'png';

        if (format === 'jpeg') {
          mimeType = 'image/jpeg';
          extension = 'jpg';
        } else if (format === 'webp') {
          mimeType = 'image/webp';
          extension = 'webp';
        } else if (format === 'png') {
          mimeType = 'image/png';
          extension = 'png';
        }

        // Always export ALL pages as requested (create ZIP)
        const zip = new JSZip();
        const element = document.getElementById('pdf-page-container');

        if (element) {
          for (let page = 1; page <= numPages; page++) {
            // Navigate to page
            setCurrentPage(page);

            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 300));

            // Capture page
            const canvas = await html2canvas(element, {
              useCORS: true,
              scale: 2,
              backgroundColor: '#ffffff',
              logging: false,
              ignoreElements: (el) => el.classList?.contains('no-export') || false,
              onclone: (clonedDoc) => {
                // Fix oklch colors for html2canvas
                const style = clonedDoc.createElement('style');
                style.textContent = `
                  * {
                    color: rgb(0, 0, 0) !important;
                  }
                  [style*="oklch"] {
                    color: rgb(0, 0, 0) !important;
                    background-color: transparent !important;
                  }
                `;
                clonedDoc.head.appendChild(style);
              }
            });

            // Convert to blob
            const quality = (format === 'jpeg' || format === 'webp') ? 0.95 : undefined;
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    reject(new Error('Failed to create blob'));
                  }
                },
                mimeType,
                quality
              );
            });

            // Add to zip
            zip.file(`${filename}-page-${page}.${extension}`, blob);
          }

          // Restore original page
          setCurrentPage(originalPage);

          // Generate and download ZIP
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          console.error('PDF container element not found');
        }
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>Download Document</DialogTitle>
          </div>
          <DialogDescription>
            Configure your export settings before downloading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="edited-document"
            />
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={format === "pdf" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => setFormat("pdf")}
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">PDF</span>
              </Button>
              <Button
                type="button"
                variant={format === "png" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => setFormat("png")}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs">PNG</span>
              </Button>
              <Button
                type="button"
                variant={format === "jpeg" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => setFormat("jpeg")}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs">JPEG</span>
              </Button>
              <Button
                type="button"
                variant={format === "webp" ? "default" : "outline"}
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => setFormat("webp")}
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-xs">WebP</span>
              </Button>
            </div>
          </div>


        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
