'use client';

import { pdfjs } from 'react-pdf';

if (typeof window !== 'undefined') {
  // Use unpkg for simplicity. In production, copying the worker file to public/ is better.
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}
