![Inkoro](/public/OpenGraph.webp)

# 🪶 Inkoro - PDF Editor & Annotator

🪶 Lightweight React + TypeScript PDF editor built with Vite, react-pdf (pdf.js), Tailwind CSS, and shadcn/ui; ideal for responsive and fast PDF workflows.

---

## ✨ Features

- **PDF Viewing & Navigation:** Open, preview, and navigate multi-page documents using `react-pdf` (pdf.js).
- **Upload, Reorder & Remove Pages:** Upload PDFs, reorder or remove pages via drag-and-drop thumbnails.
- **Rich Annotation Support:** Add and edit annotations — pen/freehand, text, highlights, shapes (rectangles/circles/lines/arrows), images, and signatures.
- **Annotation Editing Tools:** Modify color, stroke, font, position, rotate, resize, and layer ordering of annotations.
- **Export & Download:** Export full documents or single pages to PDF, PNG, JPEG, or WebP.
- **Undo/Redo & Clipboard:** Undo/redo history, copy/paste annotations, and architecture to persist editor sessions via `localStorage`.
- **Responsive & Accessible:** Mobile-first UI with keyboard shortcuts, accessible controls, and a compact toolbar for small screens.
- **Open Source & Extensible:** MIT-licensed and built to be adapted to custom workflows.

---

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) + React + TypeScript: Fast development with modern tooling.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework used for styling.
- [Shadcn UI / Radix UI](https://ui.shadcn.com/): Headless UI components and patterns.
- [react-pdf](https://github.com/wojtekmaj/react-pdf) + [pdfjs-dist (pdf.js)](https://www.jsdelivr.com/package/npm/pdfjs-dist): PDF rendering within the browser.
- [pdf-lib](https://github.com/Hopding/pdf-lib): Client-side PDF creation and modification.
- [jszip](https://stuk.github.io/jszip/): Optional export utilities.

---

## 🚀 Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/KurutoDenzeru/Inkoro)  [![Deploy with Netlify](_deploy_netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KurutoDenzeru/Inkoro)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KurutoDenzeru/Inkoro.git
cd Inkoro
```

### 2. Install dependencies

```bash
# With npm
yarn install
# or
npm install
# or
bun install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
bun run dev
```

Open [http://localhost:5713](http://localhost:5713) to view the app.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

The editor is componentized under `src/components`. Key areas to customize are:

- `src/components/pdf-editor.tsx`: Editor entrypoint and application state (annotations, undo/redo, session management).
- `src/components/pdf-canvas.tsx`: Renders pages and annotations and handles canvas interactions.
- `src/components/pdf-toolbar.tsx`: Tool selection (pen/text/shapes/highlight) and formatting controls.
- `src/components/pdf-sidebar.tsx`: Thumbnails, layers view, and annotation management.
- `src/components/pdf-navbar.tsx`: Top bar controls, export, and file handling actions.
- `src/components/pdf-upload-zone.tsx`: Drag & drop / file input for loading PDFs.
- `src/components/signature-dialog.tsx`: Signature creation and insertion.
- `src/components/export-dialog.tsx`: Controls export formats and scope.

## Contributing

Contributions are always welcome!

See `Contributing.md` for ways to get started.

<!-- Please adhere to this project's `Code of Conduct`. -->

## 📄 License

[MIT](LICENSE)
