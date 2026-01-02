import { create } from 'zustand';

export interface PDFElement {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'line' | 'arrow' | 'signature';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string; // Text content or Image Data URL
  style: {
    color?: string;
    backgroundColor?: string; // For shapes or text background
    borderColor?: string;
    borderWidth?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
    borderRadius?: number; // General radius
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    // Line-specific properties
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    sloppiness?: number; // For curved lines (0-100)
    // Arrow-specific properties
    arrowStart?: boolean; // Arrow at start
    arrowEnd?: boolean; // Arrow at end
    // Endpoint coordinates for lines/arrows (absolute page coordinates)
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

type ClipboardData =
  | { type: 'elements'; elements: PDFElement[] }
  | { type: 'text'; text: string }
  | { type: 'image'; dataUrl: string }
  | null;

interface EditorState {
  pdfFile: File | null;
  pdfUrl: string | null; // helper for display
  numPages: number;
  currentPage: number;
  scale: number;

  // Page dimensions (width, height) in PDF points
  pageDimensions: Record<number, { width: number; height: number }>;

  // Elements per page. Key is page index (1-based to match PDF)
  layers: Record<number, PDFElement[]>;
  selectedElementId: string | null;

  // Tool state
  activeTool: 'select' | 'text' | 'rect' | 'circle' | 'line' | 'arrow' | 'image' | 'signature' | 'draw' | null;

  // Clipboard
  clipboard: ClipboardData;

  setPdfFile: (file: File) => void;
  setNumPages: (num: number) => void;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;

  setPageDimensions: (page: number, width: number, height: number) => void;

  addLayer: (page: number, layer: PDFElement) => void;
  updateLayer: (page: number, id: string, updates: Partial<PDFElement>) => void;
  removeLayer: (page: number, id: string) => void;
  reorderLayers: (page: number, newLayers: PDFElement[]) => void;

  selectElement: (id: string | null) => void;
  setActiveTool: (tool: EditorState['activeTool']) => void;

  // Clipboard helpers
  copySelection: () => Promise<boolean>;
  pasteClipboard: (page: number, x?: number, y?: number) => Promise<boolean>;
  clearClipboard: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  pdfFile: null,
  pdfUrl: null,
  numPages: 0,
  currentPage: 1,
  scale: 1,
  pageDimensions: {},
  layers: {},
  selectedElementId: null,
  activeTool: 'select',
  clipboard: null,

  setPdfFile: (file) => set({
    pdfFile: file,
    pdfUrl: URL.createObjectURL(file), // Remember to revoke potentially?
    currentPage: 1
  }),
  setNumPages: (num) => set((state) => ({
    numPages: num,
    currentPage: num > 0 ? Math.min(state.currentPage, num) : 1
  })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setScale: (scale) => set({ scale }),

  setPageDimensions: (page, width, height) => set((state) => ({
    pageDimensions: {
      ...state.pageDimensions,
      [page]: { width, height }
    }
  })),

  addLayer: (page, layer) => set((state) => ({
    layers: {
      ...state.layers,
      [page]: [...(state.layers[page] || []), layer]
    }
  })),

  updateLayer: (page, id, updates) => set((state) => ({
    layers: {
      ...state.layers,
      [page]: (state.layers[page] || []).map(l =>
        l.id === id
          ? {
            ...l,
            ...updates,
            // Deep merge style object if it exists in updates
            style: updates.style ? { ...l.style, ...updates.style } : l.style
          }
          : l
      )
    }
  })),

  removeLayer: (page, id) => set((state) => ({
    layers: {
      ...state.layers,
      [page]: (state.layers[page] || []).filter(l => l.id !== id)
    }
  })),

  reorderLayers: (page, newLayers) => set((state) => ({
    layers: {
      ...state.layers,
      [page]: newLayers
    }
  })),

  selectElement: (id) => set({ selectedElementId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),

  copySelection: async () => {
    const state = get();
    const sel = state.selectedElementId;
    if (!sel) return false;
    const el = (state.layers[state.currentPage] || []).find(x => x.id === sel);
    if (!el) return false;

    // clone
    const cloned: PDFElement = JSON.parse(JSON.stringify(el));
    set({ clipboard: { type: 'elements', elements: [cloned] } });

    // Try to write to system clipboard for better UX
    try {
      if (el.type === 'text' && el.content) {
        await navigator.clipboard.writeText(el.content);
        return true;
      }

      if (el.type === 'image' && el.content && el.content.startsWith('data:')) {
        // Convert data URL to blob and write
        const res = await fetch(el.content);
        const blob = await res.blob();
        // Use ClipboardItem where supported
        if ((navigator as any).clipboard && (window as any).ClipboardItem) {
          // @ts-ignore - Runtime check
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          // @ts-ignore
          await navigator.clipboard.write([clipboardItem]);
          return true;
        }
      }

      // Fallback: write JSON to clipboard so other users can paste into another Inkoro instance
      await navigator.clipboard.writeText(JSON.stringify({ __inkoro: true, elements: [el] }));
      return true;
    } catch (err) {
      // swallow and still keep the in-memory clipboard
      console.debug('Clipboard write not supported or denied', err);
      return true;
    }
  },

  pasteClipboard: async (page, x, y) => {
    const state = get();
    const cb = state.clipboard;
    if (!cb) {
      // No internal clipboard, nothing to paste here
      return false;
    }

    if (cb.type === 'elements' && cb.elements.length > 0) {
      // Clone elements with new ids and offset by 10/10 user units
      const offset = 10;
      let newId: string | null = null;
      for (const el of cb.elements) {
        const cloned: PDFElement = JSON.parse(JSON.stringify(el));
        cloned.id = crypto.randomUUID();
        cloned.x = (typeof x === 'number' ? x : cloned.x + offset);
        cloned.y = (typeof y === 'number' ? y : cloned.y + offset);
        get().addLayer(page, cloned);
        newId = cloned.id;
      }
      if (newId) get().selectElement(newId);
      return true;
    }

    if (cb.type === 'text' && cb.text) {
      const id = crypto.randomUUID();
      const defaultPxWidth = 300; // px
      const userWidth = defaultPxWidth / (state.scale || 1);
      const userHeight = 30 / (state.scale || 1);
      const containerCenterX = 100;
      const containerCenterY = 100;
      const newElement: PDFElement = {
        id,
        type: 'text',
        x: typeof x === 'number' ? x : containerCenterX,
        y: typeof y === 'number' ? y : containerCenterY,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: cb.text,
        style: { fontSize: 16, color: '#000000' }
      };
      get().addLayer(page, newElement);
      get().selectElement(id);
      return true;
    }

    if (cb.type === 'image' && cb.dataUrl) {
      const id = crypto.randomUUID();
      // default to 200x200 user units (will be updated by image's natural size if needed)
      const userWidth = 200;
      const userHeight = 200;
      const newElement: PDFElement = {
        id,
        type: 'image',
        x: typeof x === 'number' ? x : 100,
        y: typeof y === 'number' ? y : 100,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: cb.dataUrl,
        style: { opacity: 1 }
      };
      get().addLayer(page, newElement);
      get().selectElement(id);
      return true;
    }

    return false;
  },

  clearClipboard: () => set({ clipboard: null }),
}));
