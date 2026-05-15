import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
async function cropImageDataUrl(dataUrl, trimWhite = true) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUrl;
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let top = 0;
      let bottom = h - 1;
      let left = 0;
      let right = w - 1;
      const isWhite = (r, g, b, a) => {
        if (a === 0) return true;
        if (!trimWhite) return false;
        return r > 245 && g > 245 && b > 245;
      };
      let found = false;
      for (let y = 0; y < h; y++) {
        let rowHasContent = false;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) {
            rowHasContent = true;
            break;
          }
        }
        if (rowHasContent) {
          top = y;
          found = true;
          break;
        }
      }
      if (!found) {
        resolve({ dataUrl, width: w, height: h });
        return;
      }
      for (let y = h - 1; y >= 0; y--) {
        let rowHasContent = false;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) {
            rowHasContent = true;
            break;
          }
        }
        if (rowHasContent) {
          bottom = y;
          break;
        }
      }
      for (let x = 0; x < w; x++) {
        let colHasContent = false;
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) {
            colHasContent = true;
            break;
          }
        }
        if (colHasContent) {
          left = x;
          break;
        }
      }
      for (let x = w - 1; x >= 0; x--) {
        let colHasContent = false;
        for (let y = 0; y < h; y++) {
          const idx = (y * w + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];
          if (!isWhite(r, g, b, a)) {
            colHasContent = true;
            break;
          }
        }
        if (colHasContent) {
          right = x;
          break;
        }
      }
      const cropW = right - left + 1;
      const cropH = bottom - top + 1;
      if (cropW <= 0 || cropH <= 0 || left === 0 && top === 0 && right === w - 1 && bottom === h - 1) {
        resolve({ dataUrl, width: w, height: h });
        return;
      }
      const outCanvas = document.createElement("canvas");
      outCanvas.width = cropW;
      outCanvas.height = cropH;
      const outCtx = outCanvas.getContext("2d");
      outCtx.drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH);
      const newDataUrl = outCanvas.toDataURL("image/png");
      resolve({ dataUrl: newDataUrl, width: cropW, height: cropH });
    };
    img.onerror = () => {
      resolve({ dataUrl, width: 200, height: 200 });
    };
  });
}
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cn,
  cropImageDataUrl
}, Symbol.toStringTag, { value: "Module" }));
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-muted rounded-none animate-pulse", className),
      ...props
    }
  );
}
const EditorSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "status", "aria-label": "Loading the editor", className: "h-screen w-screen flex flex-col bg-background text-foreground", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Loading editor..." }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between p-4 border-b border-muted", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 rounded-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-none" })
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 border-r border-muted p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-28 rounded-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4 rounded-none" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 p-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-none border border-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full rounded-none" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-20 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-36 rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-36 rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-36 rounded-none" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-80 p-4 border-l border-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-36 rounded-none mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-none" })
      ] })
    ] })
  ] })
] });
const EditorLayout = reactExports.lazy(() => import("./editor-layout-DPaoLSEN.mjs").then((mod) => ({
  default: mod.EditorLayout
})));
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorSkeleton, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorLayout, {}) });
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  component: Home
}, Symbol.toStringTag, { value: "Module" }));
export {
  cn as c,
  index as i,
  utils as u
};
