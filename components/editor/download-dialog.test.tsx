import type { ReactNode } from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PDFBool, PDFDict, PDFDocument, PDFName } from "pdf-lib";
import { getDocument } from "pdfjs-dist";

import { DownloadDialog } from "./download-dialog";
import { setActivePdfDocument } from "@/lib/pdf-runtime";
import { useEditorStore } from "@/lib/store";

// pdf.js reads DOMMatrix at module scope, which jsdom lacks; stub it so the module loads.
vi.hoisted(() => {
  vi.stubGlobal(
    "DOMMatrix",
    class DOMMatrix {
      a = 1;
      b = 0;
      c = 0;
      d = 1;
      e = 0;
      f = 0;
      flipY() {
        return this;
      }
      inverseSelf() {
        return this;
      }
      multiplySelf() {
        return this;
      }
      rotate() {
        return this;
      }
      scale() {
        return this;
      }
      transformPoint(p: { x: number; y: number }) {
        return { x: p.x, y: p.y, z: 0, w: 1 };
      }
      translate() {
        return this;
      }
    },
  );

  // Node lacks Math.sumPrecise used on pdf.js's save path; polyfill it (integer char counts make reduce exact).
  const math = Math as unknown as Record<string, unknown>;
  if (typeof math.sumPrecise !== "function") {
    math.sumPrecise = (arr: number[]) => arr.reduce((acc, n) => acc + n, 0);
  }
});

// The PDF.js worker won't boot in jsdom, so the Document mock runs the real document pipeline synchronously on mount.
const documentHooks = vi.hoisted(() => ({
  onLoadSuccess: null as ((data: { numPages: number }) => void) | null,
}));

vi.mock("react-pdf", () => ({
  Document: ({
    onLoadSuccess,
  }: {
    children?: ReactNode;
    file?: unknown;
    onLoadSuccess?: (data: { numPages: number }) => void;
  }) => {
    documentHooks.onLoadSuccess = onLoadSuccess ?? null;
    return <div data-testid="pdf-document" />;
  },
  Page: ({ pageIndex }: { pageIndex?: number }) => (
    <div data-testid={`preview-page-${pageIndex}`} />
  ),
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
}));

