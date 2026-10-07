import { describe, expect, it } from "vitest";
import { PDFDocument, PDFName } from "pdf-lib";
import type { PDFWidgetAnnotation } from "pdf-lib";

import {
  getFilledPdfBytes,
  setActivePdfDocument,
  type PdfDocumentRuntime,
} from "./pdf-runtime";

const createRuntime = (
  size: number,
  bytes: Uint8Array = new Uint8Array([1, 2, 3]),
): PdfDocumentRuntime => ({
  annotationStorage: { size },
  saveDocument: async () => bytes,
});

const buildFormPdf = async (): Promise<Uint8Array> => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const form = doc.getForm();
  const textField = form.createTextField("email");
  textField.addToPage(page, { x: 100, y: 600, width: 200, height: 20 });
  const checkbox = form.createCheckBox("agree");
  checkbox.addToPage(page, { x: 100, y: 560, width: 18, height: 18 });
  form.updateFieldAppearances();
  return doc.save({ useObjectStreams: false });
};

// Simulates pdf.js saveDocument() on a /NeedAppearances doc: value kept, AP stream dropped.
const stripAppearance = async (
  doc: PDFDocument,
  fieldName: string,
): Promise<void> => {
  const field = doc.getForm().getField(fieldName);
  const widget: PDFWidgetAnnotation = field.acroField.getWidgets()[0];
  widget.dict.delete(PDFName.of("AP"));
};

describe("pdf runtime", () => {
  it("returns null when no PDF document is active", async () => {
    setActivePdfDocument(null);

    await expect(getFilledPdfBytes()).resolves.toBeNull();
  });

  it("returns null when the active PDF has no form storage", async () => {
    setActivePdfDocument(createRuntime(0));

    await expect(getFilledPdfBytes()).resolves.toBeNull();
  });

  it("returns valid PDF bytes when form storage contains values", async () => {
    setActivePdfDocument(createRuntime(2, await buildFormPdf()));

    const bytes = await getFilledPdfBytes();

    expect(bytes).toBeInstanceOf(Uint8Array);
    if (!bytes) return;
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    expect(doc.getForm().getFields().map((field) => field.getName())).toEqual([
      "email",
      "agree",
    ]);
  });

  it("regenerates appearance streams that pdf.js dropped", async () => {
    const doc = await PDFDocument.load(await buildFormPdf());
    doc.getForm().getField("email").setText("user@example.com");
    await stripAppearance(doc, "email");
    const field = doc.getForm().getField("email");
    const widget: PDFWidgetAnnotation = field.acroField.getWidgets()[0];
    expect(widget.getAppearances()).toBeUndefined();

    setActivePdfDocument(
      createRuntime(1, await doc.save({ useObjectStreams: false })),
    );

    const bytes = await getFilledPdfBytes();

    expect(bytes).toBeInstanceOf(Uint8Array);
    if (!bytes) return;
    const out = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const repaired = out.getForm().getField("email");
    expect(repaired.getText()).toBe("user@example.com");
    expect(repaired.acroField.getWidgets()[0].getAppearances()).toBeDefined();
  });

  it("keeps existing values and appearance streams intact", async () => {
    const doc = await PDFDocument.load(await buildFormPdf());
    doc.getForm().getField("email").setText("preset");
    doc.getForm().getCheckBox("agree").check();
    const withValues = await doc.save({ useObjectStreams: false });

    setActivePdfDocument(createRuntime(2, withValues));

    const bytes = await getFilledPdfBytes();

    expect(bytes).toBeInstanceOf(Uint8Array);
    if (!bytes) return;
    const out = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const form = out.getForm();
    expect(form.getFields().map((field) => field.getName())).toEqual([
      "email",
      "agree",
    ]);
    expect(form.getField("email").getText()).toBe("preset");
    expect(form.getCheckBox("agree").isChecked()).toBe(true);
  });

  it("returns the raw bytes when the repair pass cannot parse them", async () => {
    const corrupt = new Uint8Array([0x25, 0x50, 0x44, 0x46, 1, 2, 3]);
    setActivePdfDocument(createRuntime(1, corrupt));

    const bytes = await getFilledPdfBytes();

    expect(bytes).toEqual(corrupt);
  });
});
