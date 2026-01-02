import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Crop an image data URL by trimming transparent or near-white borders.
export async function cropImageDataUrl(dataUrl: string, trimWhite = true): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h).data;

      let top = 0;
      let bottom = h - 1;
      let left = 0;
      let right = w - 1;
      const isWhite = (r: number, g: number, b: number, a: number) => {
        if (a === 0) return true; // treat fully transparent as empty
        if (!trimWhite) return false;
        // near-white threshold
        return r > 245 && g > 245 && b > 245;
      };

      let found = false;
      // top
      for (let y = 0; y < h; y++) {
        let rowHasContent = false;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) { rowHasContent = true; break; }
        }
        if (rowHasContent) { top = y; found = true; break; }
      }

      if (!found) {
        // image entirely empty
        resolve({ dataUrl, width: w, height: h });
        return;
      }

      // bottom
      for (let y = h - 1; y >= 0; y--) {
        let rowHasContent = false;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) { rowHasContent = true; break; }
        }
        if (rowHasContent) { bottom = y; break; }
      }

      // left
      for (let x = 0; x < w; x++) {
        let colHasContent = false;
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) { colHasContent = true; break; }
        }
        if (colHasContent) { left = x; break; }
      }

      // right
      for (let x = w - 1; x >= 0; x--) {
        let colHasContent = false;
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) { colHasContent = true; break; }
        }
        if (colHasContent) { right = x; break; }
      }

      const cropW = right - left + 1;
      const cropH = bottom - top + 1;

      if (cropW <= 0 || cropH <= 0 || (left === 0 && top === 0 && right === w - 1 && bottom === h - 1)) {
        // Nothing to crop
        resolve({ dataUrl, width: w, height: h });
        return;
      }

      const outCanvas = document.createElement('canvas');
      outCanvas.width = cropW;
      outCanvas.height = cropH;
      const outCtx = outCanvas.getContext('2d')!;
      outCtx.drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH);
      const newDataUrl = outCanvas.toDataURL('image/png');
      resolve({ dataUrl: newDataUrl, width: cropW, height: cropH });
    };
    img.onerror = () => {
      resolve({ dataUrl, width: 200, height: 200 });
    };
  });
}