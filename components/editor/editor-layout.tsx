'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDialog } from "./upload-dialog";
import { Layers, FileText, PanelLeftOpen, Menu, Download, RefreshCw, Trash2, Undo, Redo, Info, Sun, Moon, Monitor, Copy, Clipboard, ZoomIn, ZoomOut } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { LayerList } from "./layer-list";
import { ThumbnailList } from "./thumbnail-list";
import { PDFViewer } from "./pdf-viewer";
import { Toolbar } from "./toolbar";
import { PropertiesPanel } from "./properties-panel";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { DownloadDialog } from "./download-dialog";
import { AboutDialog } from "@/components/ui/about-dialog";
import { useDialogStore } from "@/hooks/use-dialogs";
import { useTheme } from "next-themes";

function SidebarToggleButton({ setDownloadDialogOpen }: { setDownloadDialogOpen: (open: boolean) => void }) {
  const { state, toggleSidebar } = useSidebar();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  if (state === "expanded") return null;

  return (
    <TooltipProvider delay={100}>
      <div className="absolute top-4 left-4 z-50 bg-background/95 backdrop-blur shadow-xl border rounded-none px-3 py-2 flex items-center gap-3 animate-in slide-in-from-left-10 fade-in duration-200">
        <div className="flex items-center gap-2">
          <img src="/brand.webp" alt="Inkoro" className="h-6 w-6 object-contain" />
          <span className="font-bold text-sm whitespace-nowrap">Inkoro</span>
        </div>

        <div className="h-6 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            onClick={toggleSidebar}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span>Expand Sidebar</span>
              <KbdGroup>
                <Kbd>{modKey}</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border" />

        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger
              nativeButton
              render={<TooltipTrigger />}
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            >
              <Menu className="h-4 w-4" />
            </DropdownMenuTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
          <SidebarMenuContent onDownload={() => setDownloadDialogOpen(true)} />
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

function SidebarMenuContent({ onDownload }: { onDownload: () => void }) {
  const { isMobile } = useSidebar();
  const { currentPage, history, undo, redo, scale, setScale } = useEditorStore();
  const setAboutOpen = useDialogStore((s) => s.setAboutOpen);
  const { setTheme } = useTheme();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';
  const redoKeys = isMac ? ['⌘', 'Shift', 'Z'] : ['Ctrl', 'Y'];
  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.5));

  return (
    <DropdownMenuContent align="start" className="min-w-64 w-72 max-w-[90vw]">
      <DropdownMenuGroup>
        <DropdownMenuLabel>File</DropdownMenuLabel>
      </DropdownMenuGroup>

      <Tooltip>
        <DropdownMenuItem nativeButton render={<TooltipTrigger />} onClick={() => onDownload()}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Download</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem nativeButton render={<TooltipTrigger />} onClick={() => {
          if (confirm('Start a new session? This will clear everything.')) {
            // Clear persisted session and the loaded PDF so the Upload dialog appears
            try {
              useEditorStore.getState().clearSession();
              useEditorStore.setState({ pdfFile: null, pdfUrl: null, layers: {}, selectedElementId: null, numPages: 0, currentPage: 1 });
            } catch (e) {
              // As a fallback, do a hard reload if store clearing fails
              window.location.reload();
            }
          }
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          New Session
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>New Session</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem nativeButton render={<TooltipTrigger />} onClick={() => {
          if (confirm('Reset session? This will remove all edits but keep the PDF.')) {
            useEditorStore.setState({ layers: {}, selectedElementId: null });
          }
        }}>
          <Trash2 className="h-4 w-4 mr-2" />
          Reset Session
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Reset Session</TooltipContent>
      </Tooltip>

      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>Edit</DropdownMenuLabel>
      </DropdownMenuGroup>

      <Tooltip>
        <DropdownMenuItem
          render={<TooltipTrigger />}
          disabled={history.past.length === 0}
          onClick={() => undo()}
        >
          <Undo className="h-4 w-4 mr-2" />
          Undo
          <KbdGroup className="ml-auto">
            <Kbd>{modKey}</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem
          render={<TooltipTrigger />}
          disabled={history.future.length === 0}
          onClick={() => redo()}
        >
          <Redo className="h-4 w-4 mr-2" />
          Redo
          <KbdGroup className="ml-auto">
            {redoKeys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Redo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem
          render={<TooltipTrigger />}
          onClick={async () => {
            const ok = await useEditorStore.getState().copySelection();
            try {
              const { toast } = await import('sonner');
              toast(ok ? 'Copied to clipboard' : 'Nothing selected');
            } catch (err) {
              // ignore
            }
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
          <KbdGroup className="ml-auto">
            <Kbd>{modKey}</Kbd>
            <Kbd>C</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Copy</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem
          render={<TooltipTrigger />}
          onClick={async () => {
            const ok = await useEditorStore.getState().pasteClipboard(currentPage);
            try {
              const { toast } = await import('sonner');
              toast(ok ? 'Pasted' : 'Nothing to paste');
            } catch (err) {
              // ignore
            }
          }}
        >
          <Clipboard className="h-4 w-4 mr-2" />
          Paste
          <KbdGroup className="ml-auto">
            <Kbd>{modKey}</Kbd>
            <Kbd>V</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Paste</TooltipContent>
      </Tooltip>

      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>View</DropdownMenuLabel>
      </DropdownMenuGroup>

      <Tooltip>
        <DropdownMenuItem render={<TooltipTrigger />} onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4 mr-2" />
          Zoom In
          <KbdGroup className="ml-auto">
            <Kbd>{modKey}</Kbd>
            <Kbd>+</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Zoom In</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem render={<TooltipTrigger />} onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4 mr-2" />
          Zoom Out
          <KbdGroup className="ml-auto">
            <Kbd>{modKey}</Kbd>
            <Kbd>-</Kbd>
          </KbdGroup>
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Zoom Out</TooltipContent>
      </Tooltip>

      <DropdownMenuSub>
        <Tooltip>
          <DropdownMenuSubTrigger render={<TooltipTrigger />}>
            <Sun className="h-4 w-4 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <TooltipContent hidden={isMobile}>Theme</TooltipContent>
        </Tooltip>
        <DropdownMenuSubContent>
          <Tooltip>
            <DropdownMenuItem render={<TooltipTrigger />} onClick={() => setTheme('light')}>
              <Sun className="h-4 w-4 mr-2" />
              Light Mode
            </DropdownMenuItem>
            <TooltipContent hidden={isMobile}>Light Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenuItem render={<TooltipTrigger />} onClick={() => setTheme('dark')}>
              <Moon className="h-4 w-4 mr-2" />
              Dark Mode
            </DropdownMenuItem>
            <TooltipContent hidden={isMobile}>Dark Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <DropdownMenuItem render={<TooltipTrigger />} onClick={() => setTheme('system')}>
              <Monitor className="h-4 w-4 mr-2" />
              System Theme
            </DropdownMenuItem>
            <TooltipContent hidden={isMobile}>System Theme</TooltipContent>
          </Tooltip>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      <Tooltip>
        <DropdownMenuItem render={<TooltipTrigger />} onClick={() => setAboutOpen(true)}>
          <Info className="h-4 w-4 mr-2" />
          About
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>About</TooltipContent>
      </Tooltip>
    </DropdownMenuContent>
  );
}

function SidebarShortcutListener() {
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const activeIsEditable = (document.activeElement as HTMLElement)?.isContentEditable;
      if (activeTag === 'input' || activeTag === 'textarea' || activeIsEditable) return;

      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return null;
}

export function EditorLayout() {
  const { pdfFile } = useEditorStore();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar collapsible="icon" className="border-r data-[collapsible=icon]:border-transparent">
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center font-bold text-xl transition-all group-data-[collapsible=icon]:px-2">
                <img src="/brand.webp" alt="Inkoro" className="h-5 w-5 object-contain mr-2" />
                <span className="group-data-[collapsible=icon]:hidden">Inkoro</span>
              </div>
              <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2">
                <TooltipProvider delay={100}>
                  <SidebarTrigger />
                  <div className="h-6 w-px bg-border" />
                  <DropdownMenu>
                    <Tooltip>
                      <DropdownMenuTrigger
                        render={<TooltipTrigger />}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                      >
                        <Menu className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <TooltipContent>Menu</TooltipContent>
                    </Tooltip>
                    <SidebarMenuContent onDownload={() => setDownloadDialogOpen(true)} />
                  </DropdownMenu>
                </TooltipProvider>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="group-data-[collapsible=icon]:hidden">
            {pdfFile ? (
              <Tabs defaultValue="thumbnails" className="w-full">
                <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent p-0 border-b">
                  <TabsTrigger value="thumbnails" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Pages
                  </TabsTrigger>
                  <TabsTrigger value="layers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="thumbnails" className="h-[calc(100vh-8rem)] overflow-y-auto p-4">
                  <ThumbnailList />
                </TabsContent>
                <TabsContent value="layers" className="h-[calc(100vh-8rem)] overflow-y-auto p-4">
                  <LayerList />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-4 text-sm text-muted-foreground text-center mt-10">
                Upload a PDF to see content
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="group-data-[collapsible=icon]:hidden">
            <div className="p-2.5 border-t">
              <Button
                variant="default"
                className={cn(
                  "w-full",
                  "cursor-pointer transform-gpu transition-all duration-150",
                  "hover:scale-[1.02] hover:shadow-md hover:shadow-black/10",
                  "active:scale-95 focus-visible:ring-ring/50",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                onClick={() => setDownloadDialogOpen(true)}
                disabled={!pdfFile}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 relative h-full w-full overflow-hidden bg-gray-100/50 dark:bg-gray-900/50">
          <div className="absolute inset-0 overflow-auto pt-8 pb-4 px-8 custom-scrollbar">
            <div className="flex items-center justify-center min-h-full">
              {pdfFile ? <PDFViewer /> : <div className="text-muted-foreground">No PDF Loaded</div>}
            </div>
          </div>

          <SidebarToggleButton setDownloadDialogOpen={setDownloadDialogOpen} />
          <SidebarShortcutListener />
          <Toolbar />
          <PropertiesPanel />
          <UploadDialog />
          <DownloadDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen} />
          <AboutDialog />
        </main>
      </div>
    </SidebarProvider>
  );
}
