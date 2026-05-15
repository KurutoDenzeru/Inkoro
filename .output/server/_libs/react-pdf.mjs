import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { c as clsx } from "./clsx.mjs";
import { d as dequal } from "./dequal.mjs";
import { m as makeCancellablePromise } from "./make-cancellable-promise.mjs";
import { m as makeEventProps } from "./make-event-props.mjs";
import { p as pdfjs, g as getDocument, A as AnnotationLayer$1, a as AnnotationMode, T as TextLayer$1, G as GlobalWorkerOptions } from "./pdfjs-dist.mjs";
import { i as invariant } from "./tiny-invariant.mjs";
import { w as warning } from "./warning.mjs";
import { m as mergeRefs } from "./merge-refs.mjs";
const documentContext = reactExports.createContext(null);
const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
class LinkService {
  constructor() {
    this.externalLinkEnabled = true;
    this.externalLinkRel = void 0;
    this.externalLinkTarget = void 0;
    this.isInPresentationMode = false;
    this.pdfDocument = void 0;
    this.pdfViewer = void 0;
  }
  setDocument(pdfDocument) {
    this.pdfDocument = pdfDocument;
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setExternalLinkRel(externalLinkRel) {
    this.externalLinkRel = externalLinkRel;
  }
  setExternalLinkTarget(externalLinkTarget) {
    this.externalLinkTarget = externalLinkTarget;
  }
  setHash() {
  }
  setHistory() {
  }
  get pagesCount() {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  }
  get page() {
    invariant(this.pdfViewer);
    return this.pdfViewer.currentPageNumber || 0;
  }
  set page(value) {
    invariant(this.pdfViewer);
    this.pdfViewer.currentPageNumber = value;
  }
  get rotation() {
    return 0;
  }
  set rotation(_value) {
  }
  addLinkAttributes(link, url, newWindow) {
    link.href = url;
    link.rel = this.externalLinkRel || DEFAULT_LINK_REL;
    link.target = newWindow ? "_blank" : this.externalLinkTarget || "";
  }
  goToDestination(dest) {
    return new Promise((resolve) => {
      invariant(this.pdfDocument);
      invariant(dest);
      if (typeof dest === "string") {
        this.pdfDocument.getDestination(dest).then(resolve);
      } else if (Array.isArray(dest)) {
        resolve(dest);
      } else {
        dest.then(resolve);
      }
    }).then((explicitDest) => {
      invariant(Array.isArray(explicitDest));
      const destRef = explicitDest[0];
      new Promise((resolve) => {
        invariant(this.pdfDocument);
        if (destRef instanceof Object) {
          this.pdfDocument.getPageIndex(destRef).then((pageIndex) => {
            resolve(pageIndex);
          }).catch(() => {
            invariant(false);
          });
        } else if (typeof destRef === "number") {
          resolve(destRef);
        } else {
          invariant(false);
        }
      }).then((pageIndex) => {
        const pageNumber = pageIndex + 1;
        invariant(this.pdfViewer);
        invariant(pageNumber >= 1 && pageNumber <= this.pagesCount);
        this.pdfViewer.scrollPageIntoView({
          dest: explicitDest,
          pageIndex,
          pageNumber
        });
      });
    });
  }
  goToPage(pageNumber) {
    const pageIndex = pageNumber - 1;
    invariant(this.pdfViewer);
    invariant(pageNumber >= 1 && pageNumber <= this.pagesCount);
    this.pdfViewer.scrollPageIntoView({
      pageIndex,
      pageNumber
    });
  }
  goToXY() {
  }
  cachePageRef() {
  }
  getDestinationHash() {
    return "#";
  }
  getAnchorUrl() {
    return "#";
  }
  executeNamedAction() {
  }
  executeSetOCGState() {
  }
  isPageVisible() {
    return true;
  }
  isPageCached() {
    return true;
  }
  navigateTo(dest) {
    this.goToDestination(dest);
  }
}
function Message({ children, type }) {
  return jsxRuntimeExports.jsx("div", { className: `react-pdf__message react-pdf__message--${type}`, children });
}
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
function reducer(state, action) {
  switch (action.type) {
    case "RESOLVE":
      return { value: action.value, error: void 0 };
    case "REJECT":
      return { value: false, error: action.error };
    case "RESET":
      return { value: void 0, error: void 0 };
    default:
      return state;
  }
}
function useResolver() {
  return reactExports.useReducer(reducer, { value: void 0, error: void 0 });
}
const isBrowser = typeof window !== "undefined";
const isLocalFileSystem = isBrowser && window.location.protocol === "file:";
function isDefined(variable) {
  return typeof variable !== "undefined";
}
function isProvided(variable) {
  return isDefined(variable) && variable !== null;
}
function isString(variable) {
  return typeof variable === "string";
}
function isArrayBuffer(variable) {
  return variable instanceof ArrayBuffer;
}
function isBlob(variable) {
  invariant(isBrowser);
  return variable instanceof Blob;
}
function isDataURI(variable) {
  return isString(variable) && /^data:/.test(variable);
}
function dataURItoByteString(dataURI) {
  invariant(isDataURI(dataURI));
  const [headersString = "", dataString = ""] = dataURI.split(",");
  const headers = headersString.split(";");
  if (headers.indexOf("base64") !== -1) {
    return atob(dataString);
  }
  return unescape(dataString);
}
function getDevicePixelRatio() {
  return isBrowser && window.devicePixelRatio || 1;
}
const allowFileAccessFromFilesTip = "On Chromium based browsers, you can use --allow-file-access-from-files flag for debugging purposes.";
function displayCORSWarning() {
  warning(!isLocalFileSystem, `Loading PDF as base64 strings/URLs may not work on protocols other than HTTP/HTTPS. ${allowFileAccessFromFilesTip}`);
}
function displayWorkerWarning() {
  warning(!isLocalFileSystem, `Loading PDF.js worker may not work on protocols other than HTTP/HTTPS. ${allowFileAccessFromFilesTip}`);
}
function cancelRunningTask(runningTask) {
  if (runningTask === null || runningTask === void 0 ? void 0 : runningTask.cancel)
    runningTask.cancel();
}
function makePageCallback(page, scale) {
  Object.defineProperty(page, "width", {
    get() {
      return this.getViewport({ scale }).width;
    },
    configurable: true
  });
  Object.defineProperty(page, "height", {
    get() {
      return this.getViewport({ scale }).height;
    },
    configurable: true
  });
  Object.defineProperty(page, "originalWidth", {
    get() {
      return this.getViewport({ scale: 1 }).width;
    },
    configurable: true
  });
  Object.defineProperty(page, "originalHeight", {
    get() {
      return this.getViewport({ scale: 1 }).height;
    },
    configurable: true
  });
  return page;
}
function isAbortException(error) {
  return error.name === "AbortException" || error.name === "RenderingCancelledException";
}
function loadFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) {
        return reject(new Error("Error while reading a file."));
      }
      resolve(reader.result);
    };
    reader.onerror = (event) => {
      if (!event.target) {
        return reject(new Error("Error while reading a file."));
      }
      const { error } = event.target;
      if (!error) {
        return reject(new Error("Error while reading a file."));
      }
      switch (error.code) {
        case error.NOT_FOUND_ERR:
          return reject(new Error("Error while reading a file: File not found."));
        case error.SECURITY_ERR:
          return reject(new Error("Error while reading a file: Security error."));
        case error.ABORT_ERR:
          return reject(new Error("Error while reading a file: Aborted."));
        default:
          return reject(new Error("Error while reading a file."));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
const { PDFDataRangeTransport } = pdfjs;
const defaultOnPassword = (callback, reason) => {
  switch (reason) {
    case PasswordResponses.NEED_PASSWORD: {
      const password = prompt("Enter the password to open this PDF file.");
      callback(password);
      break;
    }
    case PasswordResponses.INCORRECT_PASSWORD: {
      const password = prompt("Invalid password. Please try again.");
      callback(password);
      break;
    }
  }
};
function isParameterObject(file) {
  return typeof file === "object" && file !== null && ("data" in file || "range" in file || "url" in file);
}
const Document = reactExports.forwardRef(function Document2({ children, className, error = "Failed to load PDF file.", externalLinkRel, externalLinkTarget, file, inputRef, imageResourcesPath, loading = "Loading PDF…", noData = "No PDF file specified.", onItemClick, onLoadError: onLoadErrorProps, onLoadProgress, onLoadSuccess: onLoadSuccessProps, onPassword = defaultOnPassword, onSourceError: onSourceErrorProps, onSourceSuccess: onSourceSuccessProps, options, renderMode, rotate, scale, ...otherProps }, ref) {
  const [sourceState, sourceDispatch] = useResolver();
  const { value: source, error: sourceError } = sourceState;
  const [pdfState, pdfDispatch] = useResolver();
  const { value: pdf, error: pdfError } = pdfState;
  const linkService = reactExports.useRef(new LinkService());
  const pages = reactExports.useRef([]);
  const prevFile = reactExports.useRef(void 0);
  const prevOptions = reactExports.useRef(void 0);
  if (file && file !== prevFile.current && isParameterObject(file)) {
    warning(!dequal(file, prevFile.current), `File prop passed to <Document /> changed, but it's equal to previous one. This might result in unnecessary reloads. Consider memoizing the value passed to "file" prop.`);
    prevFile.current = file;
  }
  if (options && options !== prevOptions.current) {
    warning(!dequal(options, prevOptions.current), `Options prop passed to <Document /> changed, but it's equal to previous one. This might result in unnecessary reloads. Consider memoizing the value passed to "options" prop.`);
    prevOptions.current = options;
  }
  const viewer = reactExports.useRef({
    // Handling jumping to internal links target
    scrollPageIntoView: (args) => {
      const { dest, pageNumber, pageIndex = pageNumber - 1 } = args;
      if (onItemClick) {
        onItemClick({ dest, pageIndex, pageNumber });
        return;
      }
      const page = pages.current[pageIndex];
      if (page) {
        page.scrollIntoView();
        return;
      }
      warning(false, `An internal link leading to page ${pageNumber} was clicked, but neither <Document> was provided with onItemClick nor it was able to find the page within itself. Either provide onItemClick to <Document> and handle navigating by yourself or ensure that all pages are rendered within <Document>.`);
    }
  });
  reactExports.useImperativeHandle(ref, () => ({
    linkService,
    pages,
    viewer
  }), []);
  function onSourceSuccess() {
    if (onSourceSuccessProps) {
      onSourceSuccessProps();
    }
  }
  function onSourceError() {
    if (!sourceError) {
      return;
    }
    warning(false, sourceError.toString());
    if (onSourceErrorProps) {
      onSourceErrorProps(sourceError);
    }
  }
  function resetSource() {
    sourceDispatch({ type: "RESET" });
  }
  reactExports.useEffect(resetSource, [file, sourceDispatch]);
  const findDocumentSource = reactExports.useCallback(async () => {
    if (!file) {
      return null;
    }
    if (typeof file === "string") {
      if (isDataURI(file)) {
        const fileByteString = dataURItoByteString(file);
        return { data: fileByteString };
      }
      displayCORSWarning();
      return { url: file };
    }
    if (file instanceof PDFDataRangeTransport) {
      return { range: file };
    }
    if (isArrayBuffer(file)) {
      return { data: file };
    }
    if (isBrowser) {
      if (isBlob(file)) {
        const data = await loadFromFile(file);
        return { data };
      }
    }
    invariant(typeof file === "object");
    invariant(isParameterObject(file));
    if ("url" in file && typeof file.url === "string") {
      if (isDataURI(file.url)) {
        const { url, ...otherParams } = file;
        const fileByteString = dataURItoByteString(url);
        return { data: fileByteString, ...otherParams };
      }
      displayCORSWarning();
    }
    return file;
  }, [file]);
  reactExports.useEffect(() => {
    const cancellable = makeCancellablePromise(findDocumentSource());
    cancellable.promise.then((nextSource) => {
      sourceDispatch({ type: "RESOLVE", value: nextSource });
    }).catch((error2) => {
      sourceDispatch({ type: "REJECT", error: error2 });
    });
    return () => {
      cancelRunningTask(cancellable);
    };
  }, [findDocumentSource, sourceDispatch]);
  reactExports.useEffect(() => {
    if (typeof source === "undefined") {
      return;
    }
    if (source === false) {
      onSourceError();
      return;
    }
    onSourceSuccess();
  }, [source]);
  function onLoadSuccess() {
    if (!pdf) {
      return;
    }
    if (onLoadSuccessProps) {
      onLoadSuccessProps(pdf);
    }
    pages.current = new Array(pdf.numPages);
    linkService.current.setDocument(pdf);
  }
  function onLoadError() {
    if (!pdfError) {
      return;
    }
    warning(false, pdfError.toString());
    if (onLoadErrorProps) {
      onLoadErrorProps(pdfError);
    }
  }
  reactExports.useEffect(function resetDocument() {
    pdfDispatch({ type: "RESET" });
  }, [pdfDispatch, source]);
  reactExports.useEffect(function loadDocument() {
    if (!source) {
      return;
    }
    const documentInitParams = options ? { ...source, ...options } : source;
    const destroyable = getDocument(documentInitParams);
    if (onLoadProgress) {
      destroyable.onProgress = onLoadProgress;
    }
    if (onPassword) {
      destroyable.onPassword = onPassword;
    }
    const loadingTask = destroyable;
    loadingTask.promise.then((nextPdf) => {
      if (loadingTask.destroyed) {
        return;
      }
      pdfDispatch({ type: "RESOLVE", value: nextPdf });
    }).catch((error2) => {
      if (loadingTask.destroyed) {
        return;
      }
      pdfDispatch({ type: "REJECT", error: error2 });
    });
    return () => {
      loadingTask.destroy();
    };
  }, [options, pdfDispatch, source]);
  reactExports.useEffect(() => {
    if (typeof pdf === "undefined") {
      return;
    }
    if (pdf === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [pdf]);
  reactExports.useEffect(function setupLinkService() {
    linkService.current.setViewer(viewer.current);
    linkService.current.setExternalLinkRel(externalLinkRel);
    linkService.current.setExternalLinkTarget(externalLinkTarget);
  }, [externalLinkRel, externalLinkTarget]);
  const registerPage = reactExports.useCallback((pageIndex, ref2) => {
    pages.current[pageIndex] = ref2;
  }, []);
  const unregisterPage = reactExports.useCallback((pageIndex) => {
    delete pages.current[pageIndex];
  }, []);
  const childContext = reactExports.useMemo(() => ({
    imageResourcesPath,
    linkService: linkService.current,
    onItemClick,
    pdf,
    registerPage,
    renderMode,
    rotate,
    scale,
    unregisterPage
  }), [imageResourcesPath, onItemClick, pdf, registerPage, renderMode, rotate, scale, unregisterPage]);
  const eventProps = reactExports.useMemo(
    () => makeEventProps(otherProps, () => pdf),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps, pdf]
  );
  function renderChildren() {
    function isFulfilledContext(context) {
      return Boolean(context === null || context === void 0 ? void 0 : context.pdf);
    }
    if (!isFulfilledContext(childContext)) {
      throw new Error("pdf is undefined");
    }
    const resolvedChildren = typeof children === "function" ? children(childContext) : children;
    return jsxRuntimeExports.jsx(documentContext.Provider, { value: childContext, children: resolvedChildren });
  }
  function renderContent() {
    if (!file) {
      return jsxRuntimeExports.jsx(Message, { type: "no-data", children: typeof noData === "function" ? noData() : noData });
    }
    if (pdf === void 0 || pdf === null) {
      return jsxRuntimeExports.jsx(Message, { type: "loading", children: typeof loading === "function" ? loading() : loading });
    }
    if (pdf === false) {
      return jsxRuntimeExports.jsx(Message, { type: "error", children: typeof error === "function" ? error() : error });
    }
    return renderChildren();
  }
  return jsxRuntimeExports.jsx("div", {
    className: clsx("react-pdf__Document", className),
    // Assertion is needed for React 18 compatibility
    ref: inputRef,
    ...eventProps,
    children: renderContent()
  });
});
function useDocumentContext() {
  return reactExports.useContext(documentContext);
}
const pageContext = reactExports.createContext(null);
function usePageContext() {
  return reactExports.useContext(pageContext);
}
function AnnotationLayer() {
  const documentContext2 = useDocumentContext();
  const pageContext2 = usePageContext();
  invariant(pageContext2);
  const mergedProps = { ...documentContext2, ...pageContext2 };
  const { filterAnnotations, imageResourcesPath, linkService, onGetAnnotationsError: onGetAnnotationsErrorProps, onGetAnnotationsSuccess: onGetAnnotationsSuccessProps, onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps, onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps, page, pdf, renderForms, rotate, scale = 1 } = mergedProps;
  invariant(pdf);
  invariant(page);
  invariant(linkService);
  const [annotationsState, annotationsDispatch] = useResolver();
  const { value: annotations, error: annotationsError } = annotationsState;
  const layerElement = reactExports.useRef(null);
  warning(Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--react-pdf-annotation-layer"), 10) === 1, "AnnotationLayer styles not found. Read more: https://github.com/wojtekmaj/react-pdf#support-for-annotations");
  function onLoadSuccess() {
    if (!annotations) {
      return;
    }
    if (onGetAnnotationsSuccessProps) {
      onGetAnnotationsSuccessProps(annotations);
    }
  }
  function onLoadError() {
    if (!annotationsError) {
      return;
    }
    warning(false, annotationsError.toString());
    if (onGetAnnotationsErrorProps) {
      onGetAnnotationsErrorProps(annotationsError);
    }
  }
  reactExports.useEffect(function resetAnnotations() {
    annotationsDispatch({ type: "RESET" });
  }, [annotationsDispatch, page]);
  reactExports.useEffect(function loadAnnotations() {
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getAnnotations());
    const runningTask = cancellable;
    cancellable.promise.then((nextAnnotations) => {
      annotationsDispatch({ type: "RESOLVE", value: nextAnnotations });
    }).catch((error) => {
      annotationsDispatch({ type: "REJECT", error });
    });
    return () => {
      cancelRunningTask(runningTask);
    };
  }, [annotationsDispatch, page]);
  reactExports.useEffect(() => {
    if (annotations === void 0) {
      return;
    }
    if (annotations === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [annotations]);
  function onRenderSuccess() {
    if (onRenderAnnotationLayerSuccessProps) {
      onRenderAnnotationLayerSuccessProps();
    }
  }
  function onRenderError(error) {
    warning(false, `${error}`);
    if (onRenderAnnotationLayerErrorProps) {
      onRenderAnnotationLayerErrorProps(error);
    }
  }
  const viewport = reactExports.useMemo(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  reactExports.useEffect(function renderAnnotationLayer() {
    if (!pdf || !page || !linkService || !annotations) {
      return;
    }
    const { current: layer } = layerElement;
    if (!layer) {
      return;
    }
    const clonedViewport = viewport.clone({ dontFlip: true });
    const annotationLayerParameters = {
      accessibilityManager: null,
      // TODO: Implement this
      annotationCanvasMap: null,
      // TODO: Implement this
      annotationEditorUIManager: null,
      // TODO: Implement this
      annotationStorage: pdf.annotationStorage,
      commentManager: null,
      // TODO: Implement this
      div: layer,
      l10n: null,
      // TODO: Implement this
      linkService,
      page,
      structTreeLayer: null,
      // TODO: Implement this
      viewport: clonedViewport
    };
    const renderParameters = {
      annotations: filterAnnotations ? filterAnnotations({ annotations }) : annotations,
      annotationStorage: pdf.annotationStorage,
      div: layer,
      imageResourcesPath,
      linkService,
      page,
      renderForms,
      viewport: clonedViewport
    };
    layer.innerHTML = "";
    try {
      new AnnotationLayer$1(annotationLayerParameters).render(renderParameters);
      onRenderSuccess();
    } catch (error) {
      onRenderError(error);
    }
    return () => {
    };
  }, [
    annotations,
    filterAnnotations,
    imageResourcesPath,
    linkService,
    page,
    pdf,
    renderForms,
    viewport
  ]);
  return jsxRuntimeExports.jsx("div", { className: clsx("react-pdf__Page__annotations", "annotationLayer"), ref: layerElement });
}
const PDF_ROLE_TO_HTML_ROLE = {
  // Document level structure types
  Document: null,
  // There's a "document" role, but it doesn't make sense here.
  DocumentFragment: null,
  // Grouping level structure types
  Part: "group",
  Sect: "group",
  // XXX: There's a "section" role, but it's abstract.
  Div: "group",
  Aside: "note",
  NonStruct: "none",
  // Block level structure types
  P: null,
  // H<n>,
  H: "heading",
  Title: null,
  FENote: "note",
  // Sub-block level structure type
  Sub: "group",
  // General inline level structure types
  Lbl: null,
  Span: null,
  Em: null,
  Strong: null,
  Link: "link",
  Annot: "note",
  Form: "form",
  // Ruby and Warichu structure types
  Ruby: null,
  RB: null,
  RT: null,
  RP: null,
  Warichu: null,
  WT: null,
  WP: null,
  // List standard structure types
  L: "list",
  LI: "listitem",
  LBody: null,
  // Table standard structure types
  Table: "table",
  TR: "row",
  TH: "columnheader",
  TD: "cell",
  THead: "columnheader",
  TBody: null,
  TFoot: null,
  // Standard structure type Caption
  Caption: null,
  // Standard structure type Figure
  Figure: "figure",
  // Standard structure type Formula
  Formula: null,
  // standard structure type Artifact
  Artifact: null
};
const HEADING_PATTERN = /^H(\d+)$/;
function isPdfRole(role) {
  return role in PDF_ROLE_TO_HTML_ROLE;
}
function isStructTreeNode(node) {
  return "children" in node;
}
function isStructTreeNodeWithOnlyContentChild(node) {
  if (!isStructTreeNode(node)) {
    return false;
  }
  return node.children.length === 1 && 0 in node.children && "id" in node.children[0];
}
function getRoleAttributes(node) {
  const attributes = {};
  if (isStructTreeNode(node)) {
    const { role } = node;
    const matches = role.match(HEADING_PATTERN);
    if (matches) {
      attributes.role = "heading";
      attributes["aria-level"] = Number(matches[1]);
    } else if (isPdfRole(role)) {
      const htmlRole = PDF_ROLE_TO_HTML_ROLE[role];
      if (htmlRole) {
        attributes.role = htmlRole;
      }
    }
  }
  return attributes;
}
function getBaseAttributes(node) {
  const attributes = {};
  if (isStructTreeNode(node)) {
    if (node.alt !== void 0) {
      attributes["aria-label"] = node.alt;
    }
    if (node.lang !== void 0) {
      attributes.lang = node.lang;
    }
    if (isStructTreeNodeWithOnlyContentChild(node)) {
      const [child] = node.children;
      if (child) {
        const childAttributes = getBaseAttributes(child);
        return {
          ...attributes,
          ...childAttributes
        };
      }
    }
  } else if ("id" in node) {
    attributes["aria-owns"] = node.id;
  }
  return attributes;
}
function getAttributes(node) {
  if (!node) {
    return null;
  }
  return {
    ...getRoleAttributes(node),
    ...getBaseAttributes(node)
  };
}
function StructTreeItem({ className, node }) {
  const attributes = reactExports.useMemo(() => getAttributes(node), [node]);
  const children = reactExports.useMemo(() => {
    if (!isStructTreeNode(node)) {
      return null;
    }
    if (isStructTreeNodeWithOnlyContentChild(node)) {
      return null;
    }
    return node.children.map((child, index) => {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is stable here
        jsxRuntimeExports.jsx(StructTreeItem, { node: child }, index)
      );
    });
  }, [node]);
  return jsxRuntimeExports.jsx("span", { className, ...attributes, children });
}
function StructTree() {
  const pageContext2 = usePageContext();
  invariant(pageContext2);
  const { onGetStructTreeError: onGetStructTreeErrorProps, onGetStructTreeSuccess: onGetStructTreeSuccessProps } = pageContext2;
  const [structTreeState, structTreeDispatch] = useResolver();
  const { value: structTree, error: structTreeError } = structTreeState;
  const { customTextRenderer, page } = pageContext2;
  function onLoadSuccess() {
    if (!structTree) {
      return;
    }
    if (onGetStructTreeSuccessProps) {
      onGetStructTreeSuccessProps(structTree);
    }
  }
  function onLoadError() {
    if (!structTreeError) {
      return;
    }
    warning(false, structTreeError.toString());
    if (onGetStructTreeErrorProps) {
      onGetStructTreeErrorProps(structTreeError);
    }
  }
  reactExports.useEffect(function resetStructTree() {
    structTreeDispatch({ type: "RESET" });
  }, [structTreeDispatch, page]);
  reactExports.useEffect(function loadStructTree() {
    if (customTextRenderer) {
      return;
    }
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getStructTree());
    const runningTask = cancellable;
    cancellable.promise.then((nextStructTree) => {
      structTreeDispatch({ type: "RESOLVE", value: nextStructTree });
    }).catch((error) => {
      structTreeDispatch({ type: "REJECT", error });
    });
    return () => cancelRunningTask(runningTask);
  }, [customTextRenderer, page, structTreeDispatch]);
  reactExports.useEffect(() => {
    if (structTree === void 0) {
      return;
    }
    if (structTree === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [structTree]);
  if (!structTree) {
    return null;
  }
  return jsxRuntimeExports.jsx(StructTreeItem, { className: "react-pdf__Page__structTree structTree", node: structTree });
}
const ANNOTATION_MODE = AnnotationMode;
function Canvas(props) {
  const pageContext2 = usePageContext();
  invariant(pageContext2);
  const mergedProps = { ...pageContext2, ...props };
  const { _className, canvasBackground, devicePixelRatio = getDevicePixelRatio(), onRenderError: onRenderErrorProps, onRenderSuccess: onRenderSuccessProps, page, renderForms, renderTextLayer, pageColors, rotate, scale } = mergedProps;
  const { canvasRef } = props;
  invariant(page);
  const canvasElement = reactExports.useRef(null);
  function onRenderSuccess() {
    if (!page) {
      return;
    }
    if (onRenderSuccessProps) {
      onRenderSuccessProps(makePageCallback(page, scale));
    }
  }
  function onRenderError(error) {
    if (isAbortException(error)) {
      return;
    }
    warning(false, error.toString());
    if (onRenderErrorProps) {
      onRenderErrorProps(error);
    }
  }
  const renderViewport = reactExports.useMemo(() => page.getViewport({ scale: scale * devicePixelRatio, rotation: rotate }), [devicePixelRatio, page, rotate, scale]);
  const viewport = reactExports.useMemo(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  reactExports.useEffect(function drawPageOnCanvas() {
    if (!page) {
      return;
    }
    page.cleanup();
    const { current: canvas } = canvasElement;
    if (!canvas) {
      return;
    }
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    canvas.style.visibility = "hidden";
    const renderContext = {
      annotationMode: renderForms ? ANNOTATION_MODE.ENABLE_FORMS : ANNOTATION_MODE.ENABLE,
      canvas,
      canvasContext: canvas.getContext("2d", { alpha: false }),
      pageColors,
      viewport: renderViewport
    };
    if (canvasBackground) {
      renderContext.background = canvasBackground;
    }
    const cancellable = page.render(renderContext);
    const runningTask = cancellable;
    cancellable.promise.then(() => {
      canvas.style.visibility = "";
      onRenderSuccess();
    }).catch(onRenderError);
    return () => cancelRunningTask(runningTask);
  }, [canvasBackground, page, pageColors, renderForms, renderViewport, viewport]);
  const cleanup = reactExports.useCallback(() => {
    const { current: canvas } = canvasElement;
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }, []);
  reactExports.useEffect(() => cleanup, [cleanup]);
  return jsxRuntimeExports.jsx("canvas", { className: `${_className}__canvas`, dir: "ltr", ref: mergeRefs(canvasRef, canvasElement), style: {
    display: "block",
    userSelect: "none"
  }, children: renderTextLayer ? jsxRuntimeExports.jsx(StructTree, {}) : null });
}
function isTextItem(item) {
  return "str" in item;
}
const BLOCKED_CUSTOM_TEXT_TAGS = /* @__PURE__ */ new Set([
  "base",
  "embed",
  "iframe",
  "link",
  "meta",
  "object",
  "script",
  "style",
  "template"
]);
const URL_ATTRIBUTES = /* @__PURE__ */ new Set(["action", "formaction", "href", "poster", "src", "xlink:href"]);
function isDangerousUrl(value) {
  let normalizedValue = "";
  for (const char of value) {
    const charCode = char.charCodeAt(0);
    if (charCode <= 32 || charCode === 127) {
      continue;
    }
    normalizedValue += char.toLowerCase();
  }
  return normalizedValue.startsWith("javascript:") || normalizedValue.startsWith("vbscript:");
}
function isElementNode(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
function isHtmlElement(node) {
  return isElementNode(node) && node instanceof HTMLElement;
}
function isBlockedCustomTextElement(node) {
  return isHtmlElement(node) && BLOCKED_CUSTOM_TEXT_TAGS.has(node.tagName.toLowerCase());
}
function sanitizeCustomHtmlElement(element) {
  const sanitizedElement = document.createElement(element.tagName.toLowerCase());
  Array.from(element.attributes).forEach((attribute) => {
    const attributeName = attribute.name.toLowerCase();
    if (attributeName.startsWith("on") || attributeName === "srcdoc") {
      return;
    }
    if (URL_ATTRIBUTES.has(attributeName) && isDangerousUrl(attribute.value)) {
      return;
    }
    sanitizedElement.setAttribute(attribute.name, attribute.value);
  });
  Array.from(element.childNodes).forEach((child) => {
    sanitizedElement.append(sanitizeCustomTextNode(child));
  });
  return sanitizedElement;
}
function sanitizeCustomTextNode(node) {
  var _a;
  if (isHtmlElement(node) && !isBlockedCustomTextElement(node)) {
    return sanitizeCustomHtmlElement(node);
  }
  return document.createTextNode((_a = node.textContent) !== null && _a !== void 0 ? _a : "");
}
function renderSafeCustomText(target, content) {
  const template = document.createElement("template");
  template.innerHTML = content;
  const sanitizedFragment = document.createDocumentFragment();
  Array.from(template.content.childNodes).forEach((child) => {
    sanitizedFragment.append(sanitizeCustomTextNode(child));
  });
  target.replaceChildren(sanitizedFragment);
}
function TextLayer() {
  const pageContext2 = usePageContext();
  invariant(pageContext2);
  const { customTextRenderer, onGetTextError, onGetTextSuccess, onRenderTextLayerError, onRenderTextLayerSuccess, page, pageIndex, pageNumber, rotate, scale } = pageContext2;
  invariant(page);
  const [textContentState, textContentDispatch] = useResolver();
  const { value: textContent, error: textContentError } = textContentState;
  const layerElement = reactExports.useRef(null);
  warning(Number.parseInt(window.getComputedStyle(document.body).getPropertyValue("--react-pdf-text-layer"), 10) === 1, "TextLayer styles not found. Read more: https://github.com/wojtekmaj/react-pdf#support-for-text-layer");
  function onLoadSuccess() {
    if (!textContent) {
      return;
    }
    if (onGetTextSuccess) {
      onGetTextSuccess(textContent);
    }
  }
  function onLoadError() {
    if (!textContentError) {
      return;
    }
    warning(false, textContentError.toString());
    if (onGetTextError) {
      onGetTextError(textContentError);
    }
  }
  reactExports.useEffect(function resetTextContent() {
    textContentDispatch({ type: "RESET" });
  }, [page, textContentDispatch]);
  reactExports.useEffect(function loadTextContent() {
    if (!page) {
      return;
    }
    const cancellable = makeCancellablePromise(page.getTextContent());
    const runningTask = cancellable;
    cancellable.promise.then((nextTextContent) => {
      textContentDispatch({ type: "RESOLVE", value: nextTextContent });
    }).catch((error) => {
      textContentDispatch({ type: "REJECT", error });
    });
    return () => cancelRunningTask(runningTask);
  }, [page, textContentDispatch]);
  reactExports.useEffect(() => {
    if (textContent === void 0) {
      return;
    }
    if (textContent === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [textContent]);
  const onRenderSuccess = reactExports.useCallback(() => {
    if (onRenderTextLayerSuccess) {
      onRenderTextLayerSuccess();
    }
  }, [onRenderTextLayerSuccess]);
  const onRenderError = reactExports.useCallback((error) => {
    if (isAbortException(error)) {
      return;
    }
    warning(false, error.toString());
    if (onRenderTextLayerError) {
      onRenderTextLayerError(error);
    }
  }, [onRenderTextLayerError]);
  function onMouseDown() {
    const layer = layerElement.current;
    if (!layer) {
      return;
    }
    layer.classList.add("selecting");
  }
  function onMouseUp() {
    const layer = layerElement.current;
    if (!layer) {
      return;
    }
    layer.classList.remove("selecting");
  }
  const viewport = reactExports.useMemo(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale]);
  reactExports.useLayoutEffect(function renderTextLayer() {
    if (!page || !textContent) {
      return;
    }
    const { current: layer } = layerElement;
    if (!layer) {
      return;
    }
    layer.innerHTML = "";
    const textContentSource = page.streamTextContent({ includeMarkedContent: true });
    const parameters = {
      container: layer,
      textContentSource,
      viewport
    };
    const cancellable = new TextLayer$1(parameters);
    const runningTask = cancellable;
    cancellable.render().then(() => {
      const end = document.createElement("div");
      end.className = "endOfContent";
      layer.append(end);
      const layerChildren = layer.querySelectorAll('[role="presentation"]');
      if (customTextRenderer) {
        let index = 0;
        textContent.items.forEach((item, itemIndex) => {
          if (!isTextItem(item)) {
            return;
          }
          const child = layerChildren[index];
          if (!child) {
            return;
          }
          const content = customTextRenderer({
            pageIndex,
            pageNumber,
            itemIndex,
            ...item
          });
          renderSafeCustomText(child, content);
          index += item.str && item.hasEOL ? 2 : 1;
        });
      }
      onRenderSuccess();
    }).catch(onRenderError);
    return () => cancelRunningTask(runningTask);
  }, [
    customTextRenderer,
    onRenderError,
    onRenderSuccess,
    page,
    pageIndex,
    pageNumber,
    textContent,
    viewport
  ]);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: False positive caused by non interactive wrapper listening for bubbling events
    jsxRuntimeExports.jsx("div", { className: clsx("react-pdf__Page__textContent", "textLayer"), onMouseUp, onMouseDown, ref: layerElement })
  );
}
const defaultScale = 1;
function Page(props) {
  const documentContext2 = useDocumentContext();
  const mergedProps = { ...documentContext2, ...props };
  const { _className = "react-pdf__Page", _enableRegisterUnregisterPage = true, canvasBackground, canvasRef, children, className, customRenderer: CustomRenderer, customTextRenderer, devicePixelRatio, error = "Failed to load the page.", filterAnnotations, height, inputRef, loading = "Loading page…", noData = "No page specified.", onGetAnnotationsError: onGetAnnotationsErrorProps, onGetAnnotationsSuccess: onGetAnnotationsSuccessProps, onGetStructTreeError: onGetStructTreeErrorProps, onGetStructTreeSuccess: onGetStructTreeSuccessProps, onGetTextError: onGetTextErrorProps, onGetTextSuccess: onGetTextSuccessProps, onLoadError: onLoadErrorProps, onLoadSuccess: onLoadSuccessProps, onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps, onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps, onRenderError: onRenderErrorProps, onRenderSuccess: onRenderSuccessProps, onRenderTextLayerError: onRenderTextLayerErrorProps, onRenderTextLayerSuccess: onRenderTextLayerSuccessProps, pageColors, pageIndex: pageIndexProps, pageNumber: pageNumberProps, pdf, registerPage, renderAnnotationLayer: renderAnnotationLayerProps = true, renderForms = false, renderMode = "canvas", renderTextLayer: renderTextLayerProps = true, rotate: rotateProps, scale: scaleProps = defaultScale, unregisterPage, width, ...otherProps } = mergedProps;
  const [pageState, pageDispatch] = useResolver();
  const { value: page, error: pageError } = pageState;
  const pageElement = reactExports.useRef(null);
  invariant(pdf);
  const pageIndex = isProvided(pageNumberProps) ? pageNumberProps - 1 : pageIndexProps !== null && pageIndexProps !== void 0 ? pageIndexProps : null;
  const pageNumber = pageNumberProps !== null && pageNumberProps !== void 0 ? pageNumberProps : isProvided(pageIndexProps) ? pageIndexProps + 1 : null;
  const rotate = rotateProps !== null && rotateProps !== void 0 ? rotateProps : page ? page.rotate : null;
  const scale = reactExports.useMemo(() => {
    if (!page) {
      return null;
    }
    let pageScale = 1;
    const scaleWithDefault = scaleProps !== null && scaleProps !== void 0 ? scaleProps : defaultScale;
    if (width || height) {
      const viewport = page.getViewport({ scale: 1, rotation: rotate });
      if (width) {
        pageScale = width / viewport.width;
      } else if (height) {
        pageScale = height / viewport.height;
      }
    }
    return scaleWithDefault * pageScale;
  }, [height, page, rotate, scaleProps, width]);
  reactExports.useEffect(function hook() {
    return () => {
      if (!isProvided(pageIndex)) {
        return;
      }
      if (_enableRegisterUnregisterPage && unregisterPage) {
        unregisterPage(pageIndex);
      }
    };
  }, [_enableRegisterUnregisterPage, pdf, pageIndex, unregisterPage]);
  function onLoadSuccess() {
    if (onLoadSuccessProps) {
      if (!page || !scale) {
        return;
      }
      onLoadSuccessProps(makePageCallback(page, scale));
    }
    if (_enableRegisterUnregisterPage && registerPage) {
      if (!isProvided(pageIndex) || !pageElement.current) {
        return;
      }
      registerPage(pageIndex, pageElement.current);
    }
  }
  function onLoadError() {
    if (!pageError) {
      return;
    }
    warning(false, pageError.toString());
    if (onLoadErrorProps) {
      onLoadErrorProps(pageError);
    }
  }
  reactExports.useEffect(function resetPage() {
    pageDispatch({ type: "RESET" });
  }, [pageDispatch, pdf, pageIndex]);
  reactExports.useEffect(function loadPage() {
    if (!pdf || !pageNumber) {
      return;
    }
    const cancellable = makeCancellablePromise(pdf.getPage(pageNumber));
    const runningTask = cancellable;
    cancellable.promise.then((nextPage) => {
      pageDispatch({ type: "RESOLVE", value: nextPage });
    }).catch((error2) => {
      pageDispatch({ type: "REJECT", error: error2 });
    });
    return () => cancelRunningTask(runningTask);
  }, [pageDispatch, pdf, pageNumber]);
  reactExports.useEffect(() => {
    if (page === void 0) {
      return;
    }
    if (page === false) {
      onLoadError();
      return;
    }
    onLoadSuccess();
  }, [page, scale]);
  const childContext = reactExports.useMemo(() => (
    // Technically there cannot be page without pageIndex, pageNumber, rotate and scale, but TypeScript doesn't know that
    isProvided(pageIndex) && pageNumber && isProvided(rotate) && isProvided(scale) ? {
      _className,
      canvasBackground,
      customTextRenderer,
      devicePixelRatio,
      filterAnnotations,
      onGetAnnotationsError: onGetAnnotationsErrorProps,
      onGetAnnotationsSuccess: onGetAnnotationsSuccessProps,
      onGetStructTreeError: onGetStructTreeErrorProps,
      onGetStructTreeSuccess: onGetStructTreeSuccessProps,
      onGetTextError: onGetTextErrorProps,
      onGetTextSuccess: onGetTextSuccessProps,
      onRenderAnnotationLayerError: onRenderAnnotationLayerErrorProps,
      onRenderAnnotationLayerSuccess: onRenderAnnotationLayerSuccessProps,
      onRenderError: onRenderErrorProps,
      onRenderSuccess: onRenderSuccessProps,
      onRenderTextLayerError: onRenderTextLayerErrorProps,
      onRenderTextLayerSuccess: onRenderTextLayerSuccessProps,
      page,
      pageColors,
      pageIndex,
      pageNumber,
      renderForms,
      renderTextLayer: renderTextLayerProps,
      rotate,
      scale
    } : null
  ), [
    _className,
    canvasBackground,
    customTextRenderer,
    devicePixelRatio,
    filterAnnotations,
    onGetAnnotationsErrorProps,
    onGetAnnotationsSuccessProps,
    onGetStructTreeErrorProps,
    onGetStructTreeSuccessProps,
    onGetTextErrorProps,
    onGetTextSuccessProps,
    onRenderAnnotationLayerErrorProps,
    onRenderAnnotationLayerSuccessProps,
    onRenderErrorProps,
    onRenderSuccessProps,
    onRenderTextLayerErrorProps,
    onRenderTextLayerSuccessProps,
    page,
    pageColors,
    pageIndex,
    pageNumber,
    renderForms,
    renderTextLayerProps,
    rotate,
    scale
  ]);
  const eventProps = reactExports.useMemo(
    () => makeEventProps(otherProps, () => page ? scale ? makePageCallback(page, scale) : void 0 : page),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps, page, scale]
  );
  const pageKey = `${pageIndex}@${scale}/${rotate}`;
  function renderMainLayer() {
    switch (renderMode) {
      case "custom": {
        invariant(CustomRenderer);
        return jsxRuntimeExports.jsx(CustomRenderer, {}, `${pageKey}_custom`);
      }
      case "none":
        return null;
      case "canvas":
      default:
        return jsxRuntimeExports.jsx(Canvas, { canvasRef }, `${pageKey}_canvas`);
    }
  }
  function renderTextLayer() {
    if (!renderTextLayerProps) {
      return null;
    }
    return jsxRuntimeExports.jsx(TextLayer, {}, `${pageKey}_text`);
  }
  function renderAnnotationLayer() {
    if (!renderAnnotationLayerProps) {
      return null;
    }
    return jsxRuntimeExports.jsx(AnnotationLayer, {}, `${pageKey}_annotations`);
  }
  function renderChildren() {
    function isFulfilledContext(context) {
      return Boolean(context === null || context === void 0 ? void 0 : context.page);
    }
    if (!isFulfilledContext(childContext)) {
      throw new Error("page is undefined");
    }
    const resolvedChildren = typeof children === "function" ? children(childContext) : children;
    return jsxRuntimeExports.jsxs(pageContext.Provider, { value: childContext, children: [renderMainLayer(), renderTextLayer(), renderAnnotationLayer(), resolvedChildren] });
  }
  function renderContent() {
    if (!pageNumber) {
      return jsxRuntimeExports.jsx(Message, { type: "no-data", children: typeof noData === "function" ? noData() : noData });
    }
    if (pdf === null || page === void 0 || page === null) {
      return jsxRuntimeExports.jsx(Message, { type: "loading", children: typeof loading === "function" ? loading() : loading });
    }
    if (pdf === false || page === false) {
      return jsxRuntimeExports.jsx(Message, { type: "error", children: typeof error === "function" ? error() : error });
    }
    return renderChildren();
  }
  return jsxRuntimeExports.jsx("div", {
    className: clsx(_className, className),
    "data-page-number": pageNumber,
    // Assertion is needed for React 18 compatibility
    ref: mergeRefs(inputRef, pageElement),
    style: {
      "--scale-round-x": "1px",
      "--scale-round-y": "1px",
      "--scale-factor": "1",
      "--user-unit": `${scale}`,
      "--total-scale-factor": "calc(var(--scale-factor) * var(--user-unit))",
      backgroundColor: canvasBackground || "white",
      position: "relative",
      minWidth: "min-content",
      minHeight: "min-content"
    },
    ...eventProps,
    children: renderContent()
  });
}
displayWorkerWarning();
GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";
export {
  Document as D,
  Page as P
};
