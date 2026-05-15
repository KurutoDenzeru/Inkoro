import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as cn } from "./index-B7IUyegr.mjs";
import { j as useSensors, i as useSensor, D as DndContext, c as closestCenter, a as KeyboardSensor, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, s as sortableKeyboardCoordinates, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { D as Document, P as Page } from "../_libs/react-pdf.mjs";
import { M as Moveable } from "../_libs/react-moveable.mjs";
import { P as PDFDocument, S as StandardFonts, d as degrees, r as rgb } from "../_libs/pdf-lib.mjs";
import { D as Drawer$1 } from "../_libs/vaul.mjs";
import { z } from "../_libs/next-themes.mjs";
import { M as Menu, F as FileText, L as Layers, D as Download, v as RefreshCw, K as Trash2, O as Undo, R as Redo, g as Copy, f as Clipboard, Z as ZoomIn, V as ZoomOut, z as Sun, r as Moon, q as Monitor, j as Info, o as LoaderCircle, t as PanelLeftOpen, s as MousePointer2, N as Type, I as Image$1, x as Signature, w as Shapes, y as Square, e as Circle, p as Minus, A as ArrowRight, b as ChevronLeft, c as ChevronRight, E as EllipsisVertical, S as Settings2, u as PenLine, X, B as Bold, l as Italic, U as Underline, J as TextAlignStart, T as TextAlignCenter, H as TextAlignEnd, Q as Upload, G as Github, k as Instagram, n as Linkedin, i as GripVertical, m as Link, h as Eraser, a as ChevronDown, C as Check, d as ChevronUp, P as PanelLeft } from "../_libs/lucide-react.mjs";
import { c as create } from "../_libs/zustand.mjs";
import { W as TooltipProvider$1, _ as useRender, Z as mergeProps, l as MenuRoot, X as TooltipRoot, o as MenuTrigger, Y as TooltipTrigger$1, U as TooltipPortal, V as TooltipPositioner, R as TooltipPopup, Q as TooltipArrow, O as TabsRoot, T as TabsList$1, P as TabsTab, N as TabsPanel, B as Button$1, w as SelectRoot, e as DialogRoot, c as DialogPopup, a as DialogClose, f as DialogTitle$1, b as DialogDescription$1, j as MenuPortal, k as MenuPositioner, i as MenuPopup, M as MenuGroup, g as MenuGroupLabel, h as MenuItem, C as Separator$1, m as MenuSubmenuRoot, n as MenuSubmenuTrigger, I as Input$1, z as SelectTrigger$1, S as SelectIcon, A as SelectValue$1, u as SelectPortal, v as SelectPositioner, t as SelectPopup, s as SelectList, p as SelectItem$1, r as SelectItemText, q as SelectItemIndicator, G as SliderRoot, E as SliderControl, J as SliderTrack, F as SliderIndicator, H as SliderThumb, K as SwitchRoot, L as SwitchThumb, d as DialogPortal$1, D as DialogBackdrop, y as SelectScrollUpArrow, x as SelectScrollDownArrow } from "../_libs/base-ui__react.mjs";
import { v as version, G as GlobalWorkerOptions } from "../_libs/pdfjs-dist.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/dnd-kit__accessibility.mjs";
import "../_libs/dequal.mjs";
import "../_libs/make-cancellable-promise.mjs";
import "../_libs/make-event-props.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/warning.mjs";
import "../_libs/merge-refs.mjs";
import "../_libs/egjs__agent.mjs";
import "../_libs/framework-utils.mjs";
import "../_libs/daybrush__utils.mjs";
import "../_libs/scena__matrix.mjs";
import "../_libs/css-to-mat.mjs";
import "../_libs/egjs__children-differ.mjs";
import "../_libs/egjs__list-differ.mjs";
import "../_libs/scena__dragscroll.mjs";
import "../_libs/scena__event-emitter.mjs";
import "../_libs/overlap-area.mjs";
import "../_libs/gesto.mjs";
import "../_libs/react-css-styled.mjs";
import "../_libs/css-styled.mjs";
import "tslib";
import "../_libs/pdf-lib__standard-fonts.mjs";
import "../_libs/pako.mjs";
import "../_libs/pdf-lib__upng.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/base-ui__utils.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-none border border-transparent bg-clip-padding text-xs font-medium focus-visible:ring-1 aria-invalid:ring-1 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-none px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-none px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 rounded-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-none",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button$1,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Input$1,
    {
      type,
      "data-slot": "input",
      className: cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-none border bg-transparent px-2.5 py-1 text-xs transition-colors file:h-6 file:text-xs file:font-medium focus-visible:ring-1 aria-invalid:ring-1 md:text-xs file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator$1,
    {
      "data-slot": "separator",
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      ),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, { "data-slot": "sheet", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal$1, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogBackdrop,
    {
      "data-slot": "sheet-overlay",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 text-xs/relaxed duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50", className),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogPopup,
      {
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn("bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col bg-clip-padding text-xs/relaxed shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogClose,
            {
              "data-slot": "sheet-close",
              render: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  className: "absolute top-3 right-3",
                  size: "icon-sm"
                }
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {}
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("gap-0.5 p-4 flex flex-col", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle$1,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground text-sm font-medium", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription$1,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-xs/relaxed", className),
      ...props
    }
  );
}
function TooltipProvider({
  delay = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProvider$1,
    {
      "data-slot": "tooltip-provider",
      delay,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipRoot, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger$1, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipPositioner,
    {
      align,
      alignOffset,
      side,
      sideOffset,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TooltipPopup,
        {
          "data-slot": "tooltip-content",
          className: cn(
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-none px-3 py-1.5 text-xs bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin)",
            className
          ),
          ...props,
          children: [
            children,
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipArrow, { className: "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-none bg-foreground fill-foreground z-50 data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" })
          ]
        }
      )
    }
  ) });
}
function Kbd({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "kbd",
    {
      "data-slot": "kbd",
      className: cn(
        "bg-muted text-muted-foreground [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10 h-5 w-fit min-w-5 gap-1 rounded-none px-1 font-sans text-xs font-medium [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex items-center justify-center select-none",
        className
      ),
      ...props
    }
  );
}
function KbdGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "kbd",
    {
      "data-slot": "kbd-group",
      className: cn("gap-1 inline-flex items-center", className),
      ...props
    }
  );
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = reactExports.createContext(null);
function useSidebar() {
  const context = reactExports.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = reactExports.useState(false);
  const [_open, _setOpen] = reactExports.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = reactExports.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = reactExports.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  reactExports.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  reactExports.useEffect(() => {
    if (isMobile) {
      setOpen(false);
      setOpenMobile(false);
    } else {
      setOpenMobile(false);
    }
  }, [isMobile, setOpen, setOpenMobile]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = reactExports.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offExamples",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent",
              // Animate when expanding/collapsing for a smoother UX
              "data-[state=expanded]:animate-in data-[state=collapsed]:animate-out data-[state=expanded]:slide-in-from-left-10 data-[state=collapsed]:slide-out-to-left-10",
              // Right-side variants
              "group-data-[side=right]:data-[state=expanded]:slide-in-from-right-10 group-data-[side=right]:data-[state=collapsed]:slide-out-to-right-10",
              "group-data-[collapsible=offExamples]:w-0",
              "group-data-[side=right]:rotate-180",
              "group-data-[collapsible=icon]:hidden",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              // Slide/animate the container on expand/collapse for a nicer visual.
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width,transform,opacity] duration-200 ease-linear md:flex group-data-[collapsible=icon]:hidden",
              "data-[state=expanded]:animate-in data-[state=collapsed]:animate-out data-[state=expanded]:slide-in-from-left-10 data-[state=collapsed]:slide-out-to-left-10 data-[state=expanded]:fade-in data-[state=collapsed]:fade-out",
              "group-data-[side=right]:data-[state=expanded]:slide-in-from-right-10 group-data-[side=right]:data-[state=collapsed]:slide-out-to-right-10",
              side === "left" ? "left-0 group-data-[collapsible=offExamples]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offExamples]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-none group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  tooltip,
  ...props
}) {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";
  const defaultTooltip = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: SIDEBAR_KEYBOARD_SHORTCUT.toUpperCase() })
    ] })
  ] });
  const effectiveTooltip = tooltip ?? { children: defaultTooltip };
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        "data-sidebar": "trigger",
        "data-slot": "sidebar-trigger",
        className: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), className),
        onClick: (event) => {
          onClick?.(event);
          toggleSidebar();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeft, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
        ] })
      },
      props
    ),
    render: effectiveTooltip ? TooltipTrigger : void 0,
    state: {
      slot: "sidebar-trigger",
      sidebar: "trigger"
    }
  });
  if (!effectiveTooltip) return comp;
  const tooltipProps = typeof effectiveTooltip === "string" ? { children: effectiveTooltip } : effectiveTooltip;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    comp,
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, ...tooltipProps })
  ] });
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("gap-2 flex flex-col", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("gap-1 flex flex-col", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "no-scrollbar gap-0 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TabsRoot,
    {
      "data-slot": "tabs",
      "data-orientation": orientation,
      className: cn(
        "gap-2 group/tabs flex data-[orientation=horizontal]:flex-col",
        className
      ),
      ...props
    }
  );
}
const tabsListVariants = cva(
  "rounded-none p-[3px] group-data-horizontal/tabs:h-8 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TabsList$1,
    {
      "data-slot": "tabs-list",
      "data-variant": variant,
      className: cn(tabsListVariants({ variant }), className),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TabsTab,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "gap-1.5 rounded-none border border-transparent px-1.5 py-0.5 text-xs font-medium group-data-vertical/tabs:py-[calc(--spacing(1.25))] [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background dark:data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-foreground",
        "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TabsPanel,
    {
      "data-slot": "tabs-content",
      className: cn("text-xs/relaxed flex-1 outline-none", className),
      ...props
    }
  );
}
const HISTORY_LIMIT = 50;
const buildInkoroClipboardPayload = (elements) => JSON.stringify({ __inkoro: true, elements });
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const buildInkoroHtmlPayload = (elements, fallbackText) => {
  const encoded = encodeURIComponent(buildInkoroClipboardPayload(elements));
  return `<span data-inkoro="${encoded}">${escapeHtml(fallbackText)}</span>`;
};
const useEditorStore = create((set, get) => {
  let currentPdfObjectUrl = null;
  const PDF_PERSIST_SIZE_LIMIT = 3 * 1024 * 1024;
  let isHistoryApplying = false;
  const cloneLayers = (layers) => JSON.parse(JSON.stringify(layers));
  const captureSnapshot = () => ({
    layers: cloneLayers(get().layers),
    selectedElementId: get().selectedElementId,
    currentPage: get().currentPage
  });
  const recordHistory = () => {
    if (isHistoryApplying) return;
    const snapshot = captureSnapshot();
    set((state) => ({
      history: {
        past: [...state.history.past, snapshot].slice(-HISTORY_LIMIT),
        future: []
      }
    }));
  };
  return {
    pdfFile: null,
    pdfUrl: null,
    numPages: 0,
    currentPage: 1,
    scale: 1,
    pageDimensions: {},
    layers: {},
    selectedElementId: null,
    activeTool: "select",
    clipboard: null,
    history: { past: [], future: [] },
    isHydrating: typeof window !== "undefined",
    // true on client during initial load
    exportSession: () => {
      const snapshot = {
        numPages: get().numPages,
        currentPage: get().currentPage,
        scale: get().scale,
        pageDimensions: get().pageDimensions,
        layers: get().layers,
        activeTool: get().activeTool
      };
      try {
        const rawPdf = localStorage.getItem("inkoro-storage-pdf");
        if (rawPdf) {
          const pdfObj = JSON.parse(rawPdf);
          snapshot.pdf = { name: pdfObj.name, size: pdfObj.size, type: pdfObj.type };
        }
      } catch {
      }
      return JSON.stringify(snapshot);
    },
    importSession: (json) => {
      try {
        const data = JSON.parse(json);
        set((state) => ({
          numPages: typeof data.numPages === "number" ? data.numPages : state.numPages,
          currentPage: typeof data.currentPage === "number" ? data.currentPage : state.currentPage,
          scale: typeof data.scale === "number" ? data.scale : state.scale,
          pageDimensions: typeof data.pageDimensions === "object" ? data.pageDimensions : state.pageDimensions,
          layers: typeof data.layers === "object" ? data.layers : state.layers,
          activeTool: typeof data.activeTool === "string" ? data.activeTool : state.activeTool,
          history: { past: [], future: [] }
        }));
      } catch (err) {
        console.warn("Failed to import session:", err);
      }
    },
    clearSession: () => {
      try {
        localStorage.removeItem("inkoro-storage");
        localStorage.removeItem("inkoro-storage-pdf");
      } catch (e) {
      }
      set({
        numPages: 0,
        currentPage: 1,
        scale: 1,
        pageDimensions: {},
        layers: {},
        activeTool: "select",
        history: { past: [], future: [] }
      });
    },
    setPdfFile: (file) => {
      if (currentPdfObjectUrl) {
        try {
          URL.revokeObjectURL(currentPdfObjectUrl);
        } catch (e) {
        }
        currentPdfObjectUrl = null;
      }
      const url = URL.createObjectURL(file);
      currentPdfObjectUrl = url;
      set({ pdfFile: file, pdfUrl: url, currentPage: 1 });
      try {
        if (file.size <= PDF_PERSIST_SIZE_LIMIT && typeof FileReader !== "undefined") {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const payload = {
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result
              };
              localStorage.setItem("inkoro-storage-pdf", JSON.stringify(payload));
            } catch (e) {
            }
          };
          reader.readAsDataURL(file);
        } else {
          localStorage.removeItem("inkoro-storage-pdf");
        }
      } catch (e) {
      }
    },
    setNumPages: (num) => set((state) => ({
      numPages: num,
      currentPage: num > 0 ? Math.min(state.currentPage, num) : 1
    })),
    setCurrentPage: (page) => set({ currentPage: page }),
    setScale: (scale) => set({ scale }),
    setPageDimensions: (page, width, height) => set((state) => ({
      pageDimensions: {
        ...state.pageDimensions,
        [page]: { width, height }
      }
    })),
    addLayer: (page, layer) => {
      recordHistory();
      set((state) => ({
        layers: {
          ...state.layers,
          [page]: [...state.layers[page] || [], layer]
        }
      }));
    },
    updateLayer: (page, id, updates) => {
      recordHistory();
      set((state) => ({
        layers: {
          ...state.layers,
          [page]: (state.layers[page] || []).map(
            (l) => l.id === id ? {
              ...l,
              ...updates,
              style: updates.style ? { ...l.style, ...updates.style } : l.style
            } : l
          )
        }
      }));
    },
    removeLayer: (page, id) => {
      recordHistory();
      set((state) => ({
        layers: {
          ...state.layers,
          [page]: (state.layers[page] || []).filter((l) => l.id !== id)
        }
      }));
    },
    reorderLayers: (page, newLayers) => {
      recordHistory();
      set((state) => ({
        layers: {
          ...state.layers,
          [page]: newLayers
        }
      }));
    },
    selectElement: (id) => set({ selectedElementId: id }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    copySelection: async () => {
      const state = get();
      const sel = state.selectedElementId;
      if (!sel) return false;
      const el = (state.layers[state.currentPage] || []).find((x) => x.id === sel);
      if (!el) return false;
      const cloned = JSON.parse(JSON.stringify(el));
      set({ clipboard: { type: "elements", elements: [cloned] } });
      try {
        if (el.type === "text") {
          const plainText = el.content ?? "";
          if (navigator.clipboard && window.ClipboardItem) {
            const html = buildInkoroHtmlPayload([el], plainText);
            const clipboardItem = new ClipboardItem({
              "text/plain": new Blob([plainText], { type: "text/plain" }),
              "text/html": new Blob([html], { type: "text/html" })
            });
            await navigator.clipboard.write([clipboardItem]);
            return true;
          }
          await navigator.clipboard.writeText(plainText);
          return true;
        }
        if (el.type === "image" && el.content && el.content.startsWith("data:")) {
          const res = await fetch(el.content);
          const blob = await res.blob();
          if (navigator.clipboard && window.ClipboardItem) {
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([clipboardItem]);
            return true;
          }
        }
        await navigator.clipboard.writeText(JSON.stringify({ __inkoro: true, elements: [el] }));
        return true;
      } catch (err) {
        console.debug("Clipboard write not supported or denied", err);
        return true;
      }
    },
    pasteClipboard: async (page, x, y) => {
      const state = get();
      const cb = state.clipboard;
      if (!cb) return false;
      if (cb.type === "elements" && cb.elements.length > 0) {
        const offset = 10;
        let newId = null;
        for (const el of cb.elements) {
          const cloned = JSON.parse(JSON.stringify(el));
          cloned.id = crypto.randomUUID();
          cloned.x = typeof x === "number" ? x : cloned.x + offset;
          cloned.y = typeof y === "number" ? y : cloned.y + offset;
          get().addLayer(page, cloned);
          newId = cloned.id;
        }
        if (newId) get().selectElement(newId);
        return true;
      }
      if (cb.type === "text" && cb.text) {
        const id = crypto.randomUUID();
        const defaultPxWidth = 300;
        const userWidth = defaultPxWidth / (state.scale || 1);
        const userHeight = 30 / (state.scale || 1);
        const newElement = {
          id,
          type: "text",
          x: typeof x === "number" ? x : 100,
          y: typeof y === "number" ? y : 100,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: cb.text,
          style: { fontSize: 16, color: "#000000" }
        };
        get().addLayer(page, newElement);
        get().selectElement(id);
        return true;
      }
      if (cb.type === "image" && cb.dataUrl) {
        const id = crypto.randomUUID();
        const newElement = {
          id,
          type: "image",
          x: typeof x === "number" ? x : 100,
          y: typeof y === "number" ? y : 100,
          width: 200,
          height: 200,
          rotation: 0,
          content: cb.dataUrl,
          style: { opacity: 1 }
        };
        get().addLayer(page, newElement);
        get().selectElement(id);
        return true;
      }
      return false;
    },
    clearClipboard: () => set({ clipboard: null }),
    undo: () => {
      const state = get();
      if (state.history.past.length === 0) return;
      const previous = state.history.past[state.history.past.length - 1];
      const current = captureSnapshot();
      isHistoryApplying = true;
      set((s) => ({
        layers: cloneLayers(previous.layers),
        selectedElementId: previous.selectedElementId,
        currentPage: previous.currentPage,
        history: {
          past: s.history.past.slice(0, -1),
          future: [current, ...s.history.future].slice(0, HISTORY_LIMIT)
        }
      }));
      isHistoryApplying = false;
    },
    redo: () => {
      const state = get();
      if (state.history.future.length === 0) return;
      const next = state.history.future[0];
      const current = captureSnapshot();
      isHistoryApplying = true;
      set((s) => ({
        layers: cloneLayers(next.layers),
        selectedElementId: next.selectedElementId,
        currentPage: next.currentPage,
        history: {
          past: [...s.history.past, current].slice(-HISTORY_LIMIT),
          future: s.history.future.slice(1)
        }
      }));
      isHistoryApplying = false;
    }
  };
});
if (typeof window !== "undefined") {
  (async () => {
    try {
      const rawPdf = localStorage.getItem("inkoro-storage-pdf");
      if (rawPdf) {
        try {
          const pdfObj = JSON.parse(rawPdf);
          if (pdfObj && pdfObj.dataUrl) {
            const res = await fetch(pdfObj.dataUrl);
            const blob = await res.blob();
            const fileName = pdfObj.name || "document.pdf";
            const fileType = pdfObj.type || blob.type || "application/pdf";
            try {
              const restoredFile = new File([blob], fileName, { type: fileType });
              useEditorStore.getState().setPdfFile(restoredFile);
            } catch (e) {
              const url = URL.createObjectURL(blob);
              useEditorStore.setState((s) => ({ pdfFile: null, pdfUrl: url }));
            }
          }
        } catch (e) {
          console.debug("Failed to restore persisted PDF", e);
        }
      }
      const raw = localStorage.getItem("inkoro-storage");
      if (raw) {
        try {
          const data = JSON.parse(raw);
          useEditorStore.setState((s) => ({
            numPages: typeof data.numPages === "number" ? data.numPages : s.numPages,
            currentPage: typeof data.currentPage === "number" ? data.currentPage : s.currentPage,
            scale: typeof data.scale === "number" ? data.scale : s.scale,
            pageDimensions: typeof data.pageDimensions === "object" ? data.pageDimensions : s.pageDimensions,
            layers: typeof data.layers === "object" ? data.layers : s.layers,
            activeTool: typeof data.activeTool === "string" ? data.activeTool : s.activeTool
          }));
        } catch (e) {
          console.debug("Failed to hydrate inkoro-storage", e);
        }
      }
    } catch (e) {
      console.debug("Failed during hydration", e);
    } finally {
      useEditorStore.setState({ isHydrating: false });
    }
  })();
  if (!window.__inkoro_store_subscribed) {
    useEditorStore.subscribe((state) => {
      const toSave = {
        numPages: state.numPages,
        currentPage: state.currentPage,
        scale: state.scale,
        pageDimensions: state.pageDimensions,
        layers: state.layers,
        activeTool: state.activeTool
      };
      try {
        localStorage.setItem("inkoro-storage", JSON.stringify(toSave));
      } catch {
      }
    });
    window.__inkoro_store_subscribed = true;
  }
}
function Dialog({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, { "data-slot": "dialog", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal$1, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogBackdrop,
    {
      "data-slot": "dialog-overlay",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50", className),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogPopup,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 grid max-w-[calc(100%-2rem)] gap-4 rounded-none p-4 text-xs/relaxed ring-1 duration-100 sm:max-w-sm fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogClose,
            {
              "data-slot": "dialog-close",
              render: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  className: "absolute top-2 right-2",
                  size: "icon-sm"
                }
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  X,
                  {}
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("gap-1 text-left flex flex-col", className),
      ...props
    }
  );
}
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline" }), children: "Close" })
      ]
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle$1,
    {
      "data-slot": "dialog-title",
      className: cn("text-sm font-medium", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription$1,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground *:[a]:hover:text-foreground text-xs/relaxed *:[a]:underline *:[a]:underline-offset-3", className),
      ...props
    }
  );
}
function UploadDialog() {
  const { pdfFile, setPdfFile, isHydrating } = useEditorStore();
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const onDrop = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);
  const onDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const onDragLeave = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  const onInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !pdfFile && !isHydrating, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { showCloseButton: false, className: "sm:max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Upload PDF" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Start by uploading a PDF file to edit and annotate." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        ),
        onDrop,
        onDragOver,
        onDragLeave,
        onClick: () => document.getElementById("pdf-upload")?.click(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-4 rounded-none mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Click to upload or drag and drop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "SVG, PNG, JPG or GIF (max. 800x400px) - just kidding, PDF only!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              id: "pdf-upload",
              className: "hidden",
              accept: "application/pdf",
              onChange: onInputChange
            }
          )
        ]
      }
    )
  ] }) });
}
function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const getIcon = (type) => {
    switch (type) {
      case "text":
        return Type;
      case "image":
        return Image$1;
      case "signature":
        return PenLine;
      case "rect":
        return Square;
      case "circle":
        return Circle;
      case "line":
        return Minus;
      case "arrow":
        return ArrowRight;
      default:
        return Square;
    }
  };
  const Icon = getIcon(props.type);
  const handleClick = (e) => {
    props.onClick();
    try {
      window.dispatchEvent(new CustomEvent("inkoro-focus-element", { detail: { id: props.id } }));
    } catch (err) {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: setNodeRef, style, className: cn(
    "flex items-center gap-2 p-2 rounded-none mb-2 bg-card border min-w-0",
    props.selected ? "border-primary bg-primary/5" : "hover:bg-accent"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...attributes, ...listeners, className: "cursor-grab text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 cursor-pointer min-w-0", onClick: handleClick, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", title: props.label || props.type, children: props.label ?? props.type })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon-sm", className: "h-6 w-6 text-muted-foreground hover:text-destructive", onClick: props.onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
  ] });
}
function LayerList() {
  const { layers, currentPage, reorderLayers, selectedElementId, selectElement, removeLayer } = useEditorStore();
  const elements = layers[currentPage] || [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over.id);
      reorderLayers(currentPage, arrayMove(elements, oldIndex, newIndex));
    }
  }
  if (elements.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-8 text-sm", children: "No layers on this page" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SortableContext,
        {
          items: elements.map((e) => e.id),
          strategy: verticalListSortingStrategy,
          children: elements.slice().reverse().map((el) => {
            const label = el.type === "text" ? el.content ? String(el.content).split("\n")[0] : "Text" : el.type === "image" ? "Image" : el.type;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              SortableItem,
              {
                id: el.id,
                type: el.type,
                label,
                selected: el.id === selectedElementId,
                onClick: () => {
                  selectElement(el.id);
                  useEditorStore.getState().setActiveTool("select");
                  try {
                    window.dispatchEvent(new CustomEvent("inkoro-focus-element", { detail: { id: el.id } }));
                  } catch (err) {
                  }
                },
                onDelete: (e) => {
                  e.stopPropagation();
                  removeLayer(currentPage, el.id);
                }
              },
              el.id
            );
          })
        }
      )
    }
  );
}
function ThumbnailElement({ element, scale }) {
  const el = element;
  const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
  const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
  const startLocalX = (startPoint.x - el.x) * scale;
  const startLocalY = (startPoint.y - el.y) * scale;
  const endLocalX = (endPoint.x - el.x) * scale;
  const endLocalY = (endPoint.y - el.y) * scale;
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const sl = el.style?.sloppiness ?? 0;
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  const controlX = midX + nx * sl;
  const controlY = midY + ny * sl;
  const controlLocalX = (controlX - el.x) * scale;
  const controlLocalY = (controlY - el.y) * scale;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "absolute",
        left: `${el.x * scale}px`,
        top: `${el.y * scale}px`,
        width: `${el.width * scale}px`,
        height: `${el.height * scale}px`,
        transform: `rotate(${el.rotation}deg)`,
        backgroundColor: el.type === "line" || el.type === "arrow" ? "transparent" : ["rect", "circle"].includes(el.type) ? el.style.backgroundColor : el.style.backgroundColor || "transparent",
        color: el.style.color,
        fontSize: `${(el.style.fontSize || 16) * scale}px`,
        fontFamily: el.style.fontFamily || "Inter",
        fontWeight: el.style.fontWeight || "normal",
        fontStyle: el.style.fontStyle || "normal",
        textDecoration: el.style.textDecoration || "none",
        textAlign: el.style.textAlign || "left",
        border: `${(el.style.borderWidth || 0) * scale}px solid ${el.style.borderColor || "transparent"}`,
        borderTopLeftRadius: `${(el.style.borderTopLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderTopRightRadius: `${(el.style.borderTopRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderBottomLeftRadius: `${(el.style.borderBottomLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        borderBottomRightRadius: `${(el.style.borderBottomRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
        opacity: el.style.opacity ?? 1,
        padding: el.type === "text" ? `${4 * scale}px` : "0",
        overflow: "hidden"
      },
      children: [
        (el.type === "line" || el.type === "arrow") && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100%", height: "100%", style: { position: "absolute", top: 0, left: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: el.type === "arrow" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            el.style.arrowStart && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "marker",
              {
                id: `thumb-arrowhead-start-${el.id}`,
                markerWidth: "12",
                markerHeight: "12",
                refX: "6",
                refY: "6",
                orient: "auto-start-reverse",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "10 0, 10 12, 0 6", fill: el.style.backgroundColor || "#000000" })
              }
            ),
            el.style.arrowEnd && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "marker",
              {
                id: `thumb-arrowhead-end-${el.id}`,
                markerWidth: "12",
                markerHeight: "12",
                refX: "6",
                refY: "6",
                orient: "auto",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0 0, 10 6, 0 12", fill: el.style.backgroundColor || "#000000" })
              }
            )
          ] }) }),
          sl && sl > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`,
              stroke: el.style.backgroundColor || "#000000",
              strokeWidth: (el.style.borderWidth ?? 1) * scale,
              strokeDasharray: el.style.strokeStyle === "dashed" ? `${10 * scale}, ${5 * scale}` : el.style.strokeStyle === "dotted" ? `${2 * scale}, ${5 * scale}` : "none",
              fill: "none",
              markerStart: el.type === "arrow" && el.style.arrowStart ? `url(#thumb-arrowhead-start-${el.id})` : void 0,
              markerEnd: el.type === "arrow" && el.style.arrowEnd ? `url(#thumb-arrowhead-end-${el.id})` : void 0
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: startLocalX,
              y1: startLocalY,
              x2: endLocalX,
              y2: endLocalY,
              stroke: el.style.backgroundColor || "#000000",
              strokeWidth: (el.style.borderWidth ?? 1) * scale,
              strokeDasharray: el.style.strokeStyle === "dashed" ? `${10 * scale}, ${5 * scale}` : el.style.strokeStyle === "dotted" ? `${2 * scale}, ${5 * scale}` : "none",
              markerStart: el.type === "arrow" && el.style.arrowStart ? `url(#thumb-arrowhead-start-${el.id})` : void 0,
              markerEnd: el.type === "arrow" && el.style.arrowEnd ? `url(#thumb-arrowhead-end-${el.id})` : void 0
            }
          )
        ] }),
        (el.type === "image" || el.type === "signature") && el.content && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: el.content, alt: "element", style: { width: "100%", height: "100%", objectFit: "contain" } }),
        el.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height: "100%", wordWrap: "break-word", fontSize: `${(el.style.fontSize || 16) * scale}px` }, children: el.content })
      ]
    }
  );
}
function ThumbnailList() {
  const { pdfFile, numPages, currentPage, setCurrentPage, pageDimensions } = useEditorStore();
  if (!pdfFile || numPages === 0) return null;
  const thumbnailWidth = 180;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4 items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Document, { file: pdfFile, children: Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
    const pageElements = useEditorStore.getState().layers[page] || [];
    const pageDim = pageDimensions[page];
    pageDim ? Math.round(thumbnailWidth * (pageDim.height / pageDim.width)) : Math.round(thumbnailWidth * 1.4);
    const thumbnailScale = pageDim ? thumbnailWidth / pageDim.width : 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "cursor-pointer border-2 rounded-none overflow-hidden transition-all hover:shadow-md mb-1.5 flex flex-col items-center",
          currentPage === page ? "border-primary/50 hover:border-primary ring-2 ring-primary/20 shadow-lg" : "border-border/50 hover:border-primary"
        ),
        style: { width: thumbnailWidth },
        onClick: () => setCurrentPage(page),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative bg-white overflow-hidden w-full",
              style: { aspectRatio: pageDim ? `${pageDim.width}/${pageDim.height}` : "1/1.4" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Page,
                  {
                    pageNumber: page,
                    width: thumbnailWidth,
                    className: "bg-white",
                    renderTextLayer: false,
                    renderAnnotationLayer: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", children: pageElements.map((el) => /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbnailElement, { element: el, scale: thumbnailScale }, el.id)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full text-center text-xs border-t text-muted-foreground py-1 bg-muted font-medium", children: [
            "Page ",
            page
          ] })
        ]
      },
      page
    );
  }) }) });
}
if (typeof window !== "undefined") {
  GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}
