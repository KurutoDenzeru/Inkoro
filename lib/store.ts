import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Lightweight session persistence using localStorage under the key `inkoro-storage`.
// Persists only UI state (pages, scale, layers, etc.). Files and clipboard are never persisted.

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
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    sloppiness?: number;
    arrowStart?: boolean;
    arrowEnd?: boolean;
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
  pdfUrl: string | null;
  numPages: number;
  currentPage: number;
  scale: number;
  pageDimensions: Record<number, { width: number; height: number }>;
  layers: Record<number, PDFElement[]>;
  selectedElementId: string | null;
  activeTool: 'select' | 'text' | 'rect' | 'circle' | 'line' | 'arrow' | 'image' | 'signature' | 'draw' | null;
  clipboard: ClipboardData;
  isHydrating: boolean; // track whether initial hydration is in progress

  // session helpers
  exportSession: () => string;
  importSession: (json: string) => void;
  clearSession: () => void;

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

  copySelection: () => Promise<boolean>;
  pasteClipboard: (page: number, x?: number, y?: number) => Promise<boolean>;
  clearClipboard: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => {
  let currentPdfObjectUrl: string | null = null;
  const PDF_PERSIST_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB max to keep localStorage safe

  return {
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
    isHydrating: typeof window !== 'undefined', // true on client during initial load

    exportSession: () => {
      const snapshot: any = {
        numPages: get().numPages,
        currentPage: get().currentPage,
        scale: get().scale,
        pageDimensions: get().pageDimensions,
        layers: get().layers,
        activeTool: get().activeTool,
      };
      // if a small PDF is persisted, include minimal pdf metadata (no binary) for export convenience
      try {
        const rawPdf = localStorage.getItem('inkoro-storage-pdf');
        if (rawPdf) {
          const pdfObj = JSON.parse(rawPdf);
          snapshot.pdf = { name: pdfObj.name, size: pdfObj.size, type: pdfObj.type };
        }
      } catch { }

      return JSON.stringify(snapshot);
    },

    importSession: (json: string) => {
      try {
        const data = JSON.parse(json);
        set((state) => ({
          numPages: typeof data.numPages === 'number' ? data.numPages : state.numPages,
          currentPage: typeof data.currentPage === 'number' ? data.currentPage : state.currentPage,
          scale: typeof data.scale === 'number' ? data.scale : state.scale,
          pageDimensions: typeof data.pageDimensions === 'object' ? data.pageDimensions : state.pageDimensions,
          layers: typeof data.layers === 'object' ? data.layers : state.layers,
          activeTool: typeof data.activeTool === 'string' ? data.activeTool : state.activeTool,
        }));
      } catch (err) {
        console.warn('Failed to import session:', err);
      }
    },

    clearSession: () => {
      try {
        localStorage.removeItem('inkoro-storage');
        localStorage.removeItem('inkoro-storage-pdf');
      } catch (e) {
        // ignore
      }
      set({
        numPages: 0,
        currentPage: 1,
        scale: 1,
        pageDimensions: {},
        layers: {},
        activeTool: 'select',
      });
    },

    setPdfFile: (file) => {
      if (currentPdfObjectUrl) {
        try { URL.revokeObjectURL(currentPdfObjectUrl); } catch (e) { }
        currentPdfObjectUrl = null;
      }
      const url = URL.createObjectURL(file);
      currentPdfObjectUrl = url;
      set({ pdfFile: file, pdfUrl: url, currentPage: 1 });

      // Persist small PDFs to localStorage (dataURL) so sessions can be restored after refresh.
      // Keep a conservative limit to avoid exceeding localStorage quota.
      try {
        if (file.size <= PDF_PERSIST_SIZE_LIMIT && typeof FileReader !== 'undefined') {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const payload = {
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result,
              } as const;
              localStorage.setItem('inkoro-storage-pdf', JSON.stringify(payload));
            } catch (e) {
              // ignore storage errors
            }
          };
          reader.readAsDataURL(file);
        } else {
          // remove persisted pdf if it's too big to store
          localStorage.removeItem('inkoro-storage-pdf');
        }
      } catch (e) {
        // ignore any localStorage / FileReader errors
      }
    },

    setNumPages: (num) => set((state) => ({
      numPages: num,
      currentPage: num > 0 ? Math.min(state.currentPage, num) : 1,
    })),

    setCurrentPage: (page) => set({ currentPage: page }),
    setScale: (scale) => set({ scale }),

    setPageDimensions: (page, width, height) => set((state) => ({
      pageDimensions: {
        ...state.pageDimensions,
        [page]: { width, height },
      },
    })),

    addLayer: (page, layer) => set((state) => ({
      layers: {
        ...state.layers,
        [page]: [...(state.layers[page] || []), layer],
      },
    })),

    updateLayer: (page, id, updates) => set((state) => ({
      layers: {
        ...state.layers,
        [page]: (state.layers[page] || []).map((l) =>
          l.id === id
            ? {
              ...l,
              ...updates,
              style: updates.style ? { ...l.style, ...updates.style } : l.style,
            }
            : l
        ),
      },
    })),

    removeLayer: (page, id) => set((state) => ({
      layers: {
        ...state.layers,
        [page]: (state.layers[page] || []).filter((l) => l.id !== id),
      },
    })),

    reorderLayers: (page, newLayers) => set((state) => ({
      layers: {
        ...state.layers,
        [page]: newLayers,
      },
    })),

    selectElement: (id) => set({ selectedElementId: id }),
    setActiveTool: (tool) => set({ activeTool: tool }),

    copySelection: async () => {
      const state = get();
      const sel = state.selectedElementId;
      if (!sel) return false;
      const el = (state.layers[state.currentPage] || []).find((x) => x.id === sel);
      if (!el) return false;

      const cloned: PDFElement = JSON.parse(JSON.stringify(el));
      set({ clipboard: { type: 'elements', elements: [cloned] } });

      try {
        if (el.type === 'text' && el.content) {
          await navigator.clipboard.writeText(el.content);
          return true;
        }

        if (el.type === 'image' && el.content && el.content.startsWith('data:')) {
          const res = await fetch(el.content);
          const blob = await res.blob();
          if ((navigator as any).clipboard && (window as any).ClipboardItem) {
            // @ts-ignore
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });
            // @ts-ignore
            await navigator.clipboard.write([clipboardItem]);
            return true;
          }
        }

        await navigator.clipboard.writeText(JSON.stringify({ __inkoro: true, elements: [el] }));
        return true;
      } catch (err) {
        console.debug('Clipboard write not supported or denied', err);
        return true;
      }
    },

    pasteClipboard: async (page, x, y) => {
      const state = get();
      const cb = state.clipboard;
      if (!cb) return false;

      if (cb.type === 'elements' && cb.elements.length > 0) {
        const offset = 10;
        let newId: string | null = null;
        for (const el of cb.elements) {
          const cloned: PDFElement = JSON.parse(JSON.stringify(el));
          cloned.id = crypto.randomUUID();
          cloned.x = typeof x === 'number' ? x : cloned.x + offset;
          cloned.y = typeof y === 'number' ? y : cloned.y + offset;
          get().addLayer(page, cloned);
          newId = cloned.id;
        }
        if (newId) get().selectElement(newId);
        return true;
      }

      if (cb.type === 'text' && cb.text) {
        const id = crypto.randomUUID();
        const defaultPxWidth = 300;
        const userWidth = defaultPxWidth / (state.scale || 1);
        const userHeight = 30 / (state.scale || 1);
        const newElement: PDFElement = {
          id,
          type: 'text',
          x: typeof x === 'number' ? x : 100,
          y: typeof y === 'number' ? y : 100,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: cb.text,
          style: { fontSize: 16, color: '#000000' },
        };
        get().addLayer(page, newElement);
        get().selectElement(id);
        return true;
      }

      if (cb.type === 'image' && cb.dataUrl) {
        const id = crypto.randomUUID();
        const newElement: PDFElement = {
          id,
          type: 'image',
          x: typeof x === 'number' ? x : 100,
          y: typeof y === 'number' ? y : 100,
          width: 200,
          height: 200,
          rotation: 0,
          content: cb.dataUrl,
          style: { opacity: 1 },
        };
        get().addLayer(page, newElement);
        get().selectElement(id);
        return true;
      }

      return false;
    },

    clearClipboard: () => set({ clipboard: null }),
  };
});

