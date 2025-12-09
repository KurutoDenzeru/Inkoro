import { Download, Undo, Redo, Trash2, RotateCw, RotateCcw, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, Grid3x3, HelpCircle, Info, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Components
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import HowToDialog from './howto-dialog';
import AboutDialog from './about-dialog';
import { ExportDialog } from './export-dialog';
import type { ExportOptions } from '@/types/pdf';

interface PDFNavbarProps {
  fileName?: string;
  onExport: (options?: ExportOptions) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteSelected: () => void;
  onAddPage: () => void;
  onRotate: () => void;
  onNewSession: () => void;
  onResetSession: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  currentPage?: number;
  numPages?: number;
  scale?: number;
  onPageChange?: (page: number) => void;
  onScaleChange?: (scale: number) => void;
  viewMode?: 'single' | 'multiple';
  onViewModeChange?: (mode: 'single' | 'multiple') => void;
}

export function PDFNavbar({
  fileName = 'Untitled Document',
  onExport,
  onUndo,
  onRedo,
  onDeleteSelected,
  onAddPage: _onAddPage,
  onRotate,
  onNewSession,
  onResetSession,
  canUndo,
  canRedo,
  hasSelection,
  currentPage = 1,
  numPages = 0,
  scale = 1.0,
  onPageChange,
  onScaleChange,
  viewMode = 'single',
  onViewModeChange,
}: PDFNavbarProps) {
  const MIN_SCALE = 0.4;
  const isMobile = useIsMobile();
  const [howToOpen, setHowToOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('inkoro-theme');
    if (saved === 'system') return 'system';
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    // default to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class on mount and whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (value: 'light' | 'dark') => {
      if (value === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    // If user chose system, follow system preference and listen for changes
    if (theme === 'system') {
      const systemPref = mm && mm.matches ? 'dark' : 'light';
      apply(systemPref);
      const listener = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light');
      mm && mm.addEventListener && mm.addEventListener('change', listener);
      // persist 'system'
      localStorage.setItem('inkoro-theme', 'system');
      return () => mm && mm.removeEventListener && mm.removeEventListener('change', listener);
    }

    // Otherwise force the selected theme
    apply(theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('inkoro-theme', theme);
    return undefined;
  }, [theme]);
  // Remove one or more trailing extensions from the display name (e.g. `.pdf`, `.pdf.pdf`, `.tar.gz`)
  const cleanFileName = fileName ? fileName.replace(/(\.[^.]+)+$/g, '') : fileName;

  return (
    <TooltipProvider>
      <nav className="w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b">
        <div className="flex items-start justify-between px-4 gap-2 py-1.5">
          {/* Left Section - Brand Logo and Filename + Menubar */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Brand Logo */}
            <img src="/brand.png" alt="Inkoro" className="h-12 w-12 shrink-0" />

            {/* Filename and Menubar Column */}
            <div className="flex flex-col items-start justify-start gap-0 flex-1 min-w-0">
              {/* Filename Display */}
              <div className="flex items-center gap-2 min-w-0 w-full">
                <span className="text-base font-medium text-foreground truncate">{cleanFileName}</span>
              </div>

              {/* Menubar Row - Inline with Filename */}
              <div className="flex items-center gap-0.5 w-full">
                {/* File Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm px-2 py-0 h-6 hover:bg-accent">
                      File
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => setExportOpen(true)}>
                      <Download className="w-4 h-4 mr-2" />
                        <span>Export</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onNewSession}>
                      <FileText className="w-4 h-4 mr-2" />
                      <span>New Session</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onResetSession}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      <span>Reset Session</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Edit Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm px-2 py-0 h-6 hover:bg-accent">
                      Edit
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={onUndo} disabled={!canUndo} className="justify-between">
                      <div className="flex items-center">
                        <Undo className="w-4 h-4 mr-2" />
                        <span>Undo</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{typeof window !== 'undefined' && navigator.platform.includes('Mac') ? '⌘Z' : 'Ctrl+Z'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRedo} disabled={!canRedo} className="justify-between">
                      <div className="flex items-center">
                        <Redo className="w-4 h-4 mr-2" />
                        <span>Redo</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{typeof window !== 'undefined' && navigator.platform.includes('Mac') ? '⌘⇧Z' : 'Ctrl+Shift+Z'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDeleteSelected} disabled={!hasSelection}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Delete Selected</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Page menu removed: Add Page moved/hidden; Rotate Page moved to View menu */}

                {/* View Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm px-2 py-0 h-6 hover:bg-accent">
                      View
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {/* Page Navigation */}
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Page Navigation</p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                          disabled={currentPage <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium flex-1 text-center">{currentPage}/{numPages}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange?.(Math.min(numPages, currentPage + 1))}
                          disabled={currentPage >= numPages}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* Zoom Controls */}
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Zoom</p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onScaleChange?.(Math.max(MIN_SCALE, scale - 0.1))}
                          disabled={scale <= MIN_SCALE}
                          className="h-8 w-8 p-0"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium flex-1 text-center">{Math.round(scale * 100)}%</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onScaleChange?.(Math.min(2, scale + 0.1))}
                          disabled={scale >= 2}
                          className="h-8 w-8 p-0"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    {/* View Mode */}
                    {!isMobile && (
                      <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">View Mode</p>
                      <div className="flex gap-1">
                        <Button
                          variant={viewMode === 'single' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onViewModeChange?.('single')}
                          className="flex-1"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Single
                        </Button>
                        <Button
                          variant={viewMode === 'multiple' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onViewModeChange?.('multiple')}
                          className="flex-1"
                        >
                          <Grid3x3 className="w-4 h-4 mr-2" />
                          Multiple
                        </Button>
                      </div>
                      </div>
                    )}
                    {!isMobile && <DropdownMenuSeparator />}
                    <DropdownMenuItem onClick={onRotate}>
                      <RotateCw className="w-4 h-4 mr-2" />
                      <span>Rotate Page</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                  {/* Help Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-sm px-2 py-0 h-6 hover:bg-accent">
                        Help
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => setHowToOpen(true)}>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        <span>How to use</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAboutOpen(true)}>
                        <Info className="w-4 h-4 mr-2" />
                        <span>About</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-1 shrink-0 pt-1">
            {/* Desktop Quick Actions */}
              <div className="hidden md:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExportOpen(true)}
                      className="h-8 px-3 text-sm bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 transition-colors dark:bg-red-600 dark:border-red-600 dark:hover:bg-red-700"
                    >
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>

              {/* Theme dropdown */}
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={theme === 'system' ? 'outline' : 'outline'} size="sm" className="h-8 px-3 text-sm flex items-center gap-2">
                      {theme === 'light' && <Sun className="w-4 h-4" />}
                      {theme === 'dark' && <Moon className="w-4 h-4" />}
                      {theme === 'system' && <Monitor className="w-4 h-4" />}
                      <span className="hidden sm:inline">{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Theme</p>
                    <div className="flex flex-col gap-1">
                      <DropdownMenuItem onClick={() => {
                        setTheme('light');
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('inkoro-theme', 'light');
                      }} className="justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 mr-2" />
                          <span>Light</span>
                        </div>
                        {theme === 'light' && <Check className="w-4 h-4 text-green-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setTheme('dark');
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('inkoro-theme', 'dark');
                      }} className="justify-between">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 mr-2" />
                          <span>Dark</span>
                        </div>
                        {theme === 'dark' && <Check className="w-4 h-4 text-green-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setTheme('system');
                        // remove any forced dark/light and let effect determine
                        localStorage.setItem('inkoro-theme', 'system');
                        // The effect will apply the system preference
                      }} className="justify-between">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 mr-2" />
                          <span>System</span>
                        </div>
                        {theme === 'system' && <Check className="w-4 h-4 text-green-600" />}
                      </DropdownMenuItem>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* More Menu removed — replaced by Export quick action */}
            {/* Render dialogs here so they sit near the navbar root */}
            <HowToDialog open={howToOpen} onOpenChange={setHowToOpen} />
            <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
            <ExportDialog open={exportOpen} onOpenChange={setExportOpen} onExport={onExport} fileName={fileName} numPages={numPages} currentPage={currentPage} />
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
