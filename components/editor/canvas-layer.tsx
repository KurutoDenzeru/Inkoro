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

  // Need a way to map ids to refs
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Update targetRef when selection changes
    if (selectedElementId && elementRefs.current[selectedElementId]) {
      targetRef.current = elementRefs.current[selectedElementId]!;
    } else {
      targetRef.current = null;
    }
  }, [selectedElementId, elements]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicking on empty space and tool is active, create element
    // Coordinate calculation needed relative to container
    if (activeTool === 'select') {
      selectElement(null);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;
      if (isEditing) return; // Don't delete if editing text

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Ensure we aren't in an input (though isEditing checks this specific text case)
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;

        if (layers[pageIndex]?.find(el => el.id === selectedElementId)) {
          useEditorStore.getState().removeLayer(pageIndex, selectedElementId);
          selectElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, pageIndex, isEditing, layers]);

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
        const strokeWidth = selectedElement.style?.borderWidth ?? 1;
        const sloppiness = selectedElement.style?.sloppiness ?? 0;
        const strokePadding = Math.max(10, strokeWidth * 2 + sloppiness * 2);
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
                    {el.type === 'arrow' && (
                      <>
                        {el.style.arrowStart && (
                          <marker
                            id={`arrowhead-start-${el.id}`}
                            markerWidth="12"
                            markerHeight="12"
                            refX="6"
                            refY="6"
                            orient="auto"
                          >
                            <polygon points="10 0, 0 6, 10 12" fill={el.style.backgroundColor || '#000000'} />
                          </marker>
                        )}
                        {el.style.arrowEnd && (
                          <marker
                            id={`arrowhead-end-${el.id}`}
                            markerWidth="12"
                            markerHeight="12"
                            refX="6"
                            refY="6"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 6, 0 12" fill={el.style.backgroundColor || '#000000'} />
                          </marker>
                        )}
                      </>
                    )}
                  </defs>

                  {sl && sl > 0 ? (
                    <path
                      d={`M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`}
                      stroke={el.style.backgroundColor || '#000000'}
                      strokeWidth={(el.style.borderWidth ?? 1) * scale}
                      strokeDasharray={
                        el.style.strokeStyle === 'dashed' ? '10, 5' :
                          el.style.strokeStyle === 'dotted' ? '2, 5' :
                            'none'
                      }
                      fill="none"
                      markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : undefined}
                      markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : undefined}
                    />
                  ) : (
                    <line
                      x1={startLocalX}
                      y1={startLocalY}
                      x2={endLocalX}
                      y2={endLocalY}
                      stroke={el.style.backgroundColor || '#000000'}
                      strokeWidth={(el.style.borderWidth ?? 1) * scale}
                      strokeDasharray={
                        el.style.strokeStyle === 'dashed' ? '10, 5' :
                          el.style.strokeStyle === 'dotted' ? '2, 5' :
                            'none'
                      }
                      markerStart={el.type === 'arrow' && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : undefined}
                      markerEnd={el.type === 'arrow' && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : undefined}
                    />
                  )}
                </svg>
                {/* Endpoint handles when selected */}
                {isSelected && (
                  <>
                    {/* Center handle - for moving line/arrow OR controlling curve when sloppiness > 0 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: Math.abs(sl) > 0.5 ? `${controlLocalX - 8}px` : `${((startLocalX + endLocalX) / 2) - 8}px`,
                        top: Math.abs(sl) > 0.5 ? `${controlLocalY - 8}px` : `${((startLocalY + endLocalY) / 2) - 8}px`,
                        width: '16px',
                        height: '16px',
                        backgroundColor: Math.abs(sl) > 0.5 ? '#10b981' : '#3b82f6',
                        border: '2px solid white',
                        borderRadius: '4px',
                        cursor: Math.abs(sl) > 0.5 ? 'grab' : 'move',
                        pointerEvents: 'auto',
                        zIndex: 1001,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectElement(el.id);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const origStart = { ...startPoint };
                        const origEnd = { ...endPoint };
                        const origSloppiness = el.style?.sloppiness ?? 0;

                        const handleMove = (ev: MouseEvent) => {
                          const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const mouseX = (ev.clientX - rect.left) / scale;
                          const mouseY = (ev.clientY - rect.top) / scale;

                          // If sloppiness > 0.5, control the curve; otherwise, move the entire line
                          if (Math.abs(origSloppiness) > 0.5) {
                            // Curve control mode
                            const start = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                            const end = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                            const dx = end.x - start.x;
                            const dy = end.y - start.y;
                            const len = Math.max(1, Math.hypot(dx, dy));
                            const nx = -dy / len;
                            const ny = dx / len;
                            const midX = (start.x + end.x) / 2;
                            const midY = (start.y + end.y) / 2;

                            // Calculate perpendicular distance (can be positive or negative for bidirectional curve)
                            const dmx = mouseX - midX;
                            const dmy = mouseY - midY;
                            const newSloppiness = dmx * nx + dmy * ny;

                            updateLayer(pageIndex, el.id, {
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

                            // Add padding for stroke and curve - ensure minimum padding
                            const strokeWidth = el.style?.borderWidth ?? 1;
                            const sloppiness = el.style?.sloppiness ?? 0;
                            const strokePadding = Math.max(10, strokeWidth * 2 + Math.abs(sloppiness) * 2);
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
