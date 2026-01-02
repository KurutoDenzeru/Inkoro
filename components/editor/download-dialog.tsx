'use client';

import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useEditorStore } from "@/lib/store";
import { savePdf } from "@/lib/pdf-utils";
import { Download } from "lucide-react";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DownloadDialog({ open, onOpenChange }: DownloadDialogProps) {
  const { pdfFile } = useEditorStore();
  const [filename, setFilename] = useState("edited-document");
  const [format, setFormat] = useState<"pdf" | "png" | "jpeg">("pdf");
  const [isDownloading, setIsDownloading] = useState(false);

  // Metadata fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [displayDocTitle, setDisplayDocTitle] = useState(false);
  const [fastWebView, setFastWebView] = useState(false);

  // Prefill metadata when dialog opens
  useEffect(() => {
    let cancelled = false;
    async function loadMetadata() {
      if (!open || !pdfFile) {
        setTitle("");
        setAuthor("");
        setSubject("");
        setKeywordsInput("");
        setDisplayDocTitle(false);
        setFastWebView(false);
        return;
      }

      try {
        const buffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);

        if (cancelled) return;

        setTitle(pdfDoc.getTitle() ?? "");
        setAuthor(pdfDoc.getAuthor() ?? "");
        setSubject(pdfDoc.getSubject() ?? "");

        // pdf-lib stores keywords as a single string; convert to a comma separated list for the UI
        const rawKeywords = pdfDoc.getKeywords() ?? "";
        const kw = rawKeywords ? rawKeywords.split(/\s+/).join(', ') : '';
        setKeywordsInput(kw);

        try {
          // viewer preferences (display doc title) is accessible via catalog
          const viewerPrefs = (pdfDoc as any).catalog?.getOrCreateViewerPreferences?.();
          const display = viewerPrefs?.getDisplayDocTitle?.() ?? false;
          setDisplayDocTitle(Boolean(display));
        } catch {
          setDisplayDocTitle(false);
        }
      } catch (err) {
        console.error('Failed to read PDF metadata', err);
      }
    }

    loadMetadata();
    return () => { cancelled = true; };
  }, [open, pdfFile]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (fastWebView) {
        // Inform user that true linearization isn't supported client-side
        try {
          const { toast } = await import('sonner');
          toast('Fast Web View (linearization) cannot be performed client-side and will be ignored.');
        } catch (e) { /* ignore toast errors */ }
      }

      const keywordsArray = keywordsInput.split(',').map((k) => k.trim()).filter(Boolean);

      await savePdf({
        filename,
        title: title || undefined,
        author: author || undefined,
        subject: subject || undefined,
        keywords: keywordsArray.length ? keywordsArray : undefined,
        showInWindowTitleBar: displayDocTitle,
        fastWebView,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>Download Document</DialogTitle>
          </div>
          <DialogDescription>
            Configure your export settings before downloading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="edited-document"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input id="keywords" placeholder="Comma-separated keywords" value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="display-title" checked={displayDocTitle} onCheckedChange={(c) => setDisplayDocTitle(Boolean(c))} />
              <Label htmlFor="display-title" className="text-xs">Display document title in window title bar</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="fast-web" checked={fastWebView} onCheckedChange={(c) => setFastWebView(Boolean(c))} />
              <Label htmlFor="fast-web" className="text-xs">Fast Web View (Linearize) <span className="text-muted-foreground text-[11px]">(Not supported client-side)</span></Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
