import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { useEditorStore } from './store';

export async function savePdf(opts?: {
  filename?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  showInWindowTitleBar?: boolean;
  fastWebView?: boolean;
}) {
  const { pdfFile, layers, pageDimensions } = useEditorStore.getState();
  if (!pdfFile) return;

  try {
    const fileBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // Apply metadata (if provided)
    if (opts?.title) {
      pdfDoc.setTitle(opts.title, { showInWindowTitleBar: !!opts.showInWindowTitleBar });
    }
    if (opts?.author) {
      pdfDoc.setAuthor(opts.author);
    }
    if (opts?.subject) {
      pdfDoc.setSubject(opts.subject);
    }
    if (opts?.keywords && opts.keywords.length > 0) {
      pdfDoc.setKeywords(opts.keywords);
    }
    if (opts?.fastWebView) {
      // True linearization (Fast Web View) requires special rewriting of the PDF and is not supported by pdf-lib in-browser.
      // We surface a warning here; the option will not actually linearize the file.
      console.warn('Fast Web View (linearization) requested but is not supported client-side.');
    }

    const pages = pdfDoc.getPages();

    // Embed font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Filter pages that have layers
    const pagesWithLayers = Object.keys(layers).map(Number);

    for (const pageIndex of pagesWithLayers) {
      // pageIndex in store is 1-based (from react-pdf)
      // pdf-lib pages are 0-based array
      const pdfPage = pages[pageIndex - 1];
      if (!pdfPage) continue;

      const { height: pageHeight } = pdfPage.getSize();
      const elements = layers[pageIndex] || [];

      for (const el of elements) {
        // x, y from store are Top-Left coordinates relative to PDF point size
        // PDF-lib uses Bottom-Left origin

        const x = el.x;
        // Flip Y. For a rectangle/image/text, y in store is the Top edge.
        // In PDF-lib, y is Bottom edge usually.
        // So y_pdf = pageHeight - y_store - objectHeight (if objectHeight matters for origin).
        // Spec depends on draw function.
        // drawText: y is baseline? No, usually slightly different. 
        // drawRectangle: y is bottom-left corner.

        if (el.type === 'text') {
          // Basic text
          const fontSize = el.style.fontSize || 16;
          // PDF Lib drawText y is baseline? No, it's bottom-left of text box roughly.
          // To align Top-Left, y_pdf = pageHeight - y_store - fontSize (approx).
          const y = pageHeight - el.y - fontSize;

          // Color parsing
          // el.style.color might be hex.
          const color = hexToRgb(el.style.color || '#000000');

          pdfPage.drawText(el.content || '', {
            x,
            y,
            size: fontSize,
            font: helveticaFont,
            color,
            // rotate: degrees(el.rotation), // Text rotation around which point? 
            // PDF-lib rotates around origin (bottom-left of text start).
          });
        }
        else if (el.type === 'rect') {
          const y = pageHeight - el.y - el.height;
          const color = hexToRgb(el.style.backgroundColor || '#000000');
          const opacity = el.style.opacity ?? 1;

          pdfPage.drawRectangle({
            x,
            y,
            width: el.width,
            height: el.height,
            color,
            opacity,
            rotate: degrees(el.rotation || 0),
          });
        }
        else if (el.type === 'circle') {
          const centerX = x + el.width / 2;
          const centerY = pageHeight - el.y - el.height / 2;
          const radiusX = el.width / 2;
          const radiusY = el.height / 2;
          const color = hexToRgb(el.style.backgroundColor || '#000000');
          const opacity = el.style.opacity ?? 1;

          pdfPage.drawEllipse({
            x: centerX,
            y: centerY,
            xScale: radiusX,
            yScale: radiusY,
            color,
            opacity,
            rotate: degrees(el.rotation || 0),
          });
        }
        else if (el.type === 'line' || el.type === 'arrow') {
          // Use stored start/end points if available, otherwise default to horizontal line
          const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
          const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
          
          const startX = startPoint.x;
          const startY = pageHeight - startPoint.y;
          const endX = endPoint.x;
          const endY = pageHeight - endPoint.y;
          const color = hexToRgb(el.style.backgroundColor || '#000000');
          const strokeWidth = el.style.borderWidth ?? 2;

          pdfPage.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: strokeWidth,
            color,
            opacity: el.style.opacity ?? 1,
          });

          // Draw arrowhead if arrow type
          if (el.type === 'arrow' && el.style.arrowEnd) {
            const strokeWidth = el.style?.borderWidth ?? 1;
            const segLen = Math.hypot(endX - startX, endY - startY);
            const rawArrowSize = Math.max(6, Math.min(24, strokeWidth * 3));
            const maxByLen = Math.max(6, Math.min(24, Math.round(segLen * 0.15)));
            const arrowSize = Math.min(rawArrowSize, maxByLen);
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowPoint1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowPoint1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrowPoint2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowPoint2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);

            pdfPage.drawLine({
              start: { x: endX, y: endY },
              end: { x: arrowPoint1X, y: arrowPoint1Y },
              thickness: strokeWidth,
              color,
              opacity: el.style.opacity ?? 1,
            });
            pdfPage.drawLine({
              start: { x: endX, y: endY },
              end: { x: arrowPoint2X, y: arrowPoint2Y },
              thickness: strokeWidth,
              color,
              opacity: el.style.opacity ?? 1,
            });
          }
        }
        else if (el.type === 'signature' && el.content) {
          const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
          let image;
          try {
            image = await pdfDoc.embedPng(imageBytes);
          } catch {
            console.error('Failed to embed signature');
            continue;
          }

          const y = pageHeight - el.y - el.height;

          pdfPage.drawImage(image, {
            x,
            y,
            width: el.width,
            height: el.height,
            rotate: degrees(el.rotation || 0)
          });
        }
        else if (el.type === 'image' && el.content) {
          const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
          let image;
          // Naive check for png/jpg
          try {
            image = await pdfDoc.embedPng(imageBytes);
          } catch {
            try {
              image = await pdfDoc.embedJpg(imageBytes);
            } catch {
              console.error('Failed to embed image');
              continue;
            }
          }

          const y = pageHeight - el.y - el.height;

          pdfPage.drawImage(image, {
            x,
            y,
            width: el.width,
            height: el.height,
            rotate: degrees(el.rotation || 0)
          });
        }
      }
    }

    const pdfBytes = await pdfDoc.save();

    // Trigger download
    // Ensure we use a standard ArrayBuffer-backed Uint8Array (avoids SharedArrayBuffer typing issues)
    const uint8Array = new Uint8Array(pdfBytes);
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedFilename = opts?.filename?.trim()
      ? (opts!.filename!.toLowerCase().endsWith('.pdf') ? opts!.filename!.trim() : `${opts!.filename!.trim()}.pdf`)
      : 'edited_document.pdf';
    link.download = sanitizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error saving PDF', err);
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : rgb(0, 0, 0);
}
