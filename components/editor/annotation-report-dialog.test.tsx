import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { AnnotationReportDialog } from "./annotation-report-dialog";
import { useEditorStore } from "@/lib/store";

const resetStore = () => {
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
};

beforeEach(() => {
  resetStore();
});

describe("AnnotationReportDialog", () => {
  it("shows export profiles and disables download without a PDF", () => {
    render(<AnnotationReportDialog open onOpenChange={() => undefined} />);

    expect(screen.getByText("Export profile")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download report/ })).toBeDisabled();
  });

  it("allows selecting an accessible report profile", async () => {
    const user = userEvent.setup();
    render(<AnnotationReportDialog open onOpenChange={() => undefined} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Accessible PDF/UA" }));

    expect(screen.getByText(/PDF\/UA structure/)).toBeInTheDocument();
  });
});
