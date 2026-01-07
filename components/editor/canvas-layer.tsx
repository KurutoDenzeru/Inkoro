'use client';

import { useEditorStore, PDFElement } from '@/lib/store';
import { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import { cn } from '@/lib/utils'; // Assuming shadcn init

interface CanvasLayerProps {
  pageIndex: number;
  scale: number;
}

export function CanvasLayer({ pageIndex, scale }: CanvasLayerProps) {
  const {
    layers,
    addLayer,
    updateLayer,
    selectedElementId,
    selectElement,
    activeTool,
    setActiveTool
  } = useEditorStore();

  const elements = layers[pageIndex] || [];
  const selectedElement = elements.find(el => el.id === selectedElementId);
  const targetRef = useRef<HTMLElement | null>(null); // Ref to the currently selected DOM element
  const containerRef = useRef<HTMLDivElement | null>(null); // ref for paste/copy placement

  // Need a way to map ids to refs
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Track recent center drag to suppress click toggles when the user drags the control
  const recentCenterDragRef = useRef<{ id?: string; moved?: boolean }>({});

  useEffect(() => {
    // Update targetRef when selection changes
    if (selectedElementId && elementRefs.current[selectedElementId]) {
      targetRef.current = elementRefs.current[selectedElementId]!;
    } else {
      targetRef.current = null;
    }
  }, [selectedElementId, elements]);

  // Listen for focus requests from the sidebar so a single click on a layer will bring the element into view
  useEffect(() => {
    const handleFocusEvent = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as { id?: string } | undefined;
      const id = detail?.id;
      if (!id) return;

      const elRef = elementRefs.current[id];
      if (elRef) {
        try {
          elRef.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } catch (err) {
          // ignore
        }

        // If already selected, ensure bounding box gets attached
        if (selectedElementId === id) {
          targetRef.current = elRef;
        } else {
          // Select and let the selection effect attach the targetRef
          useEditorStore.getState().selectElement(id);
          // set a short timeout to allow DOM updates and then attach the target
          setTimeout(() => {
            if (elementRefs.current[id]) {
              targetRef.current = elementRefs.current[id]!
            }
          }, 40);
        }
      }
    };

    window.addEventListener('inkoro-focus-element', handleFocusEvent as EventListener);
    return () => window.removeEventListener('inkoro-focus-element', handleFocusEvent as EventListener);
  }, [selectedElementId]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Clicking on empty space should deselect any selected element
    selectElement(null);

    // If a non-select tool is active, proceed to create the element at click
    // Coordinate calculation needed relative to container
    if (activeTool === 'select') {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const id = crypto.randomUUID();

    let newElement: PDFElement | null = null;

    if (activeTool === 'text') {
      newElement = {
        id, type: 'text', x, y, width: 200, height: 30, rotation: 0,
        content: 'Double click to edit',
        style: { fontSize: 16, color: '#000000' }
      };
    } else if (activeTool === 'rect') {
      newElement = {
        id, type: 'rect', x, y, width: 100, height: 100, rotation: 0,
        style: { backgroundColor: '#ff0000', opacity: 1 }
      };
    } else if (activeTool === 'circle') {
      newElement = {
        id, type: 'circle', x, y, width: 100, height: 100, rotation: 0,
        style: { backgroundColor: '#ff0000', opacity: 1, borderRadius: 50 }
      };
    } else if (activeTool === 'line') {
      const start = { x, y };
      const end = { x: x + 150, y };
      const minX = Math.min(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
      const rawHeight = Math.max(Math.abs(end.y - start.y), 10);

      // Add minimal padding for stroke width
      const padding = 10;
      const newX = minX - padding;
      const newY = minY - padding;
      const newWidth = rawWidth + padding * 2;
      const newHeight = rawHeight + padding * 2;

      newElement = {
        id, type: 'line', x: newX, y: newY, width: newWidth, height: newHeight, rotation: 0,
        style: { backgroundColor: '#000000', opacity: 1, borderWidth: 1, start, end, sloppiness: 0 }
      };
    } else if (activeTool === 'arrow') {
      const start = { x, y };
      const end = { x: x + 150, y };
      const minX = Math.min(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
      const rawHeight = Math.max(Math.abs(end.y - start.y), 10);

      // Add minimal padding for stroke width and arrowheads
      const padding = 10;
      const newX = minX - padding;
      const newY = minY - padding;
      const newWidth = rawWidth + padding * 2;
      const newHeight = rawHeight + padding * 2;

      newElement = {
        id, type: 'arrow', x: newX, y: newY, width: newWidth, height: newHeight, rotation: 0,
        style: { backgroundColor: '#000000', opacity: 1, borderWidth: 1, arrowEnd: true, start, end, sloppiness: 0 }
      };
    }
    // ... other tools

    if (newElement) {
      addLayer(pageIndex, newElement);
      selectElement(id);
      setActiveTool('select'); // Switch back to select after placement? Or keep tool active? Usually switch back or persistent. Let's switch back for now.
    }
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent canvas click
    selectElement(id);
    // Update targetRef immediately for the bounding box
    if (elementRefs.current[id]) {
      targetRef.current = elementRefs.current[id];
    }
  };

  // Text editing state
  const [isEditing, setIsEditing] = useState(false);
  const [draggingEndpoint, setDraggingEndpoint] = useState<'start' | 'end' | null>(null);
  const moveStartRef = useRef<{ x: number; y: number; start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    // Reset editing state when selection changes
    setIsEditing(false);
  }, [selectedElementId]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!selectedElementId) {
        // Allow paste via keydown to fallback for some environments
        if ((e.metaKey || e.ctrlKey) && (e.key === 'v' || e.key === 'V')) {
          // Let the paste event handle the content
        }
        return;
      }

      if (isEditing) return; // Don't delete if editing text

      // Don't intercept when typing in inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const activeIsEditable = (document.activeElement as HTMLElement)?.isContentEditable;
      if (activeTag === 'input' || activeTag === 'textarea' || activeIsEditable) return;

      // Undo/Redo shortcuts
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().undo();
        return;
      }

      if (
        (e.metaKey || e.ctrlKey)
        && (e.key === 'y' || e.key === 'Y' || ((e.key === 'z' || e.key === 'Z') && e.shiftKey))
      ) {
        e.preventDefault();
        useEditorStore.getState().redo();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (layers[pageIndex]?.find(el => el.id === selectedElementId)) {
          useEditorStore.getState().removeLayer(pageIndex, selectedElementId);
          selectElement(null);
        }
      }

      // Copy shortcut (Cmd/Ctrl + C)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        const ok = await useEditorStore.getState().copySelection();
        if (ok) {
          // Optional: toast notification if sonner is available
          try {
            const { toast } = await import('sonner');
            toast('Copied to clipboard');
          } catch (err) {
            /* ignore */
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, pageIndex, isEditing, layers]);

  // Handle paste events (images, text, HTML) and convert them into canvas elements
  useEffect(() => {
    const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const loadImage = (src: string) => new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 200, height: 200 });
      img.src = src;
    });

    const addImageFromDataUrl = async (dataUrl: string) => {
      try {
        const { cropImageDataUrl } = await import('@/lib/utils');
        const cropped = await cropImageDataUrl(dataUrl, true);
        const dims = { width: cropped.width, height: cropped.height };
        const src = cropped.dataUrl;

        const desiredPx = Math.min(dims.width, 600);
        const desiredPxHeight = Math.round(desiredPx * (dims.height / Math.max(1, dims.width)));
        const userWidth = desiredPx / scale;
        const userHeight = desiredPxHeight / scale;

        const container = containerRef.current?.getBoundingClientRect();
        const centerX = container ? (container.width / 2) / scale : 100;
        const centerY = container ? (container.height / 2) / scale : 100;

        const id = crypto.randomUUID();
        addLayer(pageIndex, {
          id,
          type: 'image',
          x: centerX - userWidth / 2,
          y: centerY - userHeight / 2,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: src,
          style: { opacity: 1 }
        });
        selectElement(id);
        setActiveTool('select');
      } catch (err) {
        // Fallback to previous method
        const dims = await loadImage(dataUrl);
        const desiredPx = Math.min(dims.width, 300);
        const desiredPxHeight = Math.round(desiredPx * (dims.height / Math.max(1, dims.width)));
        const userWidth = desiredPx / scale;
        const userHeight = desiredPxHeight / scale;

        const container = containerRef.current?.getBoundingClientRect();
        const centerX = container ? (container.width / 2) / scale : 100;
        const centerY = container ? (container.height / 2) / scale : 100;

        const id = crypto.randomUUID();
        addLayer(pageIndex, {
          id,
          type: 'image',
          x: centerX - userWidth / 2,
          y: centerY - userHeight / 2,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: dataUrl,
          style: { opacity: 1 }
        });
        selectElement(id);
        setActiveTool('select');
      }
    };

    const addTextFromString = (text: string) => {
      const id = crypto.randomUUID();
      const defaultPxWidth = 300;
      const userWidth = defaultPxWidth / scale;
      const userHeight = 30 / scale;
      const container = containerRef.current?.getBoundingClientRect();
      const centerX = container ? (container.width / 2) / scale : 100;
      const centerY = container ? (container.height / 2) / scale : 100;

      addLayer(pageIndex, {
        id,
        type: 'text',
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: text,
        style: { fontSize: 16, color: '#000000' }
      });
      selectElement(id);
      setActiveTool('select');
    };

    const tryParseInkoroJson = (text: string) => {
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) return parsed.elements as PDFElement[];
      } catch (err) {
        // ignore
      }
      return null;
    };

    const tryParseInkoroHtml = (html: string) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const node = doc.querySelector('[data-inkoro]');
        const payload = node?.getAttribute('data-inkoro');
        if (!payload) return null;
        const decoded = decodeURIComponent(payload);
        const parsed = JSON.parse(decoded);
        if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) return parsed.elements as PDFElement[];
      } catch (err) {
        // ignore
      }
      return null;
    };

    const handlePaste = async (e: Event) => {
      const cbEvent = e as ClipboardEvent;
      if (!cbEvent.clipboardData) return;

      // If focus is in an input or editable area, don't override normal paste
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const activeIsEditable = (document.activeElement as HTMLElement)?.isContentEditable;
      if (activeTag === 'input' || activeTag === 'textarea' || activeIsEditable) return;

      // Files (images) first
      const files = Array.from(cbEvent.clipboardData.files || []);
      if (files.length > 0) {
        for (const file of files) {
          if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            await addImageFromDataUrl(dataUrl);
          }
        }
        return;
      }

      // Items - look for images first
      const items = Array.from(cbEvent.clipboardData.items || []);
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const dataUrl = await fileToDataUrl(file);
            await addImageFromDataUrl(dataUrl);
            return;
          }
        }
      }

      // HTML content - try to extract Inkoro payload first
      const html = cbEvent.clipboardData.getData('text/html');
      if (html) {
        const inkElements = tryParseInkoroHtml(html);
        if (inkElements) {
          const offset = 10;
          let lastId: string | null = null;
          for (const el of inkElements) {
            const clone: PDFElement = JSON.parse(JSON.stringify(el));
            clone.id = crypto.randomUUID();
            clone.x = (clone.x ?? 100) + offset;
            clone.y = (clone.y ?? 100) + offset;
            addLayer(pageIndex, clone);
            lastId = clone.id;
          }
          if (lastId) selectElement(lastId);
          return;
        }

        // HTML content - try to extract image src's
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const img = doc.querySelector('img');
          if (img && img.src) {
            // If src is a data url or a remote URL we can try to insert it
            await addImageFromDataUrl(img.src);
            return;
          }
        } catch (err) {
          // ignore
        }
      }

      // Plain text
      const text = cbEvent.clipboardData.getData('text/plain');
      if (text) {
        // Check for Inkoro JSON payload
        const inkElements = tryParseInkoroJson(text);
        if (inkElements) {
          // Paste elements from JSON
          const offset = 10;
          let lastId: string | null = null;
          for (const el of inkElements) {
            const clone: PDFElement = JSON.parse(JSON.stringify(el));
            clone.id = crypto.randomUUID();
            clone.x = (clone.x ?? 100) + offset;
            clone.y = (clone.y ?? 100) + offset;
            addLayer(pageIndex, clone);
            lastId = clone.id;
          }
          if (lastId) selectElement(lastId);
          return;
        }

        // Otherwise it's plain text - create text element
        addTextFromString(text);
      }
    };

    window.addEventListener('paste', handlePaste as EventListener);
    return () => window.removeEventListener('paste', handlePaste as EventListener);
  }, [pageIndex, scale, addLayer, selectElement, setActiveTool]);

  const handleElementDoubleClick = (e: React.MouseEvent, id: string, type: string) => {
    if (type === 'text') {
      setIsEditing(true);
      // Focus editable container and set caret at click location if possible (fallback to end)
      requestAnimationFrame(() => {
        const elDiv = elementRefs.current[id];
        if (elDiv) {
          const editable = elDiv.querySelector('[contenteditable]') as HTMLElement | null;
          if (editable) {
            try {
              editable.focus();
              // Try to position caret near click using offset from point
              // We fallback to end of text if the browser doesn't support caretRangeFromPoint
              let offset = (editable.innerText || '').length;

              if ((document as any).caretRangeFromPoint) {
                const range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
                if (range) {
                  const preRange = range.cloneRange();
                  preRange.selectNodeContents(editable);
                  preRange.setEnd(range.endContainer, range.endOffset);
                  offset = preRange.toString().length;
                }
              } else if ((document as any).caretPositionFromPoint) {
                const pos = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
                if (pos) {
                  const preRange = document.createRange();
                  preRange.setStart(editable, 0);
                  preRange.setEnd(pos.offsetNode, pos.offset);
                  offset = preRange.toString().length;
                }
              }

              setCaretPosition(editable, offset);
            } catch (err) {
              // ignore
            }
          }
        }
      });
    }
  };

  function getCaretCharacterOffsetWithin(element: Node) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0).cloneRange();
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  function setCaretPosition(element: Node, chars: number) {
    const range = document.createRange();
    const sel = window.getSelection();

    // Try to focus the editable container first
    try {
      (element as HTMLElement).focus?.();
    } catch (e) {
      // ignore
    }

    let charCount = 0;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let node: Node | null = walker.nextNode();
    while (node) {
      const textLength = node.textContent?.length || 0;
      if (charCount + textLength >= chars) {
        const offset = Math.max(0, chars - charCount);
        range.setStart(node, offset);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
        return;
      }
      charCount += textLength;
      node = walker.nextNode();
    }
    // fallback to end
    const walker2 = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let lastNode: Node | null = null;
    while ((node = walker2.nextNode())) lastNode = node;
    if (lastNode) {
      const length = lastNode.textContent?.length || 0;
      range.setStart(lastNode, length);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>, id: string) => {
    const target = e.currentTarget;
    const newContent = target.innerText;
    const caretOffset = getCaretCharacterOffsetWithin(target);

    updateLayer(pageIndex, id, { content: newContent });

    if (!isComposingRef.current) {
      requestAnimationFrame(() => {
        try {
          setCaretPosition(target, caretOffset);
        } catch (err) {
          console.debug('Cursor restore failed', err);
        }
      });
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Line/Arrow endpoint dragging
  const handleEndpointMouseDown = (e: any, endpoint: 'start' | 'end') => {
    // Prevent default to avoid touch scrolling while dragging and support pointer events
    e.preventDefault?.();
    e.stopPropagation?.();
    setDraggingEndpoint(endpoint);
  };

  useEffect(() => {
    if (!draggingEndpoint || !selectedElement || (selectedElement.type !== 'line' && selectedElement.type !== 'arrow')) return;

    const getCoords = (ev: MouseEvent | TouchEvent) => {
      if ('touches' in ev) {
        const t = ev.touches[0];
        return { clientX: t.clientX, clientY: t.clientY };
      } else {
        return { clientX: (ev as MouseEvent).clientX, clientY: (ev as MouseEvent).clientY };
      }
    };

    let animationFrameId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = getCoords(e);
      lastMouseX = clientX;
      lastMouseY = clientY;

      // Cancel previous frame if it hasn't run yet
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Schedule update on next animation frame for smooth performance
      animationFrameId = requestAnimationFrame(() => {
        const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = (lastMouseX - rect.left) / scale;
        const mouseY = (lastMouseY - rect.top) / scale;

        const currStart = selectedElement.style?.start ?? { x: selectedElement.x, y: selectedElement.y + selectedElement.height / 2 };
        const currEnd = selectedElement.style?.end ?? { x: selectedElement.x + selectedElement.width, y: selectedElement.y + selectedElement.height / 2 };

        let newStart = { ...currStart };
        let newEnd = { ...currEnd };

        if (draggingEndpoint === 'start') {
          newStart = { x: mouseX, y: mouseY };
        } else {
          newEnd = { x: mouseX, y: mouseY };
        }

        const newX = Math.min(newStart.x, newEnd.x);
        const newY = Math.min(newStart.y, newEnd.y);
        const newWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
        const newHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);

        // Add padding for stroke width and curve - ensure minimum padding
        const borderWidth = selectedElement.style?.borderWidth ?? 1;
        const hasArrow = !!(selectedElement.style?.arrowStart || selectedElement.style?.arrowEnd);
        const arrowPad = hasArrow ? borderWidth * 3 : 0; // reduced arrow padding
        const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
        const paddedX = newX - strokePadding;
        const paddedY = newY - strokePadding;
        const paddedWidth = newWidth + strokePadding * 2;
        const paddedHeight = newHeight + strokePadding * 2;

        // Keep existing sloppiness - don't auto-compute
        updateLayer(pageIndex, selectedElement.id, {
          x: paddedX,
          y: paddedY,
          width: paddedWidth,
          height: paddedHeight,
          style: { ...selectedElement.style, start: newStart, end: newEnd }
        });
      });
    };

    const handlePointerUp = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      setDraggingEndpoint(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingEndpoint, selectedElement, pageIndex, scale, updateLayer]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 overflow-hidden"
      onClick={handleCanvasClick}
    >
      {elements.map((el, index) => {
        const isSelected = el.id === selectedElementId;
        const isTextEditing = isSelected && isEditing && el.type === 'text';

        // Precompute endpoint coordinates (absolute and local to element) for lines/arrows
        const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
        const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
        const startLocalX = (startPoint.x - el.x) * scale;
        const startLocalY = (startPoint.y - el.y) * scale;
        const endLocalX = (endPoint.x - el.x) * scale;
        const endLocalY = (endPoint.y - el.y) * scale;
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const len = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / len;
        const ny = dx / len;
        const sl = el.style?.sloppiness ?? 0;
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;
        const controlX = midX + nx * sl;
        const controlY = midY + ny * sl;
        const controlLocalX = (controlX - el.x) * scale;
        const controlLocalY = (controlY - el.y) * scale;
        // Marker sizing: clamp a user-space marker size to avoid runaway scaling at large border widths
        const borderWidth = el.style?.borderWidth ?? 1;
        const strokeWpx = borderWidth * scale;
        // Base marker from stroke width but clamp; also limit to a fraction of segment length (25%) to avoid huge arrowheads on short lines
        const rawMarker = Math.round(Math.max(8, Math.min(24, strokeWpx * 2)));
        const maxByLen = Math.max(8, Math.min(24, Math.round(len * scale * 0.25)));
        const markerLen = Math.min(rawMarker, maxByLen);
        const markerHalf = markerLen / 2;

        return (
          <div
            key={el.id}
            ref={ref => { elementRefs.current[el.id] = ref; }}
            style={{
              position: 'absolute',
              left: `${el.x * scale}px`,
              top: `${el.y * scale}px`,
              width: `${el.width * scale}px`,
              height: `${el.height * scale}px`,
              transform: `rotate(${el.rotation}deg)`,
              backgroundColor: (el.type === 'line' || el.type === 'arrow') ? 'transparent' : (['rect', 'circle'].includes(el.type) ? el.style.backgroundColor : (el.style.backgroundColor || 'transparent')),
              color: el.style.color,
              fontSize: `${(el.style.fontSize || 16) * scale}px`,
              fontFamily: el.style.fontFamily || 'Inter',
              fontWeight: el.style.fontWeight || 'normal',
              fontStyle: el.style.fontStyle || 'normal',
              textDecoration: el.style.textDecoration || 'none',
              textAlign: el.style.textAlign || 'left',
              border: `${(el.style.borderWidth || 0)}px solid ${el.style.borderColor || 'transparent'}`,

              // Radius handling
              borderTopLeftRadius: `${(el.style.borderTopLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
              borderTopRightRadius: `${(el.style.borderTopRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
              borderBottomLeftRadius: `${(el.style.borderBottomLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
              borderBottomRightRadius: `${(el.style.borderBottomRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,

              opacity: el.style.opacity ?? 1,
              padding: el.type === 'text' ? '4px' : '0',
              cursor: activeTool === 'select' ? (isSelected ? 'move' : 'pointer') : 'default',
              outline: (isSelected && !isEditing && el.type !== 'line' && el.type !== 'arrow') ? '2px solid #3b82f6' : 'none',
              zIndex: isSelected ? 1000 : index + 1,
            }}
            onClick={(e) => handleElementClick(e, el.id)}
            onDoubleClick={(e) => handleElementDoubleClick(e, el.id, el.type)}
          >
            {(el.type === 'line' || el.type === 'arrow') && (
              <>
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                >
                  <defs>
                    {/* Markers use markerUnits="strokeWidth" so they scale with the stroke; bounding box is expanded on style changes to avoid clipping */}
                    {el.type === 'arrow' && (
                      <>
                        {el.style.arrowStart && (
                          <marker
                            id={`arrowhead-start-${el.id}`}
                            markerUnits="userSpaceOnUse"
                            markerWidth={markerLen}
                            markerHeight={markerLen}
                            refX={0}
                            refY={markerHalf}
                            orient="auto"
                          >
                            <polygon points={`${markerLen} 0, 0 ${markerHalf}, ${markerLen} ${markerLen}`} fill={el.style.backgroundColor || '#000000'} />
                          </marker>
                        )}
                        {el.style.arrowEnd && (
                          <marker
                            id={`arrowhead-end-${el.id}`}
                            markerUnits="userSpaceOnUse"
                            markerWidth={markerLen}
                            markerHeight={markerLen}
                            refX={markerLen}
                            refY={markerHalf}
                            orient="auto"
                          >
                            <polygon points={`0 0, ${markerLen} ${markerHalf}, 0 ${markerLen}`} fill={el.style.backgroundColor || '#000000'} />
                          </marker>
                        )}
                      </>
                    )}
                  </defs>

                  {sl ? (
                    <path
                      d={`M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`}
                      stroke={el.style.backgroundColor || '#000000'}
                      strokeWidth={(el.style.borderWidth ?? 1) * scale}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={
                        el.style.strokeStyle === 'dashed' ? '10, 5' :
                          el.style.strokeStyle === 'dotted' ? '2, 5' :
                            'none'
                      }
                      fill="none"
                      style={{ pointerEvents: 'stroke' }}
                      markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : undefined}
                      markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : undefined}
                      onClick={(e) => { e.stopPropagation(); selectElement(el.id); if (elementRefs.current[el.id]) { targetRef.current = elementRefs.current[el.id]; } }}
                      onMouseDown={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        selectElement(el.id);
                        if (elementRefs.current[el.id]) { targetRef.current = elementRefs.current[el.id]; }
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                        const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };

                        const handleMove = (ev: MouseEvent) => {
                          const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const dx = (ev.clientX - startClientX) / scale;
                          const dy = (ev.clientY - startClientY) / scale;

                          const newStart = { x: origStart.x + dx, y: origStart.y + dy };
                          const newEnd = { x: origEnd.x + dx, y: origEnd.y + dy };

                          const minX = Math.min(newStart.x, newEnd.x);
                          const minY = Math.min(newStart.y, newEnd.y);
                          const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                          const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                          const borderWidth = el.style?.borderWidth ?? 1;
                          const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                          const arrowPad = hasArrow ? borderWidth * 3 : 0;
                          const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                          const newX = minX - strokePadding;
                          const newY = minY - strokePadding;
                          const newWidth = rawWidth + strokePadding * 2;
                          const newHeight = rawHeight + strokePadding * 2;

                          updateLayer(pageIndex, el.id, {
                            x: newX,
                            y: newY,
                            width: newWidth,
                            height: newHeight,
                            style: { ...el.style, start: newStart, end: newEnd }
                          });
                        };

                        const handleUp = () => {
                          document.removeEventListener('mousemove', handleMove);
                          document.removeEventListener('mouseup', handleUp);
                        };

                        document.addEventListener('mousemove', handleMove);
                        document.addEventListener('mouseup', handleUp);
                      }}
                    />
                  ) : (
                    <line
                      x1={startLocalX}
                      y1={startLocalY}
                      x2={endLocalX}
                      y2={endLocalY}
                      stroke={el.style.backgroundColor || '#000000'}
                      strokeWidth={(el.style.borderWidth ?? 1) * scale}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={
                        el.style.strokeStyle === 'dashed' ? '10, 5' :
                          el.style.strokeStyle === 'dotted' ? '2, 5' :
                            'none'
                      }
                      style={{ pointerEvents: 'stroke' }}
                      markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : undefined}
                      markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : undefined}
                      onClick={(e) => { e.stopPropagation(); selectElement(el.id); if (elementRefs.current[el.id]) { targetRef.current = elementRefs.current[el.id]; } }}
                      onMouseDown={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        selectElement(el.id);
                        if (elementRefs.current[el.id]) { targetRef.current = elementRefs.current[el.id]; }
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                        const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };

                        const handleMove = (ev: MouseEvent) => {
                          const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const dx = (ev.clientX - startClientX) / scale;
                          const dy = (ev.clientY - startClientY) / scale;

                          const newStart = { x: origStart.x + dx, y: origStart.y + dy };
                          const newEnd = { x: origEnd.x + dx, y: origEnd.y + dy };

                          const minX = Math.min(newStart.x, newEnd.x);
                          const minY = Math.min(newStart.y, newEnd.y);
                          const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                          const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                          const borderWidth = el.style?.borderWidth ?? 1;
                          const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                          const arrowPad = hasArrow ? borderWidth * 3 : 0;
                          const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                          const newX = minX - strokePadding;
                          const newY = minY - strokePadding;
                          const newWidth = rawWidth + strokePadding * 2;
                          const newHeight = rawHeight + strokePadding * 2;

                          updateLayer(pageIndex, el.id, {
                            x: newX,
                            y: newY,
                            width: newWidth,
                            height: newHeight,
                            style: { ...el.style, start: newStart, end: newEnd }
                          });
                        };

                        const handleUp = () => {
                          document.removeEventListener('mousemove', handleMove);
                          document.removeEventListener('mouseup', handleUp);
                        };

                        document.addEventListener('mousemove', handleMove);
                        document.addEventListener('mouseup', handleUp);
                      }}
                    />
                  )}
                </svg>
                {/* Draggable hotspot for lines/arrows (click & drag anywhere inside element to move) */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                    cursor: isSelected ? 'move' : 'pointer',
                    zIndex: 50,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    selectElement(el.id);
                    const startClientX = e.clientX;
                    const startClientY = e.clientY;
                    const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                    const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };

                    const handleMove = (ev: MouseEvent) => {
                      const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                      if (!canvas) return;
                      const dx = (ev.clientX - startClientX) / scale;
                      const dy = (ev.clientY - startClientY) / scale;

                      const newStart = { x: origStart.x + dx, y: origStart.y + dy };
                      const newEnd = { x: origEnd.x + dx, y: origEnd.y + dy };

                      const minX = Math.min(newStart.x, newEnd.x);
                      const minY = Math.min(newStart.y, newEnd.y);
                      const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                      const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                      const borderWidth = el.style?.borderWidth ?? 1;
                      const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                      const arrowPad = hasArrow ? borderWidth * 3 : 0;
                      const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                      const newX = minX - strokePadding;
                      const newY = minY - strokePadding;
                      const newWidth = rawWidth + strokePadding * 2;
                      const newHeight = rawHeight + strokePadding * 2;

                      updateLayer(pageIndex, el.id, {
                        x: newX,
                        y: newY,
                        width: newWidth,
                        height: newHeight,
                        style: { ...el.style, start: newStart, end: newEnd }
                      });
                    };

                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };

                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
                {/* Endpoint handles when selected */}
                {isSelected && (
                  <>
                    {/* Rotate handle (top center) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '-28px',
                        transform: 'translateX(-50%)',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        border: '2px solid #6366f1',
                        cursor: 'grab',
                        zIndex: 1002,
                        pointerEvents: 'auto'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                        if (!canvas) return;
                        const rect = canvas.getBoundingClientRect();
                        const centerX = (el.x + el.width / 2) * scale + rect.left;
                        const centerY = (el.y + el.height / 2) * scale + rect.top;
                        const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                        const origRotation = el.rotation ?? 0;

                        const handleMove = (ev: MouseEvent) => {
                          const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
                          const deg = origRotation + (angle - startAngle) * 180 / Math.PI;
                          updateLayer(pageIndex, el.id, { rotation: deg });
                        };

                        const handleUp = () => {
                          document.removeEventListener('mousemove', handleMove);
                          document.removeEventListener('mouseup', handleUp);
                        };

                        document.addEventListener('mousemove', handleMove);
                        document.addEventListener('mouseup', handleUp);
                      }}
                    />

                    {/* Center handle - for moving line/arrow OR controlling curve */}
                    <div
                      style={{
                        position: 'absolute',
                        left: Math.abs(sl) > 0.01 ? `${controlLocalX - 8}px` : `${((startLocalX + endLocalX) / 2) - 8}px`,
                        top: Math.abs(sl) > 0.01 ? `${controlLocalY - 8}px` : `${((startLocalY + endLocalY) / 2) - 8}px`,
                        width: '16px',
                        height: '16px',
                        backgroundColor: Math.abs(sl) > 0.01 ? '#10b981' : '#3b82f6',
                        border: '2px solid white',
                        borderRadius: '4px',
                        cursor: 'grab',
                        pointerEvents: 'auto',
                        zIndex: 1001,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectElement(el.id);

                        // If we just dragged the center control, don't toggle sloppiness on click
                        if (recentCenterDragRef.current.id === el.id && recentCenterDragRef.current.moved) {
                          recentCenterDragRef.current = {};
                          return;
                        }

                        // Click toggles a default sloppiness so users can quickly enable curve mode
                        const currentSl = el.style?.sloppiness ?? 0;
                        if (Math.abs(currentSl) < 0.5) {
                          const newSl = 50; // default curve amount when enabling
                          const start = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                          const end = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                          const midX = (start.x + end.x) / 2;
                          const midY = (start.y + end.y) / 2;
                          const tx = end.x - start.x;
                          const ty = end.y - start.y;
                          const tlen = Math.max(1, Math.hypot(tx, ty));
                          const ntx = tx / tlen;
                          const nty = ty / tlen;
                          const nx = -nty;
                          const ny = ntx;
                          const controlX = midX + nx * newSl;
                          const controlY = midY + ny * newSl;

                          const minX = Math.min(start.x, end.x, controlX);
                          const minY = Math.min(start.y, end.y, controlY);
                          const rawWidth = Math.max(Math.max(start.x, end.x, controlX) - minX, 10);
                          const rawHeight = Math.max(Math.max(start.y, end.y, controlY) - minY, 10);
                          const borderWidth = el.style?.borderWidth ?? 1;
                          const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                          const arrowPad = hasArrow ? borderWidth * 3 : 0;
                          const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                          const newX = minX - strokePadding;
                          const newY = minY - strokePadding;
                          const newWidth = rawWidth + strokePadding * 2;
                          const newHeight = rawHeight + strokePadding * 2;

                          updateLayer(pageIndex, el.id, { x: newX, y: newY, width: newWidth, height: newHeight, style: { ...el.style, sloppiness: newSl } });
                        } else {
                          const newSl = 0;
                          const start = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                          const end = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                          const minX = Math.min(start.x, end.x);
                          const minY = Math.min(start.y, end.y);
                          const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
                          const rawHeight = Math.max(Math.abs(end.y - start.y), 10);
                          const borderWidth = el.style?.borderWidth ?? 1;
                          const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                          const arrowPad = hasArrow ? borderWidth * 3 : 0;
                          const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                          const newX = minX - strokePadding;
                          const newY = minY - strokePadding;
                          const newWidth = rawWidth + strokePadding * 2;
                          const newHeight = rawHeight + strokePadding * 2;

                          updateLayer(pageIndex, el.id, { x: newX, y: newY, width: newWidth, height: newHeight, style: { ...el.style, sloppiness: newSl } });
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const origStart = { ...startPoint };
                        const origEnd = { ...endPoint };
                        const origSloppiness = el.style?.sloppiness ?? 0;

                        // Mode detection: undecided at first, then switch to 'curve' or 'move' based on initial drag direction
                        let mode: 'undetermined' | 'move' | 'curve' = 'undetermined';

                        // Mark this as a center drag attempt so we can suppress a click toggle if the user drags
                        // When switching into 'curve' mode we also expand the element bounding box to include the control point
                        // so the curved path doesn't get clipped by the element's SVG viewport.
                        recentCenterDragRef.current = { id: el.id, moved: false };

                        const handleMove = (ev: MouseEvent) => {
                          const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const mouseX = (ev.clientX - rect.left) / scale;
                          const mouseY = (ev.clientY - rect.top) / scale;

                          const relX = (ev.clientX - startClientX) / scale;
                          const relY = (ev.clientY - startClientY) / scale;

                          // Determine tangent and normal
                          const s = origStart;
                          const ept = origEnd;
                          const tx = ept.x - s.x;
                          const ty = ept.y - s.y;
                          const tlen = Math.max(1, Math.hypot(tx, ty));
                          const ntx = tx / tlen;
                          const nty = ty / tlen;
                          const nx = -nty;
                          const ny = ntx;

                          // If mode is undecided, decide based on initial drag direction after small threshold
                          if (mode === 'undetermined') {
                            if (Math.hypot(relX, relY) < 2 / scale) {
                              return; // wait for more movement
                            }
                            const projT = Math.abs(relX * ntx + relY * nty);
                            const projN = Math.abs(relX * nx + relY * ny);
                            mode = projN > projT ? 'curve' : 'move';
                            // mark that a drag happened (used to suppress click toggle)
                            recentCenterDragRef.current.moved = true;
                          }

                          if (mode === 'curve') {
                            // Curve control: set sloppiness based on perpendicular distance from midpoint and expand bounds
                            const midX = (s.x + ept.x) / 2;
                            const midY = (s.y + ept.y) / 2;
                            const dmx = mouseX - midX;
                            const dmy = mouseY - midY;
                            const newSloppiness = dmx * nx + dmy * ny;

                            const controlX = midX + nx * newSloppiness;
                            const controlY = midY + ny * newSloppiness;
                            const minX = Math.min(s.x, ept.x, controlX);
                            const minY = Math.min(s.y, ept.y, controlY);
                            const maxX = Math.max(s.x, ept.x, controlX);
                            const maxY = Math.max(s.y, ept.y, controlY);
                            const rawWidth = Math.max(Math.abs(maxX - minX), 10);
                            const rawHeight = Math.max(Math.abs(maxY - minY), 10);
                            const borderWidth = el.style?.borderWidth ?? 1;
                            const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                            const arrowPad = hasArrow ? borderWidth * 3 : 0;
                            const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                            const paddedX = minX - strokePadding;
                            const paddedY = minY - strokePadding;
                            const paddedWidth = rawWidth + strokePadding * 2;
                            const paddedHeight = rawHeight + strokePadding * 2;

                            updateLayer(pageIndex, el.id, {
                              x: paddedX,
                              y: paddedY,
                              width: paddedWidth,
                              height: paddedHeight,
                              style: { ...el.style, sloppiness: newSloppiness }
                            });
                          } else {
                            // Move mode
                            const dx = (ev.clientX - startClientX) / scale;
                            const dy = (ev.clientY - startClientY) / scale;

                            const newStart = { x: origStart.x + dx, y: origStart.y + dy };
                            const newEnd = { x: origEnd.x + dx, y: origEnd.y + dy };
                            const minX = Math.min(newStart.x, newEnd.x);
                            const minY = Math.min(newStart.y, newEnd.y);
                            const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                            const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);

                            // Add padding for stroke and curve - ensure minimum padding (include arrow pad)
                            const borderWidth = el.style?.borderWidth ?? 1;
                            const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                            const arrowPad = hasArrow ? borderWidth * 3 : 0;
                            const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
                            const newX = minX - strokePadding;
                            const newY = minY - strokePadding;
                            const newWidth = rawWidth + strokePadding * 2;
                            const newHeight = rawHeight + strokePadding * 2;

                            updateLayer(pageIndex, el.id, {
                              x: newX,
                              y: newY,
                              width: newWidth,
                              height: newHeight,
                              style: { ...el.style, start: newStart, end: newEnd }
                            });
                          }
                        };

                        const handleUp = () => {
                          document.removeEventListener('mousemove', handleMove);
                          document.removeEventListener('mouseup', handleUp);
                          // Clear recent drag marker after click can read it
                          setTimeout(() => { recentCenterDragRef.current = {}; }, 0);
                        };

                        document.addEventListener('mousemove', handleMove);
                        document.addEventListener('mouseup', handleUp);
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: `${startLocalX - 6}px`,
                        top: `${startLocalY - 6}px`,
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#3b82f6',
                        border: '2px solid white',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        zIndex: 1001,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectElement(el.id);
                      }}
                      onMouseDown={(e) => handleEndpointMouseDown(e, 'start')}
                      onTouchStart={(e) => handleEndpointMouseDown(e, 'start')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: `${endLocalX - 6}px`,
                        top: `${endLocalY - 6}px`,
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#3b82f6',
                        border: '2px solid white',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        zIndex: 1001,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectElement(el.id);
                      }}
                      onMouseDown={(e) => handleEndpointMouseDown(e, 'end')}
                      onTouchStart={(e) => handleEndpointMouseDown(e, 'end')}
                    />
                  </>
                )}
              </>
            )}
            {(el.type === 'image' || el.type === 'signature') && el.content && (
              <img
                src={el.content}
                alt="element"
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            )}
            {el.type === 'text' && (
              <div
                className="w-full h-full wrap-break-word outline-none"
                contentEditable={isTextEditing}
                suppressContentEditableWarning
                onBlur={handleBlur}
                onInput={(e) => handleTextChange(e, el.id)}
                onCompositionStart={() => { isComposingRef.current = true; }}
                onCompositionEnd={(e) => {
                  isComposingRef.current = false;
                  const target = e.currentTarget as HTMLDivElement;
                  const caretOffset = getCaretCharacterOffsetWithin(target);
                  requestAnimationFrame(() => setCaretPosition(target, caretOffset));
                }}
                style={{ cursor: isTextEditing ? 'text' : 'inherit' }}
              >
                {el.content}
              </div>
            )}
          </div>
        )
      })}

      {selectedElement && targetRef.current && !isEditing && selectedElement.type !== 'line' && selectedElement.type !== 'arrow' && (
        <Moveable
          target={targetRef.current}
          resizable={true}
          draggable={true}
          rotatable={true}

          // Only show 4 corner resize handles (no edge handles)
          renderDirections={['nw', 'ne', 'sw', 'se']}

          // Square handles instead of circles
          className="moveable-control-box"
          controlPadding={0}

          // Drag
          onDrag={({ target, left, top }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          }}
          onDragEnd={({ target }) => {
            const x = parseFloat(target.style.left || '0') / scale;
            const y = parseFloat(target.style.top || '0') / scale;
            if (selectedElement) updateLayer(pageIndex, selectedElement.id, { x, y });
          }}

          // Resize
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.left = `${drag.left}px`;
            target.style.top = `${drag.top}px`;
          }}
          onResizeEnd={({ target }) => {
            const width = parseFloat(target.style.width || '0') / scale;
            const height = parseFloat(target.style.height || '0') / scale;
            const x = parseFloat(target.style.left || '0') / scale;
            const y = parseFloat(target.style.top || '0') / scale;
            if (selectedElement) {
              if (selectedElement.type === 'circle') {
                // Always maintain perfect circle radius
                const newRadius = Math.min(width, height) / 2;
                updateLayer(pageIndex, selectedElement.id, { width, height, x, y, style: { ...selectedElement.style, borderRadius: newRadius } });
              } else {
                updateLayer(pageIndex, selectedElement.id, { width, height, x, y });
              }
            }
          }}

          // Rotate
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onRotateEnd={({ target, lastEvent }) => {
            if (selectedElement && lastEvent) {
              updateLayer(pageIndex, selectedElement.id, { rotation: lastEvent.rotation });
            }
          }}
        />
      )}

      {/* Separate drag handling for line/arrow via endpoint handles only - no Moveable to avoid jumping */}
    </div>
  );
}
