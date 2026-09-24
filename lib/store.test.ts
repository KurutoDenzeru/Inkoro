import { beforeEach, describe, expect, it } from "vitest";

import { useEditorStore, type PDFElement } from "./store";

const element: PDFElement = {
  content: "Note",
  height: 20,
  id: "element-1",
  rotation: 0,
  style: {},
  type: "text",
  width: 100,
  x: 10,
  y: 20,
};

const resetStore = () => {
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
};

beforeEach(() => {
  resetStore();
});

describe("editor store", () => {
  it("adds, updates, and removes annotation elements", () => {
    const store = useEditorStore.getState();

    store.addLayer(1, element);
    expect(useEditorStore.getState().layers[1]).toHaveLength(1);

    store.updateLayer(1, element.id, { content: "Updated" });
    expect(useEditorStore.getState().layers[1][0].content).toBe("Updated");

    store.removeLayer(1, element.id);
    expect(useEditorStore.getState().layers[1]).toHaveLength(0);
  });

  it("undoes and redoes annotation changes", () => {
    const store = useEditorStore.getState();
    store.addLayer(1, element);
    store.updateLayer(1, element.id, { content: "Updated" });

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().layers[1][0].content).toBe("Note");

    useEditorStore.getState().redo();
    expect(useEditorStore.getState().layers[1][0].content).toBe("Updated");
  });

  it("exports annotation layers in the session payload", () => {
    useEditorStore.getState().addLayer(1, element);

    const session = JSON.parse(useEditorStore.getState().exportSession()) as {
      layers: Record<string, PDFElement[]>;
    };

    expect(session.layers["1"][0].id).toBe(element.id);
  });
});
