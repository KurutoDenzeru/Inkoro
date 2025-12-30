import { useEditorStore } from "@/lib/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Square,
  Type,
  ImageIcon,
  MousePointer2,
  Download,
  Signature,
  Circle,
  Minus,
  Shapes,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageDialog } from "./image-dialog";
import { SignatureDialog } from "./signature-dialog";
import { DownloadDialog } from "./download-dialog";

export function Toolbar() {
  const {
    currentPage,
    numPages,
    setCurrentPage,
    scale,
    setScale,
    activeTool,
    setActiveTool,
    pdfFile
  } = useEditorStore();

  // Dynamic navigation state
  const prevDisabled = currentPage <= 1;
  const nextDisabled = numPages <= 0 || currentPage >= numPages;

  const handlePrevClick = () => {
    if (!prevDisabled) setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleNextClick = () => {
    if (!nextDisabled) setCurrentPage(Math.min(currentPage + 1, numPages));
  };

  // Helper to style toolbar icon buttons: active selection appears red; hover is red for inactive buttons
  const iconButtonClass = (isActive = false) =>
    cn(
      buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'icon' }),
      "h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all",
      isActive
        ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
        : "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
    );

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.5));

  const handleImageTool = () => {
    setActiveTool('image');
    setImageDialogOpen(true);
  };

  const handleSignatureTool = () => {
    setActiveTool('signature');
    setSignatureDialogOpen(true);
  };

  if (!pdfFile) return null;

  return (
    <TooltipProvider>
      <div className="fixed sm:absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-background/90 dark:bg-background/80 backdrop-blur-md border shadow-lg rounded-full px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-2 z-50">
        <div className="flex items-center gap-1">

          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(activeTool === 'select')}
              onClick={() => setActiveTool('select')}
              title="Select"
              aria-label="Select tool"
            >
              <MousePointer2 className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="hidden sm:block">Select</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(activeTool === 'text')}
              onClick={() => setActiveTool('text')}
              title="Text"
              aria-label="Text tool"
            >
              <Type className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="hidden sm:block">Text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(activeTool === 'image')}
              onClick={handleImageTool}
              title="Image"
              aria-label="Image tool"
            >
              <ImageIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="hidden sm:block">Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(activeTool === 'signature')}
              onClick={handleSignatureTool}
              title="Signature"
              aria-label="Signature tool"
            >
              <Signature className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="hidden sm:block">Signature</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={iconButtonClass(['rect', 'circle', 'line', 'arrow'].includes(activeTool || ''))}
              title="Shapes"
              aria-label="Shapes menu"
            >
              <Shapes className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setActiveTool('rect')}>
                <Square className="h-4 w-4 mr-2" />
                Rectangle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('circle')}>
                <Circle className="h-4 w-4 mr-2" />
                Circle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('line')}>
                <Minus className="h-4 w-4 mr-2" />
                Line
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('arrow')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Arrow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Desktop: Show controls inline */}
        <div className="hidden sm:flex items-center gap-2">
          { /* Page Navigation */ }
          <Tooltip>
            <TooltipTrigger
              className={cn(iconButtonClass(false), prevDisabled && "opacity-50 cursor-not-allowed pointer-events-none")}
              onClick={handlePrevClick}
              disabled={prevDisabled}
              aria-disabled={prevDisabled}
              title="Previous Page"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Previous Page</TooltipContent>
          </Tooltip>

          <span className="text-xs font-medium w-12 text-center select-none">
            {currentPage} / {numPages}
          </span>

          <Tooltip>
            <TooltipTrigger
              className={cn(iconButtonClass(false), nextDisabled && "opacity-50 cursor-not-allowed pointer-events-none")}
              onClick={handleNextClick}
              disabled={nextDisabled}
              aria-disabled={nextDisabled}
              title="Next Page"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Next Page</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="hidden sm:block h-6" />

        <div className="hidden sm:flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(false)}
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <span className="text-xs font-medium w-12 text-center select-none">
            {Math.round(scale * 100)}%
          </span>

          <Tooltip>
            <TooltipTrigger
              className={iconButtonClass(false)}
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="hidden sm:block h-6" />

        <Tooltip>
          <TooltipTrigger
            className={cn(iconButtonClass(false), "hidden sm:flex")}
            onClick={() => setDownloadDialogOpen(true)}
            title="Download"
            aria-label="Download document"
          >
            <Download className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>

        {/* Mobile: Show dropdown menu with controls */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(iconButtonClass(false), "sm:hidden")}
            title="More options"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Page Navigation */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <button
                onClick={handlePrevClick}
                disabled={prevDisabled}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                  prevDisabled 
                    ? "opacity-40 cursor-not-allowed" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} / {numPages}
              </span>
              <button
                onClick={handleNextClick}
                disabled={nextDisabled}
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
                  nextDisabled 
                    ? "opacity-40 cursor-not-allowed" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px bg-border" />

            {/* Zoom Controls */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <button
                onClick={handleZoomOut}
                className="flex items-center justify-center h-8 w-8 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="flex items-center justify-center h-8 w-8 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px bg-border" />

            {/* Download */}
            <DropdownMenuItem onClick={() => setDownloadDialogOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ImageDialog open={imageDialogOpen} onOpenChange={setImageDialogOpen} />
        <SignatureDialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen} />
        <DownloadDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen} />
      </div>
    </TooltipProvider>
  );
}
