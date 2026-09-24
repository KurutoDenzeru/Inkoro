import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PDFViewer } from "./pdf-viewer";
import { useEditorStore } from "@/lib/store";

const pageProps = vi.hoisted(() => ({ current: null as Record<string, unknown> | null }));

vi.mock("react-pdf", () => ({
  Document: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Page: (props: Record<string, unknown>) => {
    pageProps.current = props;
    return <div>{props.children as ReactNode}</div>;
  },
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
}));

vi.mock("./canvas-layer", () => ({
  CanvasLayer: () => null,
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/lib/pdf-runtime", () => ({
  setActivePdfDocument: vi.fn(),
}));

beforeEach(() => {
  pageProps.current = null;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect() {}
      observe() {}
    },
  );
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
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PDFViewer", () => {
  it("enables interactive form widgets on the canvas page", () => {
    render(<PDFViewer />);

    expect(pageProps.current).toMatchObject({
      renderAnnotationLayer: true,
      renderForms: true,
      renderTextLayer: true,
    });
  });
});
