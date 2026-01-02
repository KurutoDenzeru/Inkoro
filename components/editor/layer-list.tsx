'use client';

import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, Type, Square, Image as ImageIcon, Circle, Minus, ArrowRight, PenLine } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

function SortableItem(props: { id: string; type: string; selected: boolean; onClick: () => void; onDelete: (e: React.MouseEvent) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'signature': return PenLine;
      case 'rect': return Square;
      case 'circle': return Circle;
      case 'line': return Minus;
      case 'arrow': return ArrowRight;
      default: return Square;
    }
  };

  const Icon = getIcon(props.type);

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "flex items-center gap-2 p-2 rounded-md mb-2 bg-card border",
      props.selected ? "border-primary bg-primary/5" : "hover:bg-accent"
    )}>
      <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 flex items-center gap-2 cursor-pointer" onClick={props.onClick}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium capitalize">{props.type}</span>
      </div>
      <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={props.onDelete}>
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function LayerList() {
  const { layers, currentPage, reorderLayers, selectedElementId, selectElement, removeLayer } = useEditorStore();
  const elements = layers[currentPage] || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over.id);

      reorderLayers(currentPage, arrayMove(elements, oldIndex, newIndex));
    }
  }

  if (elements.length === 0) {
    return <div className="text-center text-muted-foreground py-8 text-sm">No layers on this page</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={elements.map(e => e.id)}
        strategy={verticalListSortingStrategy}
      >
        {elements.slice().reverse().map((el) => ( // Reverse because Canvas renders bottom-up (first is back), Layers usually show Top first.
          // Wait, drag and drop usually implies visual order. 
          // If we reverse for display, we must handle indices carefully.
          // Let's keep it 1:1 for now to avoid confusion. First in array = Bottom layer.
          // So default map is fine (Top of list = Bottom layer). 
          // Usually Layers panel shows Top Layer at the TOP. 
          // So we SHOULD reverse.
          <SortableItem
            key={el.id}
            id={el.id}
            type={el.type}
            selected={el.id === selectedElementId}
            onClick={() => selectElement(el.id)}
            onDelete={(e) => { e.stopPropagation(); removeLayer(currentPage, el.id); }}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