function CanvasLayer({ pageIndex, scale }) {
  const {
    layers,
    addLayer,
    updateLayer,
    selectedElementId,
    selectElement,
    activeTool,
    setActiveTool
  } = useEditorStore();
  const elements = layers[pageIndex] || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const targetRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const elementRefs = reactExports.useRef({});
  const recentCenterDragRef = reactExports.useRef({});
  reactExports.useEffect(() => {
    if (selectedElementId && elementRefs.current[selectedElementId]) {
      targetRef.current = elementRefs.current[selectedElementId];
    } else {
      targetRef.current = null;
    }
  }, [selectedElementId, elements]);
  reactExports.useEffect(() => {
    const handleFocusEvent = (e) => {
      const detail = e?.detail;
      const id = detail?.id;
      if (!id) return;
      const elRef = elementRefs.current[id];
      if (elRef) {
        try {
          elRef.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        } catch (err) {
        }
        if (selectedElementId === id) {
          targetRef.current = elRef;
        } else {
          useEditorStore.getState().selectElement(id);
          setTimeout(() => {
            if (elementRefs.current[id]) {
              targetRef.current = elementRefs.current[id];
            }
          }, 40);
        }
      }
    };
    window.addEventListener("inkoro-focus-element", handleFocusEvent);
    return () => window.removeEventListener("inkoro-focus-element", handleFocusEvent);
  }, [selectedElementId]);
  const handleCanvasClick = (e) => {
    selectElement(null);
    if (activeTool === "select") {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const id = crypto.randomUUID();
    let newElement = null;
    if (activeTool === "text") {
      newElement = {
        id,
        type: "text",
        x,
        y,
        width: 200,
        height: 30,
        rotation: 0,
        content: "Double click to edit",
        style: { fontSize: 16, color: "#000000" }
      };
    } else if (activeTool === "rect") {
      newElement = {
        id,
        type: "rect",
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        style: { backgroundColor: "#ff0000", opacity: 1 }
      };
    } else if (activeTool === "circle") {
      newElement = {
        id,
        type: "circle",
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        style: { backgroundColor: "#ff0000", opacity: 1, borderRadius: 50 }
      };
    } else if (activeTool === "line") {
      const start = { x, y };
      const end = { x: x + 150, y };
      const minX = Math.min(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
      const rawHeight = Math.max(Math.abs(end.y - start.y), 10);
      const padding = 10;
      const newX = minX - padding;
      const newY = minY - padding;
      const newWidth = rawWidth + padding * 2;
      const newHeight = rawHeight + padding * 2;
      newElement = {
        id,
        type: "line",
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        rotation: 0,
        style: { backgroundColor: "#000000", opacity: 1, borderWidth: 1, start, end, sloppiness: 0 }
      };
    } else if (activeTool === "arrow") {
      const start = { x, y };
      const end = { x: x + 150, y };
      const minX = Math.min(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
      const rawHeight = Math.max(Math.abs(end.y - start.y), 10);
      const padding = 10;
      const newX = minX - padding;
      const newY = minY - padding;
      const newWidth = rawWidth + padding * 2;
      const newHeight = rawHeight + padding * 2;
      newElement = {
        id,
        type: "arrow",
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        rotation: 0,
        style: { backgroundColor: "#000000", opacity: 1, borderWidth: 1, arrowEnd: true, start, end, sloppiness: 0 }
      };
    }
    if (newElement) {
      addLayer(pageIndex, newElement);
      selectElement(id);
      setActiveTool("select");
    }
  };
  const handleElementClick = (e, id) => {
    e.stopPropagation();
    selectElement(id);
    if (elementRefs.current[id]) {
      targetRef.current = elementRefs.current[id];
    }
  };
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [draggingEndpoint, setDraggingEndpoint] = reactExports.useState(null);
  const isComposingRef = reactExports.useRef(false);
  const TEXT_PADDING_PX = 8;
  const TEXT_MIN_WIDTH_PX = 40;
  const TEXT_MIN_HEIGHT_PX = 24;
  reactExports.useEffect(() => {
    setIsEditing(false);
  }, [selectedElementId]);
  reactExports.useEffect(() => {
    const handleKeyDown = async (e) => {
      if (isEditing) return;
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const activeIsEditable = document.activeElement?.isContentEditable;
      if (activeTag === "input" || activeTag === "textarea" || activeIsEditable) return;
      if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.getState().undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y" || (e.key === "z" || e.key === "Z") && e.shiftKey)) {
        e.preventDefault();
        useEditorStore.getState().redo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        const { scale: currentScale, setScale } = useEditorStore.getState();
        setScale(Math.min(currentScale + 0.1, 3));
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "-" || e.key === "_")) {
        e.preventDefault();
        const { scale: currentScale, setScale } = useEditorStore.getState();
        setScale(Math.max(currentScale - 0.1, 0.5));
        return;
      }
      if (!selectedElementId) {
        if ((e.metaKey || e.ctrlKey) && (e.key === "v" || e.key === "V")) ;
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (layers[pageIndex]?.find((el) => el.id === selectedElementId)) {
          useEditorStore.getState().removeLayer(pageIndex, selectedElementId);
          selectElement(null);
        }
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        const ok = await useEditorStore.getState().copySelection();
        if (ok) {
          try {
            const { toast } = await import("../_libs/sonner.mjs");
            toast("Copied to clipboard");
          } catch (err) {
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, pageIndex, isEditing, layers]);
  reactExports.useEffect(() => {
    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 200, height: 200 });
      img.src = src;
    });
    const addImageFromDataUrl = async (dataUrl) => {
      try {
        const { cropImageDataUrl } = await import("./index-B7IUyegr.mjs").then((n) => n.u);
        const cropped = await cropImageDataUrl(dataUrl, true);
        const dims = { width: cropped.width, height: cropped.height };
        const src = cropped.dataUrl;
        const desiredPx = Math.min(dims.width, 600);
        const desiredPxHeight = Math.round(desiredPx * (dims.height / Math.max(1, dims.width)));
        const userWidth = desiredPx / scale;
        const userHeight = desiredPxHeight / scale;
        const container = containerRef.current?.getBoundingClientRect();
        const centerX = container ? container.width / 2 / scale : 100;
        const centerY = container ? container.height / 2 / scale : 100;
        const id = crypto.randomUUID();
        addLayer(pageIndex, {
          id,
          type: "image",
          x: centerX - userWidth / 2,
          y: centerY - userHeight / 2,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: src,
          style: { opacity: 1 }
        });
        selectElement(id);
        setActiveTool("select");
      } catch (err) {
        const dims = await loadImage(dataUrl);
        const desiredPx = Math.min(dims.width, 300);
        const desiredPxHeight = Math.round(desiredPx * (dims.height / Math.max(1, dims.width)));
        const userWidth = desiredPx / scale;
        const userHeight = desiredPxHeight / scale;
        const container = containerRef.current?.getBoundingClientRect();
        const centerX = container ? container.width / 2 / scale : 100;
        const centerY = container ? container.height / 2 / scale : 100;
        const id = crypto.randomUUID();
        addLayer(pageIndex, {
          id,
          type: "image",
          x: centerX - userWidth / 2,
          y: centerY - userHeight / 2,
          width: userWidth,
          height: userHeight,
          rotation: 0,
          content: dataUrl,
          style: { opacity: 1 }
        });
        selectElement(id);
        setActiveTool("select");
      }
    };
    const addTextFromString = (text) => {
      const id = crypto.randomUUID();
      const defaultPxWidth = 300;
      const userWidth = defaultPxWidth / scale;
      const userHeight = 30 / scale;
      const container = containerRef.current?.getBoundingClientRect();
      const centerX = container ? container.width / 2 / scale : 100;
      const centerY = container ? container.height / 2 / scale : 100;
      addLayer(pageIndex, {
        id,
        type: "text",
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: text,
        style: { fontSize: 16, color: "#000000" }
      });
      selectElement(id);
      setActiveTool("select");
    };
    const tryParseInkoroJson = (text) => {
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) return parsed.elements;
      } catch (err) {
      }
      return null;
    };
    const tryParseInkoroHtml = (html) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const node = doc.querySelector("[data-inkoro]");
        const payload = node?.getAttribute("data-inkoro");
        if (!payload) return null;
        const decoded = decodeURIComponent(payload);
        const parsed = JSON.parse(decoded);
        if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) return parsed.elements;
      } catch (err) {
      }
      return null;
    };
    const handlePaste = async (e) => {
      const cbEvent = e;
      if (!cbEvent.clipboardData) return;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const activeIsEditable = document.activeElement?.isContentEditable;
      if (activeTag === "input" || activeTag === "textarea" || activeIsEditable) return;
      const files = Array.from(cbEvent.clipboardData.files || []);
      if (files.length > 0) {
        for (const file of files) {
          if (file.type.startsWith("image/")) {
            const dataUrl = await fileToDataUrl(file);
            await addImageFromDataUrl(dataUrl);
          }
        }
        return;
      }
      const items = Array.from(cbEvent.clipboardData.items || []);
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const dataUrl = await fileToDataUrl(file);
            await addImageFromDataUrl(dataUrl);
            return;
          }
        }
      }
      const html = cbEvent.clipboardData.getData("text/html");
      if (html) {
        const inkElements = tryParseInkoroHtml(html);
        if (inkElements) {
          const offset = 10;
          let lastId = null;
          for (const el of inkElements) {
            const clone = JSON.parse(JSON.stringify(el));
            clone.id = crypto.randomUUID();
            clone.x = (clone.x ?? 100) + offset;
            clone.y = (clone.y ?? 100) + offset;
            addLayer(pageIndex, clone);
            lastId = clone.id;
          }
          if (lastId) selectElement(lastId);
          return;
        }
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const img = doc.querySelector("img");
          if (img && img.src) {
            await addImageFromDataUrl(img.src);
            return;
          }
        } catch (err) {
        }
      }
      const text = cbEvent.clipboardData.getData("text/plain");
      if (text) {
        const inkElements = tryParseInkoroJson(text);
        if (inkElements) {
          const offset = 10;
          let lastId = null;
          for (const el of inkElements) {
            const clone = JSON.parse(JSON.stringify(el));
            clone.id = crypto.randomUUID();
            clone.x = (clone.x ?? 100) + offset;
            clone.y = (clone.y ?? 100) + offset;
            addLayer(pageIndex, clone);
            lastId = clone.id;
          }
          if (lastId) selectElement(lastId);
          return;
        }
        addTextFromString(text);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [pageIndex, scale, addLayer, selectElement, setActiveTool]);
  const handleElementDoubleClick = (e, id, type) => {
    if (type === "text") {
      setIsEditing(true);
      requestAnimationFrame(() => {
        const elDiv = elementRefs.current[id];
        if (elDiv) {
          const editable = elDiv.querySelector("[contenteditable]");
          if (editable) {
            try {
              editable.focus();
              let offset = (editable.innerText || "").length;
              if (document.caretRangeFromPoint) {
                const range = document.caretRangeFromPoint(e.clientX, e.clientY);
                if (range) {
                  const preRange = range.cloneRange();
                  preRange.selectNodeContents(editable);
                  preRange.setEnd(range.endContainer, range.endOffset);
                  offset = preRange.toString().length;
                }
              } else if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                if (pos) {
                  const preRange = document.createRange();
                  preRange.setStart(editable, 0);
                  preRange.setEnd(pos.offsetNode, pos.offset);
                  offset = preRange.toString().length;
                }
              }
              setCaretPosition(editable, offset);
            } catch (err) {
            }
          }
        }
      });
    }
  };
  function getCaretCharacterOffsetWithin(element) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0).cloneRange();
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }
  function setCaretPosition(element, chars) {
    const range = document.createRange();
    const sel = window.getSelection();
    try {
      element.focus?.();
    } catch (e) {
    }
    let charCount = 0;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let node = walker.nextNode();
    while (node) {
      const textLength = node.textContent?.length || 0;
      if (charCount + textLength >= chars) {
        const offset = Math.max(0, chars - charCount);
        range.setStart(node, offset);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
        return;
      }
      charCount += textLength;
      node = walker.nextNode();
    }
    const walker2 = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let lastNode = null;
    while (node = walker2.nextNode()) lastNode = node;
    if (lastNode) {
      const length = lastNode.textContent?.length || 0;
      range.setStart(lastNode, length);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }
  const handleTextChange = (e, id) => {
    const target = e.currentTarget;
    const newContent = target.innerText;
    const caretOffset = getCaretCharacterOffsetWithin(target);
    const el = (layers[pageIndex] || []).find((layer) => layer.id === id);
    const updates = { content: newContent };
    if (el) {
      const neededWidthPx = Math.max(TEXT_MIN_WIDTH_PX, Math.ceil(target.scrollWidth + TEXT_PADDING_PX));
      const neededHeightPx = Math.max(TEXT_MIN_HEIGHT_PX, Math.ceil(target.scrollHeight + TEXT_PADDING_PX));
      const currentWidthPx = el.width * scale;
      const currentHeightPx = el.height * scale;
      if (Math.abs(neededWidthPx - currentWidthPx) > 1) {
        updates.width = neededWidthPx / scale;
      }
      if (Math.abs(neededHeightPx - currentHeightPx) > 1) {
        updates.height = neededHeightPx / scale;
      }
    }
    updateLayer(pageIndex, id, updates);
    if (!isComposingRef.current) {
      requestAnimationFrame(() => {
        try {
          setCaretPosition(target, caretOffset);
        } catch (err) {
          console.debug("Cursor restore failed", err);
        }
      });
    }
  };
  const handleBlur = () => {
    setIsEditing(false);
  };
  reactExports.useEffect(() => {
    const resizeTextElements = () => {
      for (const el of elements) {
        if (el.type !== "text") continue;
        const wrapper = elementRefs.current[el.id];
        if (!wrapper) continue;
        const contentEl = wrapper.querySelector("[data-inkoro-text]");
        if (!contentEl) continue;
        const neededWidthPx = Math.max(TEXT_MIN_WIDTH_PX, Math.ceil(contentEl.scrollWidth + TEXT_PADDING_PX));
        const neededHeightPx = Math.max(TEXT_MIN_HEIGHT_PX, Math.ceil(contentEl.scrollHeight + TEXT_PADDING_PX));
        const currentWidthPx = el.width * scale;
        const currentHeightPx = el.height * scale;
        const updates = {};
        if (Math.abs(neededWidthPx - currentWidthPx) > 1) {
          updates.width = neededWidthPx / scale;
        }
        if (Math.abs(neededHeightPx - currentHeightPx) > 1) {
          updates.height = neededHeightPx / scale;
        }
        if (Object.keys(updates).length > 0) {
          updateLayer(pageIndex, el.id, updates);
        }
      }
    };
    requestAnimationFrame(resizeTextElements);
  }, [elements, pageIndex, scale, updateLayer]);
  const handleEndpointMouseDown = (e, endpoint) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    setDraggingEndpoint(endpoint);
  };
  reactExports.useEffect(() => {
    if (!draggingEndpoint || !selectedElement || selectedElement.type !== "line" && selectedElement.type !== "arrow") return;
    const getCoords = (ev) => {
      if ("touches" in ev) {
        const t = ev.touches[0];
        return { clientX: t.clientX, clientY: t.clientY };
      } else {
        return { clientX: ev.clientX, clientY: ev.clientY };
      }
    };
    let animationFrameId = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const handlePointerMove = (e) => {
      const { clientX, clientY } = getCoords(e);
      lastMouseX = clientX;
      lastMouseY = clientY;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        const canvas = document.querySelector(".absolute.inset-0.z-20");
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (lastMouseX - rect.left) / scale;
        const mouseY = (lastMouseY - rect.top) / scale;
        const currStart = selectedElement.style?.start ?? { x: selectedElement.x, y: selectedElement.y + selectedElement.height / 2 };
        const currEnd = selectedElement.style?.end ?? { x: selectedElement.x + selectedElement.width, y: selectedElement.y + selectedElement.height / 2 };
        let newStart = { ...currStart };
        let newEnd = { ...currEnd };
        if (draggingEndpoint === "start") {
          newStart = { x: mouseX, y: mouseY };
        } else {
          newEnd = { x: mouseX, y: mouseY };
        }
        const newX = Math.min(newStart.x, newEnd.x);
        const newY = Math.min(newStart.y, newEnd.y);
        const newWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
        const newHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
        const borderWidth = selectedElement.style?.borderWidth ?? 1;
        const hasArrow = !!(selectedElement.style?.arrowStart || selectedElement.style?.arrowEnd);
        const arrowPad = hasArrow ? borderWidth * 3 : 0;
        const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
        const paddedX = newX - strokePadding;
        const paddedY = newY - strokePadding;
        const paddedWidth = newWidth + strokePadding * 2;
        const paddedHeight = newHeight + strokePadding * 2;
        updateLayer(pageIndex, selectedElement.id, {
          x: paddedX,
          y: paddedY,
          width: paddedWidth,
          height: paddedHeight,
          style: { ...selectedElement.style, start: newStart, end: newEnd }
        });
      });
    };
    const handlePointerUp = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      setDraggingEndpoint(null);
    };
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [draggingEndpoint, selectedElement, pageIndex, scale, updateLayer]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "absolute inset-0 z-20 overflow-hidden",
      onClick: handleCanvasClick,
      children: [
        elements.map((el, index) => {
          const isSelected = el.id === selectedElementId;
          const isTextEditing = isSelected && isEditing && el.type === "text";
          const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
          const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
          const startLocalX = (startPoint.x - el.x) * scale;
          const startLocalY = (startPoint.y - el.y) * scale;
          const endLocalX = (endPoint.x - el.x) * scale;
          const endLocalY = (endPoint.y - el.y) * scale;
          const dx = endPoint.x - startPoint.x;
          const dy = endPoint.y - startPoint.y;
          const len = Math.max(1, Math.hypot(dx, dy));
          const nx = -dy / len;
          const ny = dx / len;
          const sl = el.style?.sloppiness ?? 0;
          const midX = (startPoint.x + endPoint.x) / 2;
          const midY = (startPoint.y + endPoint.y) / 2;
          const controlX = midX + nx * sl;
          const controlY = midY + ny * sl;
          const controlLocalX = (controlX - el.x) * scale;
          const controlLocalY = (controlY - el.y) * scale;
          const borderWidth = el.style?.borderWidth ?? 1;
          const strokeWpx = borderWidth * scale;
          const rawMarker = Math.round(Math.max(8, Math.min(24, strokeWpx * 2)));
          const maxByLen = Math.max(8, Math.min(24, Math.round(len * scale * 0.25)));
          const markerLen = Math.min(rawMarker, maxByLen);
          const markerHalf = markerLen / 2;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              ref: (ref) => {
                elementRefs.current[el.id] = ref;
              },
              style: {
                position: "absolute",
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                width: `${el.width * scale}px`,
                height: `${el.height * scale}px`,
                transform: `rotate(${el.rotation}deg)`,
                backgroundColor: el.type === "line" || el.type === "arrow" ? "transparent" : ["rect", "circle"].includes(el.type) ? el.style.backgroundColor : el.style.backgroundColor || "transparent",
                color: el.style.color,
                fontSize: `${(el.style.fontSize || 16) * scale}px`,
                fontFamily: el.style.fontFamily || "Inter",
                fontWeight: el.style.fontWeight || "normal",
                fontStyle: el.style.fontStyle || "normal",
                textDecoration: el.style.textDecoration || "none",
                textAlign: el.style.textAlign || "left",
                border: `${el.style.borderWidth || 0}px solid ${el.style.borderColor || "transparent"}`,
                // Radius handling
                borderTopLeftRadius: `${(el.style.borderTopLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
                borderTopRightRadius: `${(el.style.borderTopRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
                borderBottomLeftRadius: `${(el.style.borderBottomLeftRadius ?? el.style.borderRadius ?? 0) * scale}px`,
                borderBottomRightRadius: `${(el.style.borderBottomRightRadius ?? el.style.borderRadius ?? 0) * scale}px`,
                opacity: el.style.opacity ?? 1,
                padding: el.type === "text" ? "4px" : "0",
                cursor: activeTool === "select" ? isSelected ? "move" : "pointer" : "default",
                outline: isSelected && !isEditing && el.type !== "line" && el.type !== "arrow" ? "2px solid #d97757" : "none",
                zIndex: isSelected ? 1e3 : index + 1
              },
              onClick: (e) => handleElementClick(e, el.id),
              onDoubleClick: (e) => handleElementDoubleClick(e, el.id, el.type),
              children: [
                (el.type === "line" || el.type === "arrow") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "svg",
                    {
                      width: "100%",
                      height: "100%",
                      style: { position: "absolute", top: 0, left: 0, pointerEvents: "none" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: el.type === "arrow" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          el.style.arrowStart && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "marker",
                            {
                              id: `arrowhead-start-${el.id}`,
                              markerUnits: "userSpaceOnUse",
                              markerWidth: markerLen,
                              markerHeight: markerLen,
                              refX: 0,
                              refY: markerHalf,
                              orient: "auto",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: `${markerLen} 0, 0 ${markerHalf}, ${markerLen} ${markerLen}`, fill: el.style.backgroundColor || "#000000" })
                            }
                          ),
                          el.style.arrowEnd && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "marker",
                            {
                              id: `arrowhead-end-${el.id}`,
                              markerUnits: "userSpaceOnUse",
                              markerWidth: markerLen,
                              markerHeight: markerLen,
                              refX: markerLen,
                              refY: markerHalf,
                              orient: "auto",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: `0 0, ${markerLen} ${markerHalf}, 0 ${markerLen}`, fill: el.style.backgroundColor || "#000000" })
                            }
                          )
                        ] }) }),
                        sl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: `M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`,
                            stroke: el.style.backgroundColor || "#000000",
                            strokeWidth: (el.style.borderWidth ?? 1) * scale,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeDasharray: el.style.strokeStyle === "dashed" ? "10, 5" : el.style.strokeStyle === "dotted" ? "2, 5" : "none",
                            fill: "none",
                            style: { pointerEvents: "stroke" },
                            markerStart: el.type === "arrow" && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : void 0,
                            markerEnd: el.type === "arrow" && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : void 0,
                            onClick: (e) => {
                              e.stopPropagation();
                              selectElement(el.id);
                              if (elementRefs.current[el.id]) {
                                targetRef.current = elementRefs.current[el.id];
                              }
                            },
                            onMouseDown: (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              selectElement(el.id);
                              if (elementRefs.current[el.id]) {
                                targetRef.current = elementRefs.current[el.id];
                              }
                              const startClientX = e.clientX;
                              const startClientY = e.clientY;
                              const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                              const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                              const handleMove = (ev) => {
                                const canvas = document.querySelector(".absolute.inset-0.z-20");
                                if (!canvas) return;
                                const dx2 = (ev.clientX - startClientX) / scale;
                                const dy2 = (ev.clientY - startClientY) / scale;
                                const newStart = { x: origStart.x + dx2, y: origStart.y + dy2 };
                                const newEnd = { x: origEnd.x + dx2, y: origEnd.y + dy2 };
                                const minX = Math.min(newStart.x, newEnd.x);
                                const minY = Math.min(newStart.y, newEnd.y);
                                const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                                const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                                const borderWidth2 = el.style?.borderWidth ?? 1;
                                const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                                const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                                const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                                const newX = minX - strokePadding;
                                const newY = minY - strokePadding;
                                const newWidth = rawWidth + strokePadding * 2;
                                const newHeight = rawHeight + strokePadding * 2;
                                updateLayer(pageIndex, el.id, {
                                  x: newX,
                                  y: newY,
                                  width: newWidth,
                                  height: newHeight,
                                  style: { ...el.style, start: newStart, end: newEnd }
                                });
                              };
                              const handleUp = () => {
                                document.removeEventListener("mousemove", handleMove);
                                document.removeEventListener("mouseup", handleUp);
                              };
                              document.addEventListener("mousemove", handleMove);
                              document.addEventListener("mouseup", handleUp);
                            }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: startLocalX,
                            y1: startLocalY,
                            x2: endLocalX,
                            y2: endLocalY,
                            stroke: el.style.backgroundColor || "#000000",
                            strokeWidth: (el.style.borderWidth ?? 1) * scale,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeDasharray: el.style.strokeStyle === "dashed" ? "10, 5" : el.style.strokeStyle === "dotted" ? "2, 5" : "none",
                            style: { pointerEvents: "stroke" },
                            markerStart: el.type === "arrow" && el.style.arrowStart ? `url(#arrowhead-start-${el.id})` : void 0,
                            markerEnd: el.type === "arrow" && el.style.arrowEnd ? `url(#arrowhead-end-${el.id})` : void 0,
                            onClick: (e) => {
                              e.stopPropagation();
                              selectElement(el.id);
                              if (elementRefs.current[el.id]) {
                                targetRef.current = elementRefs.current[el.id];
                              }
                            },
                            onMouseDown: (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              selectElement(el.id);
                              if (elementRefs.current[el.id]) {
                                targetRef.current = elementRefs.current[el.id];
                              }
                              const startClientX = e.clientX;
                              const startClientY = e.clientY;
                              const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                              const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                              const handleMove = (ev) => {
                                const canvas = document.querySelector(".absolute.inset-0.z-20");
                                if (!canvas) return;
                                const dx2 = (ev.clientX - startClientX) / scale;
                                const dy2 = (ev.clientY - startClientY) / scale;
                                const newStart = { x: origStart.x + dx2, y: origStart.y + dy2 };
                                const newEnd = { x: origEnd.x + dx2, y: origEnd.y + dy2 };
                                const minX = Math.min(newStart.x, newEnd.x);
                                const minY = Math.min(newStart.y, newEnd.y);
                                const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                                const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                                const borderWidth2 = el.style?.borderWidth ?? 1;
                                const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                                const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                                const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                                const newX = minX - strokePadding;
                                const newY = minY - strokePadding;
                                const newWidth = rawWidth + strokePadding * 2;
                                const newHeight = rawHeight + strokePadding * 2;
                                updateLayer(pageIndex, el.id, {
                                  x: newX,
                                  y: newY,
                                  width: newWidth,
                                  height: newHeight,
                                  style: { ...el.style, start: newStart, end: newEnd }
                                });
                              };
                              const handleUp = () => {
                                document.removeEventListener("mousemove", handleMove);
                                document.removeEventListener("mouseup", handleUp);
                              };
                              document.addEventListener("mousemove", handleMove);
                              document.addEventListener("mouseup", handleUp);
                            }
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "auto",
                        cursor: isSelected ? "move" : "pointer",
                        zIndex: 50
                      },
                      onMouseDown: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectElement(el.id);
                        const startClientX = e.clientX;
                        const startClientY = e.clientY;
                        const origStart = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                        const origEnd = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                        const handleMove = (ev) => {
                          const canvas = document.querySelector(".absolute.inset-0.z-20");
                          if (!canvas) return;
                          const dx2 = (ev.clientX - startClientX) / scale;
                          const dy2 = (ev.clientY - startClientY) / scale;
                          const newStart = { x: origStart.x + dx2, y: origStart.y + dy2 };
                          const newEnd = { x: origEnd.x + dx2, y: origEnd.y + dy2 };
                          const minX = Math.min(newStart.x, newEnd.x);
                          const minY = Math.min(newStart.y, newEnd.y);
                          const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                          const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                          const borderWidth2 = el.style?.borderWidth ?? 1;
                          const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                          const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                          const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                          const newX = minX - strokePadding;
                          const newY = minY - strokePadding;
                          const newWidth = rawWidth + strokePadding * 2;
                          const newHeight = rawHeight + strokePadding * 2;
                          updateLayer(pageIndex, el.id, {
                            x: newX,
                            y: newY,
                            width: newWidth,
                            height: newHeight,
                            style: { ...el.style, start: newStart, end: newEnd }
                          });
                        };
                        const handleUp = () => {
                          document.removeEventListener("mousemove", handleMove);
                          document.removeEventListener("mouseup", handleUp);
                        };
                        document.addEventListener("mousemove", handleMove);
                        document.addEventListener("mouseup", handleUp);
                      }
                    }
                  ),
                  isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: "50%",
                          top: "-28px",
                          transform: "translateX(-50%)",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                          border: "2px solid #d97757",
                          cursor: "grab",
                          zIndex: 1002,
                          pointerEvents: "auto"
                        },
                        onMouseDown: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const canvas = document.querySelector(".absolute.inset-0.z-20");
                          if (!canvas) return;
                          const rect = canvas.getBoundingClientRect();
                          const centerX = (el.x + el.width / 2) * scale + rect.left;
                          const centerY = (el.y + el.height / 2) * scale + rect.top;
                          const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                          const origRotation = el.rotation ?? 0;
                          const handleMove = (ev) => {
                            const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
                            const deg = origRotation + (angle - startAngle) * 180 / Math.PI;
                            updateLayer(pageIndex, el.id, { rotation: deg });
                          };
                          const handleUp = () => {
                            document.removeEventListener("mousemove", handleMove);
                            document.removeEventListener("mouseup", handleUp);
                          };
                          document.addEventListener("mousemove", handleMove);
                          document.addEventListener("mouseup", handleUp);
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: Math.abs(sl) > 0.01 ? `${controlLocalX - 8}px` : `${(startLocalX + endLocalX) / 2 - 8}px`,
                          top: Math.abs(sl) > 0.01 ? `${controlLocalY - 8}px` : `${(startLocalY + endLocalY) / 2 - 8}px`,
                          width: "16px",
                          height: "16px",
                          backgroundColor: Math.abs(sl) > 0.01 ? "#d97757" : "#d97757",
                          border: "2px solid white",
                          borderRadius: "4px",
                          cursor: "grab",
                          pointerEvents: "auto",
                          zIndex: 1001
                        },
                        onClick: (e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                          if (recentCenterDragRef.current.id === el.id && recentCenterDragRef.current.moved) {
                            recentCenterDragRef.current = {};
                            return;
                          }
                          const currentSl = el.style?.sloppiness ?? 0;
                          if (Math.abs(currentSl) < 0.5) {
                            const newSl = 50;
                            const start = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                            const end = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                            const midX2 = (start.x + end.x) / 2;
                            const midY2 = (start.y + end.y) / 2;
                            const tx = end.x - start.x;
                            const ty = end.y - start.y;
                            const tlen = Math.max(1, Math.hypot(tx, ty));
                            const ntx = tx / tlen;
                            const nty = ty / tlen;
                            const nx2 = -nty;
                            const ny2 = ntx;
                            const controlX2 = midX2 + nx2 * newSl;
                            const controlY2 = midY2 + ny2 * newSl;
                            const minX = Math.min(start.x, end.x, controlX2);
                            const minY = Math.min(start.y, end.y, controlY2);
                            const rawWidth = Math.max(Math.max(start.x, end.x, controlX2) - minX, 10);
                            const rawHeight = Math.max(Math.max(start.y, end.y, controlY2) - minY, 10);
                            const borderWidth2 = el.style?.borderWidth ?? 1;
                            const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                            const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                            const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                            const newX = minX - strokePadding;
                            const newY = minY - strokePadding;
                            const newWidth = rawWidth + strokePadding * 2;
                            const newHeight = rawHeight + strokePadding * 2;
                            updateLayer(pageIndex, el.id, { x: newX, y: newY, width: newWidth, height: newHeight, style: { ...el.style, sloppiness: newSl } });
                          } else {
                            const newSl = 0;
                            const start = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
                            const end = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
                            const minX = Math.min(start.x, end.x);
                            const minY = Math.min(start.y, end.y);
                            const rawWidth = Math.max(Math.abs(end.x - start.x), 10);
                            const rawHeight = Math.max(Math.abs(end.y - start.y), 10);
                            const borderWidth2 = el.style?.borderWidth ?? 1;
                            const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                            const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                            const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                            const newX = minX - strokePadding;
                            const newY = minY - strokePadding;
                            const newWidth = rawWidth + strokePadding * 2;
                            const newHeight = rawHeight + strokePadding * 2;
                            updateLayer(pageIndex, el.id, { x: newX, y: newY, width: newWidth, height: newHeight, style: { ...el.style, sloppiness: newSl } });
                          }
                        },
                        onMouseDown: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const startClientX = e.clientX;
                          const startClientY = e.clientY;
                          const origStart = { ...startPoint };
                          const origEnd = { ...endPoint };
                          let mode = "undetermined";
                          recentCenterDragRef.current = { id: el.id, moved: false };
                          const handleMove = (ev) => {
                            const canvas = document.querySelector(".absolute.inset-0.z-20");
                            if (!canvas) return;
                            const rect = canvas.getBoundingClientRect();
                            const mouseX = (ev.clientX - rect.left) / scale;
                            const mouseY = (ev.clientY - rect.top) / scale;
                            const relX = (ev.clientX - startClientX) / scale;
                            const relY = (ev.clientY - startClientY) / scale;
                            const s = origStart;
                            const ept = origEnd;
                            const tx = ept.x - s.x;
                            const ty = ept.y - s.y;
                            const tlen = Math.max(1, Math.hypot(tx, ty));
                            const ntx = tx / tlen;
                            const nty = ty / tlen;
                            const nx2 = -nty;
                            const ny2 = ntx;
                            if (mode === "undetermined") {
                              if (Math.hypot(relX, relY) < 2 / scale) {
                                return;
                              }
                              const projT = Math.abs(relX * ntx + relY * nty);
                              const projN = Math.abs(relX * nx2 + relY * ny2);
                              mode = projN > projT ? "curve" : "move";
                              recentCenterDragRef.current.moved = true;
                            }
                            if (mode === "curve") {
                              const midX2 = (s.x + ept.x) / 2;
                              const midY2 = (s.y + ept.y) / 2;
                              const dmx = mouseX - midX2;
                              const dmy = mouseY - midY2;
                              const newSloppiness = dmx * nx2 + dmy * ny2;
                              const controlX2 = midX2 + nx2 * newSloppiness;
                              const controlY2 = midY2 + ny2 * newSloppiness;
                              const minX = Math.min(s.x, ept.x, controlX2);
                              const minY = Math.min(s.y, ept.y, controlY2);
                              const maxX = Math.max(s.x, ept.x, controlX2);
                              const maxY = Math.max(s.y, ept.y, controlY2);
                              const rawWidth = Math.max(Math.abs(maxX - minX), 10);
                              const rawHeight = Math.max(Math.abs(maxY - minY), 10);
                              const borderWidth2 = el.style?.borderWidth ?? 1;
                              const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                              const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                              const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                              const paddedX = minX - strokePadding;
                              const paddedY = minY - strokePadding;
                              const paddedWidth = rawWidth + strokePadding * 2;
                              const paddedHeight = rawHeight + strokePadding * 2;
                              updateLayer(pageIndex, el.id, {
                                x: paddedX,
                                y: paddedY,
                                width: paddedWidth,
                                height: paddedHeight,
                                style: { ...el.style, sloppiness: newSloppiness }
                              });
                            } else {
                              const dx2 = (ev.clientX - startClientX) / scale;
                              const dy2 = (ev.clientY - startClientY) / scale;
                              const newStart = { x: origStart.x + dx2, y: origStart.y + dy2 };
                              const newEnd = { x: origEnd.x + dx2, y: origEnd.y + dy2 };
                              const minX = Math.min(newStart.x, newEnd.x);
                              const minY = Math.min(newStart.y, newEnd.y);
                              const rawWidth = Math.max(Math.abs(newEnd.x - newStart.x), 10);
                              const rawHeight = Math.max(Math.abs(newEnd.y - newStart.y), 10);
                              const borderWidth2 = el.style?.borderWidth ?? 1;
                              const hasArrow = !!(el.style?.arrowStart || el.style?.arrowEnd);
                              const arrowPad = hasArrow ? borderWidth2 * 3 : 0;
                              const strokePadding = Math.max(4, borderWidth2 * 1.5 + arrowPad);
                              const newX = minX - strokePadding;
                              const newY = minY - strokePadding;
                              const newWidth = rawWidth + strokePadding * 2;
                              const newHeight = rawHeight + strokePadding * 2;
                              updateLayer(pageIndex, el.id, {
                                x: newX,
                                y: newY,
                                width: newWidth,
                                height: newHeight,
                                style: { ...el.style, start: newStart, end: newEnd }
                              });
                            }
                          };
                          const handleUp = () => {
                            document.removeEventListener("mousemove", handleMove);
                            document.removeEventListener("mouseup", handleUp);
                            setTimeout(() => {
                              recentCenterDragRef.current = {};
                            }, 0);
                          };
                          document.addEventListener("mousemove", handleMove);
                          document.addEventListener("mouseup", handleUp);
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: `${startLocalX - 6}px`,
                          top: `${startLocalY - 6}px`,
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#d97757",
                          border: "2px solid white",
                          borderRadius: "50%",
                          cursor: "pointer",
                          pointerEvents: "auto",
                          zIndex: 1001
                        },
                        onClick: (e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                        },
                        onMouseDown: (e) => handleEndpointMouseDown(e, "start"),
                        onTouchStart: (e) => handleEndpointMouseDown(e, "start")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: `${endLocalX - 6}px`,
                          top: `${endLocalY - 6}px`,
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#d97757",
                          border: "2px solid white",
                          borderRadius: "50%",
                          cursor: "pointer",
                          pointerEvents: "auto",
                          zIndex: 1001
                        },
                        onClick: (e) => {
                          e.stopPropagation();
                          selectElement(el.id);
                        },
                        onMouseDown: (e) => handleEndpointMouseDown(e, "end"),
                        onTouchStart: (e) => handleEndpointMouseDown(e, "end")
                      }
                    )
                  ] })
                ] }),
                (el.type === "image" || el.type === "signature") && el.content && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: el.content,
                    alt: "element",
                    className: "w-full h-full object-contain pointer-events-none select-none",
                    draggable: false
                  }
                ),
                el.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-full wrap-break-word outline-none",
                    "data-inkoro-text": true,
                    contentEditable: isTextEditing,
                    suppressContentEditableWarning: true,
                    onBlur: handleBlur,
                    onInput: (e) => handleTextChange(e, el.id),
                    onCompositionStart: () => {
                      isComposingRef.current = true;
                    },
                    onCompositionEnd: (e) => {
                      isComposingRef.current = false;
                      const target = e.currentTarget;
                      const caretOffset = getCaretCharacterOffsetWithin(target);
                      requestAnimationFrame(() => setCaretPosition(target, caretOffset));
                    },
                    style: { cursor: isTextEditing ? "text" : "inherit" },
                    children: el.content
                  }
                )
              ]
            },
            el.id
          );
        }),
        selectedElement && targetRef.current && !isEditing && selectedElement.type !== "line" && selectedElement.type !== "arrow" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Moveable,
          {
            target: targetRef.current,
            resizable: true,
            draggable: true,
            rotatable: true,
            renderDirections: ["nw", "ne", "sw", "se"],
            className: "moveable-control-box",
            controlPadding: 0,
            onDrag: ({ target, left, top }) => {
              target.style.left = `${left}px`;
              target.style.top = `${top}px`;
            },
            onDragEnd: ({ target }) => {
              const x = parseFloat(target.style.left || "0") / scale;
              const y = parseFloat(target.style.top || "0") / scale;
              if (selectedElement) updateLayer(pageIndex, selectedElement.id, { x, y });
            },
            onResize: ({ target, width, height, drag }) => {
              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
              target.style.left = `${drag.left}px`;
              target.style.top = `${drag.top}px`;
            },
            onResizeEnd: ({ target }) => {
              const width = parseFloat(target.style.width || "0") / scale;
              const height = parseFloat(target.style.height || "0") / scale;
              const x = parseFloat(target.style.left || "0") / scale;
              const y = parseFloat(target.style.top || "0") / scale;
              if (selectedElement) {
                if (selectedElement.type === "circle") {
                  const newRadius = Math.min(width, height) / 2;
                  updateLayer(pageIndex, selectedElement.id, { width, height, x, y, style: { ...selectedElement.style, borderRadius: newRadius } });
                } else {
                  updateLayer(pageIndex, selectedElement.id, { width, height, x, y });
                }
              }
            },
            onRotate: ({ target, transform }) => {
              target.style.transform = transform;
            },
            onRotateEnd: ({ lastEvent }) => {
              if (selectedElement && lastEvent) {
                updateLayer(pageIndex, selectedElement.id, { rotation: lastEvent.rotation });
              }
            }
          }
        )
      ]
    }
  );
}
function PDFViewer() {
  const { pdfFile, currentPage, scale, setNumPages, setPageDimensions, pageDimensions } = useEditorStore();
  const [containerRef, setContainerRef] = reactExports.useState(null);
  const [containerWidth, setContainerWidth] = reactExports.useState(null);
  const isMobile = useIsMobile();
  const onDocumentLoadSuccess = reactExports.useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, [setNumPages]);
  reactExports.useEffect(() => {
    if (!containerRef) return;
    const update = () => setContainerWidth(Math.max(0, Math.floor(containerRef.getBoundingClientRect().width)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef);
    return () => ro.disconnect();
  }, [containerRef]);
  const pageDim = pageDimensions[currentPage];
  const renderWidth = isMobile && containerWidth && pageDim ? Math.max(100, Math.round(containerWidth * scale)) : void 0;
  const effectiveScale = renderWidth && pageDim ? renderWidth / pageDim.width : scale;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Document,
    {
      file: pdfFile,
      onLoadSuccess: onDocumentLoadSuccess,
      loading: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }) }),
      className: "flex flex-col items-center w-full h-full",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          id: "pdf-page-container",
          className: `relative border shadow-2xl bg-white mx-auto my-0 ${isMobile ? "w-full" : "w-fit"} p-0`,
          ref: setContainerRef,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Page,
            {
              pageNumber: currentPage,
              ...renderWidth ? { width: renderWidth } : { scale },
              className: "bg-white mb-0",
              renderAnnotationLayer: false,
              renderTextLayer: true,
              onLoadSuccess: ({ originalWidth, originalHeight }) => {
                setPageDimensions(currentPage, originalWidth, originalHeight);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CanvasLayer, { pageIndex: currentPage, scale: effectiveScale })
            }
          )
        }
      )
    }
  ) });
}
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRoot, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({ nativeButton, render, ...props }) {
  const resolvedNativeButton = typeof nativeButton === "boolean" ? nativeButton : !!render;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuTrigger,
    {
      "data-slot": "dropdown-menu-trigger",
      nativeButton: resolvedNativeButton,
      render,
      ...props
    }
  );
}
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuPositioner,
    {
      className: "isolate z-50 outline-none",
      align,
      alignOffset,
      side,
      sideOffset,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuPopup,
        {
          "data-slot": "dropdown-menu-content",
          className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-32 rounded-none shadow-md ring-1 duration-100 z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden", className),
          ...props
        }
      )
    }
  ) });
}
function DropdownMenuGroup({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuGroupLabel,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn("text-muted-foreground px-2 py-2 text-xs data-[inset]:pl-8", className),
      ...props
    }
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuItem,
    {
      "data-slot": "dropdown-menu-item",
      nativeButton: true,
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-none px-2 py-2 text-xs [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSub({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuSubmenuRoot, { "data-slot": "dropdown-menu-sub", ...props });
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MenuSubmenuTrigger,
    {
      "data-slot": "dropdown-menu-sub-trigger",
      nativeButton: true,
      "data-inset": inset,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-none px-2 py-2 text-xs [&_svg:not([class*='size-'])]:size-4 flex w-full cursor-default items-center outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
      ]
    }
  );
}
function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DropdownMenuContent,
    {
      "data-slot": "dropdown-menu-sub-content",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground min-w-[96px] rounded-none shadow-lg ring-1 duration-100 w-auto", className),
      align,
      alignOffset,
      side,
      sideOffset,
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator$1,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 h-px", className),
      ...props
    }
  );
}
function ImageDialog({ open, onOpenChange }) {
  const { addLayer, currentPage, activeTool, setActiveTool, selectElement } = useEditorStore();
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [dragActive, setDragActive] = reactExports.useState(false);
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      await addImageToCanvas(result);
    };
    reader.readAsDataURL(file);
  };
  const addImageToCanvas = async (url) => {
    try {
      const { cropImageDataUrl } = await import("./index-B7IUyegr.mjs").then((n) => n.u);
      const cropped = await cropImageDataUrl(url, true);
      const naturalW = cropped.width;
      const naturalH = cropped.height;
      const dataUrl = cropped.dataUrl;
      const maxPx = 600;
      const displayWpx = Math.min(naturalW, maxPx);
      const displayHpx = Math.round(displayWpx * (naturalH / Math.max(1, naturalW)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      const centerX = 100;
      const centerY = 100;
      addLayer(currentPage, {
        id,
        type: "image",
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: dataUrl,
        // Cropped Data URL
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool("select");
      onOpenChange(false);
    } catch (err) {
      const img = new Image();
      img.src = url;
      await new Promise((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      const displayWpx = Math.min(img.naturalWidth || 200, 600);
      const displayHpx = Math.round(displayWpx * ((img.naturalHeight || 200) / Math.max(1, img.naturalWidth || 200)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      const centerX = 100;
      const centerY = 100;
      addLayer(currentPage, {
        id,
        type: "image",
        x: centerX - userWidth / 2,
        y: centerY - userHeight / 2,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: url,
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool("select");
      onOpenChange(false);
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Insert Image" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Upload an image from your device or paste a URL." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
            dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
          ),
          onDragEnter: handleDrag,
          onDragLeave: handleDrag,
          onDragOver: handleDrag,
          onDrop: handleDrop,
          onClick: () => document.getElementById("image-upload-input")?.click(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-4 rounded-none mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Click to upload or drag and drop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "Drag & drop an image here, or click to select" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "image-upload-input",
                type: "file",
                className: "hidden",
                accept: "image/*",
                onChange: handleChange
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "Or using URL" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "https://example.com/image.png",
            value: imageUrl,
            onChange: (e) => setImageUrl(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => imageUrl && addImageToCanvas(imageUrl), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-4 w-4 mr-2" }),
          "Add"
        ] })
      ] })
    ] })
  ] }) });
}
function SignatureDialog({ open, onOpenChange }) {
  const { addLayer, currentPage, activeTool, setActiveTool, selectElement } = useEditorStore();
  const canvasRef = reactExports.useRef(null);
  const [isDrawing, setIsDrawing] = reactExports.useState(false);
  const [dragActive, setDragActive] = reactExports.useState(false);
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ("clientY" in e ? e.clientY : e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    addSignatureToCanvas(dataUrl);
  };
  const addSignatureToCanvas = async (url) => {
    try {
      const { cropImageDataUrl } = await import("./index-B7IUyegr.mjs").then((n) => n.u);
      const cropped = await cropImageDataUrl(url, true);
      const naturalW = cropped.width;
      const naturalH = cropped.height;
      const dataUrl = cropped.dataUrl;
      const maxPx = 600;
      const displayWpx = Math.min(naturalW, maxPx);
      const displayHpx = Math.round(displayWpx * (naturalH / Math.max(1, naturalW)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      addLayer(currentPage, {
        id,
        type: "signature",
        // Treated as image essentially
        x: 100,
        y: 100,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: dataUrl,
        // Cropped Data URL
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool("select");
      onOpenChange(false);
    } catch (err) {
      const img = new Image();
      img.src = url;
      await new Promise((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      const displayWpx = Math.min(img.naturalWidth || 150, 600);
      const displayHpx = Math.round(displayWpx * ((img.naturalHeight || 80) / Math.max(1, img.naturalWidth || 150)));
      const scale = useEditorStore.getState().scale || 1;
      const userWidth = displayWpx / scale;
      const userHeight = displayHpx / scale;
      const id = crypto.randomUUID();
      addLayer(currentPage, {
        id,
        type: "signature",
        x: 100,
        y: 100,
        width: userWidth,
        height: userHeight,
        rotation: 0,
        content: url,
        style: { opacity: 1 }
      });
      selectElement(id);
      setActiveTool("select");
      onOpenChange(false);
    }
  };
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      addSignatureToCanvas(result);
    };
    reader.readAsDataURL(file);
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Signature, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Signature" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Draw your signature or upload an image." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "draw", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "draw", children: "Draw" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "upload", children: "Upload" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "draw", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-none bg-white touch-none mx-auto overflow-hidden relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: 400,
              height: 200,
              className: "w-full h-60 cursor-crosshair block",
              onMouseDown: startDrawing,
              onMouseMove: draw,
              onMouseUp: stopDrawing,
              onMouseLeave: stopDrawing,
              onTouchStart: startDrawing,
              onTouchMove: draw,
              onTouchEnd: stopDrawing
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white",
              onClick: clearCanvas,
              title: "Clear",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", onClick: handleSaveSignature, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
          "Insert Signature"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-none transition-colors cursor-pointer",
            dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
          ),
          onDragEnter: handleDrag,
          onDragLeave: handleDrag,
          onDragOver: handleDrag,
          onDrop: handleDrop,
          onClick: () => document.getElementById("sig-upload-input")?.click(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/10 p-4 rounded-none mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Click to upload or drag and drop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "Drag & drop a signature image here, or click to select" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sig-upload-input",
                type: "file",
                className: "hidden",
                accept: "image/*",
                onChange: handleChange
              }
            )
          ]
        }
      ) })
    ] })
  ] }) });
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "label",
    {
      "data-slot": "label",
      className: cn(
        "gap-2 text-xs leading-none group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      ),
      ...props
    }
  );
}
async function savePdf(opts) {
  const { pdfFile, layers, pageDimensions } = useEditorStore.getState();
  if (!pdfFile) return;
  try {
    const fileBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    if (opts?.title) {
      pdfDoc.setTitle(opts.title);
    }
    if (opts?.author) {
      pdfDoc.setAuthor(opts.author);
    }
    if (opts?.subject) {
      pdfDoc.setSubject(opts.subject);
    }
    if (opts?.keywords && opts.keywords.length > 0) {
      pdfDoc.setKeywords(opts.keywords);
    }
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pagesWithLayers = Object.keys(layers).map(Number);
    for (const pageIndex of pagesWithLayers) {
      const pdfPage = pages[pageIndex - 1];
      if (!pdfPage) continue;
      const { height: pageHeight } = pdfPage.getSize();
      const elements = layers[pageIndex] || [];
      for (const el of elements) {
        const x = el.x;
        if (el.type === "text") {
          const fontSize = el.style.fontSize || 16;
          const y = pageHeight - el.y - fontSize;
          const color = hexToRgb(el.style.color || "#000000");
          pdfPage.drawText(el.content || "", {
            x,
            y,
            size: fontSize,
            font: helveticaFont,
            color
            // rotate: degrees(el.rotation), // Text rotation around which point? 
            // PDF-lib rotates around origin (bottom-left of text start).
          });
        } else if (el.type === "rect") {
          const y = pageHeight - el.y - el.height;
          const color = hexToRgb(el.style.backgroundColor || "#000000");
          const opacity = el.style.opacity ?? 1;
          pdfPage.drawRectangle({
            x,
            y,
            width: el.width,
            height: el.height,
            color,
            opacity,
            rotate: degrees(el.rotation || 0)
          });
        } else if (el.type === "circle") {
          const centerX = x + el.width / 2;
          const centerY = pageHeight - el.y - el.height / 2;
          const radiusX = el.width / 2;
          const radiusY = el.height / 2;
          const color = hexToRgb(el.style.backgroundColor || "#000000");
          const opacity = el.style.opacity ?? 1;
          pdfPage.drawEllipse({
            x: centerX,
            y: centerY,
            xScale: radiusX,
            yScale: radiusY,
            color,
            opacity,
            rotate: degrees(el.rotation || 0)
          });
        } else if (el.type === "line" || el.type === "arrow") {
          const startPoint = el.style?.start ?? { x: el.x, y: el.y + el.height / 2 };
          const endPoint = el.style?.end ?? { x: el.x + el.width, y: el.y + el.height / 2 };
          const startX = startPoint.x;
          const startY = pageHeight - startPoint.y;
          const endX = endPoint.x;
          const endY = pageHeight - endPoint.y;
          const color = hexToRgb(el.style.backgroundColor || "#000000");
          const strokeWidth = el.style.borderWidth ?? 2;
          pdfPage.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: strokeWidth,
            color,
            opacity: el.style.opacity ?? 1
          });
          if (el.type === "arrow" && el.style.arrowEnd) {
            const strokeWidth2 = el.style?.borderWidth ?? 1;
            const segLen = Math.hypot(endX - startX, endY - startY);
            const rawArrowSize = Math.max(6, Math.min(24, strokeWidth2 * 3));
            const maxByLen = Math.max(6, Math.min(24, Math.round(segLen * 0.15)));
            const arrowSize = Math.min(rawArrowSize, maxByLen);
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowPoint1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
            const arrowPoint1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
            const arrowPoint2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
            const arrowPoint2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);
            pdfPage.drawLine({
              start: { x: endX, y: endY },
              end: { x: arrowPoint1X, y: arrowPoint1Y },
              thickness: strokeWidth2,
              color,
              opacity: el.style.opacity ?? 1
            });
            pdfPage.drawLine({
              start: { x: endX, y: endY },
              end: { x: arrowPoint2X, y: arrowPoint2Y },
              thickness: strokeWidth2,
              color,
              opacity: el.style.opacity ?? 1
            });
          }
        } else if (el.type === "signature" && el.content) {
          const imageBytes = await fetch(el.content).then((res) => res.arrayBuffer());
          let image;
          try {
            image = await pdfDoc.embedPng(imageBytes);
          } catch {
            console.error("Failed to embed signature");
            continue;
          }
          const y = pageHeight - el.y - el.height;
          pdfPage.drawImage(image, {
            x,
            y,
            width: el.width,
            height: el.height,
            rotate: degrees(el.rotation || 0)
          });
        } else if (el.type === "image" && el.content) {
          const imageBytes = await fetch(el.content).then((res) => res.arrayBuffer());
          let image;
          try {
            image = await pdfDoc.embedPng(imageBytes);
          } catch {
            try {
              image = await pdfDoc.embedJpg(imageBytes);
            } catch {
              console.error("Failed to embed image");
              continue;
            }
          }
          const y = pageHeight - el.y - el.height;
          pdfPage.drawImage(image, {
            x,
            y,
            width: el.width,
            height: el.height,
            rotate: degrees(el.rotation || 0)
          });
        }
      }
    }
    const pdfBytes = await pdfDoc.save();
    const uint8Array = new Uint8Array(pdfBytes);
    if (opts?.returnBytes) {
      return uint8Array;
    }
    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedFilename = opts?.filename?.trim() ? opts.filename.toLowerCase().endsWith(".pdf") ? opts.filename.trim() : `${opts.filename.trim()}.pdf` : "edited_document.pdf";
    link.download = sanitizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error saving PDF", err);
  }
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : rgb(0, 0, 0);
}
function DownloadDialog({ open, onOpenChange }) {
  const { pdfFile } = useEditorStore();
  const [filename, setFilename] = reactExports.useState("edited-document");
  const [format, setFormat] = reactExports.useState("pdf");
  const [isDownloading, setIsDownloading] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [author, setAuthor] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [keywordsInput, setKeywordsInput] = reactExports.useState("");
  const STORAGE_KEY = "inkoro-download-metadata";
  reactExports.useEffect(() => {
    let cancelled = false;
    async function loadMetadata() {
      if (!open) return;
      try {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const saved = JSON.parse(raw);
            setFilename(saved.filename ?? "edited-document");
            setTitle(saved.title ?? "");
            setAuthor(saved.author ?? "");
            setSubject(saved.subject ?? "");
            setKeywordsInput(saved.keywords ?? "");
            return;
          }
        } catch (e) {
        }
        if (!pdfFile) {
          setTitle("");
          setAuthor("");
          setSubject("");
          setKeywordsInput("");
          return;
        }
        const buffer = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer);
        if (cancelled) return;
        setTitle(pdfDoc.getTitle() ?? "");
        setAuthor(pdfDoc.getAuthor() ?? "");
        setSubject(pdfDoc.getSubject() ?? "");
        const rawKeywords = pdfDoc.getKeywords() ?? "";
        const kw = rawKeywords ? rawKeywords.split(/\s+/).join(", ") : "";
        setKeywordsInput(kw);
      } catch (err) {
        console.error("Failed to read PDF metadata", err);
      }
    }
    loadMetadata();
    return () => {
      cancelled = true;
    };
  }, [open, pdfFile]);
  const triggerDownload = (uint8, name) => {
    const blob = new Blob([uint8.buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedFilename = name?.trim() ? name.toLowerCase().endsWith(".pdf") ? name.trim() : `${name.trim()}.pdf` : "edited_document.pdf";
    link.download = sanitizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const keywordsArray = keywordsInput.split(",").map((k) => k.trim()).filter(Boolean);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          filename,
          title,
          author,
          subject,
          keywords: keywordsInput
        }));
      } catch (e) {
      }
      const bytes = await savePdf({
        filename,
        title: title || void 0,
        author: author || void 0,
        subject: subject || void 0,
        keywords: keywordsArray.length ? keywordsArray : void 0,
        returnBytes: true
      });
      if (!bytes) throw new Error("Failed to generate PDF");
      triggerDownload(bytes, filename);
      onOpenChange(false);
    } catch (error) {
      console.error("Download failed:", error);
      try {
        const { toast } = await import("../_libs/sonner.mjs");
        toast("Download failed. See console for details.");
      } catch {
      }
    } finally {
      setIsDownloading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Download Document" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Configure your export settings before downloading." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "filename", children: "File Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "filename",
              value: filename,
              onChange: (e) => setFilename(e.target.value),
              placeholder: "edited-document"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Document title" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "author", children: "Author" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "author", value: author, onChange: (e) => setAuthor(e.target.value), placeholder: "Author name" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "subject", value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Subject" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "keywords", children: "Keywords" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "keywords", placeholder: "Comma-separated keywords", value: keywordsInput, onChange: (e) => setKeywordsInput(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: isDownloading, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleDownload, disabled: isDownloading, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
        isDownloading ? "Downloading..." : "Download"
      ] })
    ] })
  ] }) });
}
function Toolbar() {
  const {
    currentPage,
    numPages,
    setCurrentPage,
    scale,
    setScale,
    activeTool,
    setActiveTool,
    pdfFile,
    selectedElementId,
    addLayer,
    selectElement
  } = useEditorStore();
  useIsMobile();
  const prevDisabled = currentPage <= 1;
  const nextDisabled = numPages <= 0 || currentPage >= numPages;
  const handlePrevClick = () => {
    if (!prevDisabled) setCurrentPage(Math.max(currentPage - 1, 1));
  };
  const handleNextClick = () => {
    if (!nextDisabled) setCurrentPage(Math.min(currentPage + 1, numPages));
  };
  const iconButtonClass = (isActive = false) => cn(
    buttonVariants({ variant: isActive ? "default" : "ghost", size: "icon" }),
    "h-7 w-7 sm:h-8 sm:w-8 rounded-none transition-all",
    isActive ? "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30" : "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
  );
  const [imageDialogOpen, setImageDialogOpen] = reactExports.useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = reactExports.useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = reactExports.useState(false);
  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.5));
  const handleImageTool = () => {
    setActiveTool("image");
    setImageDialogOpen(true);
  };
  const handleSignatureTool = () => {
    setActiveTool("signature");
    setSignatureDialogOpen(true);
  };
  const handleCopyClick = async () => {
    const ok = await useEditorStore.getState().copySelection();
    try {
      const { toast } = await import("../_libs/sonner.mjs");
      toast(ok ? "Copied to clipboard" : "Nothing selected");
    } catch (err) {
    }
  };
  const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const tryParseInkoroHtml = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const node = doc.querySelector("[data-inkoro]");
      const payload = node?.getAttribute("data-inkoro");
      if (!payload) return null;
      const decoded = decodeURIComponent(payload);
      const parsed = JSON.parse(decoded);
      if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) return parsed.elements;
    } catch (err) {
    }
    return null;
  };
  const getPlainTextFromHtml = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      return doc.body?.textContent || "";
    } catch (err) {
      return html;
    }
  };
  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith("image/"));
          if (imgType) {
            const blob = await item.getType(imgType);
            const dataUrl = await blobToDataUrl(blob);
            const centerX = window.innerWidth / 2 / (scale || 1);
            const centerY = window.innerHeight / 2 / (scale || 1);
            const dims = await new Promise((res) => {
              const i = new Image();
              i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight });
              i.onerror = () => res({ w: 200, h: 200 });
              i.src = dataUrl;
            });
            const desiredPx = Math.min(dims.w, 300);
            const desiredPxH = Math.round(desiredPx * (dims.h / Math.max(1, dims.w)));
            const userW = desiredPx / (scale || 1);
            const userH = desiredPxH / (scale || 1);
            const id = crypto.randomUUID();
            addLayer(currentPage, { id, type: "image", x: centerX - userW / 2, y: centerY - userH / 2, width: userW, height: userH, rotation: 0, content: dataUrl, style: { opacity: 1 } });
            selectElement(id);
            setActiveTool("select");
            try {
              const { toast } = await import("../_libs/sonner.mjs");
              toast("Pasted image");
            } catch (err) {
            }
            return;
          }
          const textHtmlType = item.types.find((t) => t === "text/html");
          const textPlainType = item.types.find((t) => t === "text/plain");
          const textType = textHtmlType || textPlainType;
          if (textType) {
            const blob = await item.getType(textType);
            const txt = await blob.text();
            if (textType === "text/html") {
              const inkElements = tryParseInkoroHtml(txt);
              if (inkElements) {
                const offset = 10;
                let lastId = null;
                for (const el of inkElements) {
                  const clone = JSON.parse(JSON.stringify(el));
                  clone.id = crypto.randomUUID();
                  clone.x = (clone.x ?? 100) + offset;
                  clone.y = (clone.y ?? 100) + offset;
                  addLayer(currentPage, clone);
                  lastId = clone.id;
                }
                if (lastId) selectElement(lastId);
                try {
                  const { toast } = await import("../_libs/sonner.mjs");
                  toast("Pasted elements");
                } catch (err) {
                }
                return;
              }
            } else {
              try {
                const parsed = JSON.parse(txt);
                if (parsed && parsed.__inkoro && Array.isArray(parsed.elements)) {
                  const offset = 10;
                  let lastId = null;
                  for (const el of parsed.elements) {
                    const clone = JSON.parse(JSON.stringify(el));
                    clone.id = crypto.randomUUID();
                    clone.x = (clone.x ?? 100) + offset;
                    clone.y = (clone.y ?? 100) + offset;
                    addLayer(currentPage, clone);
                    lastId = clone.id;
                  }
                  if (lastId) selectElement(lastId);
                  try {
                    const { toast } = await import("../_libs/sonner.mjs");
                    toast("Pasted elements");
                  } catch (err) {
                  }
                  return;
                }
              } catch (err) {
              }
            }
            const id = crypto.randomUUID();
            const defaultPxWidth = 300;
            const userWidth = defaultPxWidth / (scale || 1);
            const userHeight = 30 / (scale || 1);
            const centerX = window.innerWidth / 2 / (scale || 1);
            const centerY = window.innerHeight / 2 / (scale || 1);
            const content = textType === "text/html" ? getPlainTextFromHtml(txt) : txt;
            addLayer(currentPage, { id, type: "text", x: centerX - userWidth / 2, y: centerY - userHeight / 2, width: userWidth, height: userHeight, rotation: 0, content, style: { fontSize: 16, color: "#000000" } });
            selectElement(id);
            setActiveTool("select");
            try {
              const { toast } = await import("../_libs/sonner.mjs");
              toast("Pasted text");
            } catch (err) {
            }
            return;
          }
        }
      } else {
        const txt = await navigator.clipboard.readText();
        if (txt) {
          const ink = (() => {
            try {
              const p = JSON.parse(txt);
              if (p && p.__inkoro) return p;
            } catch (e) {
              return null;
            }
          })();
          if (ink && Array.isArray(ink.elements)) {
            const offset = 10;
            let lastId = null;
            for (const el of ink.elements) {
              const clone = JSON.parse(JSON.stringify(el));
              clone.id = crypto.randomUUID();
              clone.x = (clone.x ?? 100) + offset;
              clone.y = (clone.y ?? 100) + offset;
              addLayer(currentPage, clone);
              lastId = clone.id;
            }
            if (lastId) selectElement(lastId);
            try {
              const { toast } = await import("../_libs/sonner.mjs");
              toast("Pasted elements");
            } catch (err) {
            }
            return;
          }
          const id = crypto.randomUUID();
          const defaultPxWidth = 300;
          const userWidth = defaultPxWidth / (scale || 1);
          const userHeight = 30 / (scale || 1);
          const centerX = window.innerWidth / 2 / (scale || 1);
          const centerY = window.innerHeight / 2 / (scale || 1);
          addLayer(currentPage, { id, type: "text", x: centerX - userWidth / 2, y: centerY - userHeight / 2, width: userWidth, height: userHeight, rotation: 0, content: txt, style: { fontSize: 16, color: "#000000" } });
          selectElement(id);
          setActiveTool("select");
          try {
            const { toast } = await import("../_libs/sonner.mjs");
            toast("Pasted text");
          } catch (err) {
          }
          return;
        }
      }
    } catch (err) {
      console.debug("Paste failed", err);
      try {
        const { toast } = await import("../_libs/sonner.mjs");
        toast("Paste failed");
      } catch (err2) {
      }
    }
  };
  const handlePropertiesClick = () => {
    const setOpen = useEditorStore.getState().setMobilePropertiesOpen;
    if (setOpen) {
      setOpen(true);
    }
  };
  if (!pdfFile) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed sm:absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-background/90 dark:bg-background/80 backdrop-blur-md border shadow-lg rounded-none px-2 sm:px-2 py-1.5 sm:py-1.5 flex items-center gap-2 z-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(activeTool === "select"),
            onClick: () => setActiveTool("select"),
            title: "Select",
            "aria-label": "Select tool",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer2, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Select" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(activeTool === "text"),
            onClick: () => setActiveTool("text"),
            title: "Text",
            "aria-label": "Text tool",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Text" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(activeTool === "image"),
            onClick: handleImageTool,
            title: "Image",
            "aria-label": "Image tool",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Image" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(activeTool === "signature"),
            onClick: handleSignatureTool,
            title: "Signature",
            "aria-label": "Signature tool",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Signature, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Signature" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuTrigger,
          {
            nativeButton: true,
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(["rect", "circle", "line", "arrow"].includes(activeTool || "")),
            title: "Shapes",
            "aria-label": "Shapes menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shapes, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setActiveTool("rect"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4 mr-2" }),
            "Rectangle"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setActiveTool("circle"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4 mr-2" }),
            "Circle"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setActiveTool("line"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 mr-2" }),
            "Line"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setActiveTool("arrow"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 mr-2" }),
            "Arrow"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(false),
            onClick: handleCopyClick,
            title: "Copy",
            "aria-label": "Copy selected",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(false),
            onClick: handlePasteClick,
            title: "Paste",
            "aria-label": "Paste",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "hidden sm:block", children: "Paste" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: cn(iconButtonClass(false), prevDisabled && "opacity-50 cursor-not-allowed pointer-events-none"),
            onClick: handlePrevClick,
            disabled: prevDisabled,
            "aria-disabled": prevDisabled,
            title: "Previous Page",
            "aria-label": "Previous page",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Previous Page" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium w-12 text-center select-none", children: [
        currentPage,
        " / ",
        numPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: cn(iconButtonClass(false), nextDisabled && "opacity-50 cursor-not-allowed pointer-events-none"),
            onClick: handleNextClick,
            disabled: nextDisabled,
            "aria-disabled": nextDisabled,
            title: "Next Page",
            "aria-label": "Next page",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Next Page" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "hidden sm:block h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(false),
            onClick: handleZoomOut,
            title: "Zoom Out",
            "aria-label": "Zoom out",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Zoom Out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium w-12 text-center select-none", children: [
        Math.round(scale * 100),
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TooltipTrigger,
          {
            render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
            className: iconButtonClass(false),
            onClick: handleZoomIn,
            title: "Zoom In",
            "aria-label": "Zoom in",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Zoom In" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "hidden sm:block h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TooltipTrigger,
        {
          render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
          className: cn(iconButtonClass(false), "hidden sm:flex"),
          onClick: () => setDownloadDialogOpen(true),
          title: "Download",
          "aria-label": "Download document",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Download" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DropdownMenuTrigger,
        {
          nativeButton: true,
          className: cn(iconButtonClass(false), "sm:hidden"),
          title: "More options",
          "aria-label": "More options",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-64", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handlePrevClick,
              disabled: prevDisabled,
              className: cn(
                "flex items-center justify-center h-8 w-8 rounded-none transition-colors",
                prevDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            "Page ",
            currentPage,
            " / ",
            numPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleNextClick,
              disabled: nextDisabled,
              className: cn(
                "flex items-center justify-center h-8 w-8 rounded-none transition-colors",
                nextDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleZoomOut,
              className: "flex items-center justify-center h-8 w-8 rounded-none transition-colors hover:bg-accent hover:text-accent-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            Math.round(scale * 100),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleZoomIn,
              className: "flex items-center justify-center h-8 w-8 rounded-none transition-colors hover:bg-accent hover:text-accent-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: handleCopyClick, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
          "Copy"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: handlePasteClick, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "h-4 w-4 mr-2" }),
          "Paste"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setDownloadDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
          "Download"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "fixed left-1/2 -translate-x-1/2 z-50 sm:hidden bottom-16",
          "transform-gpu transition-all duration-300 ease-in-out",
          selectedElementId ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-6 opacity-0 pointer-events-none"
        ),
        "aria-hidden": !selectedElementId,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TooltipTrigger,
            {
              render: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props }),
              className: "bg-background/90 backdrop-blur-md border shadow-lg rounded-none px-3 py-2 flex items-center gap-2",
              onClick: handlePropertiesClick,
              title: "Properties",
              "aria-label": "Open properties",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Properties" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Properties" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageDialog, { open: imageDialogOpen, onOpenChange: setImageDialogOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SignatureDialog, { open: signatureDialogOpen, onOpenChange: setSignatureDialogOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DownloadDialog, { open: downloadDialogOpen, onOpenChange: setDownloadDialogOpen })
  ] }) });
}
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = reactExports.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SliderRoot,
    {
      className: "data-horizontal:w-full data-vertical:h-full",
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      thumbAlignment: "edge",
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SliderControl,
        {
          className: cn(
            "data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
            className
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderTrack,
              {
                "data-slot": "slider-track",
                className: "bg-muted rounded-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1 relative overflow-hidden select-none",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SliderIndicator,
                  {
                    "data-slot": "slider-range",
                    className: "bg-primary select-none data-horizontal:h-full data-vertical:w-full"
                  }
                )
              }
            ),
            Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SliderThumb,
              {
                "data-slot": "slider-thumb",
                className: "border-ring ring-ring/50 relative size-3 rounded-none border bg-white transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-1 focus-visible:ring-1 focus-visible:outline-hidden active:ring-1 block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
              },
              index
            ))
          ]
        }
      )
    }
  );
}
const Select = SelectRoot;
function SelectValue({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectValue$1,
    {
      "data-slot": "select-value",
      className: cn("flex flex-1 text-left", className),
      ...props
    }
  );
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectTrigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-none border bg-transparent py-2 pr-2 pl-2.5 text-xs transition-colors select-none focus-visible:ring-1 aria-invalid:ring-1 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-none *:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectIcon,
          {
            render: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "text-muted-foreground size-4 pointer-events-none" })
          }
        )
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectPositioner,
    {
      side,
      sideOffset,
      align,
      alignOffset,
      alignItemWithTrigger,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SelectPopup,
        {
          "data-slot": "select-content",
          className: cn("bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-none shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto", className),
          ...props,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectList, { children }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
          ]
        }
      )
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectItem$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-none py-2 pr-8 pl-2 text-xs [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { className: "flex flex-1 gap-2 shrink-0 whitespace-nowrap", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectItemIndicator,
          {
            render: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "pointer-events-none" })
          }
        )
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollUpArrow,
    {
      "data-slot": "select-scroll-up-button",
      className: cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChevronUp,
        {}
      )
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollDownArrow,
    {
      "data-slot": "select-scroll-down-button",
      className: cn("bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ChevronDown,
        {}
      )
    }
  );
}
function Switch({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SwitchRoot,
    {
      "data-slot": "switch",
      "data-size": size,
      className: cn(
        "data-checked:bg-primary data-unchecked:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-unchecked:bg-input/80 shrink-0 rounded-full border border-transparent focus-visible:ring-1 aria-invalid:ring-1 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchThumb,
        {
          "data-slot": "switch-thumb",
          className: "bg-background dark:data-unchecked:bg-foreground dark:data-checked:bg-primary-foreground rounded-full group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 pointer-events-none block ring-0 transition-transform"
        }
      )
    }
  );
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50", className),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "bg-background flex h-auto flex-col text-xs/relaxed data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-none data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-none data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm group/drawer-content fixed z-50",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-none group-data-[vaul-drawer-direction=bottom]/drawer-content:block bg-muted mx-auto hidden shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn("gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left flex flex-col", className),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground text-sm font-medium", className),
      ...props
    }
  );
}
function PropertiesPanel() {
  const { layers, currentPage, selectedElementId, updateLayer, removeLayer, selectElement } = useEditorStore();
  const isMobile = useIsMobile();
  const [mobilePropertiesOpen, setMobilePropertiesOpen] = reactExports.useState(false);
  const element = layers[currentPage]?.find((el) => el.id === selectedElementId);
  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "system-ui", label: "System UI" },
    { value: "Segoe UI", label: "Segoe UI" },
    { value: "Roboto", label: "Roboto" },
    { value: "Helvetica Neue", label: "Helvetica Neue" },
    { value: "Arial", label: "Arial" },
    { value: "Verdana", label: "Verdana" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Garamond", label: "Garamond" },
    { value: "Courier New", label: "Courier New" },
    { value: "Monaco", label: "Monaco" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
    { value: "Palatino", label: "Palatino" },
    { value: "Impact", label: "Impact" },
    { value: "Comic Sans MS", label: "Comic Sans MS" }
  ];
  reactExports.useEffect(() => {
    if (!element && mobilePropertiesOpen) {
      setMobilePropertiesOpen(false);
    }
  }, [element, mobilePropertiesOpen]);
  reactExports.useEffect(() => {
    if (isMobile) {
      useEditorStore.getState().setMobilePropertiesOpen = setMobilePropertiesOpen;
    }
  }, [isMobile]);
  if (!element) return null;
  const handleStyleChange = (key, value) => {
    const newStyle = { ...element.style, [key]: value };
    if ((element.type === "line" || element.type === "arrow") && ["borderWidth", "arrowStart", "arrowEnd", "sloppiness"].includes(key)) {
      const start = element.style?.start ?? { x: element.x, y: element.y + element.height / 2 };
      const end = element.style?.end ?? { x: element.x + element.width, y: element.y + element.height / 2 };
      let minX = Math.min(start.x, end.x);
      let minY = Math.min(start.y, end.y);
      let maxX = Math.max(start.x, end.x);
      let maxY = Math.max(start.y, end.y);
      const sl = newStyle.sloppiness ?? 0;
      if (Math.abs(sl) > 1e-4) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const tx = end.x - start.x;
        const ty = end.y - start.y;
        const tlen = Math.max(1, Math.hypot(tx, ty));
        const ntx = tx / tlen;
        const nty = ty / tlen;
        const nx = -nty;
        const ny = ntx;
        const controlX = midX + nx * sl;
        const controlY = midY + ny * sl;
        minX = Math.min(minX, controlX);
        minY = Math.min(minY, controlY);
        maxX = Math.max(maxX, controlX);
        maxY = Math.max(maxY, controlY);
      }
      const rawWidth = Math.max(Math.abs(maxX - minX), 10);
      const rawHeight = Math.max(Math.abs(maxY - minY), 10);
      const borderWidth = newStyle.borderWidth ?? 1;
      const hasArrow = newStyle.arrowStart || newStyle.arrowEnd;
      const arrowPad = hasArrow ? borderWidth * 3 : 0;
      const strokePadding = Math.max(4, borderWidth * 1.5 + arrowPad);
      const newX = minX - strokePadding;
      const newY = minY - strokePadding;
      const newWidth = rawWidth + strokePadding * 2;
      const newHeight = rawHeight + strokePadding * 2;
      updateLayer(currentPage, element.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        style: newStyle
      });
      return;
    }
    updateLayer(currentPage, element.id, {
      style: newStyle
    });
  };
  const handleDelete = () => {
    removeLayer(currentPage, element.id);
    selectElement(null);
  };
  const toggleStyle = (key, value) => {
    const current = element.style[key];
    if (key === "fontWeight") {
      handleStyleChange(key, current === "bold" ? "normal" : "bold");
    } else if (key === "fontStyle") {
      handleStyleChange(key, current === "italic" ? "normal" : "italic");
    } else if (key === "textDecoration") {
      handleStyleChange(key, current === "underline" ? "none" : "underline");
    }
  };
  const panelContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          element.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "signature" && /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "rect" && /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "circle" && /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "line" && /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 text-muted-foreground" }),
          element.type === "arrow" && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold text-sm capitalize", children: [
            element.type,
            " Properties"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon-sm", onClick: () => selectElement(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {})
    ] }),
    element.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: element.content || "",
            onChange: (e) => updateLayer(currentPage, element.id, { content: e.target.value }),
            className: "h-8 text-xs"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Font" }),
          (() => {
            const currentFont = element.style.fontFamily || "Inter";
            const fontIsKnown = fontOptions.some((f) => f.value === currentFont);
            const fontSelectValue = fontIsKnown ? currentFont : "custom";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: fontSelectValue,
                  onValueChange: (val) => {
                    if (val === "custom") {
                      handleStyleChange("fontFamily", "");
                    } else {
                      handleStyleChange("fontFamily", val);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { className: "truncate" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      fontOptions.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.value, style: { fontFamily: f.value }, children: f.label }, f.value)),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "Other..." })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 truncate", style: { fontFamily: element.style.fontFamily || "Inter" }, children: element.style.fontFamily || "Inter" }),
              fontSelectValue === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Enter font name (system font)",
                  value: element.style.fontFamily || "",
                  onChange: (e) => handleStyleChange("fontFamily", e.target.value),
                  className: "h-8 text-xs mt-2"
                }
              )
            ] });
          })()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: element.style.fontSize || 16,
              onChange: (e) => handleStyleChange("fontSize", Number(e.target.value)),
              className: "h-8 text-xs w-20"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border rounded-none p-1 bg-muted/20 gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.fontWeight === "bold" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => toggleStyle("fontWeight"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.fontStyle === "italic" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => toggleStyle("fontStyle"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.textDecoration === "underline" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => toggleStyle("textDecoration"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border rounded-none p-1 bg-muted/20 gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.textAlign === "left" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => handleStyleChange("textAlign", "left"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.textAlign === "center" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => handleStyleChange("textAlign", "center"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignCenter, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-6 w-6 p-0",
                element.style.textAlign === "right" ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary" : ""
              ),
              onClick: () => handleStyleChange("textAlign", "right"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignEnd, { className: "h-3 w-3" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Text Color" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.color || "#000000",
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.color || "#000000" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.backgroundColor || "#ffffff",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.backgroundColor || "None" })
          ] })
        ] })
      ] })
    ] }),
    element.type === "rect" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Fill" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.backgroundColor || "#transparent",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.backgroundColor || "None" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.borderColor || "#000000",
                onChange: (e) => handleStyleChange("borderColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.borderColor || "None" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke Width" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [element.style.borderWidth ?? 0],
              max: 20,
              step: 1,
              onValueChange: (vals) => {
                const value = Array.isArray(vals) ? vals[0] : vals;
                handleStyleChange("borderWidth", value);
              },
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-xs text-right text-muted-foreground", children: [
            element.style.borderWidth ?? 0,
            "px"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Corner Radius" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [element.style.borderRadius ?? 0],
              max: 100,
              step: 1,
              onValueChange: (vals) => {
                const value = Array.isArray(vals) ? vals[0] : vals;
                handleStyleChange("borderRadius", value);
              },
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-xs text-right text-muted-foreground", children: [
            element.style.borderRadius ?? 0,
            "px"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Opacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [element.style.opacity ?? 1],
              max: 1,
              step: 0.1,
              onValueChange: (vals) => {
                const value = Array.isArray(vals) ? vals[0] : vals;
                handleStyleChange("opacity", value);
              },
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-xs text-right text-muted-foreground", children: [
            Math.round((element.style.opacity ?? 1) * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    element.type === "circle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Fill" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.backgroundColor || "#transparent",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.backgroundColor || "None" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.borderColor || "#000000",
                onChange: (e) => handleStyleChange("borderColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.borderColor || "None" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke Width" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.borderWidth === 1 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 1),
              children: "Thin"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.borderWidth === 3 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 3),
              children: "Medium"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.borderWidth === 6 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 6),
              children: "Thick"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Opacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [element.style.opacity ?? 1],
              max: 1,
              step: 0.1,
              onValueChange: (vals) => {
                const value = Array.isArray(vals) ? vals[0] : vals;
                handleStyleChange("opacity", value);
              },
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-xs text-right text-muted-foreground", children: [
            Math.round((element.style.opacity ?? 1) * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    (element.type === "line" || element.type === "arrow") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.backgroundColor || "#000000",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.backgroundColor || "#000000" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border rounded-none p-1 pr-2 bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: element.style.borderColor || "#ffffff",
                onChange: (e) => handleStyleChange("borderColor", e.target.value),
                className: "h-6 w-6 rounded border-none p-0 overflow-hidden cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono truncate bg-transparent uppercase", children: element.style.borderColor || "None" })
          ] })
        ] })
      ] }),
      element.type === "arrow" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Arrow Heads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.arrowStart ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("arrowStart", !element.style.arrowStart),
              children: "Start"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.arrowEnd ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("arrowEnd", !element.style.arrowEnd),
              children: "End"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke Width" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: (element.style.borderWidth ?? 1) === 1 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 1),
              children: "Thin"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: (element.style.borderWidth ?? 1) === 3 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 3),
              children: "Medium"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: (element.style.borderWidth ?? 1) === 6 ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("borderWidth", 6),
              children: "Thick"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Stroke Style" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.strokeStyle === "solid" || !element.style.strokeStyle ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("strokeStyle", "solid"),
              children: "Solid"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.strokeStyle === "dashed" ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("strokeStyle", "dashed"),
              children: "Dashed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: element.style.strokeStyle === "dotted" ? "default" : "outline",
              size: "sm",
              className: "flex-1",
              onClick: () => handleStyleChange("strokeStyle", "dotted"),
              children: "Dotted"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Curved Line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: Math.abs(element.style.sloppiness ?? 0) > 0,
            onCheckedChange: (checked) => {
              if (checked) {
                const cur = element.style.sloppiness ?? 0;
                handleStyleChange("sloppiness", Math.abs(cur) > 0 ? cur : 50);
              } else {
                handleStyleChange("sloppiness", 0);
              }
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Opacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [element.style.opacity ?? 1],
              max: 1,
              step: 0.1,
              onValueChange: (vals) => {
                const value = Array.isArray(vals) ? vals[0] : vals;
                handleStyleChange("opacity", value);
              },
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-xs text-right text-muted-foreground", children: [
            Math.round((element.style.opacity ?? 1) * 100),
            "%"
          ] })
        ] })
      ] })
    ] }),
    element.type === "image" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Top Left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: element.style.borderTopLeftRadius ?? element.style.borderRadius ?? 0,
              onChange: (e) => handleStyleChange("borderTopLeftRadius", Number(e.target.value)),
              className: "h-8 text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Top Right" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: element.style.borderTopRightRadius ?? element.style.borderRadius ?? 0,
              onChange: (e) => handleStyleChange("borderTopRightRadius", Number(e.target.value)),
              className: "h-8 text-xs"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Bottom Left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: element.style.borderBottomLeftRadius ?? element.style.borderRadius ?? 0,
              onChange: (e) => handleStyleChange("borderBottomLeftRadius", Number(e.target.value)),
              className: "h-8 text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Bottom Right" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: element.style.borderBottomRightRadius ?? element.style.borderRadius ?? 0,
              onChange: (e) => handleStyleChange("borderBottomRightRadius", Number(e.target.value)),
              className: "h-8 text-xs"
            }
          )
        ] })
      ] })
    ] }),
    element.type === "signature" && // Signature only has delete option as requested
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-4", children: "Signature selected" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", className: "w-full text-sm cursor-pointer", onClick: handleDelete, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mr-2" }),
      " Delete Layer"
    ] }) }),
    "    "
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer, { open: mobilePropertiesOpen && !!element, onOpenChange: setMobilePropertiesOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerContent, { className: "max-h-[85vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerTitle, { className: "flex items-center gap-2", children: [
        element?.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "capitalize", children: [
          element?.type,
          " Properties"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto px-4 pb-8", children: panelContent })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-20 right-4 z-40 w-72 bg-background/95 backdrop-blur shadow-xl border rounded-none p-4 flex flex-col gap-4 animate-in slide-in-from-right-10 fade-in duration-200", children: [
    panelContent,
    "    "
  ] });
}
const useDialogStore = create((set) => ({
  aboutOpen: false,
  helpOpen: false,
  setAboutOpen: (open) => set({ aboutOpen: open }),
  setHelpOpen: (open) => set({ helpOpen: open }),
  openAbout: () => set({ aboutOpen: true }),
  closeAbout: () => set({ aboutOpen: false }),
  openHelp: () => set({ helpOpen: true }),
  closeHelp: () => set({ helpOpen: false })
}));
function AboutDialog() {
  const { aboutOpen, setAboutOpen } = useDialogStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: aboutOpen, onOpenChange: (open) => setAboutOpen(open), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "About Inkoro" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2 text-base", children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-1 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Add text, shapes, images, and signatures to PDFs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Drag and drop elements with precision" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Real-time editing with undo/redo support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Export edited PDFs instantly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Dark mode support" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Session persistence across page refreshes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2 text-base", children: "Tech Stack" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["Next.js", "React", "TypeScript", "Tailwind", "pdf-lib", "react-pdf", "Zustand", "shadcn/ui"].map((tech) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-muted rounded-none text-xs", children: tech }, tech)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2 text-base", children: "Connect" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://github.com/KurutoDenzeru/Inkoro",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "GitHub" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://www.instagram.com/krtclcdy/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Instagram" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://www.linkedin.com/in/kurtcalacday/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 px-3 py-2 rounded-none border hover:bg-muted transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "LinkedIn" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAboutOpen(false), children: "Close" }) })
  ] }) });
}
function SidebarToggleButton({ setDownloadDialogOpen }) {
  const { state, toggleSidebar } = useSidebar();
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";
  if (state === "expanded") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delay: 100, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-50 bg-background/95 backdrop-blur shadow-xl border rounded-none px-3 py-2 flex items-center gap-3 animate-in slide-in-from-left-10 fade-in duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/brand.webp", alt: "Inkoro", className: "h-6 w-6 object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm whitespace-nowrap", children: "Inkoro" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px bg-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TooltipTrigger,
        {
          className: cn(buttonVariants({ variant: "ghost", size: "icon-sm" })),
          onClick: toggleSidebar,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftOpen, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Expand Sidebar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "B" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px bg-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuTrigger,
          {
            nativeButton: true,
            render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
            className: cn(buttonVariants({ variant: "ghost", size: "icon-sm" })),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Menu" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuContent, { onDownload: () => setDownloadDialogOpen(true) })
    ] })
  ] }) });
}
function SidebarMenuContent({ onDownload }) {
  const { isMobile } = useSidebar();
  const { currentPage, history, undo, redo, scale, setScale } = useEditorStore();
  const setAboutOpen = useDialogStore((s) => s.setAboutOpen);
  const { setTheme } = z();
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";
  const redoKeys = isMac ? ["⌘", "Shift", "Z"] : ["Ctrl", "Y"];
  const handleZoomIn = () => setScale(Math.min(scale + 0.1, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.1, 0.5));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", className: "min-w-64 w-72 max-w-[90vw]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "File" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { nativeButton: true, render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => onDownload(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
        "Download"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Download" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { nativeButton: true, render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => {
        if (confirm("Start a new session? This will clear everything.")) {
          try {
            useEditorStore.getState().clearSession();
            useEditorStore.setState({ pdfFile: null, pdfUrl: null, layers: {}, selectedElementId: null, numPages: 0, currentPage: 1 });
          } catch (e) {
            window.location.reload();
          }
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
        "New Session"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "New Session" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { nativeButton: true, render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => {
        if (confirm("Reset session? This will remove all edits but keep the PDF.")) {
          useEditorStore.setState({ layers: {}, selectedElementId: null });
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
        "Reset Session"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Reset Session" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Edit" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DropdownMenuItem,
        {
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
          disabled: history.past.length === 0,
          onClick: () => undo(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Undo, { className: "h-4 w-4 mr-2" }),
            "Undo",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { className: "ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "Z" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Undo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DropdownMenuItem,
        {
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
          disabled: history.future.length === 0,
          onClick: () => redo(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Redo, { className: "h-4 w-4 mr-2" }),
            "Redo",
            /* @__PURE__ */ jsxRuntimeExports.jsx(KbdGroup, { className: "ml-auto", children: redoKeys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: key }, key)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Redo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DropdownMenuItem,
        {
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
          onClick: async () => {
            const ok = await useEditorStore.getState().copySelection();
            try {
              const { toast } = await import("../_libs/sonner.mjs");
              toast(ok ? "Copied to clipboard" : "Nothing selected");
            } catch (err) {
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
            "Copy",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { className: "ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "C" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Copy" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DropdownMenuItem,
        {
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
          onClick: async () => {
            const ok = await useEditorStore.getState().pasteClipboard(currentPage);
            try {
              const { toast } = await import("../_libs/sonner.mjs");
              toast(ok ? "Pasted" : "Nothing to paste");
            } catch (err) {
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "h-4 w-4 mr-2" }),
            "Paste",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { className: "ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "V" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Paste" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "View" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: handleZoomIn, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4 mr-2" }),
        "Zoom In",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { className: "ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "+" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Zoom In" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: handleZoomOut, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4 mr-2" }),
        "Zoom Out",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(KbdGroup, { className: "ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: modKey }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Kbd, { children: "-" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Zoom Out" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuSub, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuSubTrigger, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4 mr-2" }),
          "Theme"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Theme" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuSubContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => setTheme("light"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4 mr-2" }),
            "Light Mode"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Light Mode" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => setTheme("dark"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4 mr-2" }),
            "Dark Mode"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "Dark Mode" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => setTheme("system"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-4 w-4 mr-2" }),
            "System Theme"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "System Theme" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}), onClick: () => setAboutOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 mr-2" }),
        "About"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { hidden: isMobile, children: "About" })
    ] })
  ] });
}
function SidebarShortcutListener() {
  const { toggleSidebar } = useSidebar();
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const activeIsEditable = document.activeElement?.isContentEditable;
      if (activeTag === "input" || activeTag === "textarea" || activeIsEditable) return;
      if ((e.metaKey || e.ctrlKey) && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  return null;
}
function EditorLayout() {
  const { pdfFile } = useEditorStore();
  const [downloadDialogOpen, setDownloadDialogOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen w-full overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", className: "border-r data-[collapsible=icon]:border-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center font-bold text-xl transition-all group-data-[collapsible=icon]:px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/brand.webp", alt: "Inkoro", className: "h-5 w-5 object-contain mr-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: "Inkoro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group-data-[collapsible=icon]:hidden flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { delay: 100, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DropdownMenuTrigger,
                {
                  render: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, {}),
                  className: cn(buttonVariants({ variant: "ghost", size: "icon-sm" })),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Menu" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuContent, { onDownload: () => setDownloadDialogOpen(true) })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { className: "group-data-[collapsible=icon]:hidden", children: pdfFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "thumbnails", className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-2 rounded-none bg-transparent p-0 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "thumbnails", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
            "Pages"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "layers", className: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 mr-2" }),
            "Layers"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "thumbnails", className: "h-[calc(100vh-8rem)] overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbnailList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "layers", className: "h-[calc(100vh-8rem)] overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayerList, {}) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground text-center mt-10", children: "Upload a PDF to see content" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, { className: "group-data-[collapsible=icon]:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "default",
          className: cn(
            "w-full",
            "cursor-pointer transform-gpu transition-all duration-150",
            "hover:scale-[1.02] hover:shadow-md hover:shadow-black/10",
            "active:scale-95 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          ),
          onClick: () => setDownloadDialogOpen(true),
          disabled: !pdfFile,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Export"
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 relative h-full w-full overflow-hidden bg-gray-100/50 dark:bg-gray-900/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-auto pt-8 pb-4 px-8 custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-full", children: pdfFile ? /* @__PURE__ */ jsxRuntimeExports.jsx(PDFViewer, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "No PDF Loaded" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarToggleButton, { setDownloadDialogOpen }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarShortcutListener, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toolbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PropertiesPanel, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UploadDialog, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DownloadDialog, { open: downloadDialogOpen, onOpenChange: setDownloadDialogOpen }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AboutDialog, {})
    ] })
  ] }) });
}
export {
  EditorLayout
};
