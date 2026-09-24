import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DownloadDialog } from "./download-dialog";
import { useEditorStore } from "@/lib/store";

vi.mock("react-pdf", () => ({
  Document: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Page: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

beforeEach(() => {
  useEditorStore.setState({
    activeTool: "select",
    clipboard: null,
    currentPage: 1,
    history: { future: [], past: [] },
    isHydrating: false,
    layers: {},
    numPages: 0,
    pageDimensions: {},
    pdfFile: null,
    pdfUrl: null,
    scale: 1,
    selectedElementId: null,
  });
});

describe("DownloadDialog", () => {
  it("renders export settings and blocks export without a PDF", () => {
    render(<DownloadDialog open onOpenChange={() => undefined} />);

    expect(screen.getByText("Export Settings")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Export PDF/ })).toBeDisabled();
  });
});
