'use client';

import * as React from 'react';
import { Info } from 'lucide-react';
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

export function AboutDialog() {
  const { aboutOpen, setAboutOpen } = useDialogStore();

  return (
    <Dialog open={aboutOpen} onOpenChange={(open) => setAboutOpen(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>About Inkoro</DialogTitle>
          </div>
          <DialogDescription>
            Inkoro is a lightweight PDF editor built with React and pdf-lib. Use it to annotate, insert
            images, and export your edited PDFs.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-sm">
          <p className="mb-2">Version: 0.1.0</p>
          <p className="text-muted-foreground">Made with ❤️ — open source and free to use.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAboutOpen(false)}>
            Close
          </Button>
          <a href="https://github.com/" target="_blank">
            <Button>
              View on GitHub
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
