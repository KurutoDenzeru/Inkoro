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
  };
}

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
}

export const useEditorStore = create<EditorState>((set) => ({
  pdfFile: null,
  pdfUrl: null,
  numPages: 0,
  currentPage: 1,
  scale: 1,
  pageDimensions: {},
  layers: {},
  selectedElementId: null,
  activeTool: 'select',

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
}));
