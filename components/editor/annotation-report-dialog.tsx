"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildAnnotationReportData,
  renderAnnotationReport,
} from "@/components/pdf/annotation-report";
import { useEditorStore } from "@/lib/store";

interface AnnotationReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnnotationReportDialog({
  open,
  onOpenChange,
}: AnnotationReportDialogProps) {
  const { pdfFile, numPages, layers } = useEditorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const report = useMemo(
    () => buildAnnotationReportData(pdfFile, numPages, layers),
    [layers, numPages, pdfFile]
  );

  const handleDownload = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      const bytes = await renderAnnotationReport(report);
      const pdfBuffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(pdfBuffer).set(bytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "inkoro-annotation-report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to generate the report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            Inkoro annotation report
          </DialogTitle>
          <DialogDescription>
            Generate a separate PDF summary from the current annotation session.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Document</p>
            <p className="mt-1 truncate text-sm font-medium">{report.documentName}</p>
          </div>
          <div className="border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">Annotations</p>
            <p className="mt-1 text-sm font-medium">{report.totalAnnotations}</p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!pdfFile ? (
          <p className="text-xs text-muted-foreground">
            Load a PDF in the editor before generating a report.
          </p>
        ) : null}

        <DialogFooter>
          <Button onClick={handleDownload} disabled={isGenerating || !pdfFile}>
            {isGenerating ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {isGenerating ? "Generating report..." : "Download report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
