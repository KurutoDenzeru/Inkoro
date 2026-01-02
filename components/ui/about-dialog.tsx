'use client';

import * as React from 'react';
import { Info, Github, Instagram, Linkedin } from 'lucide-react';
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <DialogTitle>About Inkoro</DialogTitle>
          </div>
          <DialogDescription>
            Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-base">Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Add text, shapes, images, and signatures to PDFs</li>
              <li>Drag and drop elements with precision</li>
              <li>Real-time editing with undo/redo support</li>
              <li>Export edited PDFs instantly</li>
              <li>Dark mode support</li>
              <li>Session persistence across page refreshes</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Tailwind', 'pdf-lib', 'react-pdf', 'Zustand', 'Shadcn UI'].map((tech) => (
                <span key={tech} className="px-2 py-1 bg-muted rounded-none text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-base">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/KurutoDenzeru/Inkoro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="text-xs">GitHub</span>
              </a>
              <a
                href="https://www.instagram.com/krtclcdy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span className="text-xs">Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/in/kurtcalacday/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="text-xs">LinkedIn</span>
              </a>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAboutOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
