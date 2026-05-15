'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "@/lib/pdf-setup";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/lib/store";
import { savePdf } from "@/lib/pdf-utils";
import { Download, ZoomIn, ZoomOut, FileText, Image, Settings2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { PreviewLayer } from "./preview-layer";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DownloadDialog({ open, onOpenChange }: DownloadDialogProps) {
  const { pdfFile, numPages, currentPage, pageDimensions } = useEditorStore();
  const isMobile = useIsMobile();

  // Export settings
  const [filename, setFilename] = useState("edited-document");
  const [format, setFormat] = useState<"pdf" | "png" | "jpeg">("pdf");
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2);
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Metadata fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");

  // Preview state
  const [previewPage, setPreviewPage] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  const STORAGE_KEY = "inkoro-download-metadata";

  // Reset preview page when dialog opens
  useEffect(() => {
    if (open) {
      setPreviewPage(1);
      setPreviewZoom(1);
      setPdfLoadError(null);
    }
  }, [open]);

  // Prefill metadata when dialog opens
  useEffect(() => {
    let cancelled = false;
    async function loadMetadata() {
      if (!open) return;

      try {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const saved = JSON.parse(raw);
            setFilename(saved.filename ?? "edited-document");
            setTitle(saved.title ?? "");
            setAuthor(saved.author ?? "");
            setSubject(saved.subject ?? "");
            setKeywordsInput(saved.keywords ?? "");
            return;
          }
        } catch (e) {
          // ignore localStorage parse errors
        }

        if (!pdfFile) {
          setTitle("");
          setAuthor("");
          setSubject("");
          setKeywordsInput("");
          return;
        }

        const buffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);

        if (cancelled) return;

        setTitle(pdfDoc.getTitle() ?? "");
        setAuthor(pdfDoc.getAuthor() ?? "");
        setSubject(pdfDoc.getSubject() ?? "");

        const rawKeywords = pdfDoc.getKeywords() ?? "";
        const kw = rawKeywords ? rawKeywords.split(/\s+/).join(", ") : "";
        setKeywordsInput(kw);
      } catch (err) {
        console.error("Failed to read PDF metadata", err);
      }
    }

    loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [open, pdfFile]);

  const triggerDownload = (uint8: Uint8Array, name: string) => {
    const blob = new Blob([uint8.buffer as ArrayBuffer], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedFilename = name?.trim()
      ? name.toLowerCase().endsWith(".pdf")
        ? name.trim()
        : `${name.trim()}.pdf`
      : "edited_document.pdf";
    link.download = sanitizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const keywordsArray = keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            filename,
            title,
            author,
            subject,
            keywords: keywordsInput,
          })
        );
      } catch (e) {
        /* ignore storage errors */
      }

      const bytes = (await savePdf({
        filename,
        title: title || undefined,
        author: author || undefined,
        subject: subject || undefined,
        keywords: keywordsArray.length ? keywordsArray : undefined,
        returnBytes: true,
      })) as Uint8Array | undefined;

      if (!bytes) throw new Error("Failed to generate PDF");

      triggerDownload(bytes, filename);
      onOpenChange(false);
    } catch (error) {
      console.error("Download failed:", error);
      try {
        const { toast } = await import("sonner");
        toast("Download failed. See console for details.");
      } catch {}
    } finally {
      setIsDownloading(false);
    }
  };

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: loadedPages }: { numPages: number }) => {
      // numPages already in store
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    setPdfLoadError(error.message);
  }, []);

  const pageDim = pageDimensions[previewPage];
  const previewWidth = pageDim ? pageDim.width : 612;

  // Checkerboard pattern for preview background
  const checkerboardStyle = {
    backgroundImage:
      "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };

  const darkCheckerboardStyle = {
    backgroundImage:
      "linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  };

  // Desktop layout
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-none w-[90vw] !w-[90vw] h-[85vh] !h-[85vh] max-h-[900px] !max-h-[900px] p-0 gap-0 overflow-hidden">
          <div className="flex h-full">
            {/* Left: Preview Area */}
            <div className="flex-1 flex flex-col border-r">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
                <DialogHeader className="gap-0">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <DialogTitle>Export</DialogTitle>
                  </div>
                  <DialogDescription>Preview your document before exporting</DialogDescription>
                </DialogHeader>
              </div>

              {/* Preview Canvas */}
              <div
                className="flex-1 overflow-hidden relative"
                style={checkerboardStyle}
              >
                <div className="flex items-center justify-center h-full p-6">
                  {pdfFile ? (
                    <div
                      className="bg-white shadow-2xl transition-transform duration-200 max-h-full max-w-full"
                      style={{
                        transform: `scale(${previewZoom})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex items-center justify-center w-[500px] h-[650px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        }
                      >
                        <Page
                          pageNumber={previewPage}
                          width={500}
                          className="bg-white"
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        >
                          <PreviewLayer
                            pageIndex={previewPage}
                            scale={500 / (pageDim?.width || 612)}
                            pageWidth={pageDim?.width || 612}
                            pageHeight={pageDim?.height || 792}
                          />
                        </Page>
                      </Document>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <FileText className="h-12 w-12 opacity-50" />
                      <p className="text-sm">No document loaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Footer: Page Navigation + Zoom */}
              {pdfFile && numPages > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-t bg-card">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}
                      disabled={previewPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs tabular-nums min-w-[80px] text-center">
                      Page {previewPage} of {numPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewPage(Math.min(numPages, previewPage + 1))}
                      disabled={previewPage >= numPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewZoom((z) => Math.max(0.25, z - 0.25))}
                      disabled={previewZoom <= 0.25}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs tabular-nums min-w-[50px] justify-center">
                      {Math.round(previewZoom * 100)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewZoom((z) => Math.min(3, z + 0.25))}
                      disabled={previewZoom >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Settings Panel */}
            <div className="w-80 flex flex-col bg-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Export Settings</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Format */}
                <div className="space-y-2">
                  <Label>Format</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["pdf", "png", "jpeg"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={cn(
                          "px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
                          format === f
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* File Name */}
                <div className="space-y-2">
                  <Label htmlFor="filename">File Name</Label>
                  <Input
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="edited-document"
                  />
                </div>

                {format !== "pdf" && (
                  <>
                    <Separator />

                    {/* Quality */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Quality</Label>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {quality}%
                        </span>
                      </div>
                      <Slider
                        value={[quality]}
                        onValueChange={([v]) => setQuality(v)}
                        min={10}
                        max={100}
                        step={5}
                      />
                    </div>

                    <Separator />

                    {/* Scale */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Scale</Label>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {scale}x
                        </span>
                      </div>
                      <Slider
                        value={[scale]}
                        onValueChange={([v]) => setScale(v)}
                        min={1}
                        max={4}
                        step={0.5}
                      />
                    </div>
                  </>
                )}

                <Separator />

                {/* Include Annotations */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="annotations" className="cursor-pointer">
                    Include Annotations
                  </Label>
                  <Switch
                    id="annotations"
                    checked={includeAnnotations}
                    onCheckedChange={setIncludeAnnotations}
                  />
                </div>

                <Separator />

                {/* Metadata Section */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Metadata
                  </Label>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Document title"
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-xs">Author</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name"
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-xs">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Comma-separated keywords"
                      value={keywordsInput}
                      onChange={(e) => setKeywordsInput(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-2">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || !pdfFile}
                  className="w-full"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export {format.toUpperCase()}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDownloading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile layout: full-screen with preview on top, settings below
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0 gap-0" showCloseButton={false}>
        {/* Top: Preview */}
        <div className="h-[45vh] flex flex-col border-b">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <DialogTitle className="text-sm">Export</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
            >
              <span className="sr-only">Close</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Button>
          </div>

          {/* Preview */}
          <div
            className="flex-1 overflow-auto relative"
            style={darkCheckerboardStyle}
          >
            <div className="flex items-center justify-center min-h-full p-4">
              {pdfFile ? (
                <div
                  className="bg-white shadow-lg transition-transform duration-200"
                  style={{
                    transform: `scale(${previewZoom})`,
                    transformOrigin: "center center",
                  }}
                >
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center w-[300px] h-[400px]">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    }
                  >
                    <Page
                      pageNumber={previewPage}
                      width={300}
                      className="bg-white"
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    >
                      <PreviewLayer
                        pageIndex={previewPage}
                        scale={300 / (pageDim?.width || 612)}
                        pageWidth={pageDim?.width || 612}
                        pageHeight={pageDim?.height || 792}
                      />
                    </Page>
                  </Document>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="h-8 w-8 opacity-50" />
                  <p className="text-xs">No document loaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Page Navigation */}
          {pdfFile && numPages > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-t bg-card">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}
                disabled={previewPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs tabular-nums">
                {previewPage} / {numPages}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPreviewPage(Math.min(numPages, previewPage + 1))}
                disabled={previewPage >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom: Settings */}
        <div className="h-[55vh] flex flex-col bg-card">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b">
            {(["pdf", "png", "jpeg"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors",
                  format === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Scrollable Settings */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* File Name */}
            <div className="space-y-2">
              <Label htmlFor="filename-mobile">File Name</Label>
              <Input
                id="filename-mobile"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="edited-document"
              />
            </div>

            {format !== "pdf" && (
              <>
                {/* Quality */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Quality</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {quality}%
                    </span>
                  </div>
                  <Slider
                    value={[quality]}
                    onValueChange={([v]) => setQuality(v)}
                    min={10}
                    max={100}
                    step={5}
                  />
                </div>

                {/* Scale */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Scale</Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {scale}x
                    </span>
                  </div>
                  <Slider
                    value={[scale]}
                    onValueChange={([v]) => setScale(v)}
                    min={1}
                    max={4}
                    step={0.5}
                  />
                </div>
              </>
            )}

            {/* Include Annotations */}
            <div className="flex items-center justify-between">
              <Label htmlFor="annotations-mobile" className="cursor-pointer">
                Include Annotations
              </Label>
              <Switch
                id="annotations-mobile"
                checked={includeAnnotations}
                onCheckedChange={setIncludeAnnotations}
              />
            </div>

            <Separator />

            {/* Metadata */}
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Metadata
              </Label>

              <div className="space-y-2">
                <Label htmlFor="title-mobile" className="text-xs">Title</Label>
                <Input
                  id="title-mobile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-mobile" className="text-xs">Author</Label>
                <Input
                  id="author-mobile"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject-mobile" className="text-xs">Subject</Label>
                <Input
                  id="subject-mobile"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords-mobile" className="text-xs">Keywords</Label>
                <Input
                  id="keywords-mobile"
                  placeholder="Comma-separated keywords"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || !pdfFile}
              className="w-full"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
