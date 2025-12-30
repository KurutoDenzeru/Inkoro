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
          newElement = {
            id, type: 'line', x, y, width: 150, height: 2, rotation: 0,
            style: { backgroundColor: '#000000', opacity: 1 }
          };
      } else if (activeTool === 'arrow') {
          newElement = {
            id, type: 'arrow', x, y, width: 150, height: 2, rotation: 0,
            style: { backgroundColor: '#000000', opacity: 1, arrowEnd: true }
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
      }
  };
  
  const handleTextChange = (e: React.FormEvent<HTMLDivElement>, id: string) => {
      const newContent = e.currentTarget.innerText;
      updateLayer(pageIndex, id, { content: newContent });
  };
  
  const handleBlur = () => {
      setIsEditing(false);
  };

  // Line/Arrow endpoint dragging
  const handleEndpointMouseDown = (e: React.MouseEvent, endpoint: 'start' | 'end') => {
      e.stopPropagation();
      setDraggingEndpoint(endpoint);
  };

  useEffect(() => {
      if (!draggingEndpoint || !selectedElement || (selectedElement.type !== 'line' && selectedElement.type !== 'arrow')) return;

      const handleMouseMove = (e: MouseEvent) => {
          const canvas = document.querySelector('.absolute.inset-0.z-20') as HTMLElement;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          const mouseX = (e.clientX - rect.left) / scale;
          const mouseY = (e.clientY - rect.top) / scale;

          // Calculate line from start to end point
          const startX = selectedElement.x;
          const startY = selectedElement.y + selectedElement.height / 2;
          const endX = selectedElement.x + selectedElement.width;
          const endY = selectedElement.y + selectedElement.height / 2;

          let newStartX = startX;
          let newStartY = startY;
          let newEndX = endX;
          let newEndY = endY;

          if (draggingEndpoint === 'start') {
              newStartX = mouseX;
              newStartY = mouseY;
          } else {
              newEndX = mouseX;
              newEndY = mouseY;
          }

          // Calculate new position, width, height
          const newX = Math.min(newStartX, newEndX);
          const newY = Math.min(newStartY, newEndY);
          const newWidth = Math.abs(newEndX - newStartX);
          const newHeight = Math.abs(newEndY - newStartY);

          // For horizontal/near-horizontal lines, keep height minimal
          const finalHeight = newHeight < 5 ? 2 : newHeight;

          updateLayer(pageIndex, selectedElement.id, {
              x: newX,
              y: newY,
              width: newWidth,
              height: finalHeight,
          });
      };

      const handleMouseUp = () => {
          setDraggingEndpoint(null);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
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
                backgroundColor: el.type === 'line' ? 'transparent' : (['rect', 'circle'].includes(el.type) ? el.style.backgroundColor : (el.style.backgroundColor || 'transparent')),
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
                outline: (isSelected && !isEditing) ? '2px solid #3b82f6' : 'none', 
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
                                        markerWidth="10"
                                        markerHeight="10"
                                        refX="0"
                                        refY="5"
                                        orient="auto-start-reverse"
                                    >
                                        <polygon points="10 0, 10 10, 0 5" fill={el.style.backgroundColor || '#000000'} />
                                    </marker>
                                )}
                                {el.style.arrowEnd && (
                                    <marker
                                        id={`arrowhead-end-${el.id}`}
                                        markerWidth="10"
                                        markerHeight="10"
                                        refX="10"
                                        refY="5"
                                        orient="auto"
                                    >
                                        <polygon points="0 0, 10 5, 0 10" fill={el.style.backgroundColor || '#000000'} />
                                    </marker>
                                )}
                            </>
                        )}
                    </defs>
                    {el.style.sloppiness && el.style.sloppiness > 0 ? (
                        <path
                            d={`M 0 ${el.height * scale / 2} Q ${el.width * scale / 2} ${(el.height * scale / 2) - (el.style.sloppiness * scale)}, ${el.width * scale} ${el.height * scale / 2}`}
                            stroke={el.style.backgroundColor || '#000000'}
                            strokeWidth={el.style.borderWidth ?? 2}
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
                            x1="0"
                            y1={el.height * scale / 2}
                            x2={el.width * scale}
                            y2={el.height * scale / 2}
                            stroke={el.style.backgroundColor || '#000000'}
                            strokeWidth={el.style.borderWidth ?? 2}
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
                        <div
                            style={{
                                position: 'absolute',
                                left: '-6px',
                                top: `${(el.height * scale / 2) - 6}px`,
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#3b82f6',
                                border: '2px solid white',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                zIndex: 1001,
                            }}
                            onMouseDown={(e) => handleEndpointMouseDown(e, 'start')}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                left: `${el.width * scale - 6}px`,
                                top: `${(el.height * scale / 2) - 6}px`,
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#3b82f6',
                                border: '2px solid white',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                zIndex: 1001,
                            }}
                            onMouseDown={(e) => handleEndpointMouseDown(e, 'end')}
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
                    style={{ cursor: isTextEditing ? 'text' : 'inherit' }}
                >
                    {el.content}
                </div>
            )}
        </div>
      )})}
      
      {selectedElement && targetRef.current && !isEditing && selectedElement.type !== 'line' && selectedElement.type !== 'arrow' && (
          <Moveable
            target={targetRef.current}
            resizable={true}
            draggable={true}
            rotatable={true}
            
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
                 if (selectedElement) updateLayer(pageIndex, selectedElement.id, { width, height, x, y });
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
      
      {/* Separate Moveable for line/arrow - only dragging */}
      {selectedElement && targetRef.current && !isEditing && (selectedElement.type === 'line' || selectedElement.type === 'arrow') && (
          <Moveable
            target={targetRef.current}
            draggable={true}
            
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
          />
      )}
    </div>
  );
}
