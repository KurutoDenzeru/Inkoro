import { b as createRouter, a as createRootRoute, c as createFileRoute, l as lazyRouteComponent, H as HeadContent, O as Outlet, S as Scripts } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { J } from "../_libs/next-themes.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function Providers({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(J, { attribute: "class", defaultTheme: "system", enableSystem: true, children });
}
const Route$1 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Inkoro - PDF Editor & Annotator" },
      { name: "description", content: "Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows." },
      { name: "keywords", content: "PDF editor, PDF annotation, React PDF, TypeScript, pdf.js, react-pdf, Tailwind CSS, shadcn/ui, online PDF editor, PDF tools, lightweight PDF editor, responsive PDF editor, PDF workflows, browser PDF editor" },
      { name: "author", content: "Kurt Calacday" },
      { name: "publisher", content: "Inkoro" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: "https://inkoro.vercel.app/" },
      { property: "og:title", content: "Inkoro - PDF Editor & Annotator" },
      { property: "og:description", content: "Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows." },
      { property: "og:site_name", content: "Inkoro" },
      { property: "og:image", content: "/OpenGraph.webp" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Inkoro PDF Editor" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Inkoro - PDF Editor & Annotator" },
      { name: "twitter:description", content: "Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows." },
      { name: "twitter:image", content: "/OpenGraph.webp" },
      { name: "twitter:creator", content: "@inkoro" },
      { name: "robots", content: "index, follow" }
    ],
    links: [
      { rel: "icon", href: "/brand.png", type: "image/png" },
      { rel: "icon", href: "/brand.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/brand.png", sizes: "16x16", type: "image/png" },
      { rel: "apple-touch-icon", href: "/brand.png" },
      { rel: "shortcut icon", href: "/brand.png" },
      { rel: "manifest", href: "/manifest.json" }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Inkoro",
    description: "Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.",
    url: "https://inkoro.vercel.app",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    screenshot: "https://inkoro.vercel.app/OpenGraph.webp",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100"
    },
    author: {
      "@type": "Organization",
      name: "Kurt Calacday"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "light", style: { colorScheme: "light" }, suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{const t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else if(t==='light'){document.documentElement.classList.remove('dark');}else{const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark', prefersDark);} }catch(e){}})()` } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: `antialiased`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Providers, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter = () => import("./index-B7IUyegr.mjs").then((n) => n.i);
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  ssr: false
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true
  });
  return router;
}
export {
  getRouter
};