// Hydrate from localStorage and subscribe to changes (client-only)
if (typeof window !== 'undefined') {
  (async () => {
    try {
      // Restore PDF first (if persisted)
      const rawPdf = localStorage.getItem('inkoro-storage-pdf');
      if (rawPdf) {
        try {
          const pdfObj = JSON.parse(rawPdf);
          if (pdfObj && pdfObj.dataUrl) {
            const res = await fetch(pdfObj.dataUrl);
            const blob = await res.blob();
            const fileName = pdfObj.name || 'document.pdf';
            const fileType = pdfObj.type || blob.type || 'application/pdf';
            try {
              const restoredFile = new File([blob], fileName, { type: fileType });
              // Use the store setter so object URLs and other logic run
              useEditorStore.getState().setPdfFile(restoredFile);
            } catch (e) {
              // Some environments may not support File constructor; fall back to setting pdfUrl
              const url = URL.createObjectURL(blob);
              useEditorStore.setState((s) => ({ pdfFile: null, pdfUrl: url } as Partial<EditorState>));
            }
          }
        } catch (e) {
          console.debug('Failed to restore persisted PDF', e);
        }
      }

      // Restore session fields after PDF (so currentPage from session isn't overwritten by setPdfFile's default)
      const raw = localStorage.getItem('inkoro-storage');
      if (raw) {
        try {
          const data = JSON.parse(raw);
          useEditorStore.setState((s) => ({
            numPages: typeof data.numPages === 'number' ? data.numPages : s.numPages,
            currentPage: typeof data.currentPage === 'number' ? data.currentPage : s.currentPage,
            scale: typeof data.scale === 'number' ? data.scale : s.scale,
            pageDimensions: typeof data.pageDimensions === 'object' ? data.pageDimensions : s.pageDimensions,
            layers: typeof data.layers === 'object' ? data.layers : s.layers,
            activeTool: typeof data.activeTool === 'string' ? data.activeTool : s.activeTool,
          } as Partial<EditorState>));
        } catch (e) {
          console.debug('Failed to hydrate inkoro-storage', e);
        }
      }
    } catch (e) {
      console.debug('Failed during hydration', e);
    } finally {
      // Mark hydration complete
      useEditorStore.setState({ isHydrating: false });
    }
  })();

  if (!(window as any).__inkoro_store_subscribed) {
    useEditorStore.subscribe((state) => {
      const toSave = {
        numPages: state.numPages,
        currentPage: state.currentPage,
        scale: state.scale,
        pageDimensions: state.pageDimensions,
        layers: state.layers,
        activeTool: state.activeTool,
      };
      try { localStorage.setItem('inkoro-storage', JSON.stringify(toSave)); } catch { }
    });
    (window as any).__inkoro_store_subscribed = true;
  }
}




