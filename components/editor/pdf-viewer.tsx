'use client';

import { useEditorStore } from '@/lib/store';
import { useCallback, useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@/lib/pdf-setup'; // Ensure worker is set
import { CanvasLayer } from './canvas-layer';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function PDFViewer() {
  const { pdfFile, currentPage, scale, setNumPages, setPageDimensions, pageDimensions } = useEditorStore();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, [setNumPages]);

  // Resize observer to track container width (for responsive mobile rendering)
  useEffect(() => {
    if (!containerRef) return;
    const update = () => setContainerWidth(Math.max(0, Math.floor(containerRef.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef);
    return () => ro.disconnect();
  }, [containerRef]);

  const pageDim = pageDimensions[currentPage];

  // If mobile, compute a render width based on container width and toolbar scale multiplier
  const renderWidth = isMobile && containerWidth && pageDim ? Math.max(100, Math.round(containerWidth * scale)) : undefined;

  // effective scale for CanvasLayer: if renderWidth is set, derive from pageDimensions, else use global scale
  const effectiveScale = renderWidth && pageDim ? renderWidth / pageDim.width : scale;

  return (
    <div className="relative flex items-center justify-center min-h-0 w-full">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center p-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        }
        className="flex flex-col items-center w-full"
      >
        <div
          id="pdf-page-container"
          className={`relative border shadow-2xl bg-white mx-auto my-0 ${isMobile ? 'w-full' : 'w-fit'} p-0`}
          ref={setContainerRef}
        >
          <Page
            pageNumber={currentPage}
            // On mobile we pass width so PDF is rendered to fit the container; desktop uses direct scale
            {...(renderWidth ? { width: renderWidth } : { scale })}
            className="bg-white mb-0"
            renderAnnotationLayer={false}
            renderTextLayer={true}
            onLoadSuccess={({ originalWidth, originalHeight }) => {
              setPageDimensions(currentPage, originalWidth, originalHeight);
            }}
          >
            {/* Overlay for our custom annotations */}
            <CanvasLayer pageIndex={currentPage} scale={effectiveScale} />
          </Page>
        </div>
      </Document>
    </div>
  );
}
