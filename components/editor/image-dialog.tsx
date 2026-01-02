'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageDialog({ open, onOpenChange }: ImageDialogProps) {
  const { addLayer, currentPage, activeTool, setActiveTool, selectElement } = useEditorStore();
  const [imageUrl, setImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      await addImageToCanvas(result);
    };
    reader.readAsDataURL(file);
  };

  const addImageToCanvas = async (url: string) => {
    // Crop transparent/white borders to remove extra space
    try {
      const { cropImageDataUrl } = await import('@/lib/utils');
      const cropped = await cropImageDataUrl(url, true);
      const naturalW = cropped.width;
      const naturalH = cropped.height;
      const dataUrl = cropped.dataUrl;

      // Cap the displayed pixel size
      const maxPx = 600;
      const displayWpx = Math.min(naturalW, maxPx);
      const displayHpx = Math.round(displayWpx * (naturalH / Math.max(1, naturalW)));

      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;

      const id = crypto.randomUUID();
      const centerX = 100; // default placement
      const centerY = 100;

      addLayer(currentPage, {
        id,
        type: 'image',
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
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
      // Fallback to raw image if cropping fails
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      const displayWpx = Math.min(img.naturalWidth || 200, 600);
      const displayHpx = Math.round(displayWpx * ((img.naturalHeight || 200) / Math.max(1, img.naturalWidth || 200)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      const centerX = 100;
      const centerY = 100;
      addLayer(currentPage, {
        id,
        type: 'image',
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
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
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>Insert Image</DialogTitle>
          </div>
          <DialogDescription>
            Upload an image from your device or paste a URL.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div
            className={cn(
              "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
              dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload-input')?.click()}
          >
            <div className="bg-primary/10 p-4 rounded-none mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>

            <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Drag & drop an image here, or click to select
            </p>

            <Input
              id="image-upload-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or using URL</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={() => imageUrl && addImageToCanvas(imageUrl)}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
