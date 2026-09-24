// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";

import { savePdf } from "./pdf-utils";
import { useEditorStore } from "./store";

const createFormPdf = async () => {
  const document = await PDFDocument.create();
  const page = document.addPage([612, 792]);
  const font = await document.embedFont(StandardFonts.Helvetica);
  const form = document.getForm();

  form.createTextField("reviewer_name").addToPage(page, {
    font,
    height: 20,
    width: 200,
    x: 100,
    y: 700,
  });
  form.createCheckBox("reviewed").addToPage(page, {
    height: 14,
    width: 14,
    x: 100,
    y: 650,
  });

  return document.save();
};

beforeEach(() => {
  useEditorStore.setState({
    activeTool: "select",
    clipboard: null,
    currentPage: 1,
    history: { future: [], past: [] },
    isHydrating: false,
    layers: {},
    numPages: 1,
    pageDimensions: {},
    pdfFile: null,
    pdfUrl: null,
    scale: 1,
    selectedElementId: null,
  });
});

describe("savePdf", () => {
  it("keeps filled AcroForm values from the PDF.js source buffer", async () => {
    const originalBytes = await createFormPdf();
    const filledDocument = await PDFDocument.load(originalBytes);
    filledDocument.getForm().getTextField("reviewer_name").setText("Taylor");
    filledDocument.getForm().getCheckBox("reviewed").check();
    const sourceBytes = await filledDocument.save();

    const originalBuffer = new ArrayBuffer(originalBytes.byteLength);
    new Uint8Array(originalBuffer).set(originalBytes);
    useEditorStore.getState().setPdfFile(
      new File([originalBuffer], "review.pdf", { type: "application/pdf" }),
    );

    const output = await savePdf({
      returnBytes: true,
      sourceBytes,
      title: "Completed review",
    });

    expect(output).toBeInstanceOf(Uint8Array);
    if (!output) return;

    const savedDocument = await PDFDocument.load(output);
    expect(savedDocument.getTitle()).toBe("Completed review");
    expect(savedDocument.getForm().getTextField("reviewer_name").getText()).toBe("Taylor");
    expect(savedDocument.getForm().getCheckBox("reviewed").isChecked()).toBe(true);
  });
});
