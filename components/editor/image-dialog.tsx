'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
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
    reader.onload = (e) => {
      const result = e.target?.result as string;
      addImageToCanvas(result);
    };
    reader.readAsDataURL(file);
  };

  const addImageToCanvas = (url: string) => {
    const id = crypto.randomUUID();
    addLayer(currentPage, {
      id,
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
      content: url, // Data URL
      style: { opacity: 1 }
    });
    selectElement(id);
    setActiveTool('select');
    onOpenChange(false);
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
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload-input')?.click()}
          >
            <ImageIcon className="h-10 w-10 text-primary mb-4" />
            <p className="text-sm text-muted-foreground text-center">
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
