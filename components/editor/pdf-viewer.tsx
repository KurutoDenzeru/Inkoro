'use client';

import { useEditorStore } from '@/lib/store';
import { useCallback, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@/lib/pdf-setup'; // Ensure worker is set
import { CanvasLayer } from './canvas-layer';
import { Loader2 } from 'lucide-react';

export function PDFViewer() {
  const { pdfFile, currentPage, scale, setNumPages, setPageDimensions } = useEditorStore();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  return (
    <div className="relative flex items-center justify-center min-h-0">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center p-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        }
        className="flex flex-col items-center"
      >
        <div id="pdf-page-container" className="relative border shadow-2xl bg-white mx-auto my-0 p-0 w-fit" ref={setContainerRef}>
          <Page
            pageNumber={currentPage}
            scale={scale}
            className="bg-white mb-0"
            renderAnnotationLayer={false}
            renderTextLayer={true}
            onLoadSuccess={({ originalWidth, originalHeight }) => {
              setPageDimensions(currentPage, originalWidth, originalHeight);
            }}
          >
            {/* Overlay for our custom annotations */}
            <CanvasLayer pageIndex={currentPage} scale={scale} />
          </Page>
        </div>
      </Document>
    </div>
  );
}
