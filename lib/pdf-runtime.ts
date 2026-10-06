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

  // pdf.js only writes appearance streams it can generate itself. In
  // documents with /NeedAppearances (or fonts it cannot encode), fields are
  // saved with values but no appearance stream, so static renderers — the
  // download preview and many viewers — show them blank. Regenerate the
  // missing appearances so the exported file renders identically
  // everywhere. If the repair cannot run, fall back to the raw serialized
  // bytes.
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
        // pdf-lib only supports text fields, checkboxes, radios, dropdowns,
        // and option lists; skip signature and other fields.
      }
    }
    return new Uint8Array(await doc.save());
  } catch {
    return bytes;
  }
}
