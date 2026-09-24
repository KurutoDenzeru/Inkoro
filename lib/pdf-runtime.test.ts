import { describe, expect, it } from "vitest";

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

describe("pdf runtime", () => {
  it("returns null when no PDF document is active", async () => {
    setActivePdfDocument(null);

    await expect(getFilledPdfBytes()).resolves.toBeNull();
  });

  it("returns null when the active PDF has no form storage", async () => {
    setActivePdfDocument(createRuntime(0));

    await expect(getFilledPdfBytes()).resolves.toBeNull();
  });

  it("serializes the active PDF when form storage contains values", async () => {
    const bytes = new Uint8Array([4, 5, 6]);
    setActivePdfDocument(createRuntime(2, bytes));

    await expect(getFilledPdfBytes()).resolves.toEqual(bytes);
  });
});
