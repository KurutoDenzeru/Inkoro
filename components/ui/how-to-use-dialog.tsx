'use client';

import * as React from 'react';
import { BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialogStore } from '@/hooks/use-dialogs';

export function HowToUseDialog() {
  const { helpOpen, setHelpOpen } = useDialogStore();

  return (
    <Dialog open={helpOpen} onOpenChange={(open) => setHelpOpen(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>How to Use Inkoro</DialogTitle>
          </div>
          <DialogDescription>
            Quick tips to get started editing PDFs.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm space-y-2">
          <ul className="list-disc pl-4">
            <li>Upload a PDF using the upload area or drag-and-drop.</li>
            <li>Use the toolbar to add text, shapes, images, or signatures.</li>
            <li>Click and drag to move elements; use the properties panel to fine-tune.</li>
            <li>Press <kbd>⌘Ctrl</kbd> + <kbd>B</kbd> to toggle the sidebar.</li>
            <li>Use the Menu (top-right of the header) to download or view About.</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setHelpOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
