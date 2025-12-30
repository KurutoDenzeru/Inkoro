'use client';

import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  X,
  Type
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function PropertiesPanel() {
  const { layers, currentPage, selectedElementId, updateLayer, removeLayer, selectElement } = useEditorStore();
  const isMobile = useIsMobile();

  const element = layers[currentPage]?.find(el => el.id === selectedElementId);

  if (!element) return null;

  const handleStyleChange = (key: string, value: any) => {
    updateLayer(currentPage, element.id, {
      style: { ...element.style, [key]: value }
    });
  };

  const handleDelete = () => {
    removeLayer(currentPage, element.id);
    selectElement(null);
  };

  const toggleStyle = (key: 'fontWeight' | 'fontStyle' | 'textDecoration', value: string) => {
    const current = element.style[key];
    // If current is the value, unset it (normal/none), else set it
    // Simple toggles:
    if (key === 'fontWeight') {
      handleStyleChange(key, current === 'bold' ? 'normal' : 'bold');
    } else if (key === 'fontStyle') {
      handleStyleChange(key, current === 'italic' ? 'normal' : 'italic');
    } else if (key === 'textDecoration') {
      handleStyleChange(key, current === 'underline' ? 'none' : 'underline');
    }
  };

  // Properties panel content (shared between mobile and desktop)
  const panelContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {element.type === 'text' && <Type className="h-4 w-4 text-muted-foreground" />}
          <h4 className="font-semibold text-sm capitalize">{element.type} Properties</h4>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon-sm" onClick={() => selectElement(null)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      {element.type === 'text' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Content</Label>
            <Input
              value={element.content || ''}
              onChange={(e) => updateLayer(currentPage, element.id, { content: e.target.value })}
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Font</Label>
              <Select
                value={element.style.fontFamily || 'Inter'}
                onValueChange={(val) => handleStyleChange('fontFamily', val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Size</Label>
              <Input
                type="number"
                value={element.style.fontSize || 16}
                onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md p-1 bg-muted/20 gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.fontWeight === 'bold' ? 'bg-background' : ''}`}
                onClick={() => toggleStyle('fontWeight', 'bold')}
              >
                <Bold className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.fontStyle === 'italic' ? 'bg-background' : ''}`}
                onClick={() => toggleStyle('fontStyle', 'italic')}
              >
                <Italic className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.textDecoration === 'underline' ? 'bg-background' : ''}`}
                onClick={() => toggleStyle('textDecoration', 'underline')}
              >
                <Underline className="h-3 w-3" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <div className="flex items-center border rounded-md p-1 bg-muted/20 gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.textAlign === 'left' ? 'bg-background' : ''}`}
                onClick={() => handleStyleChange('textAlign', 'left')}
              >
                <AlignLeft className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.textAlign === 'center' ? 'bg-background' : ''}`}
                onClick={() => handleStyleChange('textAlign', 'center')}
              >
                <AlignCenter className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${element.style.textAlign === 'right' ? 'bg-background' : ''}`}
                onClick={() => handleStyleChange('textAlign', 'right')}
              >
                <AlignRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.color || '#000000'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.backgroundColor || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {element.type === 'rect' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Fill</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.backgroundColor || '#transparent'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.backgroundColor || 'None'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Stroke</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.borderColor || '#000000'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.borderColor || 'None'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Stroke Width</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.style.borderWidth ?? 0]}
                max={20}
                step={1}
                onValueChange={(vals) => {
                  const value = Array.isArray(vals) ? vals[0] : vals;
                  handleStyleChange('borderWidth', value);
                }}
                className="flex-1"
              />
              <span className="w-8 text-xs text-right text-muted-foreground">{element.style.borderWidth ?? 0}px</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Corner Radius</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.style.borderRadius ?? 0]}
                max={100}
                step={1}
                onValueChange={(vals) => {
                  const value = Array.isArray(vals) ? vals[0] : vals;
                  handleStyleChange('borderRadius', value);
                }}
                className="flex-1"
              />
              <span className="w-8 text-xs text-right text-muted-foreground">{element.style.borderRadius ?? 0}px</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.style.opacity ?? 1]}
                max={1}
                step={0.1}
                onValueChange={(vals) => {
                  const value = Array.isArray(vals) ? vals[0] : vals;
                  handleStyleChange('opacity', value);
                }}
                className="flex-1"
              />
              <span className="w-8 text-xs text-right text-muted-foreground">{Math.round((element.style.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {element.type === 'circle' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Fill</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.backgroundColor || '#transparent'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.backgroundColor || 'None'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Stroke</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.borderColor || '#000000'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.borderColor || 'None'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Stroke Width</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={element.style.borderWidth === 1 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 1)}
              >
                Thin
              </Button>
              <Button
                type="button"
                variant={element.style.borderWidth === 3 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 3)}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={element.style.borderWidth === 6 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 6)}
              >
                Thick
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.style.opacity ?? 1]}
                max={1}
                step={0.1}
                onValueChange={(vals) => {
                  const value = Array.isArray(vals) ? vals[0] : vals;
                  handleStyleChange('opacity', value);
                }}
                className="flex-1"
              />
              <span className="w-8 text-xs text-right text-muted-foreground">{Math.round((element.style.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {(element.type === 'line' || element.type === 'arrow') && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Stroke</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.backgroundColor || '#000000'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.backgroundColor || '#000000'}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-background">
                <input
                  type="color"
                  value={element.style.borderColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase">
                  {element.style.borderColor || 'None'}
                </span>
              </div>
            </div>
          </div>

          {element.type === 'arrow' && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Arrow Heads</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={element.style.arrowStart ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStyleChange('arrowStart', !element.style.arrowStart)}
                >
                  Start
                </Button>
                <Button
                  type="button"
                  variant={element.style.arrowEnd ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStyleChange('arrowEnd', !element.style.arrowEnd)}
                >
                  End
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Stroke Width</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={(element.style.borderWidth ?? 1) === 1 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 1)}
              >
                Thin
              </Button>
              <Button
                type="button"
                variant={(element.style.borderWidth ?? 1) === 3 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 3)}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={(element.style.borderWidth ?? 1) === 6 ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('borderWidth', 6)}
              >
                Thick
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Stroke Style</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={element.style.strokeStyle === 'solid' || !element.style.strokeStyle ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('strokeStyle', 'solid')}
              >
                Solid
              </Button>
              <Button
                type="button"
                variant={element.style.strokeStyle === 'dashed' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('strokeStyle', 'dashed')}
              >
                Dashed
              </Button>
              <Button
                type="button"
                variant={element.style.strokeStyle === 'dotted' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => handleStyleChange('strokeStyle', 'dotted')}
              >
                Dotted
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Curved Line</Label>
              <Switch
                checked={(element.style.sloppiness ?? 0) > 0}
                onCheckedChange={(checked) => {
                  handleStyleChange('sloppiness', checked ? 50 : 0);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[element.style.opacity ?? 1]}
                max={1}
                step={0.1}
                onValueChange={(vals) => {
                  const value = Array.isArray(vals) ? vals[0] : vals;
                  handleStyleChange('opacity', value);
                }}
                className="flex-1"
              />
              <span className="w-8 text-xs text-right text-muted-foreground">{Math.round((element.style.opacity ?? 1) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {element.type === 'image' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Top Left</Label>
              <Input
                type="number"
                value={element.style.borderTopLeftRadius ?? element.style.borderRadius ?? 0}
                onChange={(e) => handleStyleChange('borderTopLeftRadius', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Top Right</Label>
              <Input
                type="number"
                value={element.style.borderTopRightRadius ?? element.style.borderRadius ?? 0}
                onChange={(e) => handleStyleChange('borderTopRightRadius', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bottom Left</Label>
              <Input
                type="number"
                value={element.style.borderBottomLeftRadius ?? element.style.borderRadius ?? 0}
                onChange={(e) => handleStyleChange('borderBottomLeftRadius', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bottom Right</Label>
              <Input
                type="number"
                value={element.style.borderBottomRightRadius ?? element.style.borderRadius ?? 0}
                onChange={(e) => handleStyleChange('borderBottomRightRadius', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {element.type === 'signature' && (
        // Signature only has delete option as requested
        <div className="text-xs text-muted-foreground mb-4">
          Signature selected
        </div>
      )}

      <Separator />

      <div className="flex gap-2">
        <Button variant="destructive" className="w-full text-xs" onClick={handleDelete}>
          <Trash2 className="h-3 w-3 mr-2" /> Delete Layer
        </Button>
      </div>    </>
  );

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <Sheet open={!!element} onOpenChange={(open) => !open && selectElement(null)}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {element.type === 'text' && <Type className="h-4 w-4" />}
              <span className="capitalize">{element.type} Properties</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            {panelContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Floating panel
  return (
    <div className="absolute top-20 right-4 z-40 w-72 bg-background/95 backdrop-blur shadow-xl border rounded-lg p-4 flex flex-col gap-4 animate-in slide-in-from-right-10 fade-in duration-200">
      {panelContent}    </div>
  );
}
