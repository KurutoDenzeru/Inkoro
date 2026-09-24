export interface PdfDocumentRuntime {
  annotationStorage: {
    size: number;
  };
  saveDocument: () => Promise<Uint8Array>;
}

let activePdfDocument: PdfDocumentRuntime | null = null;

export function setActivePdfDocument(pdf: PdfDocumentRuntime | null): void {
  activePdfDocument = pdf;
}

export async function getFilledPdfBytes(): Promise<Uint8Array | null> {
  if (!activePdfDocument) {
    return null;
  }

  if (activePdfDocument.annotationStorage.size === 0) {
    return null;
  }

  return activePdfDocument.saveDocument();
}
