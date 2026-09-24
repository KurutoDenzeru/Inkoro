// @vitest-environment node

import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PDFDocument } from "pdf-lib";

import {
  buildAnnotationReportData,
  renderAnnotationReport,
  type AnnotationReportPreset,
} from "./annotation-report";
import type { PDFElement } from "@/lib/store";

const textElement: PDFElement = {
  content: "Review note",
  height: 20,
  id: "text-1",
  rotation: 0,
  style: {},
  type: "text",
  width: 100,
  x: 10,
  y: 20,
};

const checkboxElement: PDFElement = {
  height: 14,
  id: "check-1",
  rotation: 0,
  style: {},
  type: "rect",
  width: 14,
  x: 10,
  y: 50,
};

beforeAll(() => {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url =
      input instanceof URL
        ? input
        : typeof input === "string"
          ? new URL(input)
          : new URL(input.url);
    const data = await readFile(url);
    return new Response(data, { headers: { "Content-Type": "application/wasm" } });
  });
});

afterAll(() => {
  vi.unstubAllGlobals();
});

const createReportData = async () => {
  const sourceDocument = await PDFDocument.create();
  sourceDocument.addPage([612, 792]);
  const sourceBytes = await sourceDocument.save();
  const sourceBuffer = new ArrayBuffer(sourceBytes.byteLength);
  new Uint8Array(sourceBuffer).set(sourceBytes);
  const sourceFile = new File([sourceBuffer], "agreement.pdf", {
    type: "application/pdf",
  });
  const data = buildAnnotationReportData(
    sourceFile,
    2,
    {
      1: [textElement, checkboxElement],
      2: [],
    },
    "https://example.com/session",
  );

  return {
    ...data,
    generatedAt: "2026-09-25T12:00:00.000Z",
  };
};

describe("annotation report", () => {
  it("counts annotations and omits pages without annotations", async () => {
    const data = await createReportData();

    expect(data.pageCount).toBe(2);
    expect(data.totalAnnotations).toBe(2);
    expect(data.pages).toHaveLength(1);
    expect(data.pages[0].byType.text).toBe(1);
    expect(data.pages[0].byType.rect).toBe(1);
    expect(data.sourceUrl).toBe("https://example.com/session");
  });

  it.each<AnnotationReportPreset>(["standard", "accessible", "archival"])(
    "renders the %s report preset",
    async (preset) => {
      const data = await createReportData();
      const bytes = await renderAnnotationReport(data, { preset });

      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
      const document = await PDFDocument.load(bytes);
      expect(document.getPageCount()).toBeGreaterThan(0);
    },
  );
});