vi.mock("./canvas-layer", () => ({
  CanvasLayer: () => null,
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const blobCaptures = vi.hoisted(() => [] as Blob[]);

vi.stubGlobal(
  "URL",
  new Proxy(URL, {
    get(target, prop, receiver) {
      if (prop === "createObjectURL") {
        return (blob: Blob) => {
          blobCaptures.push(blob);
          return target.createObjectURL(blob);
        };
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  }),
);

afterEach(() => {
  blobCaptures.length = 0;
  documentHooks.onLoadSuccess = null;
  setActivePdfDocument(null);
  vi.unstubAllGlobals();
});

const seedStore = () => {
  useEditorStore.setState({
    activeTool: "select",
    clipboard: null,
    currentPage: 1,
    history: { future: [], past: [] },
    isHydrating: false,
    layers: {},
    numPages: 1,
    pageDimensions: { 1: { height: 792, width: 612 } },
    pdfFile: new File(["%PDF-1.4"], "document.pdf", { type: "application/pdf" }),
    pdfUrl: null,
    scale: 1,
    selectedElementId: null,
  });
};

// Single-page AcroForm with every widget type; /NeedAppearances set so pdf.js saves values without appearance streams.
const buildFixture = async (): Promise<Uint8Array> => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const form = doc.getForm();

  const plain = form.createTextField("plain");
  plain.addToPage(page, { x: 100, y: 700, width: 200, height: 20 });

  const multi = form.createTextField("multi");
  multi.enableMultiline();
  multi.addToPage(page, { x: 100, y: 670, width: 200, height: 60 });

  const pw = form.createTextField("pw");
  pw.enablePassword();
  pw.addToPage(page, { x: 100, y: 640, width: 200, height: 20 });

  const check = form.createCheckBox("check");
  check.addToPage(page, { x: 100, y: 610, width: 18, height: 18 });

  const radio = form.createRadioGroup("radio");
  radio.addOptionToPage("A", page, { x: 100, y: 580, width: 18, height: 18 });
  radio.addOptionToPage("B", page, { x: 130, y: 580, width: 18, height: 18 });

  const drop = form.createDropdown("drop");
  drop.addOptions(["One", "Two", "Three"]);
  drop.addToPage(page, { x: 100, y: 550, width: 150, height: 20 });

  form.updateFieldAppearances();
  const acroForm = doc.catalog.lookup(PDFName.of("AcroForm")) as PDFDict;
  acroForm.set(PDFName.of("NeedAppearances"), PDFBool.True);

  return await doc.save({ useObjectStreams: false });
};

describe("DownloadDialog", () => {
  it("keeps every filled field value and appearance in the export bytes", async () => {
    seedStore();
    const bytes = await buildFixture();

    const pdf = await (await getDocument({ data: new Uint8Array(bytes) })).promise;
    const page = await pdf.getPage(1);
    const annots = await page.getAnnotations();

    // Fill as the rendered annotation layer does: radio selection marks the chosen widget true and the rest false (B is selected here).
    const setValue = (id: string, value: { value: unknown }) =>
      pdf.annotationStorage.setValue(id, value);
    for (const a of annots) {
      const d = a as unknown as Record<string, unknown>;
      if (a.fieldName === "plain") {
        setValue(a.id, { value: "plain-value" });
      } else if (a.fieldName === "multi") {
        setValue(a.id, { value: "line one\nline two" });
      } else if (a.fieldName === "pw") {
        setValue(a.id, { value: "secret123" });
      } else if (a.fieldName === "check") {
        setValue(a.id, { value: true });
      } else if (a.fieldName === "radio") {
        setValue(a.id, { value: d.buttonValue === "1" });
      } else if (a.fieldName === "drop") {
        setValue(a.id, { value: "Three" });
      }
    }

    // Copy saveDocument() bytes into the test realm (cross-realm instanceof guard in pdf-lib fails); a test-only shim, since the browser shares one realm.
    setActivePdfDocument({
      annotationStorage: pdf.annotationStorage,
      saveDocument: async () => new Uint8Array(await pdf.saveDocument()),
    });

    const { unmount } = render(<DownloadDialog open onOpenChange={vi.fn()} />);
    documentHooks.onLoadSuccess?.({ numPages: 1 });

    await waitFor(
      () => {
        expect(blobCaptures.length).toBeGreaterThan(0);
      },
      { timeout: 10000 },
    );

    const previewBytes = new Uint8Array(await blobCaptures[0].arrayBuffer());
    const out = await PDFDocument.load(previewBytes, { ignoreEncryption: true });
    const form = out.getForm();

    // Values survive the real pdf.js save + repair round-trip.
    expect(form.getField("plain").getText()).toBe("plain-value");
    expect(form.getField("multi").getText()).toBe("line one\nline two");
    expect(form.getField("pw").getText()).toBe("secret123");
    expect(form.getCheckBox("check").isChecked()).toBe(true);
    expect(form.getRadioGroup("radio").getSelected()).toBe("B");
    expect(form.getDropdown("drop").getSelected()).toEqual(["Three"]);

    // Every widget carries an appearance stream so static viewers render the values.
    for (const name of ["plain", "multi", "pw", "check", "drop"]) {
      const widget = form.getField(name).acroField.getWidgets()[0];
      expect(widget.getAppearances(), `${name} widget has an AP`).toBeDefined();
    }
    for (const widget of form.getRadioGroup("radio").acroField.getWidgets()) {
      expect(widget.getAppearances(), "radio widget has an AP").toBeDefined();
    }

    unmount();
  }, 30000);
});
