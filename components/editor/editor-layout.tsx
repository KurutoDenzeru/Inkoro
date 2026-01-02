'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDialog } from "./upload-dialog";
import { Layers, FileText, PanelLeftOpen, Menu, Download, RefreshCw, Trash2, Undo, Redo, Info, Sun, Moon, Monitor } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { DownloadDialog } from "./download-dialog";
import { AboutDialog } from "@/components/ui/about-dialog";
import { useDialogStore } from "@/hooks/use-dialogs";
import { useTheme } from "next-themes";

function SidebarToggleButton({ setDownloadDialogOpen }: { setDownloadDialogOpen: (open: boolean) => void }) {
  const { state, toggleSidebar } = useSidebar();

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
          <TooltipContent>Expand Sidebar</TooltipContent>
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
  const setAboutOpen = useDialogStore((s) => s.setAboutOpen);
  const { setTheme } = useTheme();

  return (
    <DropdownMenuContent align="start">
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
            window.location.reload();
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
        <DropdownMenuItem render={<TooltipTrigger />} disabled>
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <DropdownMenuItem render={<TooltipTrigger />} disabled>
          <Redo className="h-4 w-4 mr-2" />
          Redo
        </DropdownMenuItem>
        <TooltipContent hidden={isMobile}>Redo</TooltipContent>
      </Tooltip>

      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>View</DropdownMenuLabel>
      </DropdownMenuGroup>

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
