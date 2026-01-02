'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Eraser, Upload as UploadIcon, Signature } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignatureDialog({ open, onOpenChange }: SignatureDialogProps) {
  const { addLayer, currentPage, activeTool, setActiveTool, selectElement } = useEditorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    addSignatureToCanvas(dataUrl);
  };

  const addSignatureToCanvas = async (url: string) => {
    try {
      const { cropImageDataUrl } = await import('@/lib/utils');
      const cropped = await cropImageDataUrl(url, true);
      const naturalW = cropped.width;
      const naturalH = cropped.height;
      const dataUrl = cropped.dataUrl;

      // Cap displayed pixel size
      const maxPx = 600;
      const displayWpx = Math.min(naturalW, maxPx);
      const displayHpx = Math.round(displayWpx * (naturalH / Math.max(1, naturalW)));

      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;

      const id = crypto.randomUUID();
      addLayer(currentPage, {
        id,
        type: 'signature', // Treated as image essentially
        x: 100,
        y: 100,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: dataUrl, // Cropped Data URL
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool('select');
      onOpenChange(false);
    } catch (err) {
      // Fallback
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      const displayWpx = Math.min(img.naturalWidth || 150, 600);
      const displayHpx = Math.round(displayWpx * ((img.naturalHeight || 80) / Math.max(1, img.naturalWidth || 150)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      addLayer(currentPage, {
        id,
        type: 'signature',
        x: 100,
        y: 100,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: url,
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool('select');
      onOpenChange(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      addSignatureToCanvas(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Signature className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>Add Signature</DialogTitle>
          </div>
          <DialogDescription>
            Draw your signature or upload an image.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="border rounded-none bg-white touch-none mx-auto overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-60 cursor-crosshair block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                onClick={clearCanvas}
                title="Clear"
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={handleSaveSignature}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Insert Signature
            </Button>
          </TabsContent>

          <TabsContent value="upload">
            <div
              className={cn(
                "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
                dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('sig-upload-input')?.click()}
            >
              <div className="bg-primary/10 p-4 rounded-none mb-4">
                <UploadIcon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Drag & drop a signature image here, or click to select
              </p>

              <Input
                id="sig-upload-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
