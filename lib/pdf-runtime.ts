import { PDFDocument, StandardFonts } from "pdf-lib";

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

  const bytes = await activePdfDocument.saveDocument();

  // pdf.js drops appearance streams for /NeedAppearances docs, so regenerate missing ones or static viewers show blank fields; fall back to raw bytes if the repair fails.
  try {
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    for (const field of form.getFields()) {
      try {
        if (field.needsAppearancesUpdate()) {
          field.defaultUpdateAppearances(font);
        }
      } catch {
        // pdf-lib only supports text/checkbox/radio/dropdown fields; skip the rest.
      }
    }
    return new Uint8Array(await doc.save());
  } catch {
    return bytes;
  }
}
