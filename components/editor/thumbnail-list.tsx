'use client';

import { useEditorStore } from "@/lib/store";
import { Document, Page } from "react-pdf";
import { cn } from "@/lib/utils";

export function ThumbnailList() {
  const { pdfFile, numPages, currentPage, setCurrentPage, pageDimensions } = useEditorStore();

  if (!pdfFile || numPages === 0) return null;

  // Calculate optimal width for thumbnails based on aspect ratio
  // Most PDFs are portrait and fit to width, so we make thumbnails wider
  const thumbnailWidth = 240;

  return (
    <div className="flex flex-col gap-4">
      <Document file={pdfFile}>
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <div
            key={page}
            className={cn(
              "cursor-pointer border-2 rounded-md overflow-hidden transition-all hover:border-primary hover:shadow-md mb-1.5",
              currentPage === page ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border"
            )}
            onClick={() => setCurrentPage(page)}
          >
            <div className="relative pointer-events-none bg-white">
              {/* pointer-events-none to prevent text selection in thumbnail */}
              <Page
                pageNumber={page}
                width={thumbnailWidth}
                className="bg-white"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
            <div className="text-center text-xs text-muted-foreground py-1 bg-muted font-medium">
              Page {page}
            </div>
          </div>
        ))}
      </Document>
    </div>
  );
}
