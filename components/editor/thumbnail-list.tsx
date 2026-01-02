'use client';

import { useEditorStore } from "@/lib/store";
import { Document, Page } from "react-pdf";
import { cn } from "@/lib/utils";
import { PDFElement } from "@/lib/store";

// Component to render a single element on thumbnail
function ThumbnailElement({ element, scale }: { element: PDFElement; scale: number }) {
  const el = element;

  // For lines/arrows, compute endpoint positions
  const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
  const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
  const startLocalX = (startPoint.x - el.x) * scale;
  const startLocalY = (startPoint.y - el.y) * scale;
  const endLocalX = (endPoint.x - el.x) * scale;
  const endLocalY = (endPoint.y - el.y) * scale;
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const sl = el.style?.sloppiness ?? 0;
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  const controlX = midX + nx * sl;
  const controlY = midY + ny * sl;
  const controlLocalX = (controlX - el.x) * scale;
  const controlLocalY = (controlY - el.y) * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${el.x * scale}px`,
        top: `${el.y * scale}px`,
        width: `${el.width * scale}px`,
        height: `${el.height * scale}px`,
        transform: `rotate(${el.rotation}deg)`,
        backgroundColor: el.type === 'line' || el.type === 'arrow' ? 'transparent' : (['rect', 'circle'].includes(el.type) ? el.style.backgroundColor : (el.style.backgroundColor || 'transparent')),
        color: el.style.color,
        fontSize: `${(el.style.fontSize || 16) * scale}px`,
        fontFamily: el.style.fontFamily || 'Inter',
        fontWeight: el.style.fontWeight || 'normal',
        fontStyle: el.style.fontStyle || 'normal',
        textDecoration: el.style.textDecoration || 'none',
        textAlign: el.style.textAlign || 'left',
        border: `${(el.style.borderWidth || 0) * scale}px solid ${el.style.borderColor || 'transparent'}`,
        borderTopLeftRadius: `${(el.style.borderTopLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderTopRightRadius: `${(el.style.borderTopRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderBottomLeftRadius: `${(el.style.borderBottomLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderBottomRightRadius: `${(el.style.borderBottomRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        opacity: el.style.opacity ?? 1,
        padding: el.type === 'text' ? `${4 * scale}px` : '0',
        overflow: 'hidden',
      }}
    >
      {(el.type === 'line' || el.type === 'arrow') && (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            {el.type === 'arrow' && (
              <>
                {el.style.arrowStart && (
                  <marker
                    id={`thumb-arrowhead-start-${el.id}`}
                    markerWidth="12"
                    markerHeight="12"
                    refX="6"
                    refY="6"
                    orient="auto-start-reverse"
                  >
                    <polygon points="10 0, 10 12, 0 6" fill={el.style.backgroundColor || '#000000'} />
                  </marker>
                )}
                {el.style.arrowEnd && (
                  <marker
                    id={`thumb-arrowhead-end-${el.id}`}
                    markerWidth="12"
                    markerHeight="12"
                    refX="6"
                    refY="6"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 6, 0 12" fill={el.style.backgroundColor || '#000000'} />
                  </marker>
                )}
              </>
            )}
          </defs>
          {sl && sl > 0 ? (
            <path
              d={`M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`}
              stroke={el.style.backgroundColor || '#000000'}
              strokeWidth={(el.style.borderWidth ?? 1) * scale}
              strokeDasharray={
                el.style.strokeStyle === 'dashed' ? `${10 * scale}, ${5 * scale}` :
                  el.style.strokeStyle === 'dotted' ? `${2 * scale}, ${5 * scale}` :
                    'none'
              }
              fill="none"
              markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#thumb-arrowhead-start-${el.id})` : undefined}
              markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#thumb-arrowhead-end-${el.id})` : undefined}
            />
          ) : (
            <line
              x1={startLocalX}
              y1={startLocalY}
              x2={endLocalX}
              y2={endLocalY}
              stroke={el.style.backgroundColor || '#000000'}
              strokeWidth={(el.style.borderWidth ?? 1) * scale}
              strokeDasharray={
                el.style.strokeStyle === 'dashed' ? `${10 * scale}, ${5 * scale}` :
                  el.style.strokeStyle === 'dotted' ? `${2 * scale}, ${5 * scale}` :
                    'none'
              }
              markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#thumb-arrowhead-start-${el.id})` : undefined}
              markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#thumb-arrowhead-end-${el.id})` : undefined}
            />
          )}
        </svg>
      )}
      {(el.type === 'image' || el.type === 'signature') && el.content && (
        <img src={el.content} alt="element" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      )}
      {el.type === 'text' && (
        <div style={{ width: '100%', height: '100%', wordWrap: 'break-word', fontSize: `${(el.style.fontSize || 16) * scale}px` }}>
          {el.content}
        </div>
      )}
    </div>
  );
}

export function ThumbnailList() {
  const { pdfFile, numPages, currentPage, setCurrentPage, pageDimensions } = useEditorStore();

  if (!pdfFile || numPages === 0) return null;

  // Calculate optimal width for thumbnails based on aspect ratio
  // Smaller thumbnails for better sidebar fit
  const thumbnailWidth = 220;

  return (
    <div className="flex flex-col gap-4">
      <Document file={pdfFile}>
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
          const pageElements = useEditorStore.getState().layers[page] || [];
          const pageDim = pageDimensions[page];
          const thumbnailScale = pageDim ? thumbnailWidth / pageDim.width : 1;

          return (
            <div
              key={page}
              className={cn(
                "cursor-pointer border-2 rounded-none overflow-hidden transition-all hover:border-primary hover:shadow-md",
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
                {/* Render canvas elements on thumbnail */}
                <div className="absolute inset-0 pointer-events-none">
                  {pageElements.map((el) => (
                    <ThumbnailElement key={el.id} element={el} scale={thumbnailScale} />
                  ))}
                </div>
              </div>
              <div className="text-center text-xs border-t text-muted-foreground py-1 bg-muted font-medium">
                Page {page}
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
}
